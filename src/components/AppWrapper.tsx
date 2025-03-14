
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import DbInitializer from './DbInitializer';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <DbInitializer>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </DbInitializer>
    </BrowserRouter>
  );
}
