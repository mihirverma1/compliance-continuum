
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { cn } from "@/lib/utils";

const data = [
  {
    framework: "ISO 27001",
    compliant: 92,
    nonCompliant: 8,
  },
  {
    framework: "PCI DSS",
    compliant: 87,
    nonCompliant: 13,
  },
  {
    framework: "HIPAA",
    compliant: 65,
    nonCompliant: 35,
  },
  {
    framework: "SOC 2",
    compliant: 42,
    nonCompliant: 58,
  },
  {
    framework: "GDPR",
    compliant: 78,
    nonCompliant: 22,
  },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm">Compliant: {payload[0].value}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Non-Compliant: {payload[1].value}%</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function ComplianceOverviewChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Compliance Overview</h3>
        <select className="text-sm bg-secondary/50 rounded-md px-2 py-1 border-none focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Last Year</option>
        </select>
      </div>
      
      <div className="h-[300px] pt-2 animate-fade-in">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            barGap={0}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis 
              dataKey="framework"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="compliant" 
              stackId="a" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="nonCompliant" 
              stackId="a" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm">Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm">Non-Compliant</span>
        </div>
      </div>
    </div>
  );
}
