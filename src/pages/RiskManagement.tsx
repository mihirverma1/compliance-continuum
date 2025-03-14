
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiskUploadForm from "@/components/risk/RiskUploadForm";
import RiskRegister, { RiskItem } from "@/components/risk/RiskRegister";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RiskHeatmap from "@/components/risk/RiskHeatmap";

// Sample risks with compliance mappings
const initialRisks: RiskItem[] = [
  {
    id: "r1",
    riskType: "External",
    name: "Unauthorized Access to Database",
    description: "External actors gaining unauthorized access to sensitive data",
    compensatoryControl: "Database encryption, robust authentication, and access controls",
    owner: "Security Team",
    criticality: "High",
    impact: 4,
    likelihood: 2,
    vulnerabilityScore: 8,
    assetValue: 3,
    threatValue: 3,
    status: "Active",
    dueDate: "2023-12-15",
    lastUpdated: "2023-10-05",
    complianceFrameworks: ["ISO 27001", "SOC 2", "PCI DSS", "HIPAA"]
  },
  {
    id: "r2",
    riskType: "External",
    name: "Unpatched Vulnerabilities in Web Server",
    description: "Exploitation of known vulnerabilities in web servers",
    compensatoryControl: "Regular patching schedule, vulnerability scanning",
    owner: "IT Operations",
    criticality: "High",
    impact: 4,
    likelihood: 3,
    vulnerabilityScore: 12,
    assetValue: 4,
    threatValue: 3,
    status: "Active",
    dueDate: "2023-11-30",
    lastUpdated: "2023-10-12",
    complianceFrameworks: ["ISO 27001", "SOC 2", "PCI DSS"]
  },
  {
    id: "r3",
    riskType: "Internal",
    name: "Weak Password Policy Enforcement",
    description: "Inadequate password requirements increasing breach probability",
    compensatoryControl: "Password policy enforcement, MFA implementation",
    owner: "Security Team",
    criticality: "Medium",
    impact: 3,
    likelihood: 3,
    vulnerabilityScore: 9,
    assetValue: 3,
    threatValue: 2,
    status: "Active",
    dueDate: "2023-11-15",
    lastUpdated: "2023-09-28",
    complianceFrameworks: ["ISO 27001", "SOC 2"]
  },
  {
    id: "r4",
    riskType: "Internal",
    name: "Lack of Regular Security Training",
    description: "Employees not trained on security awareness",
    compensatoryControl: "Quarterly security training, phishing simulations",
    owner: "HR / Security Team",
    criticality: "Low",
    impact: 2,
    likelihood: 2,
    vulnerabilityScore: 4,
    assetValue: 2,
    threatValue: 1,
    status: "Mitigated",
    lastUpdated: "2023-10-15",
    complianceFrameworks: ["ISO 27001", "SOC 2", "HIPAA"]
  },
  {
    id: "r5",
    riskType: "External",
    name: "Data Breach via Vendor Systems",
    description: "Third-party vendor systems compromising organizational data",
    compensatoryControl: "Vendor risk assessments, security requirements in contracts",
    owner: "Vendor Management",
    criticality: "High",
    impact: 4,
    likelihood: 2,
    vulnerabilityScore: 8,
    assetValue: 4,
    threatValue: 3,
    status: "Active",
    dueDate: "2023-12-30",
    lastUpdated: "2023-10-08",
    complianceFrameworks: ["PCI DSS", "HIPAA"]
  }
];

function RiskHome() {
  const [risks, setRisks] = useState<RiskItem[]>(initialRisks);
  const [filterFramework, setFilterFramework] = useState<string>("all");
  const { toast } = useToast();

  const handleNewRisks = (newRisks: RiskItem[]) => {
    setRisks(prevRisks => [...prevRisks, ...newRisks]);
    toast({
      title: "Risks Uploaded",
      description: `Successfully added ${newRisks.length} new risks to the register`,
    });
  };

  // Filter risks by compliance framework
  const filteredRisks = filterFramework === "all" 
    ? risks 
    : risks.filter(risk => 
        risk.complianceFrameworks?.includes(filterFramework)
      );

  // Count risks by criticality for the dashboard
  const criticalRisks = filteredRisks.filter(risk => risk.criticality === "Critical").length;
  const highRisks = filteredRisks.filter(risk => risk.criticality === "High").length;
  const mitigatedRisks = filteredRisks.filter(risk => risk.status === "Mitigated").length;

  // Export risk register to CSV
  const exportRiskRegister = () => {
    // Create CSV content
    const headers = [
      "Risk ID", "Risk Type", "Name", "Description", "Controls", 
      "Owner", "Criticality", "Impact", "Likelihood", "Risk Score",
      "Status", "Due Date", "Compliance Frameworks"
    ];
    
    const csvRows = [
      headers.join(","),
      ...filteredRisks.map(risk => [
        risk.id,
        risk.riskType,
        `"${risk.name.replace(/"/g, '""')}"`,
        `"${risk.description.replace(/"/g, '""')}"`,
        `"${risk.compensatoryControl.replace(/"/g, '""')}"`,
        risk.owner,
        risk.criticality,
        risk.impact,
        risk.likelihood,
        risk.impact * risk.likelihood,
        risk.status,
        risk.dueDate || "N/A",
        `"${(risk.complianceFrameworks || []).join(", ")}"`
      ].join(","))
    ];
    
    const csvContent = csvRows.join("\n");
    
    // Create download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `risk_register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `Risk register exported to CSV with ${filteredRisks.length} risks.`,
    });
  };

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
          Risk Management
        </span>
        <h1 className="text-3xl font-semibold">Risk Assessment</h1>
        <p className="text-muted-foreground mt-1">
          Identify, assess, and manage risks across your organization
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="dashboard">Risk Dashboard</TabsTrigger>
          <TabsTrigger value="register">Risk Register</TabsTrigger>
          <TabsTrigger value="upload">Upload Risks</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterFramework} onValueChange={setFilterFramework}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                  <SelectItem value="SOC 2">SOC 2</SelectItem>
                  <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                  <SelectItem value="HIPAA">HIPAA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportRiskRegister}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-medium mb-4">Risk Overview</h2>
            <p className="text-muted-foreground">
              View and manage your organization's risk assessment, threat tracking, and mitigation planning.
              {filterFramework !== "all" && <span className="font-medium"> Filtered by: {filterFramework}</span>}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Critical & High Risks</h3>
                <p className="text-2xl font-bold">{criticalRisks + highRisks}</p>
              </div>
              <div className="bg-amber-50 text-amber-700 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Total Risks</h3>
                <p className="text-2xl font-bold">{filteredRisks.length}</p>
              </div>
              <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Mitigated</h3>
                <p className="text-2xl font-bold">{mitigatedRisks}</p>
              </div>
            </div>

            {filteredRisks.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Risk Heatmap</h3>
                  <RiskHeatmap risks={filteredRisks} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Risk Distribution</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">By Criticality</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-4 rounded-full bg-red-500" style={{ width: `${(criticalRisks / Math.max(filteredRisks.length, 1)) * 100}%` }}></div>
                        <span className="text-sm">Critical ({criticalRisks})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-4 rounded-full bg-amber-500" style={{ width: `${(highRisks / Math.max(filteredRisks.length, 1)) * 100}%` }}></div>
                        <span className="text-sm">High ({highRisks})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 rounded-full bg-blue-500" style={{ width: `${((filteredRisks.length - criticalRisks - highRisks) / Math.max(filteredRisks.length, 1)) * 100}%` }}></div>
                        <span className="text-sm">Medium/Low ({filteredRisks.length - criticalRisks - highRisks})</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">By Status</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-4 rounded-full bg-blue-500" style={{ width: `${((filteredRisks.filter(r => r.status === "Active").length) / Math.max(filteredRisks.length, 1)) * 100}%` }}></div>
                        <span className="text-sm">Active ({filteredRisks.filter(r => r.status === "Active").length})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-4 rounded-full bg-green-500" style={{ width: `${(mitigatedRisks / Math.max(filteredRisks.length, 1)) * 100}%` }}></div>
                        <span className="text-sm">Mitigated ({mitigatedRisks})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 rounded-full bg-purple-500" style={{ width: `${((filteredRisks.filter(r => r.status !== "Active" && r.status !== "Mitigated").length) / Math.max(filteredRisks.length, 1)) * 100}%` }}></div>
                        <span className="text-sm">Other ({filteredRisks.filter(r => r.status !== "Active" && r.status !== "Mitigated").length})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="register" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterFramework} onValueChange={setFilterFramework}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                  <SelectItem value="SOC 2">SOC 2</SelectItem>
                  <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                  <SelectItem value="HIPAA">HIPAA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportRiskRegister}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <RiskRegister risks={filteredRisks} />
        </TabsContent>
        <TabsContent value="upload" className="mt-6">
          <RiskUploadForm onUploadSuccess={handleNewRisks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function RiskManagement() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<RiskHome />} />
        <Route path="/assessment" element={<RiskHome />} />
        <Route path="/threats" element={<RiskHome />} />
        <Route path="/mitigation" element={<RiskHome />} />
      </Routes>
    </MainLayout>
  );
}
