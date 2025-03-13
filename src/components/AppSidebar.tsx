
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Shield,
  AlertTriangle,
  Server,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarLinkProps = {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  collapsed: boolean;
  subItems?: { name: string; to: string }[];
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon: Icon, 
  children, 
  collapsed,
  subItems 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasSubItems = subItems && subItems.length > 0;
  
  return (
    <div className="mb-1">
      <NavLink
        to={to}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
          isActive ? 
            "bg-primary/10 text-primary font-medium" : 
            "text-foreground/80 hover:bg-primary/5 hover:text-primary"
        )}
        onClick={hasSubItems ? (e) => {
          if (e.target === e.currentTarget || e.target instanceof SVGElement || e.target instanceof SVGSVGElement) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        } : undefined}
        end={!hasSubItems}
      >
        <Icon className={cn(
          "w-5 h-5 transition-all duration-300",
          collapsed ? "translate-x-[0.15rem]" : ""
        )} />
        
        {!collapsed && (
          <>
            <span className="flex-grow transition-all duration-200">{children}</span>
            {hasSubItems && (
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform duration-200",
                isExpanded ? "rotate-90" : ""
              )} />
            )}
          </>
        )}
      </NavLink>
      
      {!collapsed && hasSubItems && isExpanded && (
        <div className="ml-8 mt-1 space-y-1 animate-slide-down">
          {subItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "block px-3 py-1.5 rounded-md text-sm transition-colors",
                isActive ? 
                  "bg-primary/5 text-primary font-medium" : 
                  "text-foreground/70 hover:bg-primary/5 hover:text-primary"
              )}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 h-screen bg-white shadow-md z-40 transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-primary mr-2" />
            <h2 className="font-semibold text-lg">ComplianceCore</h2>
          </div>
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all",
            collapsed ? "mx-auto" : ""
          )}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>
      
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <SidebarLink to="/" icon={LayoutDashboard} collapsed={collapsed}>
          Dashboard
        </SidebarLink>
        
        <SidebarLink 
          to="/compliance" 
          icon={FileText} 
          collapsed={collapsed}
          subItems={[
            { name: "ISO 27001", to: "/compliance/iso27001" },
            { name: "PCI DSS", to: "/compliance/pcidss" },
            { name: "HIPAA", to: "/compliance/hipaa" },
            { name: "SOC 2", to: "/compliance/soc2" }
          ]}
        >
          Compliance
        </SidebarLink>
        
        <SidebarLink 
          to="/risk" 
          icon={AlertTriangle} 
          collapsed={collapsed}
          subItems={[
            { name: "Assessment", to: "/risk/assessment" },
            { name: "Threats", to: "/risk/threats" },
            { name: "Mitigation", to: "/risk/mitigation" }
          ]}
        >
          Risk Management
        </SidebarLink>
        
        <SidebarLink 
          to="/policies" 
          icon={Shield} 
          collapsed={collapsed}
          subItems={[
            { name: "Policies", to: "/policies/all" },
            { name: "Procedures", to: "/policies/procedures" },
            { name: "Audits", to: "/policies/audits" }
          ]}
        >
          Policies & Audits
        </SidebarLink>
        
        <SidebarLink to="/assets" icon={Server} collapsed={collapsed}>
          Asset Inventory
        </SidebarLink>
        
        <SidebarLink to="/users" icon={Users} collapsed={collapsed}>
          User Management
        </SidebarLink>
      </nav>
      
      <div className="border-t py-4 px-3">
        <SidebarLink to="/settings" icon={Settings} collapsed={collapsed}>
          Settings
        </SidebarLink>
        
        <SidebarLink to="/logout" icon={LogOut} collapsed={collapsed}>
          Logout
        </SidebarLink>
      </div>
    </aside>
  );
}
