
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiskUploadForm from "@/components/risk/RiskUploadForm";
import RiskRegister, { RiskItem } from "@/components/risk/RiskRegister";
import { useToast } from "@/hooks/use-toast";

function RiskHome() {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const { toast } = useToast();

  const handleNewRisks = (newRisks: RiskItem[]) => {
    setRisks(prevRisks => [...prevRisks, ...newRisks]);
    toast({
      title: "Risks Uploaded",
      description: `Successfully added ${newRisks.length} new risks to the register`,
    });
  };

  // Count risks by criticality for the dashboard
  const criticalRisks = risks.filter(risk => risk.criticality === "Critical").length;
  const highRisks = risks.filter(risk => risk.criticality === "High").length;
  const mitigatedRisks = risks.filter(risk => risk.status === "Mitigated").length;

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
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-medium mb-4">Risk Overview</h2>
            <p className="text-muted-foreground">
              View and manage your organization's risk assessment, threat tracking, and mitigation planning.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Critical Risks</h3>
                <p className="text-2xl font-bold">{criticalRisks}</p>
              </div>
              <div className="bg-amber-50 text-amber-700 p-4 rounded-lg">
                <h3 className="font-medium mb-1">High Risks</h3>
                <p className="text-2xl font-bold">{highRisks}</p>
              </div>
              <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Mitigated</h3>
                <p className="text-2xl font-bold">{mitigatedRisks}</p>
              </div>
            </div>

            {risks.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Risk Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">By Criticality</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 rounded-full bg-red-500" style={{ width: `${(criticalRisks / Math.max(risks.length, 1)) * 100}%` }}></div>
                      <span className="text-sm">Critical ({criticalRisks})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 rounded-full bg-amber-500" style={{ width: `${(highRisks / Math.max(risks.length, 1)) * 100}%` }}></div>
                      <span className="text-sm">High ({highRisks})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 rounded-full bg-blue-500" style={{ width: `${((risks.length - criticalRisks - highRisks) / Math.max(risks.length, 1)) * 100}%` }}></div>
                      <span className="text-sm">Medium/Low ({risks.length - criticalRisks - highRisks})</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">By Status</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 rounded-full bg-blue-500" style={{ width: `${((risks.filter(r => r.status === "Active").length) / Math.max(risks.length, 1)) * 100}%` }}></div>
                      <span className="text-sm">Active ({risks.filter(r => r.status === "Active").length})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 rounded-full bg-green-500" style={{ width: `${(mitigatedRisks / Math.max(risks.length, 1)) * 100}%` }}></div>
                      <span className="text-sm">Mitigated ({mitigatedRisks})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 rounded-full bg-purple-500" style={{ width: `${((risks.filter(r => r.status !== "Active" && r.status !== "Mitigated").length) / Math.max(risks.length, 1)) * 100}%` }}></div>
                      <span className="text-sm">Other ({risks.filter(r => r.status !== "Active" && r.status !== "Mitigated").length})</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="register" className="mt-6">
          <RiskRegister risks={risks} />
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
