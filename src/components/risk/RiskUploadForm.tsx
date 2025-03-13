
import React, { useState } from "react";
import { Upload, FileType, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isValidCSVFile, parseCSV, getSampleRiskTemplate } from "@/lib/csvUtils";
import { RiskItem } from "./RiskRegister";

interface RiskUploadFormProps {
  onUploadSuccess?: (risks: RiskItem[]) => void;
}

export default function RiskUploadForm({ onUploadSuccess }: RiskUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const { toast } = useToast();
  
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
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Read the file content
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        if (csvText) {
          const parsedData = parseCSV(csvText);
          
          // Transform the parsed data into RiskItem format
          const parsedRisks: RiskItem[] = parsedData.map((item, index) => ({
            id: item.id || `risk-${Date.now()}-${index}`,
            riskType: item.riskType || "External",
            name: item.title || item.name || "Unnamed Risk",
            description: item.description || "",
            rating: item.rating || "Medium",
            compensatoryControl: item.compensatoryControl || "",
            owner: item.owner || "Not Assigned",
            criticality: (item.criticality as any) || "Medium",
            impact: Number(item.impact) || 2,
            likelihood: Number(item.likelihood) || 1,
            vulnerabilityScore: Number(item.vulnerabilityScore) || Number(item.impact) * Number(item.likelihood) || 2,
            assetValue: Number(item.assetValue) || 2,
            threatValue: Number(item.threatValue) || 2,
            status: (item.status as any) || "Active",
            dueDate: item.dueDate || "",
            lastUpdated: item.lastUpdated || new Date().toISOString().split('T')[0]
          }));
          
          setRisks(parsedRisks);
          setUploadSuccess(true);
          
          if (onUploadSuccess) {
            onUploadSuccess(parsedRisks);
          }
          
          toast({
            title: "Upload successful",
            description: `${parsedRisks.length} risks have been uploaded.`,
          });
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
  
  const downloadSampleTemplate = () => {
    const element = document.createElement("a");
    const sampleContent = getSampleRiskTemplate();
    const file = new Blob([sampleContent], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "risk_template.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Risk Data</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Upload a CSV file containing your risk register with fields like risk type, name, description, 
              impact, likelihood, controls, and more.
            </p>
            
            <div className="mt-4 flex flex-col items-center gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="risk-file-upload"
              />
              <label
                htmlFor="risk-file-upload"
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
                className="text-xs"
              >
                Download Sample Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {uploadSuccess && risks.length > 0 && (
        <Card className="animate-slide-up">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Uploaded Risks</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Risk Type</th>
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">Criticality</th>
                    <th className="px-4 py-2 text-left font-medium">Impact</th>
                    <th className="px-4 py-2 text-left font-medium">Likelihood</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {risks.map((risk, index) => (
                    <tr key={risk.id || index}>
                      <td className="px-4 py-2">{risk.riskType}</td>
                      <td className="px-4 py-2">{risk.name}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${risk.criticality === "Critical" 
                            ? "bg-red-100 text-red-800" 
                            : risk.criticality === "High" 
                            ? "bg-orange-100 text-orange-800"
                            : risk.criticality === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"}`}>
                          {risk.criticality}
                        </span>
                      </td>
                      <td className="px-4 py-2">{risk.impact}</td>
                      <td className="px-4 py-2">{risk.likelihood}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${risk.status === "Active" 
                            ? "bg-blue-100 text-blue-800" 
                            : risk.status === "Mitigated" 
                            ? "bg-green-100 text-green-800"
                            : risk.status === "Accepted"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"}`}>
                          {risk.status}
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
