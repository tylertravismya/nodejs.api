const Table   			= require('cli-table')
const requestHandler	= require('./requestHandler');
const fileHandler		= require('./fileHandler');
var constants 			= require("./constants");
var config 				= require('config');
var util 				= require('util');
const Status 			= require("./status");

module.exports = {
	listApps: (scope) => {
		
		return new Promise(function(resolve, reject) {

			const input = requestHandler.packageInputAddToken( constants.ARCHIVED_APP_LIST );
			input.scopeType	= scope != null ? scope.toUpperCase() : null; // server likes uppercase enum types
			
			return requestHandler.handleRequest( input, constants.APP_ARCHIVELIST_REQUEST_MSG, function(err, data) {
		    	if ( err ) {
		    		reject(  err );	    	
		    	} 
		    	else {
		    		resolve( data );
		    	}
			});
		});
	},

	deleteApp: (id) => {
		
		return new Promise(function(resolve, reject) {
			
			const input = requestHandler.packageInputAddToken(constants.DELETE_APP);
			input.generatedAppId = id;
			
			return requestHandler.handleRequest( input, constants.DELETE_APP_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( err );
				} else if ( data != null ){
					resolve( data );
				}
			});
		});
	},
	
	promoteApp: (id) => {

		return new Promise(function(resolve, reject) {

			const input = requestHandler.packageInputAddToken(constants.PROMOTE_APP);
			input.generatedAppId = id;
			
			return requestHandler.handleRequest( input, constants.PROMOTE_APP_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( err );
				} else if ( data != null ){
					resolve( data );
				}
			});	
		});	

	},

	demoteApp: (id) => {

		return new Promise(function(resolve, reject) {

			const input = requestHandler.packageInputAddToken(constants.DEMOTE_APP);
			input.generatedAppId = id;
			
			return requestHandler.handleRequest( input, constants.DEMOTE_APP_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( err );
				} else if ( data != null ){
					resolve( data );
				}
			});	
		});	

	},

	downloadApp: (id, outputFileAndPath) => {

		return new Promise(function(resolve, reject) {

			const input = requestHandler.packageInputAddToken(constants.GET_APP);
			input.generatedAppId = id;
			return requestHandler.handleRequest( input, constants.DOWNLOAD_APP_REQUEST_MSG, function(err, data) {
				if ( err ) {
					console.log( 'err is ' + err );
				} else if ( data != null ){
					if ( data.resultCode == constants.SUCCESS ) {
						var fileKey 	= JSON.parse(data.result).zippedAppPackagePath;
						
						fileHandler.downloadFromS3Bucket( fileKey, outputFileAndPath );
						resolve(data)
					}
					else
						reject(data);
				}
			});
		});
	}
}
