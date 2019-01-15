const requestHandler	= require('./requestHandler');
const fileHandler		= require('./filehandler');
const user				= require('./user');
const Status 			= require("./status");
var constants 			= require("./constants");
var config 				= require('config');
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.REALMETHODS);
var util 				= require('util');

module.exports = {

	validate: (file) => {
		
		return new Promise(async function(resolve, reject) {

			// upload the file to an S3 bucket and get's it's key
			var s3Path = user.deduceDir( constants.PUBLIC, constants.MODEL_DIR);
			var s3UploadPromise = fileHandler.uploadToS3Bucket(file, s3Path);
			s3UploadPromise.then(function(s3FileLocation) {
				const input = requestHandler.packageInputAddToken(constants.VALIDATE_MODEL);		
				input.s3FileLocation = s3FileLocation;
				const msg = util.format(constants.VALIDATE_MODEL_REQUEST_MSG, file);
				if ( input.s3FileLocation != null ) {				
					return requestHandler.handleRequest( input, msg, function(err, data) {
						if ( err ) {
							reject( new Status().error(err, 
										util.format(constants.COMMAND_ERROR, constants.VALIDATE_MODEL )));
						} else {
							resolve( data )
						}
					});
				}
			}).catch(err => reject( new Status().error(err, 
										util.format(constants.COMMAND_ERROR, constants.VALIDATE_MODEL ))));
		});
	},	

	list: (scope, filter) => {
		return new Promise(function(resolve, reject) {
			const input = requestHandler.packageInputAddToken(constants.MODEL_LIST);
			input.scopeType	= scope != null ? scope.toUpperCase() : null; // server likes uppercase enum types
			input.filter = filter;
			return requestHandler.handleRequest( input, constants.MODEL_LIST_REQUEST_MSG, function(err, data) {
				if ( err ) {
		    		reject( new Status().error(err, 
							util.format(constants.COMMAND_ERROR, constants.TECH_STACK_PKG_LIST_REQUEST_MSG) ));
		    	}else {
		    		resolve( data );
		    	}
			}, false);
		});
	},
	
	register: (ymlFilePath, scope, defaultModelId ) => {
	
		return new Promise(function(resolve, reject) {
			if ( ymlFilePath != null ) {	
				var ymlFilePathAsJson 	= null;				
		
				fileHandler.loadYMLToJSON(ymlFilePath, function( err, data ) {
					if ( err ) {
						reject( new Status().error( null, "Error parsing JSON file " + ymlFilePath + " : " + err ) );
					}
					else
						ymlFilePathAsJson = data;
				});
		
				var s3Path 			= user.deduceDir(scope, constants.MODEL_DIR);
				var s3UploadPromise = fileHandler.uploadToS3Bucket( ymlFilePathAsJson.modelPath 
																	+ ymlFilePathAsJson.modelFile, 
																	s3Path);
				s3UploadPromise.then(function(s3FileLocation) {
					const input 			= requestHandler.packageInputAddToken(constants.REGISTER_MODEL);
					input.saveParams 		= ymlFilePathAsJson.saveParams;
					input.s3FileLocation 	= s3FileLocation;
					const msg 				= util.format(constants.REGISTER_MODEL_REQUEST_MSG, ymlFilePathAsJson.saveParams.name );
					input.scopeType			= scope != null ? scope.toUpperCase() : null; // server likes uppercase enum types
					var reqPromise 			= requestHandler
												.asyncHandleRequest( input, msg);
					
					reqPromise.then(function(data) {
						resolve(data.result); // should be the newly created model id.
					}, function(err) {
						reject(err);
					}).catch(err => reject( new Status()
											.error( null, util.format(constants.COMMAND_ERROR, constants.REGISTER_MODEL))));
				}, function(err) {
					reject(err);
				}).catch(err => reject( new Status()
									.error( null, util.format(constants.COMMAND_ERROR, constants.REGISTER_MODEL))));
			}else {
				if ( defaultModelId != null )
					resolve( new Status().success(defaultModelId, 
												util.format(constants.COMMAND_, constants.REGISTER_MODEL )));
				else {
					reject( new Status().error(null,"Null YAML file arg provided with no default model id arg" ));
				}
			}
		});
	},		
	
	deleteModel: (id) => {
		return new Promise(async function(resolve, reject) {
			const input = requestHandler.packageInputAddToken(constants.DELETE_MODEL);
			input.modelId = id;
		
			return requestHandler.handleRequest( input, constants.DELETE_MODEL_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( new Status().error(err,
											util.format(constants.COMMAND_ERROR, constants.DELETE_MODEL)));
				} else if ( data != null ){
					resolve(data);
				}
			});
		});
	},

	promoteModel: (id) => {
		return new Promise(async function(resolve, reject) {

			const input = requestHandler.packageInputAddToken(constants.PROMOTE_MODEL);
			input.modelId = id;
			
			return requestHandler.handleRequest( input, constants.PROMOTE_MODEL_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( new Status().error(err,
							util.format(constants.COMMAND_ERROR, constants.PROMOTE_MODEL)));
				} else if ( data != null ){
					resolve( data );
				}
			});	
		});
	},

	demoteModel: (id) => {
		return new Promise(async function(resolve, reject) {

			const input = requestHandler.packageInputAddToken(constants.DEMOTE_MODEL);
			input.modelId = id;
			
			return requestHandler.handleRequest( input, constants.DEMOTE_MODEL_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( new Status().error(err,
							util.format(constants.COMMAND_ERROR, constants.DEMOTE_MODEL)));
				} else if ( data != null ){
					resolve( data );
				}
			});	
		});
	},

	downloadModel: (id, outputFileAndPath) => {
		return new Promise(async function(resolve, reject) {
			
			const input = requestHandler.packageInputAddToken(constants.GET_MODEL);
			input.modelId = id;
			return requestHandler.handleRequest( input, constants.DOWNLOAD_MODEL_REQUEST_MSG, function(err, data) {
				if ( err == null &&  data != null ){
					if ( data.resultCode == constants.SUCCESS ) {
						var fileKey 	= JSON.parse(data.result).modelFilePath;
						
						fileHandler.downloadFromS3Bucket( fileKey, outputFileAndPath );
						resolve(new Status().success(data, constants.DOWNLOAD_COMPLETE));
					}
				}
				else {
					reject( new Status().error(data,
								util.format(constants.GET_MODEL, constants.GET_MODEL)));
				}
			});	
		});
	}
}
