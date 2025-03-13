
import React, { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default expanded width
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Add a slight delay to allow for the mounting animation
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-300 overflow-hidden",
          isMounted ? "opacity-100" : "opacity-0"
        )}
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <AppHeader sidebarWidth={sidebarWidth} />
        
        <main className="pt-24 px-6 pb-8 transition-all duration-300">
          <div className={cn(
            "max-w-7xl mx-auto animate-fade-in",
            !isMounted && "opacity-0"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
