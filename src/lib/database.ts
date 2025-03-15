
// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Mock data for browser environment
const mockData: Record<string, any[]> = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', username: 'admin', status: 'active' },
    { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user', username: 'user', status: 'active' },
  ],
  assets: [
    { id: 1, name: 'Production Server', type: 'Server', location: 'Main Datacenter', department: 'IT', compliance_status: 'Compliant', criticality: 'High' },
    { id: 2, name: 'Customer Database', type: 'Database', location: 'Cloud', department: 'Operations', compliance_status: 'Review', criticality: 'Critical' },
  ],
  policies: [
    { id: 1, name: 'Data Retention Policy', type: 'Security', owner: 'CISO', status: 'Active', review_date: '2025-12-31' },
    { id: 2, name: 'Access Control Policy', type: 'Security', owner: 'Security Team', status: 'Active', review_date: '2025-10-15' },
  ],
  risks: [
    { id: 1, name: 'Data Breach', risk_type: 'Security', criticality: 'High', impact: 8, likelihood: 5, owner: 'CISO', status: 'Mitigating' },
    { id: 2, name: 'System Downtime', risk_type: 'Operational', criticality: 'Medium', impact: 6, likelihood: 4, owner: 'IT Director', status: 'Accepted' },
  ],
  compliance_frameworks: [
    { id: 1, name: 'ISO 27001', description: 'Information security standard' },
    { id: 2, name: 'GDPR', description: 'General Data Protection Regulation' },
  ],
  compliance_controls: [
    { id: 1, framework_id: 1, control_id: 'A.5.1.1', name: 'Information Security Policies', status: 'Implemented' },
    { id: 2, framework_id: 2, control_id: 'Art.30', name: 'Records of Processing', status: 'In Progress' },
  ],
  audit_evidence: [
    { id: 1, control_id: 1, evidence_name: 'Security Policy Document', evidence_type: 'Document', status: 'Approved' },
    { id: 2, control_id: 2, evidence_name: 'Data Processing Register', evidence_type: 'Spreadsheet', status: 'Draft' },
  ],
};

/**
 * Execute a query with optional parameters
 */
export async function query(text: string, params?: any[]) {
  try {
    // In a browser environment, return mock data based on a very simple query matching
    if (isBrowser) {
      console.log('Browser environment detected, using mock data');
      
      // Simulate a delay to mimic a real database query
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Very simple mock implementation based on the query text
      if (text.toLowerCase().includes('select * from users')) {
        return { rows: mockData.users, rowCount: mockData.users.length };
      }
      
      if (text.toLowerCase().includes('select * from assets')) {
        return { rows: mockData.assets, rowCount: mockData.assets.length };
      }
      
      if (text.toLowerCase().includes('select * from policies')) {
        return { rows: mockData.policies, rowCount: mockData.policies.length };
      }
      
      if (text.toLowerCase().includes('select * from risks')) {
        return { rows: mockData.risks, rowCount: mockData.risks.length };
      }
      
      if (text.toLowerCase().includes('select * from compliance_frameworks')) {
        return { rows: mockData.compliance_frameworks, rowCount: mockData.compliance_frameworks.length };
      }
      
      if (text.toLowerCase().includes('select * from compliance_controls')) {
        return { rows: mockData.compliance_controls, rowCount: mockData.compliance_controls.length };
      }
      
      if (text.toLowerCase().includes('select * from audit_evidence')) {
        return { rows: mockData.audit_evidence, rowCount: mockData.audit_evidence.length };
      }
      
      if (text.toLowerCase().includes('select count(*) from')) {
        const tableName = text.match(/from\s+(\w+)/i)?.[1].toLowerCase() || '';
        const tableData = Object.entries(mockData).find(([key]) => key.toLowerCase() === tableName);
        const count = tableData ? tableData[1].length : 0;
        return { rows: [{ count }], rowCount: 1 };
      }
      
      if (text.toLowerCase().includes('insert into')) {
        const tableName = text.match(/insert into\s+(\w+)/i)?.[1].toLowerCase() || '';
        // Just return a fake successful insert
        return { rows: [{ id: Math.floor(Math.random() * 1000) + 10 }], rowCount: 1 };
      }
      
      if (text.toLowerCase().includes('update')) {
        // Just return a fake successful update
        return { rows: [{}], rowCount: 1 };
      }
      
      if (text.toLowerCase().includes('delete')) {
        // Just return a fake successful delete
        return { rows: [], rowCount: 1 };
      }
      
      // Default response
      return { rows: [], rowCount: 0 };
    }
    
    // If this is a server environment, import the pg module
    // This is done dynamically to avoid errors in the browser
    const { Pool } = await import('pg');
    
    // Create the pool if it doesn't exist
    const pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'compliance_continuum',
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
    });
    
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
    
    // Simple connection test
    const result = await query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    
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
