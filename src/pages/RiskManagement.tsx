
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiskUploadForm from "@/components/risk/RiskUploadForm";
import RiskRegister, { RiskItem } from "@/components/risk/RiskRegister";
import { parseCSV } from "@/lib/csvUtils";
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
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="bg-amber-50 text-amber-700 p-4 rounded-lg">
                <h3 className="font-medium mb-1">High Risks</h3>
                <p className="text-2xl font-bold">7</p>
              </div>
              <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Mitigated</h3>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
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
