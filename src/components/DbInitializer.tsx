
import { useEffect, useState } from 'react';
import { initDatabase } from '@/lib/database';
import { toast } from '@/components/ui/use-toast';

export default function DbInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error('Database initialization error:', error);
        setIsError(true);
        toast({
          title: 'Database Connection Error',
          description: 'Failed to connect to the database. Using local storage for this session.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    };

    initialize();
  }, []);

  if (isError) {
    // In case of DB error, we still render the app but it will fall back to local storage
    return <>{children}</>;
  }

  if (!isInitialized) {
    // You could show a loading screen here if desired
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Connecting to database...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
