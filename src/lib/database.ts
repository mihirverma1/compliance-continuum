
import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'compliance_continuum',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Test the pool connection on startup
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database from frontend');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

/**
 * Execute a query with optional parameters
 */
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Frontend executed query', { duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Initialize database tables if they don't exist
 */
export async function initDatabase() {
  try {
    console.log('Checking database connection from frontend...');
    
    // Simple connection test
    const result = await query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    
    // We'll run a check on users table to ensure we have access
    const usersCheck = await query('SELECT COUNT(*) FROM users');
    console.log(`Found ${usersCheck.rows[0].count} users in the database`);
    
    return true;
  } catch (error) {
    console.error('Database initialization error from frontend:', error);
    throw error;
  }
}

/**
 * Utility function to check if a table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `, [tableName]);
    
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

export default {
  query,
  initDatabase,
  tableExists
};
