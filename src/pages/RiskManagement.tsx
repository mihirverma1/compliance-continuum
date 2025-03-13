
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route } from "react-router-dom";

function RiskHome() {
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
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-medium mb-4">Risk Management Module</h2>
        <p className="text-muted-foreground">
          This module will include risk assessment, threat tracking, and mitigation planning features.
        </p>
      </div>
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
