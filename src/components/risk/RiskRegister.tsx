
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface RiskItem {
  id: string;
  riskType: "Internal" | "External";
  name: string;
  description: string;
  rating: string;
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
}

// Sample risk data
const mockRisks: RiskItem[] = [
  {
    id: "r1",
    riskType: "External",
    name: "Data Breach",
    description: "Unauthorized access to customer data",
    rating: "High",
    compensatoryControl: "Encryption, Access Controls",
    owner: "Security Team",
    criticality: "Critical",
    impact: 4,
    likelihood: 2,
    vulnerabilityScore: 8,
    assetValue: 4,
    threatValue: 3,
    status: "Active",
    dueDate: "2023-12-15",
    lastUpdated: "2023-10-05"
  },
  {
    id: "r2",
    riskType: "Internal",
    name: "Insider Threat",
    description: "Malicious actions by authorized personnel",
    rating: "Medium",
    compensatoryControl: "Access Monitoring, Least Privilege",
    owner: "HR & Security",
    criticality: "High",
    impact: 3,
    likelihood: 1,
    vulnerabilityScore: 3,
    assetValue: 3,
    threatValue: 2,
    status: "Mitigated",
    lastUpdated: "2023-09-18"
  },
  {
    id: "r3",
    riskType: "External",
    name: "Ransomware Attack",
    description: "Encryption of critical data with ransom demand",
    rating: "High",
    compensatoryControl: "Backups, Email Filtering",
    owner: "IT Operations",
    criticality: "Critical",
    impact: 4,
    likelihood: 2,
    vulnerabilityScore: 8,
    assetValue: 4,
    threatValue: 3,
    status: "Active",
    dueDate: "2023-11-30",
    lastUpdated: "2023-10-02"
  },
  {
    id: "r4",
    riskType: "Internal",
    name: "System Misconfiguration",
    description: "Security vulnerabilities due to improper configuration",
    rating: "Medium",
    compensatoryControl: "Configuration Management, Regular Audits",
    owner: "IT Operations",
    criticality: "Medium",
    impact: 2,
    likelihood: 2,
    vulnerabilityScore: 4,
    assetValue: 2,
    threatValue: 2,
    status: "Active",
    dueDate: "2023-11-15",
    lastUpdated: "2023-09-25"
  },
  {
    id: "r5",
    riskType: "External",
    name: "Regulatory Non-Compliance",
    description: "Failure to meet compliance requirements",
    rating: "Medium",
    compensatoryControl: "Compliance Monitoring, Regular Audits",
    owner: "Compliance Officer",
    criticality: "High",
    impact: 3,
    likelihood: 1,
    vulnerabilityScore: 3,
    assetValue: 3,
    threatValue: 2,
    status: "Accepted",
    lastUpdated: "2023-09-10"
  }
];

interface RiskRegisterProps {
  risks?: RiskItem[];
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

const RiskRegister: React.FC<RiskRegisterProps> = ({ risks = mockRisks }) => {
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
