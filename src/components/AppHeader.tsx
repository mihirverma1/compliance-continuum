
import React from "react";
import { Bell, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  sidebarWidth: number;
};

export default function AppHeader({ sidebarWidth }: AppHeaderProps) {
  return (
    <header 
      className={cn(
        "fixed top-0 right-0 h-16 bg-white border-b z-30 transition-all duration-300",
        "flex items-center justify-between px-6"
      )}
      style={{ left: `${sidebarWidth}px` }}
    >
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search..."
            className="h-9 w-64 bg-secondary/50 rounded-full pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center bg-secondary/50 hover:bg-secondary/80 transition-colors">
          <Bell className="w-4 h-4 text-foreground/70" />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Jane Cooper</p>
            <p className="text-xs text-muted-foreground">Security Analyst</p>
          </div>
          
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
