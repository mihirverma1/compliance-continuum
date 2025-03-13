
import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
  metric?: string;
}

export default function StatCard({ title, value, change, icon, iconBg, metric }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 h-full animate-scale-in">
      <div className="flex justify-between">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-2xl font-semibold">{value}</p>
            {metric && <span className="text-xs text-muted-foreground">{metric}</span>}
          </div>
          
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? (
                <ArrowUpIcon className="w-3 h-3" />
              ) : (
                <ArrowDownIcon className="w-3 h-3" />
              )}
              <span>{Math.abs(change)}% from last period</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconBg
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
