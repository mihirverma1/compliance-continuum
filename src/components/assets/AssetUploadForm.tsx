import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Upload, Database, FileText } from "lucide-react";
import { parseCSV } from "@/lib/csvUtils";
import { useToast } from "@/hooks/use-toast";
import { importAssets } from "@/services/assetService";

interface AssetUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (assets: any[]) => void;
}

const AssetUploadForm = ({ isOpen, onClose, onUpload }: AssetUploadFormProps) => {
  const [uploadMethod, setUploadMethod] = useState<"csv" | "backend">("csv");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      source: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCSVUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const parsedAssets = parseCSV(text);
      
      const assetsToImport = parsedAssets.map(asset => ({
        name: asset.name,
        type: asset.type,
        location: asset.location,
        department: asset.department || 'Unknown',
        compliance_status: asset.complianceStatus,
        criticality: asset.criticality || 'Medium'
      }));
      
      await importAssets(assetsToImport);
      
      onUpload(parsedAssets);
      setFile(null);
      
      toast({
        title: "Assets imported successfully",
        description: `${parsedAssets.length} assets added to the database`,
      });
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast({
        title: "Error uploading file",
        description: "There was an error processing your CSV file. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackendImport = () => {
    setIsLoading(true);
    const source = form.getValues("source");
    
    setTimeout(async () => {
      const mockAssets = [
        { name: "Backend API Server", type: "Server", location: "AWS", department: "UPI", compliance_status: "Compliant", criticality: "High" },
        { name: "Analytics Service", type: "Application", location: "GCP", department: "Rupay", compliance_status: "Review Needed", criticality: "Medium" },
        { name: "User Database", type: "Database", location: "Azure", department: "ATM", compliance_status: "Compliant", criticality: "High" },
      ];
      
      try {
        await importAssets(mockAssets);
        
        onUpload(mockAssets.map(asset => ({
          ...asset,
          id: `be-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          complianceStatus: asset.compliance_status,
          lastUpdated: new Date().toISOString().split('T')[0]
        })));
        
        toast({
          title: "Backend import successful",
          description: `${mockAssets.length} assets imported from backend`,
        });
      } catch (error) {
        console.error("Error importing from backend:", error);
        toast({
          title: "Import failed",
          description: "There was an error importing assets from the backend",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        form.reset();
      }
    }, 1500);
  };

  const handleSubmit = () => {
    if (uploadMethod === "csv") {
      handleCSVUpload();
    } else {
      handleBackendImport();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Assets</DialogTitle>
          <DialogDescription>
            Import assets from a CSV file or connect to a backend data source
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="csv" 
          className="w-full" 
          onValueChange={(value) => setUploadMethod(value as "csv" | "backend")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
            <TabsTrigger value="backend">Backend Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="mt-4 space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-2">
              <FileText className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Drag and drop your CSV file or click to browse</p>
              <Input 
                type="file" 
                accept=".csv" 
                className="mt-2"
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm font-medium">{file.name}</p>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              <p>CSV format should have these columns:</p>
              <p><code>name,type,location,department,complianceStatus</code></p>
            </div>
          </TabsContent>
          
          <TabsContent value="backend" className="mt-4">
            <Form {...form}>
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backend Source</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter data source identifier" {...field} />
                    </FormControl>
                    <FormDescription>
                      Connect to a backend data source to import assets
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-row justify-between gap-3 sm:justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                {uploadMethod === "csv" ? "Upload" : "Import"}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssetUploadForm;
