const mysql = require('mysql2/promise');

const connectDB = async () => {
  try {
    const connection = await mysql.createPool({
      host: process.env.DB_HOST || "shortline.proxy.rlwy.net",
      port: process.env.DB_PORT || 42289,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "vUdUIjtsWyGVvgjCQwGBYqpzyZBlQqUF",
      database: process.env.DB_NAME || "railway",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('✅ MySQL connected');
    return connection;
  } catch (error) {
    console.error(' MySQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
