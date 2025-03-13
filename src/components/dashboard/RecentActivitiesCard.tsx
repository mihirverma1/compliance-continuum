
import React from "react";
import { FileText, ShieldCheck, AlertTriangle, Calendar, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Activity = {
  id: string;
  type: "policy" | "compliance" | "risk" | "audit" | "user";
  title: string;
  description: string;
  time: string;
  user: string;
};

const activities: Activity[] = [
  {
    id: "act1",
    type: "policy",
    title: "Data Protection Policy",
    description: "Updated by Jane Cooper",
    time: "2 hours ago",
    user: "Jane Cooper"
  },
  {
    id: "act2",
    type: "compliance",
    title: "ISO 27001 Control",
    description: "Evidence uploaded for A.8.2.3",
    time: "Yesterday",
    user: "Alex Morgan"
  },
  {
    id: "act3",
    type: "risk",
    title: "New Risk Identified",
    description: "Unauthorized access to customer data",
    time: "2 days ago",
    user: "Robert Fox"
  },
  {
    id: "act4",
    type: "audit",
    title: "Internal Audit",
    description: "Scheduled for Security Controls",
    time: "1 week ago",
    user: "Wade Cooper"
  },
  {
    id: "act5",
    type: "user",
    title: "User Access Review",
    description: "Completed for Finance department",
    time: "1 week ago",
    user: "Leslie Alexander"
  }
];

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "policy":
      return <FileText className="w-4 h-4" />;
    case "compliance":
      return <ShieldCheck className="w-4 h-4" />;
    case "risk":
      return <AlertTriangle className="w-4 h-4" />;
    case "audit":
      return <Calendar className="w-4 h-4" />;
    case "user":
      return <User className="w-4 h-4" />;
  }
};

const getActivityColors = (type: Activity["type"]) => {
  switch (type) {
    case "policy":
      return "bg-blue-100 text-blue-700";
    case "compliance":
      return "bg-green-100 text-green-700";
    case "risk":
      return "bg-red-100 text-red-700";
    case "audit":
      return "bg-purple-100 text-purple-700";
    case "user":
      return "bg-amber-100 text-amber-700";
  }
};

export default function RecentActivitiesCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Recent Activities</h3>
        <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
          See all <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 pb-3 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
              getActivityColors(activity.type)
            )}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 border-b pb-3">
              <div className="flex justify-between">
                <h4 className="font-medium">{activity.title}</h4>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
