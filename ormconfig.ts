import { ConnectionOptions } from 'typeorm';

export default {
    type: 'mssql',
    host: '201.54.16.83',
    port: 1433,
    username: 'userapp_crm',
    password: '6Yd785VOGvaSbB9',
    database: 'CRM',
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true,
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