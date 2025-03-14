
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileType, Check } from "lucide-react";

export default function AuditObservationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [status, setStatus] = useState("open");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !severity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Observation added",
        description: "The audit observation has been successfully added",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setSeverity("medium");
      setStatus("open");
      setFile(null);
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Observation Title*</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Missing access controls for file server"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="severity">Severity*</Label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger id="severity">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status*</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="remediated">Remediated</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the observation, findings, and recommended remediation..."
          rows={5}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="evidence">Evidence (Optional)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-6 w-6 text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Upload supporting evidence (Screenshots, logs, etc.)
            </p>
            
            <input
              type="file"
              id="evidence"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="evidence"
              className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded text-sm"
            >
              Select File
            </label>
            
            {file && (
              <div className="flex items-center gap-2 text-sm mt-3">
                <FileType className="h-4 w-4" />
                <span>{file.name}</span>
                <Check className="h-4 w-4 text-green-500" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Observation"}
        </Button>
      </div>
    </form>
  );
}
