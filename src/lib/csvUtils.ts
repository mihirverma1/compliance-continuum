
/**
 * Parses CSV content into an array of asset objects
 * 
 * @param csvText The CSV text content to parse
 * @returns Array of parsed asset objects
 */
export function parseCSV(csvText: string): any[] {
  // Split the CSV text into lines and remove any empty lines
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  // Extract headers from the first line
  const headers = lines[0].split(',').map(header => header.trim());
  
  const assets = [];
  
  // Parse each data line (skipping the header)
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim());
    
    // Skip lines that don't have the right number of fields
    if (values.length !== headers.length) continue;
    
    // Create an object for this asset
    const asset: any = {
      id: `csv-${Date.now()}-${i}`, // Generate a unique ID
      lastUpdated: new Date().toISOString().split('T')[0] // Today's date
    };
    
    // Map each value to its corresponding header
    headers.forEach((header, index) => {
      asset[header] = values[index];
    });
    
    assets.push(asset);
  }
  
  return assets;
}

/**
 * Validates if a file is a valid CSV file
 * 
 * @param file The file to validate
 * @returns boolean indicating if the file is a valid CSV
 */
export function isValidCSVFile(file: File): boolean {
  return file.type === 'text/csv' || 
         file.name.endsWith('.csv') || 
         file.type === 'application/vnd.ms-excel';
}

/**
 * Creates a sample CSV file for assets
 * 
 * @returns String containing sample CSV content
 */
export function getSampleCSVTemplate(): string {
  return `name,type,location,complianceStatus
Web Frontend,Application,AWS,Compliant
Data Warehouse,Database,GCP,Non-Compliant
Authentication Server,Server,Azure,Review Needed`;
}

/**
 * Creates a sample CSV file for policies
 * 
 * @returns String containing sample policy CSV content
 */
export function getSamplePolicyTemplate(): string {
  return `name,type,owner,status,reviewDate,lastUpdated
Information Security Policy,Policy,CISO,Active,2024-12-15,2023-11-10
Acceptable Use Policy,Policy,IT Manager,Active,2024-06-20,2023-10-05
Data Classification Procedure,Procedure,Data Protection Officer,Draft,2024-05-30,2023-12-01
Incident Response Plan,Procedure,Security Team,Active,2024-08-15,2023-09-18
Backup and Recovery,Standard,IT Operations,Active,2024-07-10,2023-11-25`;
}

/**
 * Creates a sample CSV file for compliance evidence
 * 
 * @returns String containing sample compliance evidence CSV content
 */
export function getSampleComplianceTemplate(): string {
  return `controlId,framework,evidenceName,evidenceType,status,reviewer,reviewDate
A.8.1.1,ISO 27001,Asset Inventory Report,Document,Accepted,John Smith,2023-10-15
A.8.1.2,ISO 27001,Asset Ownership Matrix,Spreadsheet,Pending,Jane Doe,
A.9.2.3,ISO 27001,Access Control Policy,Document,Accepted,John Smith,2023-11-05
6.1.3,PCI DSS,Firewall Configuration Review,Screenshot,Rejected,Alice Johnson,2023-09-20
164.308,HIPAA,Access Control Audit Log,Log,Pending,Bob Brown,`;
}

/**
 * Creates a sample CSV file for risk management
 * 
 * @returns String containing sample risk CSV content
 */
export function getSampleRiskTemplate(): string {
  return `title,description,severity,likelihood,impact,owner,status,dueDate
Data Breach,Unauthorized access to customer data,Critical,High,High,Security Team,Active,2023-12-15
System Outage,Extended downtime of critical systems,High,Medium,High,IT Operations,Active,2023-11-30
Regulatory Non-Compliance,Failure to meet compliance requirements,Medium,Low,High,Compliance Team,Mitigated,2023-10-20
Insider Threat,Malicious actions by authorized personnel,High,Low,Critical,Security Team,Active,2024-01-15
Ransomware Attack,Encryption of critical data with ransom demand,Critical,Medium,Critical,Incident Response Team,Active,2023-12-10`;
}
