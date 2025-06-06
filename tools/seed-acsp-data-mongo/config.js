const mongodbConfigs = {
    local: "mongodb://localhost:27017",
    phoenix: "mongodb+srv://phoenix_dev@phoenix-dev-pl-0.ueium.mongodb.net/admin?retryWrites=true&loadBalanced=false&replicaSet=atlas-yar7m5-shard-0&readPreference=primary&srvServiceName=mongodb&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1",
    cidev: "mongodb+srv://phoenix_dev@phoenix-dev-pl-0.ueium.mongodb.net/admin?retryWrites=true&loadBalanced=false&replicaSet=atlas-yar7m5-shard-0&readPreference=primary&srvServiceName=mongodb&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1"
};

const USE_ENV = process.env.USE_ENV || "local";

export const MONGODB_URI = process.env.MONGODB_URI || mongodbConfigs[USE_ENV];
export const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || "$2a$10$6a..eerV1kSiNW3sBlcYv.VmEXyI7ABWuoo3w7zKzcdh18YKyvPbm";
export const NO_USERS_TO_CREATE = process.env.NO_USERS_TO_CREATE ? parseInt(process.env.NO_USERS_TO_CREATE, 10) : 100;
export const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || "example.com";
