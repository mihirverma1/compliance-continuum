
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PolicyUploadForm from "@/components/policies/PolicyUploadForm";
import NewAuditForm from "@/components/audit/NewAuditForm";
import AuditObservationForm from "@/components/audit/AuditObservationForm";
import AuditSummary, { Audit } from "@/components/audit/AuditSummary";
import AuditUploadForm from "@/components/policies/AuditUploadForm";
import { AlertTriangle, FileText, Plus } from "lucide-react";

const policies = [
  {
    id: "1",
    name: "Information Security Policy",
    version: "2.3",
    lastUpdated: "2023-06-15",
    status: "active",
    owner: "CISO",
    approvers: ["CEO", "CTO"],
  },
  {
    id: "2",
    name: "Acceptable Use Policy",
    version: "1.5",
    lastUpdated: "2023-05-20",
    status: "active",
    owner: "IT Director",
    approvers: ["CISO", "HR Director"],
  },
  {
    id: "3",
    name: "Data Classification Policy",
    version: "1.2",
    lastUpdated: "2023-04-10",
    status: "active",
    owner: "Data Protection Officer",
    approvers: ["CISO", "Legal Counsel"],
  },
  {
    id: "4",
    name: "Password Policy",
    version: "2.0",
    lastUpdated: "2023-03-22",
    status: "active",
    owner: "IT Security Manager",
    approvers: ["CISO"],
  },
  {
    id: "5",
    name: "Business Continuity Plan",
    version: "3.1",
    lastUpdated: "2023-02-18",
    status: "review-needed",
    owner: "Risk Manager",
    approvers: ["CEO", "COO", "CISO"],
  },
  {
    id: "6",
    name: "Third-Party Risk Management Policy",
    version: "1.4",
    lastUpdated: "2023-01-30",
    status: "review-needed",
    owner: "Vendor Management Officer",
    approvers: ["CISO", "Procurement Director"],
  },
  {
    id: "7",
    name: "Access Control Policy",
    version: "2.1",
    lastUpdated: "2022-12-15",
    status: "active",
    owner: "IT Security Manager",
    approvers: ["CISO", "IT Director"],
  },
  {
    id: "8",
    name: "Incident Response Plan",
    version: "2.6",
    lastUpdated: "2022-11-05",
    status: "active",
    owner: "Security Operations Lead",
    approvers: ["CISO", "Legal Counsel"],
  },
];

const audits: Audit[] = [
  {
    id: "audit-1",
    name: "ISO 27001 Annual Audit",
    startDate: "2023-06-10",
    endDate: "2023-06-25",
    framework: "ISO 27001",
    status: "completed",
    compliance: 89,
    observations: 7,
    findings: {
      critical: 0,
      high: 2,
      medium: 3,
      low: 2
    }
  },
  {
    id: "audit-2",
    name: "SOC 2 Type 2 Audit",
    startDate: "2023-04-15",
    endDate: "2023-05-20",
    framework: "SOC 2",
    status: "completed",
    compliance: 82,
    observations: 12,
    findings: {
      critical: 1,
      high: 3,
      medium: 5,
      low: 3
    }
  },
  {
    id: "audit-3",
    name: "PCI DSS Quarterly Review",
    startDate: "2023-08-01",
    endDate: "2023-08-15",
    framework: "PCI DSS",
    status: "in-progress",
    compliance: 76,
    observations: 5,
    findings: {
      critical: 0,
      high: 1,
      medium: 2,
      low: 2
    }
  },
  {
    id: "audit-4",
    name: "HIPAA Compliance Audit",
    startDate: "2023-09-12",
    endDate: "2023-09-30",
    framework: "HIPAA",
    status: "planned",
    compliance: 0,
    observations: 0,
    findings: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }
  }
];

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState("policies");
  const [isPolicyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [isAuditDialogOpen, setAuditDialogOpen] = useState(false);
  const [isObservationDialogOpen, setObservationDialogOpen] = useState(false);
  const [isEvidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [displayedAudits, setDisplayedAudits] = useState<Audit[]>(audits);

  const handleNewAuditSuccess = () => {
    setAuditDialogOpen(false);
    const newAudit: Audit = {
      id: `audit-${displayedAudits.length + 1}`,
      name: "New Compliance Audit",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      framework: "ISO 27001",
      status: "planned",
      compliance: 0,
      observations: 0,
      findings: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    };
    setDisplayedAudits([...displayedAudits, newAudit]);
  };

  const handleAuditClick = (audit: Audit) => {
    setSelectedAudit(audit);
    setObservationDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
          Governance
        </span>
        <h1 className="text-3xl font-semibold">Policies and Audits</h1>
        <p className="text-muted-foreground mt-1">
          Manage your policies, procedures, and audit results
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="policies">Policy Management</TabsTrigger>
          <TabsTrigger value="audits">Audit Management</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Policies</h2>
            <Dialog open={isPolicyDialogOpen} onOpenChange={setPolicyDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Upload New Policy</DialogTitle>
                  <DialogDescription>
                    Upload a new policy document to the policy library
                  </DialogDescription>
                </DialogHeader>
                <PolicyUploadForm onSuccess={() => setPolicyDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Policy Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Version</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Last Updated</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-muted/50 cursor-pointer">
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        {policy.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{policy.version}</td>
                    <td className="px-4 py-3 text-sm">{policy.lastUpdated}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          policy.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {policy.status === "active" ? "Active" : "Review Needed"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{policy.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Compliance Audits</h2>
            <div className="flex gap-2">
              <Dialog open={isEvidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Evidence
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Upload Audit Evidence</DialogTitle>
                    <DialogDescription>
                      Upload evidence documents for compliance audits
                    </DialogDescription>
                  </DialogHeader>
                  <AuditUploadForm onSuccess={() => setEvidenceDialogOpen(false)} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAuditDialogOpen} onOpenChange={setAuditDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Audit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Start New Audit</DialogTitle>
                    <DialogDescription>
                      Create a new compliance audit project
                    </DialogDescription>
                  </DialogHeader>
                  <NewAuditForm onSuccess={handleNewAuditSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedAudits.map((audit) => (
              <AuditSummary 
                key={audit.id} 
                audit={audit} 
                onClick={() => handleAuditClick(audit)}
              />
            ))}
          </div>

          <Dialog open={isObservationDialogOpen} onOpenChange={setObservationDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedAudit ? `Add Observation: ${selectedAudit.name}` : 'Add Audit Observation'}</DialogTitle>
                <DialogDescription>
                  Record a finding or observation from the audit
                </DialogDescription>
              </DialogHeader>
              <AuditObservationForm />
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
