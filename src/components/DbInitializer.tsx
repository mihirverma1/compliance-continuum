
import { useEffect, useState } from 'react';
import { initDatabase, tableExists } from '@/lib/database';
import { toast } from '@/components/ui/use-toast';

export default function DbInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState<string>('connecting');
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    const initialize = async () => {
      try {
        // Try to initialize the database connection
        await initDatabase();
        
        if (isBrowser) {
          console.log('Using browser-compatible mock database');
          setIsInitialized(true);
          setStatus('mock-connected');
          
          toast({
            title: 'Using Preview Data',
            description: 'Currently using mock data for preview. Database connections work in deployment.',
            duration: 4000,
          });
          
          return;
        }
        
        // Check if critical tables exist
        const tables = ['users', 'assets', 'policies', 'risks'];
        const tableChecks = await Promise.all(
          tables.map(async (table) => ({
            name: table,
            exists: await tableExists(table)
          }))
        );
        
        const missingTables = tableChecks.filter(t => !t.exists).map(t => t.name);
        
        if (missingTables.length > 0) {
          console.warn('Missing tables:', missingTables);
          toast({
            title: 'Database Schema Warning',
            description: `Some tables are missing: ${missingTables.join(', ')}. Application may not function properly.`,
            variant: 'destructive',
            duration: 7000,
          });
        } else {
          toast({
            title: 'Database Connected',
            description: 'Successfully connected to the database.',
            duration: 3000,
          });
        }
        
        setIsInitialized(true);
        setStatus('connected');
      } catch (error) {
        console.error('Database initialization error:', error);
        setStatus('failed');
        
        toast({
          title: 'Database Connection Error',
          description: 'Using local data storage for this session.',
          variant: 'destructive',
          duration: 5000,
        });
        
        // Even though there was an error, we'll still render the app with mock data
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  if (!isInitialized) {
    // Show a loading screen while connecting to the database
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Initializing application...</p>
          {status === 'connecting' && (
            <p className="text-sm text-muted-foreground mt-2">
              Setting up data connections...
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
