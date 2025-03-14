
import { query } from '@/lib/database';

export interface Policy {
  id: number;
  name: string;
  type: string;
  owner: string;
  status: string;
  review_date: string;
  created_at: string;
  last_updated: string;
}

/**
 * Get all policies
 */
export async function getAllPolicies(): Promise<Policy[]> {
  try {
    const result = await query('SELECT * FROM policies ORDER BY created_at DESC');
    return result.rows as Policy[];
  } catch (error) {
    console.error('Get policies error:', error);
    throw error;
  }
}

/**
 * Create a new policy
 */
export async function createPolicy(policy: Omit<Policy, 'id' | 'created_at' | 'last_updated'>): Promise<Policy> {
  try {
    const result = await query(
      'INSERT INTO policies (name, type, owner, status, review_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [policy.name, policy.type, policy.owner, policy.status, policy.review_date]
    );
    
    return result.rows[0] as Policy;
  } catch (error) {
    console.error('Create policy error:', error);
    throw error;
  }
}

/**
 * Update an existing policy
 */
export async function updatePolicy(id: number, policyData: Partial<Policy>): Promise<Policy> {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let counter = 1;

    // Build dynamic update query
    for (const [key, value] of Object.entries(policyData)) {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${counter}`);
        values.push(value);
        counter++;
      }
    }

    // Always update the last_updated timestamp
    fields.push(`last_updated = CURRENT_TIMESTAMP`);
    
    values.push(id);
    const result = await query(
      `UPDATE policies SET ${fields.join(', ')} WHERE id = $${counter} RETURNING *`,
      values
    );

    return result.rows[0] as Policy;
  } catch (error) {
    console.error('Update policy error:', error);
    throw error;
  }
}

/**
 * Delete a policy
 */
export async function deletePolicy(id: number): Promise<boolean> {
  try {
    const result = await query('DELETE FROM policies WHERE id = $1', [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Delete policy error:', error);
    throw error;
  }
}

/**
 * Import multiple policies from CSV
 */
export async function importPolicies(policies: Omit<Policy, 'id' | 'created_at' | 'last_updated'>[]): Promise<number> {
  try {
    let count = 0;
    
    // Use a transaction for bulk import
    await query('BEGIN');
    
    for (const policy of policies) {
      const result = await query(
        'INSERT INTO policies (name, type, owner, status, review_date) VALUES ($1, $2, $3, $4, $5)',
        [policy.name, policy.type, policy.owner, policy.status, policy.review_date]
      );
      
      count += result.rowCount;
    }
    
    await query('COMMIT');
    return count;
  } catch (error) {
    await query('ROLLBACK');
    console.error('Import policies error:', error);
    throw error;
  }
}
