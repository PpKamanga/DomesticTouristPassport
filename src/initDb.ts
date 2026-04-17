import "dotenv/config";
import { pool } from "./db";
import bcrypt from "bcrypt";

async function initDb() {
  if (!pool) {
    throw new Error("Database pool is not initialized");
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE,
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
      cleanliness TEXT,
      safety TEXT,
      accessibility TEXT,
      staff TEXT,
      value TEXT,
      recommend TEXT,
      username VARCHAR(50) NOT NULL,
      footprints INT NOT NULL DEFAULT 0,
      badge VARCHAR(50) DEFAULT 'First Step',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
    await pool.query(`
    ALTER TABLE visits
    ADD COLUMN IF NOT EXISTS cleanliness TEXT,
    ADD COLUMN IF NOT EXISTS safety TEXT,
    ADD COLUMN IF NOT EXISTS accessibility TEXT,
    ADD COLUMN IF NOT EXISTS staff TEXT,
    ADD COLUMN IF NOT EXISTS value TEXT,
    ADD COLUMN IF NOT EXISTS recommend TEXT;
  `);

  const touristPasswordHash = await bcrypt.hash("tour123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  await pool.query(`
    INSERT INTO users (username, email, password_hash, role)
    VALUES
      ($1, $2, $3, $4),
      ($5, $6, $7, $8)
    ON CONFLICT (username) DO NOTHING;
  `, [
    'tourist1', 'tour123@example.com', touristPasswordHash, 'tourist',
    'admin1', 'admin123@example.com', adminPasswordHash, 'admin'
  ]);

  console.log("Database initialized successfully");
  await pool.end();
}

initDb().catch(error => {
  console.error("Database init error:", error);
});