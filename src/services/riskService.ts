
import { query } from '@/lib/database';

export interface Risk {
  id: number;
  name: string;
  risk_type: string;
  description: string;
  criticality: string;
  impact: number;
  likelihood: number;
  vulnerability_score: number;
  asset_value: number;
  threat_value: number;
  compensatory_control: string;
  owner: string;
  status: string;
  due_date: string;
  created_at: string;
  last_updated: string;
}

/**
 * Get all risks
 */
export async function getAllRisks(): Promise<Risk[]> {
  try {
    const result = await query('SELECT * FROM risks ORDER BY criticality DESC, created_at DESC');
    return result.rows as Risk[];
  } catch (error) {
    console.error('Get risks error:', error);
    throw error;
  }
}

/**
 * Create a new risk
 */
export async function createRisk(risk: Omit<Risk, 'id' | 'created_at' | 'last_updated'>): Promise<Risk> {
  try {
    const result = await query(
      `INSERT INTO risks (
        name, risk_type, description, criticality, impact, likelihood, 
        vulnerability_score, asset_value, threat_value, compensatory_control, 
        owner, status, due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        risk.name, risk.risk_type, risk.description, risk.criticality, 
        risk.impact, risk.likelihood, risk.vulnerability_score, 
        risk.asset_value, risk.threat_value, risk.compensatory_control,
        risk.owner, risk.status, risk.due_date
      ]
    );
    
    return result.rows[0] as Risk;
  } catch (error) {
    console.error('Create risk error:', error);
    throw error;
  }
}

/**
 * Update an existing risk
 */
export async function updateRisk(id: number, riskData: Partial<Risk>): Promise<Risk> {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let counter = 1;

    // Build dynamic update query
    for (const [key, value] of Object.entries(riskData)) {
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
      `UPDATE risks SET ${fields.join(', ')} WHERE id = $${counter} RETURNING *`,
      values
    );

    return result.rows[0] as Risk;
  } catch (error) {
    console.error('Update risk error:', error);
    throw error;
  }
}

/**
 * Delete a risk
 */
export async function deleteRisk(id: number): Promise<boolean> {
  try {
    const result = await query('DELETE FROM risks WHERE id = $1', [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Delete risk error:', error);
    throw error;
  }
}

/**
 * Import multiple risks from CSV
 */
export async function importRisks(risks: Omit<Risk, 'id' | 'created_at' | 'last_updated'>[]): Promise<number> {
  try {
    let count = 0;
    
    // Use a transaction for bulk import
    await query('BEGIN');
    
    for (const risk of risks) {
      const result = await query(
        `INSERT INTO risks (
          name, risk_type, description, criticality, impact, likelihood, 
          vulnerability_score, asset_value, threat_value, compensatory_control, 
          owner, status, due_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          risk.name, risk.risk_type, risk.description, risk.criticality, 
          risk.impact, risk.likelihood, risk.vulnerability_score, 
          risk.asset_value, risk.threat_value, risk.compensatory_control,
          risk.owner, risk.status, risk.due_date
        ]
      );
      
      count += result.rowCount;
    }
    
    await query('COMMIT');
    return count;
  } catch (error) {
    await query('ROLLBACK');
    console.error('Import risks error:', error);
    throw error;
  }
}
