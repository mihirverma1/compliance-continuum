
import { query } from '@/lib/database';

export interface ComplianceFramework {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface ComplianceControl {
  id: number;
  framework_id: number;
  control_id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  last_updated: string;
}

export interface AuditEvidence {
  id: number;
  control_id: number;
  evidence_name: string;
  evidence_type: string;
  file_path: string;
  status: string;
  reviewer: string;
  review_date: string;
  notes: string;
  created_at: string;
}

/**
 * Get all compliance frameworks
 */
export async function getAllFrameworks(): Promise<ComplianceFramework[]> {
  try {
    const result = await query('SELECT * FROM compliance_frameworks ORDER BY name');
    return result.rows as ComplianceFramework[];
  } catch (error) {
    console.error('Get frameworks error:', error);
    throw error;
  }
}

/**
 * Get framework by ID with controls
 */
export async function getFrameworkWithControls(frameworkId: number): Promise<{framework: ComplianceFramework, controls: ComplianceControl[]}> {
  try {
    const frameworkResult = await query('SELECT * FROM compliance_frameworks WHERE id = $1', [frameworkId]);
    
    if (frameworkResult.rowCount === 0) {
      throw new Error('Framework not found');
    }
    
    const controlsResult = await query('SELECT * FROM compliance_controls WHERE framework_id = $1 ORDER BY control_id', [frameworkId]);
    
    return {
      framework: frameworkResult.rows[0] as ComplianceFramework,
      controls: controlsResult.rows as ComplianceControl[]
    };
  } catch (error) {
    console.error('Get framework with controls error:', error);
    throw error;
  }
}

/**
 * Get controls by category
 */
export async function getControlsByCategory(category: string): Promise<ComplianceControl[]> {
  try {
    const result = await query(
      'SELECT * FROM compliance_controls WHERE category = $1 ORDER BY control_id',
      [category]
    );
    return result.rows as ComplianceControl[];
  } catch (error) {
    console.error('Get controls by category error:', error);
    throw error;
  }
}

/**
 * Get all control categories
 */
export async function getAllControlCategories(): Promise<string[]> {
  try {
    const result = await query(
      'SELECT DISTINCT category FROM compliance_controls ORDER BY category'
    );
    return result.rows.map(row => row.category);
  } catch (error) {
    console.error('Get control categories error:', error);
    throw error;
  }
}

/**
 * Create a new framework
 */
export async function createFramework(framework: Omit<ComplianceFramework, 'id' | 'created_at'>): Promise<ComplianceFramework> {
  try {
    const result = await query(
      'INSERT INTO compliance_frameworks (name, description) VALUES ($1, $2) RETURNING *',
      [framework.name, framework.description]
    );
    
    return result.rows[0] as ComplianceFramework;
  } catch (error) {
    console.error('Create framework error:', error);
    throw error;
  }
}

/**
 * Create a new control
 */
export async function createControl(control: Omit<ComplianceControl, 'id' | 'created_at' | 'last_updated'>): Promise<ComplianceControl> {
  try {
    const result = await query(
      `INSERT INTO compliance_controls (
        framework_id, control_id, name, description, category, status
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        control.framework_id, control.control_id, control.name, 
        control.description, control.category, control.status
      ]
    );
    
    return result.rows[0] as ComplianceControl;
  } catch (error) {
    console.error('Create control error:', error);
    throw error;
  }
}

/**
 * Submit audit evidence
 */
export async function submitAuditEvidence(evidence: Omit<AuditEvidence, 'id' | 'created_at'>): Promise<AuditEvidence> {
  try {
    const result = await query(
      `INSERT INTO audit_evidence (
        control_id, evidence_name, evidence_type, file_path, 
        status, reviewer, review_date, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        evidence.control_id, evidence.evidence_name, evidence.evidence_type, 
        evidence.file_path, evidence.status, evidence.reviewer, 
        evidence.review_date, evidence.notes
      ]
    );
    
    return result.rows[0] as AuditEvidence;
  } catch (error) {
    console.error('Submit audit evidence error:', error);
    throw error;
  }
}

/**
 * Import compliance data from CSV
 */
export async function importComplianceData(
  framework: string, 
  controls: Omit<ComplianceControl, 'id' | 'created_at' | 'last_updated' | 'framework_id'>[]
): Promise<number> {
  try {
    let count = 0;
    
    // Use a transaction for bulk import
    await query('BEGIN');
    
    // Check if framework exists or create it
    let frameworkId: number;
    const frameworkResult = await query('SELECT id FROM compliance_frameworks WHERE name = $1', [framework]);
    
    if (frameworkResult.rowCount === 0) {
      const newFramework = await query(
        'INSERT INTO compliance_frameworks (name, description) VALUES ($1, $2) RETURNING id',
        [framework, `${framework} Compliance Framework`]
      );
      frameworkId = newFramework.rows[0].id;
    } else {
      frameworkId = frameworkResult.rows[0].id;
    }
    
    // Import controls
    for (const control of controls) {
      const result = await query(
        `INSERT INTO compliance_controls (
          framework_id, control_id, name, description, category, status
        ) VALUES ($1, $2, $3, $4, $5, $6) 
        ON CONFLICT (framework_id, control_id) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          status = EXCLUDED.status,
          last_updated = CURRENT_TIMESTAMP`,
        [
          frameworkId, control.control_id, control.name, 
          control.description, control.category, control.status
        ]
      );
      
      count += result.rowCount;
    }
    
    await query('COMMIT');
    return count;
  } catch (error) {
    await query('ROLLBACK');
    console.error('Import compliance data error:', error);
    throw error;
  }
}
