
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Clock, Filter, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Find the selected category
  const category = selectedCategory 
    ? categories.find(c => c.name === selectedCategory) 
    : null;

  // Filter controls based on status and search query
  const filteredControls = category?.controls.filter(control => {
    const matchesStatus = statusFilter === "all" || control.status === statusFilter;
    const matchesSearch = !searchQuery || 
      control.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      control.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-medium mb-4">Control Categories</h3>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="cursor-pointer hover:bg-slate-50 rounded-md p-2 transition-colors" 
              onClick={() => setSelectedCategory(category.name)}
            >
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
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => setSelectedCategory(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h3 className="text-lg font-medium">{category.name} Controls</h3>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Search controls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Controls</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="bg-green-50 text-green-700 px-3 py-2 rounded flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium">{category.controls.filter(c => c.status === "compliant").length}</div>
                <div className="text-xs">Compliant</div>
              </div>
            </div>
            <div className="bg-red-50 text-red-700 px-3 py-2 rounded flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium">{category.controls.filter(c => c.status === "non-compliant").length}</div>
                <div className="text-xs">Non-Compliant</div>
              </div>
            </div>
            <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium">{category.controls.filter(c => c.status === "in-progress").length}</div>
                <div className="text-xs">In Progress</div>
              </div>
            </div>
          </div>
          
          {filteredControls && filteredControls.length > 0 ? (
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
                {filteredControls.map((control) => (
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
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No controls match your filter criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
}
