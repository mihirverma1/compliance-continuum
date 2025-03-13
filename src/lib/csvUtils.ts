
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
