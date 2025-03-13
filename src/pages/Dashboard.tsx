
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import ComplianceStatusCard from "@/components/dashboard/ComplianceStatusCard";
import RiskSummaryCard from "@/components/dashboard/RiskSummaryCard";
import RecentActivitiesCard from "@/components/dashboard/RecentActivitiesCard";
import ComplianceOverviewChart from "@/components/dashboard/ComplianceOverviewChart";
import StatCard from "@/components/dashboard/StatCard";
import { FileText, AlertTriangle, ShieldCheck, Server } from "lucide-react";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="mb-6">
        <div className="animate-slide-up">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
            GRC Dashboard
          </span>
          <h1 className="text-3xl font-semibold">Compliance Continuum</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your compliance status, risk posture, and governance activities
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard 
          title="Total Controls" 
          value={312} 
          change={4}
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        
        <StatCard 
          title="Open Risks" 
          value={26} 
          change={-12}
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-100"
        />
        
        <StatCard 
          title="Compliance Score" 
          value={78} 
          metric="/ 100"
          change={3}
          icon={<ShieldCheck className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
        />
        
        <StatCard 
          title="Assets Tracked" 
          value={187} 
          change={8}
          icon={<Server className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ComplianceOverviewChart />
        </div>
        <div>
          <ComplianceStatusCard />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <RiskSummaryCard />
        </div>
        <div>
          <RecentActivitiesCard />
        </div>
      </div>
    </MainLayout>
  );
}
