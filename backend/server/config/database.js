import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'aicvmakeroauth',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let dbPool;

const DEFAULT_CREDITS_REGISTERED = 50;

async function initializeDatabase() {
  try {
    const tempConnectionForDbCreation = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });
    await tempConnectionForDbCreation.query('CREATE DATABASE IF NOT EXISTS ??', [dbConfig.database]);
    await tempConnectionForDbCreation.end();
    console.log(`Database '${dbConfig.database}' ensured.`);

    dbPool = mysql.createPool(dbConfig);
    const connection = await dbPool.getConnection();
    console.log('Successfully connected to MySQL database pool.');

    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NULL, 
          name VARCHAR(255),
          google_id VARCHAR(255) UNIQUE NULL,
          role VARCHAR(50) DEFAULT 'user',
          is_email_verified BOOLEAN DEFAULT FALSE,
          email_verification_token VARCHAR(255) NULL,
          email_verification_token_expires_at TIMESTAMP NULL,
          password_reset_token VARCHAR(255) NULL,
          password_reset_token_expires_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Users table core structure ensured.');

      const columnsOperations = [
        { name: 'credits_available', type: `INT DEFAULT ${DEFAULT_CREDITS_REGISTERED} NULL` },
        { name: 'credits_last_reset_date', type: 'DATE NULL' }
      ];

      for (const col of columnsOperations) {
        const [existingCols] = await connection.query(`SHOW COLUMNS FROM users LIKE '${col.name}';`);
        if (existingCols.length === 0) {
          await connection.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type};`);
          console.log(`Added column '${col.name}' to users table.`);
        }
      }
      
      const [passwordCols] = await connection.query("SHOW COLUMNS FROM users LIKE 'password';"); 
      if (passwordCols.length > 0 && passwordCols[0].Null === 'NO') {
          await connection.query("ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL;");
          console.log('Modified password column to be nullable.');
      }

      console.log('Users table schema is up to date.');

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Failed to initialize or connect to database:', error);
    if (dbPool && typeof dbPool.end === 'function') {
      await dbPool.end();
    }
    throw error; 
  }
}

export { dbPool, initializeDatabase, DEFAULT_CREDITS_REGISTERED };
