
import React from "react";
import MainLayout from "@/layouts/MainLayout";

export default function AssetsPage() {
  return (
    <MainLayout>
      <div className="animate-slide-up">
        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
            Asset Management
          </span>
          <h1 className="text-3xl font-semibold">Asset Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your IT assets and their compliance status
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-medium mb-4">Asset Inventory Module</h2>
          <p className="text-muted-foreground">
            This module will include asset catalog, classification, and compliance mapping features.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
