import "dotenv/config";
import { pool } from "./db";

async function initDb() {
  if (!pool) {
    throw new Error("Database pool is not initialized");
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      destination_id INT NOT NULL,
      rating INT NOT NULL DEFAULT 0,
      comment TEXT DEFAULT '',
      username VARCHAR(50) NOT NULL,
      footprints INT NOT NULL DEFAULT 0,
      badge VARCHAR(50) DEFAULT 'First Step',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    INSERT INTO users (username, password, role)
    VALUES
      ('tourist1', 'tour123', 'tourist'),
      ('admin1', 'admin123', 'admin')
    ON CONFLICT (username) DO NOTHING;
  `);

  console.log("Database initialized successfully");
  await pool.end();
}

initDb().catch(error => {
  console.error("Database init error:", error);
});