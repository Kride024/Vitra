const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Development/local fallback: set DB_USE_SQLITE=true to run with a local sqlite file
const useSqlite = process.env.DB_USE_SQLITE === 'true';

// Optional SSL CA path and flags are supported via env vars:
// DB_SSL_CA_PATH - path to the Aiven ca.pem
// DB_SSL_REJECT_UNAUTHORIZED - 'true' or 'false'
// DB_SSL_REQUIRE - 'true' or 'false' (if not set, we infer from presence of CA)

const sslCaPath = process.env.DB_SSL_CA_PATH;
const sslRequire = process.env.DB_SSL_REQUIRE === 'true' || !!sslCaPath;
const sslRejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';

const dialectOptions = {};
if (sslRequire) {
    // For mysql2, pass TLS options under `ssl`. Include CA when provided
    dialectOptions.ssl = {
        rejectUnauthorized: sslRejectUnauthorized,
    };

    if (sslCaPath) {
        try {
            const resolved = path.resolve(sslCaPath);
            // Provide raw buffer for CA (mysql2 accepts Buffer or string)
            dialectOptions.ssl.ca = fs.readFileSync(resolved);
        } catch (err) {
            console.warn(`Could not read DB_SSL_CA_PATH at ${sslCaPath}: ${err.message}`);
        }
    }
}

// Warn early if required DB env vars are missing to aid debugging
const requiredVars = ["DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST"];
const missing = requiredVars.filter((v) => !process.env[v]);
if (missing.length) {
    console.warn(`Missing DB env vars: ${missing.join(", ")}. DB connection likely to fail.`);
}

let sequelize;
if (useSqlite) {
    const storagePath = path.resolve(__dirname, '..', 'data', 'dev.sqlite');
    // Ensure directory exists
    try {
        fs.mkdirSync(path.dirname(storagePath), { recursive: true });
    } catch (e) {
        // ignore
    }
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: storagePath,
        logging: false,
    });
    console.log(`Using local SQLite DB at ${storagePath}`);
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
            dialect: 'mysql',
            logging: false,
            pool: {
                max: Number(process.env.DB_POOL_MAX) || 10,
                min: Number(process.env.DB_POOL_MIN) || 0,
                acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
                idle: Number(process.env.DB_POOL_IDLE) || 10000,
            },
            dialectOptions,
        }
    );
}

module.exports = sequelize;
