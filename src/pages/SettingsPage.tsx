
import React from "react";
import MainLayout from "@/layouts/MainLayout";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="animate-slide-up">
        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
            Configuration
          </span>
          <h1 className="text-3xl font-semibold">System Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your GRC platform settings and preferences
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-medium mb-4">Settings Module</h2>
          <p className="text-muted-foreground">
            This module will include system configuration, notification preferences, and integration settings.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
