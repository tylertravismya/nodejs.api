function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}


// realMethods specific
define("REALMETHODS", "realmethods");
define("REALMETHODS_DOMAIN", "http://www.realmethods.com");
define("REALMETHODS_TOKEN", "realmethods.token");
define("SERVER_CONFIG", "realMethods.serverConfig");
define("AWS_S3_CONFIG", "realMethods.awsS3Config");
define("QUIET_MODE", "QUIET_MODE");
define("PLATFORM_URL", "PLATFORM_URL");

// labels
define("SERVICE_REQUEST_TYPE_LABEL", "serviceRequestType");
define("TOKEN_LABEL", "token");

// service request types
define("CREATE_APP", "CREATE_APP");
define("DELETE_APP", "DELETE_APP");
define("DOWNLOAD_APP", "DOWNLOAD_APP");
define("TECH_STACK_PACKAGE_LIST", "TECH_STACK_PACKAGE_LIST");
define("MODEL_LIST", "MODEL_LIST");
define("TECH_STACK_PACKAGE_OPTIONS", "TECH_STACK_PACKAGE_OPTIONS");
define("ARCHIVED_APP_LIST", "ARCHIVED_APP_LIST");
define("SERVICE_LIST", "SERVICE_LIST");
define("VALIDATE_TOKEN", "VALIDATE_TOKEN");
define("VALIDATE_MODEL", "VALIDATE_MODEL");
define("VALIDATE_TECH_STACK", "VALIDATE_TECH_STACK");
define("REGISTER_MODEL", "REGISTER_MODEL");
define("REGISTER_TECH_STACK", "REGISTER_TECH_STACK");
define("CREATE_APP", "CREATE_APP");
define("GENERATE_APP", "GENERATE_APP");
define("DELETE_APP", "DELETE_APP");
define("GET_APP", "GET_APP");
define("S3SERVERURL", "s3ServerUrl");
define("S3USERDIR", "s3UsersDir");
define("GET_TECH_STACK", "GET_TECH_STACK");
define("GET_MODEL", "GET_MODEL");
define("DELETE_TECH_STACK", "DELETE_TECH_STACK");
define("DELETE_MODEL", "DELETE_MODEL");
define("PROMOTE_TECH_STACK", "PROMOTE_TECH_STACK");
define("PROMOTE_MODEL", "PROMOTE_MODEL");
define("PROMOTE_APP", "PROMOTE_APP");
define("DEMOTE_TECH_STACK", "DEMOTE_TECH_STACK");
define("DEMOTE_MODEL", "DEMOTE_MODEL");
define("DEMOTE_APP", "DEMOTE_APP");
define("USER_INFO", "USER_INFO");

////////////////////////
// return msg options
////////////////////////
define("SUCCESS", "SUCCESS");
define("ERROR", "ERROR");

////////////////////////
// msgs
////////////////////////
define("TOKEN_REQUEST_MSG", "Authenticating your token with realMethods.");
define("TOKEN_VALID_MSG", "Token authorized and realMethods is now ready to be used.");
define("TOKEN_ALREADY_VALID_MSG", "Token already authorized, realMethods ready to be used.");
define("TOKEN_VALIDATION_ERROR", "Unable to validate your token. Check the token and host Url if provided.");
define("MODEL_LIST_REQUEST_MSG", "Retrieving a list of models." );
define("TECH_STACK_PKG_LIST_REQUEST_MSG", "Retrieving a list of tech stacks." );
define("TECH_STACK_OPTIONS_REQUEST_MSG", "Retrieving tech stack package options.");
define("VALIDATE_TECH_STACK_REQUEST_MSG", "Validating tech stack %s on remote server.");
define("VALIDATE_MODEL_REQUEST_MSG", "Validating model %s on remote server.");
define("REGISTER_MODEL_REQUEST_MSG", "Publishing model %s on remote server.");
define("REGISTER_TECH_STACK_REQUEST_MSG", "Publishing tech stack %s on remote server.");
define("GENERATE_APP_REQUEST_MSG", "Generating app %s on remote server. Please wait...");
define("APP_ARCHIVELIST_REQUEST_MSG", "Retrieving application archive info." );
define("DELETE_APP_REQUEST_MSG", "Deleting application from archive." );
define("DOWNLOAD_APP_REQUEST_MSG", "Downloading application from archive." );
define("DELETE_MODEL_REQUEST_MSG", "Deleting model." );
define("DOWNLOAD_MODEL_REQUEST_MSG", "Downloading model." );
define("DELETE_TECH_STACK_REQUEST_MSG", "Deleting tech stack." );
define("DOWNLOAD_TECH_STACK_REQUEST_MSG", "Downloading tech stack." );
define("TECH_STACK_VALIDATION_SUCCESS", "Tech stack validation was successful.");
define("TECH_STACK_REGISTRATION_SUCCESS", "Tech stack registration was successful.");
define("DOWNLOAD_COMPLETE", "Download complete.");
define("MAL_FORMED_OPTIONS_JSON_FILE", "Options file is not properly formed as a JSON structure. Validate its structure.");
define("PROMOTE_APP_REQUEST_MSG", "Promoting application from private to public scope.");
define("PROMOTE_MODEL_REQUEST_MSG", "Promoting model from private to public scope.");
define("PROMOTE_TECH_STACK_REQUEST_MSG", "Promoting tech stack from private to public scope.");
define("DEMOTE_APP_REQUEST_MSG", "Demoting application from public to private scope.");
define("DEMOTE_MODEL_REQUEST_MSG", "Demiting model from public to private scope.");
define("DEMOTE_TECH_STACK_REQUEST_MSG", "Demoting tech stack from public to private scope.");
define("APP_GENERATE_SUCCESS", "Application %s was generated, compiled, committed to GitHub, and archived." );
define("COMMAND_SUCCESS", "Successfully executed command %s");
define("COMMAND_ERROR", "Failed to execute command %s." );
define("USER_INFO_REQUEST_MSG", "Retrieving user information.");

////////////////////////
// enums
////////////////////////

// output format
define("JSON_OUTPUT", 'json');
define("PRETTY_PRINT_OUTPUT", 'pretty');
define("NO_OUTPUT", "none");

// scope of request
define("PRIVATE", 'PRIVATE'); // the default for most to all calls likely
define("PUBLIC", 'PUBLIC');
define("COMMUNITY", 'COMMUNITY');

// AWS S3 Related
define("BUCKET", "bucket");
define("USER_ROOT_DIR", "/cli/users/");
define("PUBLIC_ROOT_DIR", "/public/");
define("TECH_STACK_DIR", "techstacks");
define("MODEL_DIR", "models");
