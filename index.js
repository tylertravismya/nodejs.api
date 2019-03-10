#!/usr/bin/env node
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const user				= require('./lib/user');
const modelHandler		= require('./lib/modelhandler');
const techStackHandler	= require('./lib/techstackhandler');
const archiveHandler	= require('./lib/archivehandler');
const requestHandler	= require('./lib/requesthandler');
const generateHandler	= require('./lib/generatehandler');
const constants 		= require("./lib/constants");
const Status 			= require("./lib/status");
const status			= new Status();

self = module.exports =  {

	////////////////////////////////////////////////////
	// Handles the authentication of the user, 
	// the user to provide their unique token, assigned
	// within their profile during registration
	////////////////////////////////////////////////////
		
	async authenticate (inputToken)  {

		return new Promise(async function(resolve, reject) {
			if ( inputToken ) {	// authenticate the token from the remote server
				await user.authenticate(inputToken, function(err, data){
			    	if ( err )  {
			    		reject( status.error(err, constants.TOKEN_VALIDATION_ERROR ) );
			    	}else {
			    		if ( data.resultCode == constants.SUCCESS ) {
			    			if (inputToken == JSON.parse(data.result).token) {
			    				user.storeToken(inputToken);	// authenticated
			    				resolve( data );
			    			}
			    		} 
			    		else
			    			reject( status.error("", constants.TOKEN_VALIDATION_ERROR ) ); 
			    	}
			    });
			}
			else
				reject( status.error("", constants.TOKEN_VALIDATION_ERROR ) );
		});
	},

	////////////////////////////////////////////////////
	// Model Related Functions
	////////////////////////////////////////////////////

	userInfo : () => {	
		return new Promise(function(resolve, reject) {
			user.userInfo()
				.then(function(result) {
					resolve(result);
			}).catch(err => reject(err));
		});
	},

	////////////////////////////////////////////////////
	// Model Related Functions
	////////////////////////////////////////////////////

	listModels : (scope, filter) => {	
		return new Promise(function(resolve, reject) {
			modelHandler.list(scope, filter)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},

	validateModel : (file) => {	
		return new Promise(function(resolve,reject) {
			modelHandler.validate(file)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	registerModel : (yamlFile, scope) => {	
		return new Promise(function(resolve,reject) {
			if ( yamlFile == null )
				reject( status.error(null, "Invalid YAML file provided." ));
			else {
				modelHandler.register(yamlFile, scope == null ? constants.PRIVATE : scope)
					.then(function(result) {
						resolve( result );
				}).catch(err => reject(err));
			}
		});
	},
	
	downloadModel : (model_id, output_file_path) => {
		return new Promise(function(resolve,reject) {
			modelHandler.downloadModel( model_id, output_file_path )
				.then(function(result) {
					resolve(result);
			}).catch(err => reject(err));
		});
	},
	
	deleteModel (model_id)  {
		return new Promise(function(resolve,reject) {
			modelHandler.deleteModel(model_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	promoteModel (model_id) {
		return new Promise(function(resolve,reject) {
			modelHandler.promoteModel(model_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
		
	},

	demoteModel (model_id) {
		return new Promise(function(resolve,reject) {
			modelHandler.demoteModel(model_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
		
	},
	

	////////////////////////////////////////////////////
	// Tech Stack Related Functions
	////////////////////////////////////////////////////
	
	listTechStacks  : (scope, filter) => {	
		
		return new Promise(function(resolve, reject) {
			techStackHandler.list(scope, filter)
				.then(function(result) {
					resolve(result);
			}).catch(err => reject(err));
		});
	},
	
	validateTechStack : (file) => {	
		return new Promise(function(resolve, reject) {
			techStackHandler.validate(file)
				.then(function(result) {
					resolve(result);
			}).catch(err => reject(err));
		});
	},
	
	registerTechStack : (yamlFile, scope) => {	
		return new Promise(function(resolve, reject) {
			if ( yamlFile == null )
				reject( status.error(null, "Invalid YAML file provided." ) );
			else {
				techStackHandler.register(yamlFile, scope == null ? constants.PRIVATE : scope)
				 .then(function(result) {
						resolve( result );
				}).catch(err => reject(err) );
			}
		});
	},
	
	stackOptions : (id) => {
		return new Promise(function(resolve, reject) {
			techStackHandler.options(id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	downloadStack : (stack_id, output_file_path) => {
		return new Promise(function(resolve, reject) {
			techStackHandler.downloadStack( stack_id, output_file_path )
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	async deleteStack (stack_id) {
		return new Promise(function(resolve, reject) {
			techStackHandler.deleteStack(stack_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	promoteStack (stack_id) {
		return new Promise(function(resolve, reject) {
			techStackHandler.promoteStack(stack_id)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},

	demoteStack (stack_id) {
		return new Promise(function(resolve, reject) {
			techStackHandler.demoteStack(stack_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},

	////////////////////////////////////////////////////
	// App Generation Related Functions
	////////////////////////////////////////////////////
	
	generateApp : (yamlFilePath, gitFile, appOptionsFile) => {	
		return new Promise(function(resolve, reject) {
			generateHandler.generateApp(yamlFilePath, gitFile, appOptionsFile)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},
	
	
	////////////////////////////////////////////////////
	//Archive Related Functions
	////////////////////////////////////////////////////
	
	listApps : (scope) => {
		return new Promise(function(resolve, reject) {
			archiveHandler.listApps(scope)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},
	
	downloadApp : (app_id, output_file_path) => {
		archiveHandler.downloadApp(app_id, output_file_path)
			.then(function(result) {
				resolve( result );
			}).catch(err => reject(err));
	},
	
	deleteApp : (app_id) => {
		archiveHandler.deleteApp(app_id)
			.then(function(result) {
				resolve( result );
			}).catch(err => reject(err));

	},
	
	promoteApp : (app_id) => {
		archiveHandler.promoteApp(app_id)
			.then(function(result) {
				resolve( result );
			}).catch(err => reject(err));
	},

	demoteApp : (app_id) => {
		archiveHandler.demoteApp(app_id)
			.then(function(result) {
				resolve( result );
			}).catch(err => reject(err));
	},

}