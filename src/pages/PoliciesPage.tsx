import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route, Link } from "react-router-dom";
import { Check, File, FileCheck, ClipboardList, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PolicyUploadForm from "@/components/policies/PolicyUploadForm";

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
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium mb-2">{framework.name}</h2>
          <p className="text-muted-foreground">{framework.description}</p>
        </div>
        <div className="flex items-center">
          <span className="text-primary">{framework.controls} Controls</span>
          <span className="text-primary ml-2">{framework.compliance}% Compliance</span>
        </div>
      </div>
    </div>
  );
}

function PoliciesHome() {
  return (
    <>
      <div className="mb-6 animate-slide-up">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
          Governance
        </span>
        <h1 className="text-3xl font-semibold">Policies & Audits</h1>
        <p className="text-muted-foreground mt-1">
          Manage your policies, procedures, and audit activities
        </p>
      </div>
      
      <Tabs defaultValue="browse" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="browse">Browse Policies</TabsTrigger>
          <TabsTrigger value="upload">Upload Policies</TabsTrigger>
        </TabsList>
        <TabsContent value="browse" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {frameworks.map((framework) => (
              <FrameworkCard key={framework.id} framework={framework} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upload" className="mt-6">
          <PolicyUploadForm />
        </TabsContent>
      </Tabs>
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

export default function PoliciesPage() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<PoliciesHome />} />
        <Route path="/all" element={<PoliciesHome />} />
        <Route path="/procedures" element={<PoliciesHome />} />
        <Route path="/audits" element={<PoliciesHome />} />
      </Routes>
    </MainLayout>
  );
}
