
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route, Link } from "react-router-dom";
import { Check, File, FileCheck, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

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
        </div>
        
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          "bg-primary/10 text-primary"
        )}>
          {framework.icon}
        </div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {frameworks.map((framework) => (
          <FrameworkCard key={framework.id} framework={framework} />
        ))}
      </div>
    </>
  );
}

function FrameworkDetail() {
  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-semibold mb-6">Framework Details Coming Soon</h2>
      <p className="text-muted-foreground">
        This screen will show detailed controls and compliance status for the selected framework.
      </p>
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
