
import React from "react";
import MainLayout from "@/layouts/MainLayout";

export default function UsersPage() {
  return (
    <MainLayout>
      <div className="animate-slide-up">
        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
            Access Control
          </span>
          <h1 className="text-3xl font-semibold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and permissions for your GRC platform
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-medium mb-4">User Management Module</h2>
          <p className="text-muted-foreground">
            This module will include user accounts, role-based access control, and permission management features.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
