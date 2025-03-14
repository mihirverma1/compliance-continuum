
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

interface AuditUploadFormProps {
  onSuccess?: () => void;
}

export default function AuditUploadForm({ onSuccess }: AuditUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [audits, setAudits] = useState<any[]>([]);
  
  // Single audit evidence upload state
  const [framework, setFramework] = useState("ISO 27001");
  const [control, setControl] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  
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
  
  const handleEvidenceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setEvidenceFile(selectedFile);
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
          const parsedAudits = parseCSV(csvText);
          setAudits(parsedAudits);
          setUploadSuccess(true);
          
          toast({
            title: "Upload successful",
            description: `${parsedAudits.length} audit records have been uploaded.`,
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
    if (!control || !evidenceFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select an evidence file.",
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
        title: "Evidence uploaded",
        description: `Evidence for ${framework} control ${control} has been uploaded successfully.`,
      });
      
      // Reset form
      setControl("");
      setEvidenceFile(null);
      setNotes("");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    }, 1500);
  };
  
  const downloadSampleTemplate = () => {
    const element = document.createElement("a");
    // Use a specialized template for audit evidence
    const sampleContent = `framework,control,control_name,status,evidence_file,notes
ISO 27001,A.8.1.1,Inventory of Assets,Compliant,asset-inventory-2023.xlsx,"Complete asset inventory verified by IT team"
SOC 2,CC5.2,Security Awareness Training,Non-Compliant,,"Training program under development"
PCI DSS,3.4,Render PAN Unreadable,Compliant,encryption-report-q3.pdf,"All card data properly encrypted"`;
    const file = new Blob([sampleContent], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "audit_evidence_template.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="single">Single Evidence Upload</TabsTrigger>
          <TabsTrigger value="bulk">Bulk CSV Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="framework">Compliance Framework</Label>
                    <Select value={framework} onValueChange={setFramework}>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                        <SelectItem value="SOC 2">SOC 2</SelectItem>
                        <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                        <SelectItem value="HIPAA">HIPAA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="control">Control ID</Label>
                    <Input 
                      id="control" 
                      placeholder="e.g. A.8.1.1 or CC5.2" 
                      value={control}
                      onChange={(e) => setControl(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="evidence"
                      className="hidden"
                      onChange={handleEvidenceFileChange}
                    />
                    <div className="border rounded w-full p-2 flex items-center gap-2">
                      <Label 
                        htmlFor="evidence"
                        className="cursor-pointer bg-primary/10 text-primary px-3 py-1 rounded"
                      >
                        Browse...
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {evidenceFile ? evidenceFile.name : "No file selected"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="w-full p-2 border rounded min-h-[100px]"
                    placeholder="Add any relevant notes about this evidence..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSingleUpload} 
                    disabled={isUploading || !control || !evidenceFile}
                  >
                    {isUploading ? "Uploading..." : "Upload Evidence"}
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
                <h3 className="text-lg font-medium mb-2">Upload Audit Evidence</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Upload a CSV file containing your audit evidence records. Each row should include framework, control, status, and evidence details.
                </p>
                
                <div className="mt-4 flex flex-col items-center gap-4">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="audit-file-upload"
                  />
                  <label
                    htmlFor="audit-file-upload"
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
          
          {uploadSuccess && audits.length > 0 && (
            <Card className="mt-6 animate-slide-up">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Uploaded Audit Evidence</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Framework</th>
                        <th className="px-4 py-2 text-left font-medium">Control</th>
                        <th className="px-4 py-2 text-left font-medium">Status</th>
                        <th className="px-4 py-2 text-left font-medium">Evidence File</th>
                        <th className="px-4 py-2 text-left font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {audits.map((audit, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{audit.framework}</td>
                          <td className="px-4 py-2">{audit.control}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              ${audit.status === "Compliant" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"}`}>
                              {audit.status || "Non-Compliant"}
                            </span>
                          </td>
                          <td className="px-4 py-2">{audit.evidence_file || "—"}</td>
                          <td className="px-4 py-2">{audit.notes || "—"}</td>
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
