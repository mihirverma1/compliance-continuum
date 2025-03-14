import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Lock, ShieldCheck, UserPlus, CheckIcon, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Initial user data
const initialUsers = [
  { id: 1, name: "Miko Admin", email: "miko@example.com", role: "admin", department: "IT Security", status: "active", lastLogin: "2023-10-15 09:45" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "auditor", department: "Compliance", status: "active", lastLogin: "2023-10-14 14:30" },
  { id: 3, name: "John Doe", email: "john@example.com", role: "user", department: "UPI", status: "active", lastLogin: "2023-10-13 11:20" },
  { id: 4, name: "Alice Johnson", email: "alice@example.com", role: "user", department: "ATM", status: "inactive", lastLogin: "2023-09-30 08:15" },
  { id: 5, name: "Bob Wilson", email: "bob@example.com", role: "user", department: "Rupay", status: "active", lastLogin: "2023-10-12 16:45" },
];

// Initial role data
const initialRoles = [
  { id: 1, name: "admin", description: "Full system access", permissions: ["read:all", "write:all", "delete:all", "manage:users"] },
  { id: 2, name: "auditor", description: "Can view all data but not modify", permissions: ["read:all", "read:audit-logs"] },
  { id: 3, name: "user", description: "Limited access to assigned departments", permissions: ["read:own", "write:own"] },
];

// Available permissions
const availablePermissions = [
  { id: "read:all", description: "Read all data" },
  { id: "write:all", description: "Write all data" },
  { id: "delete:all", description: "Delete all data" },
  { id: "manage:users", description: "Manage users" },
  { id: "read:audit-logs", description: "View audit logs" },
  { id: "read:own", description: "Read own department data" },
  { id: "write:own", description: "Edit own department data" },
];

// Departments
const departments = ["IT Security", "Compliance", "UPI", "ATM", "Rupay", "Nursing Ward", "Operations"];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [activeTab, setActiveTab] = useState("users");
  
  // User management state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    department: "",
    password: "",
    confirmPassword: ""
  });
  
  // Role management state
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: []
  });

  // Handle adding a new user
  const handleAddUser = () => {
    if (
      !newUser.name || 
      !newUser.email || 
      !newUser.role || 
      !newUser.department || 
      !newUser.password
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    const addedUser = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: "active",
      lastLogin: "-"
    };
    
    setUsers([...users, addedUser]);
    setIsAddUserOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "user",
      department: "",
      password: "",
      confirmPassword: ""
    });
    
    toast({
      title: "User Added",
      description: `User ${addedUser.name} has been added successfully`
    });
  };

  // Handle editing a user
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      password: "",
      confirmPassword: ""
    });
    setIsEditUserOpen(true);
  };

  // Handle saving edited user
  const handleSaveUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (newUser.password && newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    const updatedUsers = users.map(user => 
      user.id === currentUser.id
        ? { 
            ...user, 
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            department: newUser.department,
          }
        : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    
    toast({
      title: "User Updated",
      description: `User ${newUser.name} has been updated successfully`
    });
  };

  // Handle toggling user status
  const handleToggleUserStatus = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    );
    
    setUsers(updatedUsers);
    
    const targetUser = users.find(user => user.id === userId);
    const newStatus = targetUser.status === "active" ? "inactive" : "active";
    
    toast({
      title: "Status Updated",
      description: `User ${targetUser.name} is now ${newStatus}`
    });
  };

  // Handle adding a new role
  const handleAddRole = () => {
    if (!newRole.name || !newRole.description || newRole.permissions.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one permission",
        variant: "destructive"
      });
      return;
    }
    
    const addedRole = {
      id: roles.length + 1,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions
    };
    
    setRoles([...roles, addedRole]);
    setIsAddRoleOpen(false);
    setNewRole({
      name: "",
      description: "",
      permissions: []
    });
    
    toast({
      title: "Role Added",
      description: `Role ${addedRole.name} has been added successfully`
    });
  };

  // Handle editing a role
  const handleEditRole = (role) => {
    setCurrentRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsEditRoleOpen(true);
  };

  // Handle saving edited role
  const handleSaveRole = () => {
    if (!newRole.name || !newRole.description || newRole.permissions.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one permission",
        variant: "destructive"
      });
      return;
    }
    
    const updatedRoles = roles.map(role => 
      role.id === currentRole.id
        ? { 
            ...role, 
            name: newRole.name,
            description: newRole.description,
            permissions: newRole.permissions
          }
        : role
    );
    
    setRoles(updatedRoles);
    setIsEditRoleOpen(false);
    
    toast({
      title: "Role Updated",
      description: `Role ${newRole.name} has been updated successfully`
    });
  };

  // Toggle permission in role
  const togglePermission = (permissionId) => {
    if (newRole.permissions.includes(permissionId)) {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter(id => id !== permissionId)
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permissionId]
      });
    }
  };

  return (
    <MainLayout>
      <div className="animate-slide-up">
        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
            Access Control
          </span>
          <h1 className="text-3xl font-semibold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and permissions for your GRC platform
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">User Accounts</h2>
              <Button onClick={() => setIsAddUserOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "active" ? "secondary" : "outline"}
                            className={user.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === "active" ? <X className="h-4 w-4 text-red-500" /> : <CheckIcon className="h-4 w-4 text-green-500" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Add User Dialog */}
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with appropriate role and permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Full Name</Label>
                    <Input 
                      id="name" 
                      value={newUser.name} 
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newUser.email} 
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">Role</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value) => setNewUser({...newUser, role: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name} - {role.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">Department</Label>
                    <Select 
                      value={newUser.department} 
                      onValueChange={(value) => setNewUser({...newUser, department: value})}
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
                    <Label htmlFor="password" className="text-right">Password</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={newUser.password} 
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confirmPassword" className="text-right">Confirm</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={newUser.confirmPassword} 
                      onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Edit User Dialog */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>
                    Update user details and access settings
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">Full Name</Label>
                    <Input 
                      id="edit-name" 
                      value={newUser.name} 
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">Email</Label>
                    <Input 
                      id="edit-email" 
                      type="email"
                      value={newUser.email} 
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role" className="text-right">Role</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value) => setNewUser({...newUser, role: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name} - {role.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-department" className="text-right">Department</Label>
                    <Select 
                      value={newUser.department} 
                      onValueChange={(value) => setNewUser({...newUser, department: value})}
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
                    <Label htmlFor="edit-password" className="text-right">
                      New Password (optional)
                    </Label>
                    <Input 
                      id="edit-password" 
                      type="password"
                      value={newUser.password} 
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  {newUser.password && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-confirmPassword" className="text-right">Confirm</Label>
                      <Input 
                        id="edit-confirmPassword" 
                        type="password"
                        value={newUser.confirmPassword} 
                        onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveUser}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Roles & Permissions</h2>
              <Button onClick={() => setIsAddRoleOpen(true)}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.map(perm => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {users.filter(user => user.role === role.name).length}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditRole(role)}
                            disabled={role.name === "admin" || role.name === "user"}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Add Role Dialog */}
            <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Role</DialogTitle>
                  <DialogDescription>
                    Create a new role with specific permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role-name" className="text-right">Role Name</Label>
                    <Input 
                      id="role-name" 
                      value={newRole.name} 
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role-description" className="text-right">Description</Label>
                    <Input 
                      id="role-description" 
                      value={newRole.description} 
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <Label className="text-right pt-2">Permissions</Label>
                    <div className="col-span-3 border rounded-md p-3 space-y-2">
                      {availablePermissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={permission.id}
                            checked={newRole.permissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={permission.id} className="cursor-pointer">
                            <span className="font-medium">{permission.id}</span> - {permission.description}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddRole}>Add Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Edit Role Dialog */}
            <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Role</DialogTitle>
                  <DialogDescription>
                    Update role details and permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role-name" className="text-right">Role Name</Label>
                    <Input 
                      id="edit-role-name" 
                      value={newRole.name} 
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role-description" className="text-right">Description</Label>
                    <Input 
                      id="edit-role-description" 
                      value={newRole.description} 
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <Label className="text-right pt-2">Permissions</Label>
                    <div className="col-span-3 border rounded-md p-3 space-y-2">
                      {availablePermissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`edit-${permission.id}`}
                            checked={newRole.permissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`edit-${permission.id}`} className="cursor-pointer">
                            <span className="font-medium">{permission.id}</span> - {permission.description}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveRole}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
