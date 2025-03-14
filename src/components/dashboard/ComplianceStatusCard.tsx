
import React from "react";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type ComplianceFramework = {
  id: string;
  name: string;
  progress: number;
  status: "compliant" | "non-compliant" | "in-progress";
  nextAudit?: string;
};

export const frameworks: ComplianceFramework[] = [
  {
    id: "iso27001", 
    name: "ISO 27001", 
    progress: 87,
    status: "compliant",
    nextAudit: "Oct 15, 2023"
  },
  {
    id: "pcidss",
    name: "PCI DSS",
    progress: 92,
    status: "compliant",
    nextAudit: "Nov 30, 2023"
  },
  {
    id: "hipaa",
    name: "HIPAA",
    progress: 65,
    status: "in-progress",
    nextAudit: "Feb 12, 2024"
  },
  {
    id: "soc2",
    name: "SOC 2",
    progress: 42,
    status: "non-compliant",
    nextAudit: "Jan 05, 2024"
  }
];

const StatusIcon: React.FC<{ status: ComplianceFramework["status"] }> = ({ status }) => {
  switch (status) {
    case "compliant":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "non-compliant":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "in-progress":
      return <Clock className="w-5 h-5 text-amber-500" />;
    default:
      return null;
  }
};

export default function ComplianceStatusCard() {
  const [filter, setFilter] = React.useState("all");
  const navigate = useNavigate();
  
  const filteredFrameworks = filter === "all" 
    ? frameworks 
    : frameworks.filter(f => f.status === "non-compliant");
  
  const handleFrameworkClick = (frameworkId: string) => {
    navigate(`/compliance/${frameworkId}`);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Compliance Status</h3>
        <select 
          className="text-sm bg-secondary/50 rounded-md px-2 py-1 border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Frameworks</option>
          <option value="non-compliant">Critical Only</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {filteredFrameworks.length > 0 ? (
          filteredFrameworks.map((framework) => (
            <div 
              key={framework.id} 
              className="animate-slide-up cursor-pointer hover:bg-slate-50 rounded-md p-2 transition-colors" 
              style={{ animationDelay: `${frameworks.indexOf(framework) * 0.1}s` }}
              onClick={() => handleFrameworkClick(framework.id)}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <StatusIcon status={framework.status} />
                  <h4 className="font-medium">{framework.name}</h4>
                  <Badge variant={
                    framework.status === "compliant" 
                      ? "default" 
                      : framework.status === "non-compliant"
                      ? "destructive"
                      : "secondary"
                  }>
                    {framework.status}
                  </Badge>
                </div>
                <span className="text-sm font-medium">{framework.progress}%</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Progress 
                  value={framework.progress} 
                  className={`h-2 ${
                    framework.status === "compliant" 
                      ? "bg-green-100" 
                      : framework.status === "non-compliant"
                      ? "bg-red-100"
                      : "bg-amber-100"
                  }`} 
                />
                {framework.nextAudit && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Next: {framework.nextAudit}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No frameworks match the selected filter
          </div>
        )}
      </div>
      
      <a href="/compliance" className="w-full mt-4 text-sm text-primary font-medium hover:underline block text-center">
        View detailed compliance report
      </a>
    </div>
  );
}
