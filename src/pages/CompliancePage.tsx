
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route, Link } from "react-router-dom";
import { Check, File, FileCheck, ClipboardList, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ComplianceUploadForm from "@/components/compliance/ComplianceUploadForm";

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
      { name: "Information Security Policies", completed: 8, total: 10 },
      { name: "Organization of Information Security", completed: 12, total: 15 },
      { name: "Access Control", completed: 18, total: 25 },
      { name: "Cryptography", completed: 5, total: 5 },
      { name: "Physical Security", completed: 20, total: 22 },
    ]
  },
  { 
    id: "pcidss", 
    name: "PCI DSS", 
    description: "Payment Card Industry Data Security Standard",
    controls: 78,
    compliance: 92,
    icon: <ClipboardList className="w-5 h-5" />,
    nextAudit: "Nov 30, 2023"
  },
  { 
    id: "hipaa", 
    name: "HIPAA", 
    description: "Health Insurance Portability and Accountability Act",
    controls: 49,
    compliance: 65,
    icon: <File className="w-5 h-5" />,
    nextAudit: "Feb 12, 2024"
  },
  { 
    id: "soc2", 
    name: "SOC 2", 
    description: "Service Organization Control 2",
    controls: 64,
    compliance: 42,
    icon: <Check className="w-5 h-5" />,
    nextAudit: "Jan 05, 2024"
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
  // This would typically use a route parameter to get the framework ID
  const frameworkId = "iso27001"; // For demo purposes
  const framework = frameworks.find(f => f.id === frameworkId) || frameworks[0];
  
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
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-medium mb-4">Control Categories</h3>
          <div className="space-y-4">
            {framework.categories.map((category, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">{category.name}</h4>
                  <span className="text-sm">
                    {category.completed}/{category.total} ({Math.round(category.completed/category.total*100)}%)
                  </span>
                </div>
                <Progress value={category.completed/category.total*100} className="h-2" />
              </div>
            ))}
          </div>
        </div>
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
