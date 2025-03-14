
import React, { useState, useEffect } from "react";
import { Upload, FileType, Check, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isValidCSVFile, parseCSV } from "@/lib/csvUtils";
import { frameworks } from "@/components/dashboard/ComplianceStatusCard";

// Sample controls per framework for the select dropdown
const frameworkControls = {
  iso27001: [
    { id: "A.5.1.1", name: "Policies for information security" },
    { id: "A.5.1.2", name: "Review of policies for information security" },
    { id: "A.6.1.1", name: "Information security roles and responsibilities" },
    { id: "A.6.1.2", name: "Segregation of duties" },
    { id: "A.6.1.3", name: "Contact with authorities" },
    { id: "A.9.1.1", name: "Access control policy" },
    { id: "A.9.1.2", name: "Access to networks and network services" },
    { id: "A.9.2.1", name: "User registration and de-registration" },
    { id: "A.9.2.2", name: "User access provisioning" },
    { id: "A.9.2.3", name: "Management of privileged access rights" },
    { id: "A.9.2.4", name: "Management of secret authentication information" },
    { id: "A.9.2.5", name: "Review of user access rights" },
    { id: "A.9.2.6", name: "Removal or adjustment of access rights" },
    { id: "A.10.1.1", name: "Policy on the use of cryptographic controls" },
    { id: "A.10.1.2", name: "Key management" },
    { id: "A.11.1.1", name: "Physical security perimeter" },
    { id: "A.11.1.2", name: "Physical entry controls" },
    { id: "A.11.2.1", name: "Equipment siting and protection" },
  ],
  pcidss: [
    { id: "1.1", name: "Install and maintain a firewall configuration" },
    { id: "1.2", name: "Do not use vendor-supplied defaults" },
    { id: "1.3", name: "Protect stored cardholder data" },
    { id: "1.4", name: "Encrypt transmission of cardholder data" },
    { id: "3.1", name: "Keep cardholder data storage to a minimum" },
    { id: "3.2", name: "Do not store sensitive authentication data" },
    { id: "3.3", name: "Mask PAN when displayed" },
    { id: "3.4", name: "Render PAN unreadable anywhere it is stored" },
    { id: "3.5", name: "Protect cryptographic keys" },
    { id: "3.6", name: "Document and implement key management processes" },
  ],
  hipaa: [
    { id: "164.308(a)(1)(i)", name: "Security Management Process" },
    { id: "164.308(a)(2)", name: "Assigned Security Responsibility" },
    { id: "164.308(a)(3)(i)", name: "Workforce Security" },
    { id: "164.308(a)(4)(i)", name: "Information Access Management" },
    { id: "164.308(a)(5)(i)", name: "Security Awareness and Training" },
    { id: "164.310(a)(1)", name: "Facility Access Controls" },
    { id: "164.310(b)", name: "Workstation Use" },
    { id: "164.310(c)", name: "Workstation Security" },
    { id: "164.310(d)(1)", name: "Device and Media Controls" },
    { id: "164.312(a)(1)", name: "Access Control" },
    { id: "164.312(b)", name: "Audit Controls" },
    { id: "164.312(c)(1)", name: "Integrity" },
    { id: "164.312(d)", name: "Person or Entity Authentication" },
    { id: "164.312(e)(1)", name: "Transmission Security" },
  ],
  soc2: [
    { id: "CC1.1", name: "COSO Principle 1" },
    { id: "CC1.2", name: "COSO Principle 2" },
    { id: "CC1.3", name: "COSO Principle 3" },
    { id: "CC1.4", name: "COSO Principle 4" },
    { id: "CC1.5", name: "COSO Principle 5" },
    { id: "CC2.1", name: "Communication and Information" },
    { id: "CC2.2", name: "Board Oversight" },
    { id: "CC2.3", name: "Risk Management" },
    { id: "A1.1", name: "Availability Objectives" },
    { id: "A1.2", name: "Availability Requirements" },
    { id: "A1.3", name: "Environmental Protections" },
    { id: "PI1.1", name: "Processing Objectives" },
    { id: "PI1.2", name: "Processing Procedures" },
    { id: "PI1.3", name: "Processing Monitoring" },
    { id: "PI1.4", name: "Processing Outputs" },
    { id: "PI1.5", name: "Processing Documentation" },
  ]
};

export default function ComplianceUploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [evidences, setEvidences] = useState<any[]>([]);
  const [selectedFramework, setSelectedFramework] = useState("iso27001");
  const [selectedControl, setSelectedControl] = useState("");
  const [availableControls, setAvailableControls] = useState(frameworkControls.iso27001);
  
  useEffect(() => {
    // Update available controls when framework changes
    setAvailableControls(frameworkControls[selectedFramework as keyof typeof frameworkControls] || []);
    setSelectedControl(""); // Reset selected control
  }, [selectedFramework]);
  
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
        const controlInfo = selectedControl ? 
          availableControls.find(c => c.id === selectedControl) : 
          { id: "A.9.2.3", name: "Management of privileged access rights" };
          
        setEvidences([{
          id: `evidence-${Date.now()}`,
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          uploadDate: new Date().toISOString().split('T')[0],
          framework: selectedFramework,
          control: controlInfo?.id || "Unknown",
          controlName: controlInfo?.name || "Unknown",
          status: "Pending Review"
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
  
  const downloadSampleTemplate = () => {
    const element = document.createElement("a");
    const sampleContent = `framework,control,control_name,status,evidence_file,notes
ISO 27001,A.5.1.1,Policies for information security,Compliant,policies-v1.2.pdf,"Complete security policies document"
SOC 2,CC1.1,COSO Principle 1,Non-Compliant,,"Documentation pending"
PCI DSS,1.1,Install and maintain a firewall configuration,Compliant,firewall-config.pdf,"Firewall rules documented"`;
    const file = new Blob([sampleContent], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "compliance_evidence_template.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
                  <Select value={selectedControl} onValueChange={setSelectedControl}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select control" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {availableControls.map((control) => (
                        <SelectItem key={control.id} value={control.id}>
                          {control.id} - {control.name}
                        </SelectItem>
                      ))}
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
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadSampleTemplate}
                      className="mt-3 text-xs"
                    >
                      Download Sample Template
                    </Button>
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
                    <th className="px-4 py-2 text-left font-medium">File Name</th>
                    <th className="px-4 py-2 text-left font-medium">Control ID</th>
                    <th className="px-4 py-2 text-left font-medium">Control Name</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {evidences.map((evidence, index) => (
                    <tr key={evidence.id || index}>
                      <td className="px-4 py-2">{evidence.name}</td>
                      <td className="px-4 py-2">{evidence.control || "N/A"}</td>
                      <td className="px-4 py-2">{evidence.controlName || "N/A"}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${evidence.status === "Compliant" 
                            ? "bg-green-100 text-green-800" 
                            : evidence.status === "Non-Compliant" 
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
