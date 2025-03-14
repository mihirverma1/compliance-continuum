
import { query } from '@/lib/database';

export interface Asset {
  id: number;
  name: string;
  type: string;
  location: string;
  department: string;
  compliance_status: string;
  criticality: string;
  created_at: string;
  last_updated: string;
}

/**
 * Get all assets
 */
export async function getAllAssets(): Promise<Asset[]> {
  try {
    const result = await query('SELECT * FROM assets ORDER BY created_at DESC');
    return result.rows as Asset[];
  } catch (error) {
    console.error('Get assets error:', error);
    throw error;
  }
}

/**
 * Create a new asset
 */
export async function createAsset(asset: Omit<Asset, 'id' | 'created_at' | 'last_updated'>): Promise<Asset> {
  try {
    const result = await query(
      'INSERT INTO assets (name, type, location, department, compliance_status, criticality) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [asset.name, asset.type, asset.location, asset.department, asset.compliance_status, asset.criticality]
    );
    
    return result.rows[0] as Asset;
  } catch (error) {
    console.error('Create asset error:', error);
    throw error;
  }
}

/**
 * Update an existing asset
 */
export async function updateAsset(id: number, assetData: Partial<Asset>): Promise<Asset> {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let counter = 1;

    // Build dynamic update query
    for (const [key, value] of Object.entries(assetData)) {
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
      `UPDATE assets SET ${fields.join(', ')} WHERE id = $${counter} RETURNING *`,
      values
    );

    return result.rows[0] as Asset;
  } catch (error) {
    console.error('Update asset error:', error);
    throw error;
  }
}

/**
 * Delete an asset
 */
export async function deleteAsset(id: number): Promise<boolean> {
  try {
    const result = await query('DELETE FROM assets WHERE id = $1', [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Delete asset error:', error);
    throw error;
  }
}

/**
 * Import multiple assets from CSV
 */
export async function importAssets(assets: Omit<Asset, 'id' | 'created_at' | 'last_updated'>[]): Promise<number> {
  try {
    let count = 0;
    
    // Use a transaction for bulk import
    await query('BEGIN');
    
    for (const asset of assets) {
      const result = await query(
        'INSERT INTO assets (name, type, location, department, compliance_status, criticality) VALUES ($1, $2, $3, $4, $5, $6)',
        [asset.name, asset.type, asset.location, asset.department || 'N/A', asset.compliance_status, asset.criticality || 'Medium']
      );
      
      count += result.rowCount;
    }
    
    await query('COMMIT');
    return count;
  } catch (error) {
    await query('ROLLBACK');
    console.error('Import assets error:', error);
    throw error;
  }
}
