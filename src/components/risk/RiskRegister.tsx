
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface RiskItem {
  id: string;
  riskType: "Internal" | "External";
  name: string;
  description: string;
  compensatoryControl: string;
  owner: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  impact: number; // 1-4
  likelihood: number; // 0-3
  vulnerabilityScore: number;
  assetValue: number; // 1-4
  threatValue: number;
  status: "Active" | "Mitigated" | "Accepted" | "Transferred";
  dueDate?: string;
  lastUpdated: string;
  complianceFrameworks?: string[]; // Add compliance frameworks
}

// Helper function to determine risk score color
const getRiskScoreColor = (impact: number, likelihood: number) => {
  const score = impact * likelihood;
  if (score >= 9) return "bg-red-100 text-red-800";
  if (score >= 6) return "bg-orange-100 text-orange-800";
  if (score >= 3) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

// Helper function to get criticality color
const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case "Critical": return "bg-red-100 text-red-800";
    case "High": return "bg-orange-100 text-orange-800";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Low": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-blue-100 text-blue-800";
    case "Mitigated": return "bg-green-100 text-green-800";
    case "Accepted": return "bg-purple-100 text-purple-800";
    case "Transferred": return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

interface RiskRegisterProps {
  risks: RiskItem[];
}

const RiskRegister: React.FC<RiskRegisterProps> = ({ risks }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Risk Register</CardTitle>
        <CardDescription>
          Comprehensive view of all identified risks and their assessment metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Risk Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead>Impact (1-4)</TableHead>
                <TableHead>Likelihood (0-3)</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Controls</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell>{risk.riskType}</TableCell>
                  <TableCell className="font-medium">
                    <div>{risk.name}</div>
                    <div className="text-xs text-muted-foreground">{risk.description}</div>
                  </TableCell>
                  <TableCell>{risk.owner}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(risk.criticality)}`}>
                      {risk.criticality}
                    </span>
                  </TableCell>
                  <TableCell>{risk.impact}</TableCell>
                  <TableCell>{risk.likelihood}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskScoreColor(risk.impact, risk.likelihood)}`}>
                      {risk.impact * risk.likelihood}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={risk.compensatoryControl}>
                      {risk.compensatoryControl}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {risk.complianceFrameworks?.map((framework) => (
                        <Badge key={framework} variant="outline" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(risk.status)}`}>
                      {risk.status}
                    </span>
                  </TableCell>
                  <TableCell>{risk.dueDate || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskRegister;
