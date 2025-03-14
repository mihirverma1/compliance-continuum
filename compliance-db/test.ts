import { query } from './db-connector';

async function testConnection() {
  try {
    const result = await query('SELECT * FROM users');
    console.log('Users:', result.rows);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection();