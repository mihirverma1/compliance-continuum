
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface Audit {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  framework: string;
  status: "in-progress" | "completed" | "planned";
  compliance: number;
  observations: number;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface AuditSummaryProps {
  audit: Audit;
  onClick?: () => void;
}

export default function AuditSummary({ audit, onClick }: AuditSummaryProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border p-5 transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{audit.name}</h3>
            <Badge 
              variant={
                audit.status === "completed" ? "default" : 
                audit.status === "in-progress" ? "secondary" : "outline"
              }
            >
              {audit.status === "in-progress" ? "In Progress" : 
               audit.status === "completed" ? "Completed" : "Planned"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{audit.framework}</p>
          
          <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
            <CalendarCheck className="h-4 w-4" />
            <span>{audit.startDate} to {audit.endDate}</span>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Compliance</span>
              <span className="text-sm font-medium">{audit.compliance}%</span>
            </div>
            <Progress value={audit.compliance} className="h-2" />
          </div>
        </div>
        
        {audit.observations > 0 && (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 p-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">{audit.observations}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs">
        <div className="bg-red-50 text-red-700 p-2 rounded">
          <div className="font-medium">{audit.findings.critical}</div>
          <div>Critical</div>
        </div>
        <div className="bg-orange-50 text-orange-700 p-2 rounded">
          <div className="font-medium">{audit.findings.high}</div>
          <div>High</div>
        </div>
        <div className="bg-amber-50 text-amber-700 p-2 rounded">
          <div className="font-medium">{audit.findings.medium}</div>
          <div>Medium</div>
        </div>
        <div className="bg-blue-50 text-blue-700 p-2 rounded">
          <div className="font-medium">{audit.findings.low}</div>
          <div>Low</div>
        </div>
      </div>
    </div>
  );
}
