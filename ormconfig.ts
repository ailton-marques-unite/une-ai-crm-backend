import { ConnectionOptions } from 'typeorm';

export default {
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'user_crm',
    password: 'p@ssw0rd',
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
