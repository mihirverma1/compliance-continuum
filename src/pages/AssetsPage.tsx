
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AssetUploadForm from "@/components/assets/AssetUploadForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Filter, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for assets with added department field
const mockAssets = [
  { id: "a1", name: "Web Server", type: "Server", location: "AWS", department: "UPI", complianceStatus: "Compliant", criticality: "High", lastUpdated: "2023-10-01" },
  { id: "a2", name: "Customer Database", type: "Database", location: "Azure", department: "ATM", complianceStatus: "Non-Compliant", criticality: "Critical", lastUpdated: "2023-09-15" },
  { id: "a3", name: "Mobile App Backend", type: "Application", location: "GCP", department: "Rupay", complianceStatus: "Review Needed", criticality: "Medium", lastUpdated: "2023-10-10" },
  { id: "a4", name: "HR System", type: "Application", location: "On-Premise", department: "Nursing Ward", complianceStatus: "Compliant", criticality: "High", lastUpdated: "2023-08-22" },
  { id: "a5", name: "Storage Server", type: "Server", location: "AWS", department: "UPI", complianceStatus: "Compliant", criticality: "Low", lastUpdated: "2023-09-30" },
];

// Departments list
const departments = ["UPI", "ATM", "Rupay", "Nursing Ward", "Network", "Security", "Operations"];

export default function AssetsPage() {
  const [assets, setAssets] = useState(mockAssets);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    type: "",
    location: "",
    department: "",
    complianceStatus: "",
    criticality: ""
  });
  const { toast } = useToast();

  const handleNewAssets = (newAssets) => {
    setAssets([...assets, ...newAssets]);
    setIsUploadDialogOpen(false);
    toast({
      title: "Assets Uploaded",
      description: `Successfully added ${newAssets.length} new assets`,
    });
  };

  const handleEditAsset = (asset) => {
    setCurrentAsset(asset);
    setEditFormData({
      name: asset.name,
      type: asset.type,
      location: asset.location,
      department: asset.department,
      complianceStatus: asset.complianceStatus,
      criticality: asset.criticality
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedAssets = assets.map(asset => 
      asset.id === currentAsset.id 
        ? { ...asset, ...editFormData, lastUpdated: new Date().toISOString().split('T')[0] } 
        : asset
    );
    setAssets(updatedAssets);
    setIsEditDialogOpen(false);
    toast({
      title: "Asset Updated",
      description: `Successfully updated ${editFormData.name}`,
    });
  };

  const renderAssetTable = (filteredAssets) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Criticality</TableHead>
          <TableHead>Compliance Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAssets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell className="font-medium">{asset.name}</TableCell>
            <TableCell>{asset.type}</TableCell>
            <TableCell>{asset.location}</TableCell>
            <TableCell>{asset.department}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                asset.criticality === "Critical" 
                  ? "bg-red-100 text-red-800" 
                  : asset.criticality === "High"
                    ? "bg-orange-100 text-orange-800"
                    : asset.criticality === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
              }`}>
                {asset.criticality}
              </span>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                asset.complianceStatus === "Compliant" 
                  ? "bg-green-100 text-green-800" 
                  : asset.complianceStatus === "Non-Compliant"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}>
                {asset.complianceStatus}
              </span>
            </TableCell>
            <TableCell>{asset.lastUpdated}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => handleEditAsset(asset)}>
                <Edit className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <MainLayout>
      <div className="animate-slide-up">
        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
            Asset Management
          </span>
          <h1 className="text-3xl font-semibold">Asset Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your IT assets and their compliance status
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Assets
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="databases">Databases</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Asset Inventory</CardTitle>
                <CardDescription>
                  View and manage all your IT assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderAssetTable(assets)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Servers</CardTitle>
                <CardDescription>All server assets</CardDescription>
              </CardHeader>
              <CardContent>
                {renderAssetTable(assets.filter(a => a.type === "Server"))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>All application assets</CardDescription>
              </CardHeader>
              <CardContent>
                {renderAssetTable(assets.filter(a => a.type === "Application"))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="databases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Databases</CardTitle>
                <CardDescription>All database assets</CardDescription>
              </CardHeader>
              <CardContent>
                {renderAssetTable(assets.filter(a => a.type === "Database"))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AssetUploadForm 
          isOpen={isUploadDialogOpen} 
          onClose={() => setIsUploadDialogOpen(false)}
          onUpload={handleNewAssets}
        />

        {/* Edit Asset Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Asset</DialogTitle>
              <DialogDescription>
                Update asset details and compliance status
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  value={editFormData.name} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">Department</Label>
                <Select 
                  value={editFormData.department} 
                  onValueChange={(value) => setEditFormData({...editFormData, department: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="compliance" className="text-right">Compliance Status</Label>
                <Select 
                  value={editFormData.complianceStatus} 
                  onValueChange={(value) => setEditFormData({...editFormData, complianceStatus: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Compliant">Compliant</SelectItem>
                    <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                    <SelectItem value="Review Needed">Review Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="criticality" className="text-right">Criticality</Label>
                <Select 
                  value={editFormData.criticality} 
                  onValueChange={(value) => setEditFormData({...editFormData, criticality: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select criticality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
