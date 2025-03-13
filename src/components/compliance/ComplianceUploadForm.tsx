
import React, { useState } from "react";
import { Upload, FileType, Check, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isValidCSVFile, parseCSV } from "@/lib/csvUtils";

export default function ComplianceUploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [evidences, setEvidences] = useState<any[]>([]);
  const [selectedFramework, setSelectedFramework] = useState("iso27001");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Accept various document formats
      const acceptedTypes = [
        "text/csv", 
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png"
      ];
      
      if (acceptedTypes.includes(selectedFile.type) || 
          selectedFile.name.endsWith('.csv') || 
          selectedFile.name.endsWith('.pdf') ||
          selectedFile.name.endsWith('.docx') ||
          selectedFile.name.endsWith('.xlsx') ||
          selectedFile.name.endsWith('.jpg') ||
          selectedFile.name.endsWith('.png')) {
        setFile(selectedFile);
        setUploadSuccess(false);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a supported file format (CSV, PDF, DOCX, XLSX, JPG, PNG)",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // For CSV files, we'll parse them. For other file types, we'd normally upload to a server
      if (isValidCSVFile(file)) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const csvText = event.target?.result as string;
          if (csvText) {
            const parsedEvidences = parseCSV(csvText);
            setEvidences(parsedEvidences);
          }
        };
        
        reader.readAsText(file);
      } else {
        // For non-CSV files, we'd normally upload to a server
        // Here we'll just simulate a successful upload
        setEvidences([{
          id: `evidence-${Date.now()}`,
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          uploadDate: new Date().toISOString().split('T')[0],
          framework: selectedFramework,
          control: "A.9.2.3",
          status: "Accepted"
        }]);
      }
      
      setUploadSuccess(true);
      
      toast({
        title: "Upload successful",
        description: "Your evidence has been uploaded successfully.",
      });
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
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="single">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="single">Upload Single Evidence</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Compliance Framework</label>
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso27001">ISO 27001</SelectItem>
                      <SelectItem value="pcidss">PCI DSS</SelectItem>
                      <SelectItem value="hipaa">HIPAA</SelectItem>
                      <SelectItem value="soc2">SOC 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Control ID</label>
                  <Select defaultValue="a923">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select control" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a923">A.9.2.3 - Management of privileged access rights</SelectItem>
                      <SelectItem value="a924">A.9.2.4 - Management of secret authentication information</SelectItem>
                      <SelectItem value="a925">A.9.2.5 - Review of user access rights</SelectItem>
                      <SelectItem value="a926">A.9.2.6 - Removal or adjustment of access rights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-4">
                  <Upload className="h-8 w-8 text-gray-400 mb-3" />
                  <h3 className="text-base font-medium mb-2">Upload Evidence Document</h3>
                  <p className="text-xs text-muted-foreground mb-4 max-w-md">
                    Upload evidence documents in PDF, DOCX, XLSX, JPG, or PNG format
                  </p>
                  
                  <div className="mt-2 flex flex-col items-center gap-3">
                    <input
                      type="file"
                      accept=".csv,.pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="compliance-file-upload"
                    />
                    <label
                      htmlFor="compliance-file-upload"
                      className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Select File
                    </label>
                    
                    {file && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileType className="h-4 w-4" />
                        <span>{file.name}</span>
                        {!uploadSuccess && (
                          <Button
                            size="sm"
                            onClick={handleUpload}
                            disabled={isUploading}
                          >
                            {isUploading ? "Uploading..." : "Upload"}
                          </Button>
                        )}
                        {uploadSuccess && <Check className="h-4 w-4 text-green-500" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bulk" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Compliance Framework</label>
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso27001">ISO 27001</SelectItem>
                      <SelectItem value="pcidss">PCI DSS</SelectItem>
                      <SelectItem value="hipaa">HIPAA</SelectItem>
                      <SelectItem value="soc2">SOC 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-4">
                  <Upload className="h-8 w-8 text-gray-400 mb-3" />
                  <h3 className="text-base font-medium mb-2">Bulk Upload Evidence</h3>
                  <p className="text-xs text-muted-foreground mb-4 max-w-md">
                    Upload a CSV file with evidence metadata and individual evidence files
                  </p>
                  
                  <div className="mt-2 flex flex-col items-center gap-3">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="compliance-bulk-upload"
                    />
                    <label
                      htmlFor="compliance-bulk-upload"
                      className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Select CSV Metadata File
                    </label>
                    
                    {file && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileType className="h-4 w-4" />
                        <span>{file.name}</span>
                        {!uploadSuccess && (
                          <Button
                            size="sm"
                            onClick={handleUpload}
                            disabled={isUploading}
                          >
                            {isUploading ? "Uploading..." : "Upload"}
                          </Button>
                        )}
                        {uploadSuccess && <Check className="h-4 w-4 text-green-500" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {uploadSuccess && evidences.length > 0 && (
        <Card className="animate-slide-up">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Uploaded Evidence</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">Control</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {evidences.map((evidence, index) => (
                    <tr key={evidence.id || index}>
                      <td className="px-4 py-2">{evidence.name}</td>
                      <td className="px-4 py-2">{evidence.type || "-"}</td>
                      <td className="px-4 py-2">{evidence.control || "A.9.2.3"}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${evidence.status === "Accepted" 
                            ? "bg-green-100 text-green-800" 
                            : evidence.status === "Rejected" 
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"}`}>
                          {evidence.status || "Pending Review"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
