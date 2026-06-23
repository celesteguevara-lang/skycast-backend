const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

let poolPromise = null;

async function getConnection() {
  try {
    if (!process.env.DB_SERVER) {
      console.warn('DB_SERVER no está definido. No se intentará conectar a SQL Server.');
      return null;
    }

    if (!poolPromise) {
      poolPromise = sql.connect(dbConfig);
    }

    return await poolPromise;
  } catch (error) {
    console.error('Error conectando a SQL Server:', error.message);
    throw error;
  }
}

module.exports = {
  sql,
  getConnection,
  dbConfig
};