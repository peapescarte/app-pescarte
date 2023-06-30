require('dotenv').config();

module.exports = {
    dialect: 'postgres',
    host: "database",
    port: process.env.DATABASE_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    define: {
        timestamp: true
    },
    dialectOptions: {
        timezone: 'America/Sao_Paulo'
    },
    timezone: 'America/Sao_Paulo'
}