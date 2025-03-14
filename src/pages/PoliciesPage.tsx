
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Check, File, FileCheck, ClipboardList, Upload, SearchCode, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PolicyUploadForm from "@/components/policies/PolicyUploadForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import AuditUploadForm from "@/components/policies/AuditUploadForm";

const frameworks = [
  { 
    id: "iso27001", 
    name: "ISO 27001", 
    description: "Information Security Management System",
    controls: 114,
    compliance: 87,
    icon: <FileCheck className="w-5 h-5" />
  },
  { 
    id: "pcidss", 
    name: "PCI DSS", 
    description: "Payment Card Industry Data Security Standard",
    controls: 78,
    compliance: 92,
    icon: <ClipboardList className="w-5 h-5" />
  },
  { 
    id: "hipaa", 
    name: "HIPAA", 
    description: "Health Insurance Portability and Accountability Act",
    controls: 49,
    compliance: 65,
    icon: <File className="w-5 h-5" />
  },
  { 
    id: "soc2", 
    name: "SOC 2", 
    description: "Service Organization Control 2",
    controls: 64,
    compliance: 42,
    icon: <Check className="w-5 h-5" />
  }
];

// Sample policy data
const samplePolicies = [
  {
    id: "pol-1",
    name: "Information Security Policy",
    type: "Security",
    version: "2.3",
    status: "Active",
    owner: "CISO",
    lastUpdated: "2023-09-15",
    nextReview: "2024-09-15",
    relatedControls: ["ISO-A.5", "SOC2-CC1.1", "PCI-2.1"]
  },
  {
    id: "pol-2",
    name: "Access Control Policy",
    type: "Security",
    version: "1.8",
    status: "Active",
    owner: "Security Team",
    lastUpdated: "2023-11-20",
    nextReview: "2024-11-20",
    relatedControls: ["ISO-A.9", "SOC2-CC6.1", "PCI-7.1"]
  },
  {
    id: "pol-3",
    name: "Data Protection Policy",
    type: "Compliance",
    version: "3.1",
    status: "Draft",
    owner: "Compliance Officer",
    lastUpdated: "2023-10-05",
    nextReview: "2024-04-05",
    relatedControls: ["ISO-A.18", "HIPAA-164.308"]
  }
];

// Sample audit data
const sampleAudits = [
  {
    id: "aud-1",
    framework: "ISO 27001",
    control: "A.8.1.1",
    name: "Inventory of Assets",
    status: "Compliant",
    evidence: "Asset-Register-2023.xlsx",
    lastReviewed: "2023-10-15",
    reviewer: "John Smith"
  },
  {
    id: "aud-2",
    framework: "SOC 2",
    control: "CC5.2",
    name: "Security Awareness Training",
    status: "Non-Compliant",
    evidence: "Pending",
    lastReviewed: "2023-09-28",
    reviewer: "Jane Doe"
  },
  {
    id: "aud-3",
    framework: "PCI DSS",
    control: "3.4",
    name: "Render PAN Unreadable",
    status: "Compliant",
    evidence: "Encryption-Report-Q3.pdf",
    lastReviewed: "2023-11-05",
    reviewer: "Mike Johnson"
  }
];

function FrameworkCard({ framework }: { framework: typeof frameworks[0] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-2 rounded-full">
              {framework.icon}
            </div>
            <h2 className="text-xl font-medium">{framework.name}</h2>
          </div>
          <p className="text-muted-foreground mb-4">{framework.description}</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">Compliance:</span>
            <Progress value={framework.compliance} className="w-32 h-2" />
            <span className="text-sm font-medium">{framework.compliance}%</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {framework.controls} controls
          </div>
        </div>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>
    </div>
  );
}

function PolicyManagement() {
  const [policies, setPolicies] = useState(samplePolicies);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
          Policy Management
        </span>
        <h1 className="text-3xl font-semibold">Policies & Procedures</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization's policies, procedures, and standards
        </p>
      </div>

      {!showUpload ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Policies
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Policy Documents</CardTitle>
              <CardDescription>
                Manage and track all policy documents across your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Policy Name</th>
                      <th className="text-left font-medium px-4 py-3">Type</th>
                      <th className="text-left font-medium px-4 py-3">Version</th>
                      <th className="text-left font-medium px-4 py-3">Status</th>
                      <th className="text-left font-medium px-4 py-3">Owner</th>
                      <th className="text-left font-medium px-4 py-3">Last Updated</th>
                      <th className="text-left font-medium px-4 py-3">Related Controls</th>
                      <th className="text-left font-medium px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {policies.map(policy => (
                      <tr key={policy.id}>
                        <td className="px-4 py-3 font-medium">{policy.name}</td>
                        <td className="px-4 py-3">{policy.type}</td>
                        <td className="px-4 py-3">{policy.version}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                            ${policy.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : policy.status === "Draft" 
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"}`}>
                            {policy.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{policy.owner}</td>
                        <td className="px-4 py-3">{policy.lastUpdated}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {policy.relatedControls.map((control, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 text-xs">
                                {control}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <SearchCode className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <BookOpen className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Clock className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowUpload(false)}
              className="mr-2"
            >
              Back to Policies
            </Button>
            <h2 className="text-xl font-medium">Upload Policy Documents</h2>
          </div>
          <PolicyUploadForm onSuccess={() => setShowUpload(false)} />
        </div>
      )}
    </div>
  );
}

function AuditManagement() {
  const [audits, setAudits] = useState(sampleAudits);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState("all");

  // Filtered audits based on framework selection
  const filteredAudits = selectedFramework === "all" 
    ? audits 
    : audits.filter(audit => audit.framework.toLowerCase().includes(selectedFramework.toLowerCase()));

  // Calculate compliance statistics
  const totalControls = audits.length;
  const compliantControls = audits.filter(audit => audit.status === "Compliant").length;
  const compliancePercentage = totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0;
  
  // Run compliance review
  const runComplianceReview = () => {
    // In a real application, this would trigger a compliance check
    // For this demo, we'll just show a toast notification
    console.log("Running compliance review for framework:", selectedFramework);
  };

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
          Audit Management
        </span>
        <h1 className="text-3xl font-semibold">Compliance Audits</h1>
        <p className="text-muted-foreground mt-1">
          Track compliance controls, upload evidence, and manage audit activities
        </p>
      </div>

      {!showUpload ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Compliance</p>
                    <h3 className="text-2xl font-bold">{compliancePercentage}%</h3>
                  </div>
                  <div className="bg-green-100 text-green-800 p-2 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
                <Progress value={compliancePercentage} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Controls</p>
                    <h3 className="text-2xl font-bold">{totalControls}</h3>
                  </div>
                  <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                    <ClipboardList className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Compliant</p>
                    <h3 className="text-2xl font-bold">{compliantControls}</h3>
                  </div>
                  <div className="bg-green-100 text-green-800 p-2 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Non-Compliant</p>
                    <h3 className="text-2xl font-bold">{totalControls - compliantControls}</h3>
                  </div>
                  <div className="bg-red-100 text-red-800 p-2 rounded-full">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  <SelectItem value="iso">ISO 27001</SelectItem>
                  <SelectItem value="soc">SOC 2</SelectItem>
                  <SelectItem value="pci">PCI DSS</SelectItem>
                  <SelectItem value="hipaa">HIPAA</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={runComplianceReview}>
                Run Compliance Review
              </Button>
            </div>
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Audit Evidence
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Audit Controls</CardTitle>
              <CardDescription>
                Track compliance status across all audit controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Framework</th>
                      <th className="text-left font-medium px-4 py-3">Control</th>
                      <th className="text-left font-medium px-4 py-3">Control Name</th>
                      <th className="text-left font-medium px-4 py-3">Status</th>
                      <th className="text-left font-medium px-4 py-3">Evidence</th>
                      <th className="text-left font-medium px-4 py-3">Last Reviewed</th>
                      <th className="text-left font-medium px-4 py-3">Reviewer</th>
                      <th className="text-left font-medium px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAudits.map(audit => (
                      <tr key={audit.id}>
                        <td className="px-4 py-3">{audit.framework}</td>
                        <td className="px-4 py-3">{audit.control}</td>
                        <td className="px-4 py-3 font-medium">{audit.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                            ${audit.status === "Compliant" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"}`}>
                            {audit.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{audit.evidence}</td>
                        <td className="px-4 py-3">{audit.lastReviewed}</td>
                        <td className="px-4 py-3">{audit.reviewer}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <SearchCode className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowUpload(false)}
              className="mr-2"
            >
              Back to Audits
            </Button>
            <h2 className="text-xl font-medium">Upload Audit Evidence</h2>
          </div>
          <AuditUploadForm onSuccess={() => setShowUpload(false)} />
        </div>
      )}
    </div>
  );
}

function PoliciesHome() {
  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
          Governance
        </span>
        <h1 className="text-3xl font-semibold">Policies & Audits</h1>
        <p className="text-muted-foreground mt-1">
          Manage your policies, procedures, and audit activities
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <Button variant="ghost" asChild>
                <Link to="/policies/manage">View All</Link>
              </Button>
            </div>
            <h2 className="text-xl font-medium mb-2">Policy Management</h2>
            <p className="text-muted-foreground mb-4">
              Create, upload, and manage policy documents. Link them to compliance controls and track versions.
            </p>
            <div className="flex justify-between text-sm">
              <span>{samplePolicies.length} Policies</span>
              <span>{samplePolicies.filter(p => p.status === "Active").length} Active</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <ClipboardList className="w-6 h-6 text-green-600" />
              </div>
              <Button variant="ghost" asChild>
                <Link to="/policies/audits">View All</Link>
              </Button>
            </div>
            <h2 className="text-xl font-medium mb-2">Audit Management</h2>
            <p className="text-muted-foreground mb-4">
              Track compliance controls, upload evidence, and run compliance reviews across frameworks.
            </p>
            <div className="flex justify-between text-sm">
              <span>{sampleAudits.length} Controls</span>
              <span>{sampleAudits.filter(a => a.status === "Compliant").length} Compliant</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-medium mb-4">Supported Frameworks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {frameworks.map((framework) => (
          <FrameworkCard key={framework.id} framework={framework} />
        ))}
      </div>
    </div>
  );
}

export default function PoliciesPage() {
  const location = useLocation();
  
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<PoliciesHome />} />
        <Route path="/all" element={<PoliciesHome />} />
        <Route path="/manage" element={<PolicyManagement />} />
        <Route path="/audits" element={<AuditManagement />} />
        <Route path="/procedures" element={<PolicyManagement />} />
      </Routes>
    </MainLayout>
  );
}
