import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database connection pool configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',              // Default user: postgres
  host: process.env.DB_HOST || 'localhost',             // Default host: localhost
  database: process.env.DB_NAME || 'compliance_continuum', // Default database name
  password: process.env.DB_PASSWORD || 'password',      // Default password (update this!)
  port: parseInt(process.env.DB_PORT || '5432'),        // Default port: 5432
});

/**
 * Execute a query with optional parameters
 * @param text SQL query string
 * @param params Optional array of parameters for parameterized queries
 * @returns Query result
 */
export async function query(text: string, params?: any[]) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Initialize database tables if they don't exist and add default data
 */
export async function initDatabase() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        department VARCHAR(50),
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // Create assets table
    await query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        location VARCHAR(100),
        department VARCHAR(100),
        compliance_status VARCHAR(50),
        criticality VARCHAR(20),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create policies table
    await query(`
      CREATE TABLE IF NOT EXISTS policies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        owner VARCHAR(100),
        status VARCHAR(50),
        review_date DATE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create risks table
    await query(`
      CREATE TABLE IF NOT EXISTS risks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        risk_type VARCHAR(50) NOT NULL,
        description TEXT,
        criticality VARCHAR(20),
        impact INTEGER,
        likelihood INTEGER,
        vulnerability_score INTEGER,
        asset_value INTEGER,
        threat_value INTEGER,
        compensatory_control TEXT,
        owner VARCHAR(100),
        status VARCHAR(50),
        due_date DATE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create compliance_frameworks table
    await query(`
      CREATE TABLE IF NOT EXISTS compliance_frameworks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create compliance_controls table (with foreign key to frameworks)
    await query(`
      CREATE TABLE IF NOT EXISTS compliance_controls (
        id SERIAL PRIMARY KEY,
        framework_id INTEGER REFERENCES compliance_frameworks(id),
        control_id VARCHAR(20) NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Not Assessed',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create audit_evidence table (with foreign key to controls)
    await query(`
      CREATE TABLE IF NOT EXISTS audit_evidence (
        id SERIAL PRIMARY KEY,
        control_id INTEGER REFERENCES compliance_controls(id),
        evidence_name VARCHAR(100) NOT NULL,
        evidence_type VARCHAR(50),
        file_path VARCHAR(255),
        status VARCHAR(50),
        reviewer VARCHAR(100),
        review_date DATE,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin user if it doesn't exist
    const adminExists = await query('SELECT * FROM users WHERE username = $1', ['miko']);
    if (adminExists.rowCount === 0) {
      // Note: In production, use bcrypt or similar for password hashing
      await query(
        'INSERT INTO users (username, password_hash, name, email, role) VALUES ($1, $2, $3, $4, $5)',
        ['miko', 'miko', 'Miko Admin', 'admin@example.com', 'admin']
      );
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Export functions for use in other files
export default {
  query,
  initDatabase,
};