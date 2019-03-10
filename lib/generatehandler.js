const requestHandler	= require('./requesthandler');
const fileHandler		= require('./filehandler');
const modelHandler		= require('./modelhandler');
const techStackHandler	= require('./techstackhandler');
var constants 			= require("./constants");
var util 				= require('util');
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.REALMETHODS);
const Status 			= require("./status");
const status			= new Status();

let self = module.exports = {

	generateAppHelper: (techStackId, modelId, appOptionsPath, appName, gitParams) => {
		
		return new Promise(async function(resolve, reject) {
			
			const input 				= requestHandler.packageInputAddToken(constants.CREATE_APP);
	
			input.techStackPackageId 	= techStackId;
			input.modelId 				= modelId;			
			input.gitParams				= gitParams; 
			
			fileHandler.loadFileToJSON(appOptionsPath, function( err, data ){
				if ( err ) {
					reject( status.error( err, "Error parsing JSON options file " + appOptionsPath ) );
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
						resolve( data );
					}
				}, function(err) {
					reject( err );
				}).catch(err => console.log('Catch', err));
			}
		});
	},
	
	generateApp: (yamlFile) => {

		return new Promise(async function(resolve, reject) {
	
			let genYamlAsJson = null;
			
			fileHandler.loadYMLToJSON(yamlFile, function( err, data ){
				if ( err ) {
					reject( status.error( err, "Error parsing gen app yaml file " + yamlFile + " to json."));
				}
				genYamlAsJson = data;
			});
			
			if ( genYamlAsJson != null ) {
	
				let techStackId, modelId;
				let appParams;
				
				for(let index = 0; index < genYamlAsJson.app.length; index++ ) {
	    			// if using a modelFile, need to first register the model and
	    			// if successful, use the returned modelId to then generate the app
					appParams 		= genYamlAsJson.app[index];
					
	    			modelId	 		= appParams.modelId;
	    			techStackId	 	= appParams.techStackId;
					
	    			// if the model identifier is a file, it should be publish to the remove
	    			// realmethods server and if successful, use the return ID as the model identified
	    			
	    			if ( Number.isInteger(modelId) == false ) {
	    				console.log('Model identifer ' + modelId + ' determined to be a file.  Validing/publishing model with server...');
	    				modelHandler.register(modelId, null)
	    					.then(function(result) {
	    						modelId = result;
	    						console.log( 'Registered model identifier is ' + modelId );
	    						self.internalGitHelper(appParams, techStackId, modelId);
	    						
	    					}).catch(err => reject(err));
	    			}
	    			else {
	    				self.internalGitHelper(appParams, techStackId, modelId)
	    				.then(function(result) {
	    					console.log(result);
	    				}).catch(err => reject(err));
	    			}
				}
			}
			
		});
	},
	
	internalGitHelper: ( appParams, techStackId, modelId ) => {

		return new Promise(async function(resolve, reject) {
	
			// locate the gitParams
			var gitParams;
			fileHandler.loadYMLToJSON(appParams.gitParams.file, function( err, data ){
				if ( err ) {
					reject( status.error( err, "Error parsing git yaml file " + appParams.gitParams.file + " to json" ));
				}
				gitYamlAsJson = data;
			});
			
			for( let __index = 0; gitYamlAsJson.gitParams.length; __index++ ) {
				
				if ( gitYamlAsJson.gitParams[__index].name == appParams.gitParams.entry ) {
					gitParams = gitYamlAsJson.gitParams[__index];
					break;
				}
			}
			
			self.generateAppHelper( techStackId, 
						modelId, 
						appParams.appOptionsFile,
						appParams.saveParams.name,
						gitParams ).then(function(result) {
							resolve( result );
						}).catch(err => reject(err));
		});

	}
}
