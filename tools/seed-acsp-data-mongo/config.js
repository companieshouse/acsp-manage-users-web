const mongodbConfigs = {
    local: "mongodb://localhost:27017",
    phoenix: "mongodb+srv://phoenix_dev@phoenix-dev-pl-0.ueium.mongodb.net/admin?retryWrites=true&loadBalanced=false&replicaSet=atlas-yar7m5-shard-0&readPreference=primary&srvServiceName=mongodb&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1&3t.uriVersion=3&3t.connection.name=pheonix&3t.databases=admin&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true&3t.sslTlsVersion=TLS",
    cidev: "mongodb+srv://phoenix_dev@phoenix-dev-pl-0.ueium.mongodb.net/admin?retryWrites=true&loadBalanced=false&replicaSet=atlas-yar7m5-shard-0&readPreference=primary&srvServiceName=mongodb&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1&3t.uriVersion=3&3t.connection.name=pheonix&3t.databases=admin&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true&3t.sslTlsVersion=TLS"
};

const USE_ENV = process.env.USE_ENV || "local";

export const MONGODB_URI = process.env.MONGODB_URI || mongodbConfigs[USE_ENV];
export const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || "password";
export const NO_USERS_TO_CREATE = process.env.NO_USERS_TO_CREATE ? parseInt(process.env.NO_USERS_TO_CREATE, 10) : 100;
