import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
    type: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: false,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
        },
        options: {
        encrypt: true,   
        trustServerCertificate: true 
        }
} as ConnectionOptions;
