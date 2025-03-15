
import { query } from './db-connector';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await query('SELECT * FROM users');
    console.log('Connection successful. Users:', result.rows);
    
    // Test query to each table to ensure they exist
    console.log('\nTesting all tables:');
    const tables = ['users', 'assets', 'policies', 'risks', 'compliance_frameworks', 'compliance_controls', 'audit_evidence'];
    
    for (const table of tables) {
      try {
        const tableResult = await query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`Table ${table} exists with ${tableResult.rows[0].count} records`);
      } catch (err) {
        console.error(`Error querying table ${table}:`, err);
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection();
