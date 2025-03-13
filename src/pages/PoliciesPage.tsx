
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { Routes, Route } from "react-router-dom";

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
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-medium mb-4">Policy Management Module</h2>
        <p className="text-muted-foreground">
          This module will include policy repository, document management, and audit tracking features.
        </p>
      </div>
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
