
import React, { useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { Check, File, FileCheck, ClipboardList, ArrowRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ComplianceUploadForm from "@/components/compliance/ComplianceUploadForm";
import FrameworkControls from "@/components/compliance/FrameworkControls";

const frameworks = [
  { 
    id: "iso27001", 
    name: "ISO 27001", 
    description: "Information Security Management System",
    controls: 114,
    compliance: 87,
    icon: <FileCheck className="w-5 h-5" />,
    nextAudit: "Oct 15, 2023",
    categories: [
      { 
        name: "Information Security Policies", 
        completed: 8, 
        total: 10,
        controls: [
          { id: "A.5.1.1", name: "Policies for information security", status: "compliant" as const, evidence: "policies-v1.2.pdf", lastUpdated: "2023-09-15" },
          { id: "A.5.1.2", name: "Review of the policies for information security", status: "compliant" as const, evidence: "policy-review.docx", lastUpdated: "2023-09-20" }
        ]
      },
      { 
        name: "Organization of Information Security", 
        completed: 12, 
        total: 15,
        controls: [
          { id: "A.6.1.1", name: "Information security roles and responsibilities", status: "compliant" as const, evidence: "roles-responsibilities.pdf", lastUpdated: "2023-08-05" },
          { id: "A.6.1.2", name: "Segregation of duties", status: "non-compliant" as const, evidence: "", lastUpdated: "" },
          { id: "A.6.1.3", name: "Contact with authorities", status: "compliant" as const, evidence: "authority-contacts.xlsx", lastUpdated: "2023-07-12" }
        ]
      },
      { 
        name: "Access Control", 
        completed: 18, 
        total: 25,
        controls: [
          { id: "A.9.1.1", name: "Access control policy", status: "compliant" as const, evidence: "access-policy.pdf", lastUpdated: "2023-08-18" },
          { id: "A.9.1.2", name: "Access to networks and network services", status: "non-compliant" as const, evidence: "", lastUpdated: "" },
          { id: "A.9.2.1", name: "User registration and de-registration", status: "compliant" as const, evidence: "user-management.pdf", lastUpdated: "2023-09-01" },
          { id: "A.9.2.2", name: "User access provisioning", status: "compliant" as const, evidence: "access-provisioning.xlsx", lastUpdated: "2023-09-05" }
        ]
      },
      { 
        name: "Cryptography", 
        completed: 5, 
        total: 5,
        controls: [
          { id: "A.10.1.1", name: "Policy on the use of cryptographic controls", status: "compliant" as const, evidence: "crypto-policy.pdf", lastUpdated: "2023-06-20" },
          { id: "A.10.1.2", name: "Key management", status: "compliant" as const, evidence: "key-management.docx", lastUpdated: "2023-06-22" }
        ]
      },
      { 
        name: "Physical Security", 
        completed: 20, 
        total: 22,
        controls: [
          { id: "A.11.1.1", name: "Physical security perimeter", status: "compliant" as const, evidence: "physical-security.pdf", lastUpdated: "2023-07-15" },
          { id: "A.11.1.2", name: "Physical entry controls", status: "compliant" as const, evidence: "entry-controls.jpg", lastUpdated: "2023-07-16" },
          { id: "A.11.2.1", name: "Equipment siting and protection", status: "non-compliant" as const, evidence: "", lastUpdated: "" }
        ]
      }
    ]
  },
  { 
    id: "pcidss", 
    name: "PCI DSS", 
    description: "Payment Card Industry Data Security Standard",
    controls: 78,
    compliance: 92,
    icon: <ClipboardList className="w-5 h-5" />,
    nextAudit: "Nov 30, 2023",
    categories: [
      { 
        name: "Build and Maintain a Secure Network", 
        completed: 6, 
        total: 6,
        controls: [
          { id: "1.1", name: "Install and maintain a firewall configuration", status: "compliant" as const, evidence: "firewall-config.pdf", lastUpdated: "2023-08-12" },
          { id: "1.2", name: "Do not use vendor-supplied defaults", status: "compliant" as const, evidence: "default-changes.xlsx", lastUpdated: "2023-08-14" }
        ]
      },
      { 
        name: "Protect Cardholder Data", 
        completed: 8, 
        total: 9,
        controls: [
          { id: "3.1", name: "Keep cardholder data storage to a minimum", status: "compliant" as const, evidence: "data-minimization.pdf", lastUpdated: "2023-09-02" },
          { id: "3.2", name: "Do not store sensitive authentication data", status: "compliant" as const, evidence: "data-storage-audit.docx", lastUpdated: "2023-09-04" },
          { id: "3.3", name: "Mask PAN when displayed", status: "non-compliant" as const, evidence: "", lastUpdated: "" }
        ]
      },
      { 
        name: "Maintain a Vulnerability Management Program", 
        completed: 5, 
        total: 6,
        controls: [
          { id: "5.1", name: "Deploy anti-virus software", status: "compliant" as const, evidence: "av-deployment.pdf", lastUpdated: "2023-07-22" },
          { id: "5.2", name: "Ensure all anti-virus mechanisms are current", status: "compliant" as const, evidence: "av-updates.xlsx", lastUpdated: "2023-07-25" },
          { id: "6.1", name: "Establish a process to identify security vulnerabilities", status: "non-compliant" as const, evidence: "", lastUpdated: "" }
        ]
      }
    ]
  },
  { 
    id: "hipaa", 
    name: "HIPAA", 
    description: "Health Insurance Portability and Accountability Act",
    controls: 49,
    compliance: 65,
    icon: <File className="w-5 h-5" />,
    nextAudit: "Feb 12, 2024",
    categories: [
      { 
        name: "Administrative Safeguards", 
        completed: 8, 
        total: 12,
        controls: [
          { id: "164.308(a)(1)(i)", name: "Security Management Process", status: "compliant" as const, evidence: "security-mgmt.pdf", lastUpdated: "2023-08-05" },
          { id: "164.308(a)(2)", name: "Assigned Security Responsibility", status: "compliant" as const, evidence: "security-responsibility.docx", lastUpdated: "2023-08-07" },
          { id: "164.308(a)(3)(i)", name: "Workforce Security", status: "non-compliant" as const, evidence: "", lastUpdated: "" }
        ]
      },
      { 
        name: "Physical Safeguards", 
        completed: 5, 
        total: 8,
        controls: [
          { id: "164.310(a)(1)", name: "Facility Access Controls", status: "compliant" as const, evidence: "facility-access.pdf", lastUpdated: "2023-07-12" },
          { id: "164.310(b)", name: "Workstation Use", status: "non-compliant" as const, evidence: "", lastUpdated: "" },
          { id: "164.310(c)", name: "Workstation Security", status: "non-compliant" as const, evidence: "", lastUpdated: "" }
        ]
      },
      { 
        name: "Technical Safeguards", 
        completed: 7, 
        total: 10,
        controls: [
          { id: "164.312(a)(1)", name: "Access Control", status: "compliant" as const, evidence: "access-control.pdf", lastUpdated: "2023-09-10" },
          { id: "164.312(b)", name: "Audit Controls", status: "compliant" as const, evidence: "audit-controls.xlsx", lastUpdated: "2023-09-12" },
          { id: "164.312(c)(1)", name: "Integrity", status: "non-compliant" as const, evidence: "", lastUpdated: "" }
        ]
      }
    ]
  },
  { 
    id: "soc2", 
    name: "SOC 2", 
    description: "Service Organization Control 2",
    controls: 64,
    compliance: 42,
    icon: <Check className="w-5 h-5" />,
    nextAudit: "Jan 05, 2024",
    categories: [
      { 
        name: "Security", 
        completed: 10, 
        total: 20,
        controls: [
          { id: "CC1.1", name: "COSO Principle 1", status: "compliant" as const, evidence: "coso-p1.pdf", lastUpdated: "2023-08-15" },
          { id: "CC1.2", name: "COSO Principle 2", status: "non-compliant" as const, evidence: "", lastUpdated: "" },
          { id: "CC2.1", name: "Communication and Information", status: "compliant" as const, evidence: "communication.docx", lastUpdated: "2023-08-22" }
        ]
      },
      { 
        name: "Availability", 
        completed: 6, 
        total: 12,
        controls: [
          { id: "A1.1", name: "Availability Objectives", status: "compliant" as const, evidence: "availability-objectives.pdf", lastUpdated: "2023-07-18" },
          { id: "A1.2", name: "Availability Requirements", status: "non-compliant" as const, evidence: "", lastUpdated: "" },
          { id: "A1.3", name: "Environmental Protections", status: "non-compliant" as const, evidence: "", lastUpdated: "" }
        ]
      },
      { 
        name: "Processing Integrity", 
        completed: 4, 
        total: 10,
        controls: [
          { id: "PI1.1", name: "Processing Objectives", status: "compliant" as const, evidence: "processing-objectives.pdf", lastUpdated: "2023-09-05" },
          { id: "PI1.2", name: "Processing Procedures", status: "non-compliant" as const, evidence: "", lastUpdated: "" },
          { id: "PI1.3", name: "Processing Monitoring", status: "non-compliant" as const, evidence: "", lastUpdated: "" }
        ]
      }
    ]
  }
];

function FrameworkCard({ framework }: { framework: typeof frameworks[0] }) {
  return (
    <Link 
      to={`/compliance/${framework.id}`}
      className="bg-white rounded-xl shadow-sm border p-5 transition-all hover:shadow-md hover:border-primary/20"
    >
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">{framework.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{framework.description}</p>
          
          <div className="flex gap-4 mt-4">
            <div>
              <p className="text-sm text-muted-foreground">Controls</p>
              <p className="text-lg font-medium">{framework.controls}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Compliance</p>
              <p className="text-lg font-medium">{framework.compliance}%</p>
            </div>
          </div>
          
          {framework.nextAudit && (
            <div className="mt-3 text-xs text-muted-foreground">
              Next Audit: {framework.nextAudit}
            </div>
          )}
        </div>
        
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          "bg-primary/10 text-primary"
        )}>
          {framework.icon}
        </div>
      </div>
      
      <div className="mt-4">
        <Progress value={framework.compliance} className="h-2" />
      </div>
    </Link>
  );
}

function ComplianceHome() {
  return (
    <>
      <div className="mb-6 animate-slide-up">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
          Compliance
        </span>
        <h1 className="text-3xl font-semibold">Compliance Frameworks</h1>
        <p className="text-muted-foreground mt-1">
          Manage your compliance frameworks and track your compliance status
        </p>
      </div>
      
      <Tabs defaultValue="frameworks" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="upload">Upload Evidence</TabsTrigger>
        </TabsList>
        <TabsContent value="frameworks" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {frameworks.map((framework) => (
              <FrameworkCard key={framework.id} framework={framework} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upload" className="mt-6">
          <ComplianceUploadForm />
        </TabsContent>
      </Tabs>
    </>
  );
}

function FrameworkDetail() {
  const { frameworkId } = useParams();
  const navigate = useNavigate();
  const framework = frameworks.find(f => f.id === frameworkId) || frameworks[0];
  
  useEffect(() => {
    // If framework not found, redirect to compliance home
    if (!framework) {
      navigate("/compliance");
    }
  }, [framework, navigate]);
  
  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/compliance" className="hover:text-primary">Compliance</Link>
        <ArrowRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{framework.name}</span>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">{framework.name}</h1>
        <p className="text-muted-foreground mt-1">{framework.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-medium mb-2">Overall Compliance</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{framework.compliance}%</span>
            <span className="text-green-600 text-sm mb-1">+3% this month</span>
          </div>
          <Progress value={framework.compliance} className="h-2 mt-4" />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-medium mb-2">Controls</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{framework.controls}</span>
            <span className="text-muted-foreground text-sm mb-1">total controls</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
            <div className="bg-green-50 text-green-700 p-2 rounded">
              <div className="font-medium">{Math.round(framework.controls * framework.compliance / 100)}</div>
              <div>Compliant</div>
            </div>
            <div className="bg-amber-50 text-amber-700 p-2 rounded">
              <div className="font-medium">12</div>
              <div>In Progress</div>
            </div>
            <div className="bg-red-50 text-red-700 p-2 rounded">
              <div className="font-medium">{Math.round(framework.controls * (100 - framework.compliance) / 100)}</div>
              <div>Non-Compliant</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-medium mb-2">Next Steps</h3>
          <div className="space-y-3 mt-4">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Complete Access Control Assessment</p>
                <p className="text-xs text-muted-foreground">Due in 5 days</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">2</span>
              </div>
              <div>
                <p className="text-sm font-medium">Upload Missing Evidence</p>
                <p className="text-xs text-muted-foreground">7 documents pending</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">3</span>
              </div>
              <div>
                <p className="text-sm font-medium">Prepare for Audit</p>
                <p className="text-xs text-muted-foreground">Scheduled for {framework.nextAudit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {framework.categories && (
        <FrameworkControls categories={framework.categories} />
      )}
    </div>
  );
}

export default function CompliancePage() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<ComplianceHome />} />
        <Route path="/:frameworkId" element={<FrameworkDetail />} />
      </Routes>
    </MainLayout>
  );
}
