
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Control {
  id: string;
  name: string;
  status: "compliant" | "non-compliant" | "in-progress";
  evidence?: string;
  lastUpdated?: string;
}

export interface Category {
  name: string;
  completed: number;
  total: number;
  controls: Control[];
}

interface FrameworkControlsProps {
  categories: Category[];
}

export default function FrameworkControls({ categories }: FrameworkControlsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  // Find the selected category
  const category = selectedCategory 
    ? categories.find(c => c.name === selectedCategory) 
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-medium mb-4">Control Categories</h3>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="cursor-pointer hover:bg-slate-50 rounded-md p-2 transition-colors" onClick={() => setSelectedCategory(category.name)}>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium hover:text-primary transition-colors">{category.name}</h4>
                <span className="text-sm">
                  {category.completed}/{category.total} ({Math.round(category.completed/category.total*100)}%)
                </span>
              </div>
              <Progress value={category.completed/category.total*100} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {category && (
        <div className="bg-white rounded-xl shadow-sm border p-6 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{category.name} Controls</h3>
            <button 
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedCategory(null)}
            >
              Back to Categories
            </button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category.controls.map((control) => (
                <TableRow key={control.id}>
                  <TableCell className="font-medium">{control.id}</TableCell>
                  <TableCell>{control.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {control.status === "compliant" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : control.status === "in-progress" ? (
                        <Clock className="h-4 w-4 text-amber-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <Badge variant={
                        control.status === "compliant" ? "default" : 
                        control.status === "non-compliant" ? "destructive" : "secondary"
                      }>
                        {control.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{control.evidence || "No evidence"}</TableCell>
                  <TableCell>{control.lastUpdated || "Never"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
