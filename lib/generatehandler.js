const requestHandler	= require('./requestHandler');
const fileHandler		= require('./filehandler');
const modelHandler		= require('./modelhandler');
const techStackHandler	= require('./techstackhandler');
var constants 			= require("./constants");
var util 				= require('util');
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.REALMETHODS);
const Status 			= require("./status");

let self = module.exports = {

	generateApp: (techStackId, modelId, appOptionsPath, appName, gitParams) => {
		
		return new Promise(async function(resolve, reject) {
			
			const input 				= requestHandler.packageInputAddToken(constants.CREATE_APP);
	
			input.techStackPackageId 	= techStackId;
			input.modelId 				= modelId;			
			input.gitParams				= gitParams; 
			
			fileHandler.loadFileToJSON(appOptionsPath, function( err, data ){
				if ( err ) {
					reject( new Status().error( err, "Error parsing JSON options file " + appOptionsPath ) );
				}else {
					input.appOptions = data;
				}
			});
	
			if ( input.appOptions != null ) {
				var msg = util.format(constants.GENERATE_APP_REQUEST_MSG, appName);
				
				var reqPromise = requestHandler.asyncHandleRequest( input, msg);
				
				reqPromise.then(function(data) {
					if ( data.resultCode != constants.SUCCESS)
						reject(data)
					else {
						data.processMessage = ( util.format(constants.APP_GENERATE_SUCCESS, appName));	
						resolve( data );
					}
				}, function(err) {
					reject( err );
				}).catch(err => console.log('Catch', err));
			}
		});
	},
	
	generateApps: (yamlFile) => {

		return new Promise(async function(resolve, reject) {
	
			let genYamlAsJson = null;
			
			fileHandler.loadYMLToJSON(yamlFile, function( err, data ){
				if ( err ) {
					reject( new Status().error( err, "Error parsing gen app yaml file " + yamlFile + " to json."));
				}
				genYamlAsJson = data;
			});
			
			if ( genYamlAsJson != null ) {
	
				var techStackId, modelId;
				let appParams;
				
				for(let index = 0; index < genYamlAsJson.apps.length; index++ ) {
	    			// if using a modelFile, need to first register the model and
	    			// if successful, use the returned modelId to then generate the app
					appParams 		= genYamlAsJson.apps[index];
					
	    			modelId	 		= appParams.modelId;
	    			techStackId	 	= appParams.techStackId;
					
					// locate the gitParams
					var gitParams;
					fileHandler.loadYMLToJSON(appParams.gitParams.file, function( err, data ){
						if ( err ) {
							reject( new Status().error( err, "Error parsing git  yaml file " + appParams.gitParams.file + " to json" ));
						}
						gitYamlAsJson = data;
					});
					
					for( let __index = 0; gitYamlAsJson.gitParams.length; __index++ ) {
						
						if ( gitYamlAsJson.gitParams[__index].name == appParams.gitParams.entry ) {
							gitParams			= gitYamlAsJson.gitParams[__index];
							break;
						}
					}
					
					self.generateApp( techStackId, modelId, 
							appParams.appOptionsFile,
							appParams.saveParams.name,
							gitParams ).then(function(result) {
								resolve( new Status().success(null, util.format(constants.COMMAND_SUCCESS, constants.GENERATE_APP) ) );
							}).catch(err => reject(err));
	    		}
			}
			
		});
	}
}
