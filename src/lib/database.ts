
import { Pool } from 'pg';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Database connection pool - will only be initialized in Node.js environments
let pool: Pool | null = null;

if (!isBrowser) {
  // Only create the pool in a Node.js environment
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'compliance_continuum',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  // Test the pool connection on startup
  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('Database connection error:', err);
  });
}

// Mock data for browser environment
const mockData = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user' },
  ],
  assets: [],
  policies: [],
  risks: [],
  compliance_frameworks: [],
  compliance_controls: [],
  audit_evidence: [],
};

/**
 * Execute a query with optional parameters
 */
export async function query(text: string, params?: any[]) {
  try {
    if (isBrowser) {
      console.log('Browser environment detected, using mock data');
      
      // Simulate a delay to mimic a real database query
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Very simple mock implementation
      if (text.includes('SELECT * FROM users')) {
        return { rows: mockData.users, rowCount: mockData.users.length };
      }
      
      if (text.includes('SELECT COUNT(*) FROM')) {
        const tableName = text.match(/FROM\s+(\w+)/i)?.[1] || '';
        const count = mockData[tableName as keyof typeof mockData]?.length || 0;
        return { rows: [{ count }], rowCount: 1 };
      }
      
      return { rows: [], rowCount: 0 };
    }
    
    if (!pool) {
      throw new Error('Database pool not initialized - not in Node.js environment');
    }
    
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { duration, rows: result.rowCount });
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
    console.log('Checking database connection...');
    
    if (isBrowser) {
      console.log('Browser environment detected, using mock data');
      return true;
    }
    
    if (!pool) {
      throw new Error('Database pool not initialized - not in Node.js environment');
    }
    
    // Simple connection test
    const result = await query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    
    // We'll run a check on users table to ensure we have access
    const usersCheck = await query('SELECT COUNT(*) FROM users');
    console.log(`Found ${usersCheck.rows[0].count} users in the database`);
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

/**
 * Utility function to check if a table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    if (isBrowser) {
      // In browser, pretend all required tables exist
      return true;
    }
    
    if (!pool) {
      throw new Error('Database pool not initialized - not in Node.js environment');
    }
    
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
