
import React from "react";
import { Shield, AlertTriangle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

type RiskMetric = {
  id: string;
  label: string;
  count: number;
  change: number;
  severity: "critical" | "high" | "medium" | "low";
};

const riskMetrics: RiskMetric[] = [
  {
    id: "critical",
    label: "Critical",
    count: 3,
    change: 1,
    severity: "critical"
  },
  {
    id: "high",
    label: "High",
    count: 7,
    change: -2,
    severity: "high"
  },
  {
    id: "medium",
    label: "Medium",
    count: 16,
    change: 0,
    severity: "medium"
  },
  {
    id: "low",
    label: "Low",
    count: 42,
    change: -5,
    severity: "low"
  }
];

const getSeverityIcon = (severity: RiskMetric["severity"]) => {
  switch (severity) {
    case "critical":
      return <AlertOctagon className="w-5 h-5" />;
    case "high":
      return <AlertTriangle className="w-5 h-5" />;
    case "medium":
    case "low":
      return <Shield className="w-5 h-5" />;
  }
};

const getSeverityColors = (severity: RiskMetric["severity"]) => {
  switch (severity) {
    case "critical":
      return "bg-red-50 text-red-700 border-red-200";
    case "high":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "low":
      return "bg-green-50 text-green-700 border-green-200";
  }
};

export default function RiskSummaryCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Risk Summary</h3>
        <span className="text-xs bg-secondary rounded-full px-2 py-1">
          Last updated: 2 days ago
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {riskMetrics.map((metric) => (
          <div 
            key={metric.id}
            className={cn(
              "rounded-lg border p-3 transition-all hover:shadow-sm animate-scale-in",
              getSeverityColors(metric.severity)
            )}
            style={{ animationDelay: `${riskMetrics.indexOf(metric) * 0.1}s` }}
          >
            <div className="flex items-center gap-2 mb-2">
              {getSeverityIcon(metric.severity)}
              <h4 className="font-medium">{metric.label}</h4>
            </div>
            
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold">{metric.count}</span>
              <div className={cn(
                "text-xs font-medium flex items-center gap-0.5 rounded px-1.5 py-0.5",
                metric.change > 0 
                  ? "text-red-700 bg-red-100" 
                  : metric.change < 0 
                  ? "text-green-700 bg-green-100"
                  : "text-gray-700 bg-gray-100"
              )}>
                {metric.change > 0 ? `+${metric.change}` : metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between items-center pt-3 border-t">
        <div>
          <h4 className="text-sm font-medium">Total Risk Score</h4>
          <p className="text-2xl font-semibold mt-1">67/100</p>
        </div>
        
        <button className="text-sm px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
          View All Risks
        </button>
      </div>
    </div>
  );
}
