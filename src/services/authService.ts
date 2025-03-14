
import { query } from '@/lib/database';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'auditor';
  department?: string;
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * User login authentication
 */
export async function login(credentials: LoginCredentials): Promise<User | null> {
  try {
    // In a real application, you would use password hashing like bcrypt
    const result = await query(
      'SELECT id, username, name, email, role, department, status, created_at, last_login FROM users WHERE username = $1 AND password_hash = $2 AND status = $3',
      [credentials.username, credentials.password, 'active']
    );

    if (result.rowCount === 0) {
      return null;
    }

    // Update last login timestamp
    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [result.rows[0].id]);

    return result.rows[0] as User;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const result = await query(
      'SELECT id, username, name, email, role, department, status, created_at, last_login FROM users ORDER BY created_at DESC'
    );
    return result.rows as User[];
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
}

/**
 * Create a new user
 */
export async function createUser(user: Omit<User, 'id' | 'created_at' | 'last_login'> & { password: string }): Promise<User> {
  try {
    const result = await query(
      'INSERT INTO users (username, password_hash, name, email, role, department, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, name, email, role, department, status, created_at',
      [user.username, user.password, user.name, user.email, user.role, user.department, user.status]
    );
    
    return result.rows[0] as User;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

/**
 * Update an existing user
 */
export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let counter = 1;

    // Build dynamic update query based on provided fields
    for (const [key, value] of Object.entries(userData)) {
      if (key !== 'id' && key !== 'created_at' && key !== 'last_login') {
        fields.push(`${key} = $${counter}`);
        values.push(value);
        counter++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${counter} RETURNING id, username, name, email, role, department, status, created_at, last_login`,
      values
    );

    return result.rows[0] as User;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: number): Promise<boolean> {
  try {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}
