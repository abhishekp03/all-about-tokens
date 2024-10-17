const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Export environment variables for use throughout the app
module.exports = {
    tenantID: process.env.TENANT_ID,
    clientAppClientID: process.env.CLIENT_APP_CLIENT_ID,
    clientAppClientSecret: process.env.CLIENT_APP_CLIENT_SECRET,
    middletierAppClientID: process.env.MIDDLE_TIER_APP_CLIENT_ID,
    middletierAppClientSecret: process.env.MIDDLE_TIER_APP_CLIENT_SECRET
};