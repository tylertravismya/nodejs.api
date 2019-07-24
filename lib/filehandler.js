var AWS 				= require('aws-sdk');
var constants 			= require("./constants");
var fs 					= require('fs');
var config 				= require('config');
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.REALMETHODS);
var util 				= require('util');
var fileHandler			= require('./filehandler');

fileHandler = module.exports = {

	uploadToS3Bucket: (file, remotePath) => { 
		return new Promise(function(resolve, reject) {
	
			var awsConfig 	= config.get(constants.AWS_S3_CONFIG);
			var s3 			= fileHandler.configureS3();
			
			// call S3 to retrieve upload file to specified bucket
			var uploadParams = {Bucket: awsConfig.bucket + remotePath, 
									Key: '', 
									Body: '', 
									ACL: 'public-read'};
	
			// create a read stream from the file
			var fileStream 	= fs.createReadStream(file);
			
			// validation
			fileStream.on('error', function(err) {
			  reject( err);
			});
			
			// apply the file stream to the body
			uploadParams.Body = fileStream;
	
			// apply the file as a path as the key
			var path 			= require('path');
			uploadParams.Key 	= path.basename(file);

			s3.upload (uploadParams, function (err, data) {
				if (err) {
					reject( err);
				} else if (data) {
					resolve( data.Location );
				}
			});
		});
	},		
	
	removeFromS3Bucket: (file) => {

		// remove the file from the goframework s3 bucket
		var awsConfig 	= config.get(constants.AWS_S3_CONFIG);
		var s3 			= fileHandler.configureS3();

		// likely have to strip the bucket URL prefix from the file arg

		var params = {
	            Bucket: awsConfig.bucket,
	            Key: file
	    };
	    
		s3.deleteObject(params, function (err, data) {
	        if (err) {
	            console.log("Problem deleting file from AWS S3 bucket." + err);
	        }
	    });
	},

	downloadFromS3Bucket: (fileKey, outputFileAndPath) => {
		// remove the file from the goframework s3 bucket
		var awsConfig 	= config.get(constants.AWS_S3_CONFIG);
		var s3 			= fileHandler.configureS3();
		
		// likely have to strip the bucket URL prefix from the file arg
		
	    var params = {
	            Bucket: awsConfig.bucket,
	            Key: fileKey
	    };
	    
	    var file = fs.createWriteStream(outputFileAndPath);
	    s3.getObject(params).createReadStream().pipe(file);
	},

	configureS3: ()  => {
		// configuring the AWS environment

		var awsConfig 	= config.get(constants.AWS_S3_CONFIG);
		AWS.config.update({
			region: awsConfig.region,
			accessKeyId: awsConfig.accessKeyId,
			secretAccessKey: awsConfig.secretAccessKey
		});
		
		// Create S3 service object
		var s3 = new AWS.S3({apiVersion: awsConfig.apiVersion});
		return( s3 );
	},
	
	loadYMLToJSON: (ymlFilePath, callback) => {
		const yaml = require('js-yaml');
		const fs = require('fs');
		try {
		    const yml = yaml.safeLoad(fs.readFileSync(ymlFilePath, 'utf8'));
		    callback(null, yml);
 		} catch (e) {
			console.log("ymlFilePath=" + ymlFilePath + ", " + e);
		    callback(e, null)
		}
	},
	
	loadFileToJSON: (jsonFilePath, callback ) => {
		const fs = require('fs');
		try {
			const json = JSON.parse( fs.readFileSync( jsonFilePath ) );
			callback(null, json);
		} catch (e) {
			console.log('Failure in loadFileToJSON' + e);
		    callback(e, null)
		}
	}
}
