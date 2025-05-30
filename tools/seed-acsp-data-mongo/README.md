# MongoDB Test Data Generator

Adds users, an ACSP and ACSP member data to MongoDB.

## Setup and Usage

1. In the project directory, install dependencies:
   ```bash
   npm install
   ```

2. Run the script:
   ```bash
   node index.js
   ```

## Environment Options

Use the `USE_ENV` variable to specify the MongoDB configuration:

```bash
USE_ENV=cidev node index.js
```

Pre-configured environments:
- `local` (default): Uses localhost MongoDB
- `phoenix`: Uses Phoenix development MongoDB
- `cidev`: Uses CI development MongoDB

## Custom Environment Variables

You can customize the script using these environment variables:

- `MONGODB_URI`: Override the MongoDB connection string
- `DEFAULT_PASSWORD`: Set a custom default password for generated users (default: "password")
- `NO_USERS_TO_CREATE`: Specify the number of users to generate (default: 100)
- `EMAIL_DOMAIN`: Set a custom domain for email addresses (default: `example.com`). See also https://www.iana.org/help/example-domains

Example usage:
```bash
USE_ENV=pheonix NO_USERS_TO_CREATE=50 DEFAULT_PASSWORD=custompass EMAIL_DOMAIN=example.org node index.js
```

## Configuration

The `config.js` file contains pre-configured MongoDB URIs and default values. You can modify this file to add or change environments and default settings. Here's an example of how to add a new environment:

```diff
const mongodbConfigs = {
    local: "mongodb://localhost:27017",
    phoenix: "mongodb+srv://phoenix_dev@phoenix-dev-pl-0.ueium.mongodb.net/admin?...",
    cidev: "mongodb+srv://phoenix_dev@phoenix-dev-pl-0.ueium.mongodb.net/admin?...",
+   staging: "mongodb+srv://staging_user@staging-cluster.example.net/admin?..."
};
```

Environment variables will override the values in `config.js` when provided.