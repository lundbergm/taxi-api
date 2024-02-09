import dotenv from 'dotenv-defaults';

dotenv.config();

const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    mode: process.env.API_MODE || 'MOCK',
    db: {
        connectionString: process.env.MONGO_CONNECTION_STRING || '',
        name: process.env.MONGO_DB_NAME || 'taxi-service',
    },
};

export default config;
export type AppConfig = typeof config;
