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
						resolve( data );
					}
				}, function(err) {
					reject( err );
				}).catch(err => console.log('Catch', err));
			}
		});
	},
	
	generateApp: (yamlFile, gitFile, appOptionsFile, modelIdentifier) => {
		
		return new Promise(async function(resolve, reject) {
	
			let genYamlAsJson = null;
			
			fileHandler.loadYMLToJSON(yamlFile, function( err, data ){

				if ( err ) {
					reject( status.error( err, "Error parsing gen app yaml file " + yamlFile + " to json."));
				}
				genYamlAsJson = data;
			});
			
			if ( genYamlAsJson != null ) {
	
				let techStackId, modelIdentifierToUse;
				let appParams;
				
				for(let index = 0; index < genYamlAsJson.app.length; index++ ) {
	    			// if using a modelFile, need to first register the model and
	    			// if successful, use the returned modelId to then generate the app
					appParams 		= genYamlAsJson.app[index];
					
					modelIdentifierToUse = modelIdentifier;
					
					if( modelIdentifierToUse == null )
						modelIdentifierToUse = appParams.modelId;
	    			
	    			
	    			techStackId	 	= appParams.techStackId;
					
	    			// if the model identifier is a file, it should be publish to the remove
	    			// realmethods server and if successful, use the return ID as the model identified
	    			
	    			if ( Number.isInteger(modelIdentifierToUse) == false ) {
	    				console.log('Model identifer ' + modelIdentifierToUse + ' determined to be a file.  Validing/publishing model with server...');
	    				modelHandler.register(modelIdentifierToUse.toString(), null)
	    					.then(function(result) {
	    						let deleteModel = true; // delete models from the backend that are provided as a file here...need to be explicitly published
	    						modelIdentifierToUse = result;
	    						self.internalGitHelper(appParams, techStackId, modelIdentifierToUse, gitFile, appOptionsFile, deleteModel);
	    					}).catch(err => reject(err));
	    			}
	    			else {
	    				let deleteModel = false;
	    				self.internalGitHelper(appParams, techStackId, modelIdentifierToUse, gitFile, appOptionsFile, deleteModel)
	    				.then(function(result) {
	    					console.log(result);
	    				}).catch(err => reject(err));
	    			}
				}
			}
			
		});
	},
	
	internalGitHelper: ( appParams, techStackId, modelId, gitFile, appOptionsFile, deleteModel ) => {

		return new Promise(async function(resolve, reject) {
			// locate the gitParams
			var gitParams;
			var gitFileToUse = gitFile;
			
			// if one is not provided, use the one designated in the appParams file
			if ( gitFileToUse == null ) {
				gitFileToUse = appParams.gitParams.file;
			}
						
			fileHandler.loadYMLToJSON(gitFileToUse, function( err, data ){

				if ( err ) {
					reject( new Status().error( err, "Error parsing git yaml file " + gitFileToUse + " to json" ));
				}
				gitYamlAsJson = data;
			});
			
			for( let __index = 0; gitYamlAsJson.gitParams.length; __index++ ) {
				
				if ( gitYamlAsJson.gitParams[__index].name == appParams.gitParams.entry ) {
					gitParams = gitYamlAsJson.gitParams[__index];
					break;
				}
			}
			
			var appOptionsFileToUse = appOptionsFile;

			// if one is not provided, use the one designated in the appParams file
			if ( appOptionsFileToUse == null ) { 
				appOptionsFileToUse = appParams.appOptionsFile;
			}
			
			self.generateAppHelper( techStackId, 
						modelId, 
						appOptionsFileToUse,
						appParams.saveParams.name,
						gitParams ).then(function(result) {
							if ( deleteModel == true ) {
								console.log( "Unpublishing model..." )
								modelHandler.deleteModel( modelId ).then(function(result) {
									console.log( "Model unpublished" );
								}).catch(err => console.log(err));
							}
							resolve( result );
						}).catch(err => reject(err));
		});

	}
}
