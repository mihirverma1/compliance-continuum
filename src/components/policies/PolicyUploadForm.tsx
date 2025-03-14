
import React, { useState } from "react";
import { Upload, FileType, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { isValidCSVFile, parseCSV, getSampleCSVTemplate } from "@/lib/csvUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface PolicyUploadFormProps {
  onSuccess?: () => void;
}

export default function PolicyUploadForm({ onSuccess }: PolicyUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [policies, setPolicies] = useState<any[]>([]);
  
  // Single policy upload state
  const [policyName, setPolicyName] = useState("");
  const [policyType, setPolicyType] = useState("Security");
  const [policyVersion, setPolicyVersion] = useState("1.0");
  const [policyStatus, setPolicyStatus] = useState("Draft");
  const [policyOwner, setPolicyOwner] = useState("");
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [relatedControls, setRelatedControls] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (isValidCSVFile(selectedFile)) {
        setFile(selectedFile);
        setUploadSuccess(false);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
      }
    }
  };
  
  const handlePolicyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setPolicyFile(selectedFile);
    }
  };
  
  const handleBulkUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Read the file content
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        if (csvText) {
          const parsedPolicies = parseCSV(csvText);
          setPolicies(parsedPolicies);
          setUploadSuccess(true);
          
          toast({
            title: "Upload successful",
            description: `${parsedPolicies.length} policies have been uploaded.`,
          });
          
          // Call onSuccess callback if provided
          if (onSuccess) {
            setTimeout(onSuccess, 2000);
          }
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSingleUpload = () => {
    if (!policyName || !policyOwner || !policyFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a policy file.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, you would upload the file to a server
    // For this demo, we'll just simulate a successful upload
    
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      toast({
        title: "Policy uploaded",
        description: `${policyName} has been uploaded successfully.`,
      });
      
      // Reset form
      setPolicyName("");
      setPolicyType("Security");
      setPolicyVersion("1.0");
      setPolicyStatus("Draft");
      setPolicyOwner("");
      setPolicyFile(null);
      setRelatedControls("");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    }, 1500);
  };
  
  const downloadSampleTemplate = () => {
    const element = document.createElement("a");
    // Use a specialized template for policies with versioning and control mapping
    const sampleContent = `name,type,version,status,owner,last_updated,next_review,related_controls
Information Security Policy,Security,2.3,Active,CISO,2023-09-15,2024-09-15,"ISO-A.5, SOC2-CC1.1, PCI-2.1"
Access Control Policy,Security,1.8,Active,Security Team,2023-11-20,2024-11-20,"ISO-A.9, SOC2-CC6.1, PCI-7.1"
Data Protection Policy,Compliance,3.1,Draft,Compliance Officer,2023-10-05,2024-04-05,"ISO-A.18, HIPAA-164.308"`;
    const file = new Blob([sampleContent], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "policy_template.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="single">Single Policy Upload</TabsTrigger>
          <TabsTrigger value="bulk">Bulk CSV Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-name">Policy Name</Label>
                    <Input 
                      id="policy-name" 
                      placeholder="e.g. Information Security Policy" 
                      value={policyName}
                      onChange={(e) => setPolicyName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policy-type">Policy Type</Label>
                    <Select value={policyType} onValueChange={setPolicyType}>
                      <SelectTrigger id="policy-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Procedure">Procedure</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-version">Version</Label>
                    <Input 
                      id="policy-version" 
                      placeholder="e.g. 1.0" 
                      value={policyVersion}
                      onChange={(e) => setPolicyVersion(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policy-status">Status</Label>
                    <Select value={policyStatus} onValueChange={setPolicyStatus}>
                      <SelectTrigger id="policy-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Review">Under Review</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policy-owner">Owner</Label>
                    <Input 
                      id="policy-owner" 
                      placeholder="e.g. CISO" 
                      value={policyOwner}
                      onChange={(e) => setPolicyOwner(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="policy-file">Policy Document</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="policy-file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handlePolicyFileChange}
                    />
                    <div className="border rounded w-full p-2 flex items-center gap-2">
                      <Label 
                        htmlFor="policy-file"
                        className="cursor-pointer bg-primary/10 text-primary px-3 py-1 rounded"
                      >
                        Browse...
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {policyFile ? policyFile.name : "No file selected"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: PDF, Word documents, Text files
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="related-controls">Related Controls</Label>
                  <Input 
                    id="related-controls" 
                    placeholder="e.g. ISO-A.5, SOC2-CC1.1, PCI-2.1" 
                    value={relatedControls}
                    onChange={(e) => setRelatedControls(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Comma-separated list of related compliance controls
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSingleUpload} 
                    disabled={isUploading || !policyName || !policyOwner || !policyFile}
                  >
                    {isUploading ? "Uploading..." : "Upload Policy"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bulk" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Policy Documents</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Upload a CSV file containing your policies and procedures with metadata like version, status, and linked compliance controls.
                </p>
                
                <div className="mt-4 flex flex-col items-center gap-4">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="policy-file-upload"
                  />
                  <label
                    htmlFor="policy-file-upload"
                    className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Select CSV File
                  </label>
                  
                  {file && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileType className="h-4 w-4" />
                      <span>{file.name}</span>
                      {!uploadSuccess && (
                        <Button
                          size="sm"
                          onClick={handleBulkUpload}
                          disabled={isUploading}
                        >
                          {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                      )}
                      {uploadSuccess && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadSampleTemplate}
                    className="text-xs"
                  >
                    Download Sample Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {uploadSuccess && policies.length > 0 && (
            <Card className="mt-6 animate-slide-up">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Uploaded Policies</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Name</th>
                        <th className="px-4 py-2 text-left font-medium">Type</th>
                        <th className="px-4 py-2 text-left font-medium">Version</th>
                        <th className="px-4 py-2 text-left font-medium">Status</th>
                        <th className="px-4 py-2 text-left font-medium">Owner</th>
                        <th className="px-4 py-2 text-left font-medium">Last Updated</th>
                        <th className="px-4 py-2 text-left font-medium">Related Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {policies.map((policy, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 font-medium">{policy.name}</td>
                          <td className="px-4 py-2">{policy.type}</td>
                          <td className="px-4 py-2">{policy.version}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              ${policy.status === "Active" 
                                ? "bg-green-100 text-green-800" 
                                : policy.status === "Draft" 
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"}`}>
                              {policy.status || "Draft"}
                            </span>
                          </td>
                          <td className="px-4 py-2">{policy.owner}</td>
                          <td className="px-4 py-2">{policy.last_updated}</td>
                          <td className="px-4 py-2">
                            {policy.related_controls && (
                              <div className="flex flex-wrap gap-1">
                                {policy.related_controls.split(',').map((control: string, i: number) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 text-xs">
                                    {control.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
