import { initDatabase } from './db-connector';

async function setup() {
  try {
    await initDatabase();
    console.log('Database setup complete');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setup();