
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Calendar, 
  Globe, 
  HardDrive, 
  LockKeyhole, 
  LogOut, 
  Mail, 
  Save, 
  UserCircle, 
  Webhook,
  Shield,
  Database,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  // General system settings
  const [systemName, setSystemName] = useState("ComplianceCore GRC Platform");
  const [companyName, setCompanyName] = useState("Example Corporation");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  
  // Security settings
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    expireAfterDays: 90,
    preventReuse: 5
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    securityAlerts: true,
    complianceReminders: true,
    auditNotifications: true,
    riskAlerts: true,
    weeklyDigest: true
  });
  
  // Integration settings
  const [integrations, setIntegrations] = useState([
    { id: "slack", name: "Slack", connected: true, status: "connected" },
    { id: "jira", name: "Jira", connected: false, status: "disconnected" },
    { id: "azure", name: "Azure AD", connected: true, status: "connected" },
    { id: "aws", name: "AWS", connected: false, status: "disconnected" },
    { id: "github", name: "GitHub", connected: true, status: "connected" }
  ]);
  
  // Backup settings
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: 30,
    backupLocation: "cloud",
    lastBackup: "2023-10-12 03:00 AM"
  });

  // Handle form submission
  const handleSaveSettings = (section) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`
    });
  };
  
  // Toggle integration connection
  const toggleIntegration = (id) => {
    const updatedIntegrations = integrations.map(integration => 
      integration.id === id
        ? { 
            ...integration, 
            connected: !integration.connected, 
            status: integration.connected ? "disconnected" : "connected" 
          }
        : integration
    );
    
    setIntegrations(updatedIntegrations);
    
    const targetIntegration = integrations.find(integration => integration.id === id);
    const newStatus = targetIntegration.connected ? "disconnected" : "connected";
    
    toast({
      title: `Integration ${newStatus}`,
      description: `${targetIntegration.name} has been ${newStatus} successfully.`
    });
  };

  return (
    <MainLayout>
      <div className="animate-slide-up">
        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
            Configuration
          </span>
          <h1 className="text-3xl font-semibold">System Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your GRC platform settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-5 gap-4 max-w-4xl">
            <TabsTrigger value="general">
              <Globe className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Webhook className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="backup">
              <Database className="h-4 w-4 mr-2" />
              Backup & Logs
            </TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="system-name" className="text-right">System Name</Label>
                    <Input 
                      id="system-name" 
                      value={systemName} 
                      onChange={(e) => setSystemName(e.target.value)} 
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company-name" className="text-right">Company Name</Label>
                    <Input 
                      id="company-name" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                      className="col-span-3"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="timezone" className="text-right">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date-format" className="text-right">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="MMM DD, YYYY">MMM DD, YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("General")}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure password policies and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password Policy</h3>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="min-length" className="text-right">Minimum Length</Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input 
                        id="min-length" 
                        type="number" 
                        min="6" 
                        max="24"
                        value={passwordPolicy.minLength} 
                        onChange={(e) => setPasswordPolicy({...passwordPolicy, minLength: parseInt(e.target.value)})} 
                        className="w-20"
                      />
                      <span className="text-muted-foreground">characters</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Requirements</Label>
                    <div className="col-span-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={passwordPolicy.requireUppercase} 
                          onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireUppercase: checked})}
                          id="req-uppercase"
                        />
                        <Label htmlFor="req-uppercase">Require uppercase letters</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={passwordPolicy.requireLowercase} 
                          onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireLowercase: checked})}
                          id="req-lowercase"
                        />
                        <Label htmlFor="req-lowercase">Require lowercase letters</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={passwordPolicy.requireNumbers} 
                          onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireNumbers: checked})}
                          id="req-numbers"
                        />
                        <Label htmlFor="req-numbers">Require numbers</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={passwordPolicy.requireSpecial} 
                          onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireSpecial: checked})}
                          id="req-special"
                        />
                        <Label htmlFor="req-special">Require special characters</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expire-days" className="text-right">Password Expiry</Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input 
                        id="expire-days" 
                        type="number" 
                        min="30" 
                        max="365"
                        value={passwordPolicy.expireAfterDays} 
                        onChange={(e) => setPasswordPolicy({...passwordPolicy, expireAfterDays: parseInt(e.target.value)})} 
                        className="w-20"
                      />
                      <span className="text-muted-foreground">days</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="prevent-reuse" className="text-right">Prevent Password Reuse</Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input 
                        id="prevent-reuse" 
                        type="number" 
                        min="0" 
                        max="24"
                        value={passwordPolicy.preventReuse} 
                        onChange={(e) => setPasswordPolicy({...passwordPolicy, preventReuse: parseInt(e.target.value)})} 
                        className="w-20"
                      />
                      <span className="text-muted-foreground">previous passwords</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Session Settings</h3>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-timeout" className="text-right">Session Timeout</Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Select defaultValue="30">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">of inactivity</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Force Logout</Label>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked id="force-logout" />
                        <Label htmlFor="force-logout">Force logout after password change</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("Security")}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Email Notifications</Label>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={notificationSettings.emailNotifications} 
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                          id="email-notifications"
                        />
                        <Label htmlFor="email-notifications">Enable email notifications</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                          <Label htmlFor="security-alerts" className="font-medium">Security Alerts</Label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Notifications about security incidents and alerts
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.securityAlerts} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, securityAlerts: checked})}
                        id="security-alerts"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                          <Label htmlFor="compliance-reminders" className="font-medium">Compliance Reminders</Label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Upcoming compliance deadlines and tasks
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.complianceReminders} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, complianceReminders: checked})}
                        id="compliance-reminders"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-purple-500 mr-2" />
                          <Label htmlFor="audit-notifications" className="font-medium">Audit Notifications</Label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Updates about audits and assessment activities
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.auditNotifications} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, auditNotifications: checked})}
                        id="audit-notifications"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                          <Label htmlFor="risk-alerts" className="font-medium">Risk Alerts</Label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Notifications about new or changed risks
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.riskAlerts} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, riskAlerts: checked})}
                        id="risk-alerts"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Weekly Digest</Label>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={notificationSettings.weeklyDigest} 
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyDigest: checked})}
                          id="weekly-digest"
                        />
                        <Label htmlFor="weekly-digest">Receive weekly compliance and risk summary</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("Notification")}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Integration Settings */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Manage integrations with external services and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {integrations.map(integration => (
                    <div key={integration.id} className="flex items-center justify-between border rounded-md p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                          integration.connected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {integration.id === "slack" && <Webhook className="h-5 w-5" />}
                          {integration.id === "jira" && <HardDrive className="h-5 w-5" />}
                          {integration.id === "azure" && <UserCircle className="h-5 w-5" />}
                          {integration.id === "aws" && <Cloud className="h-5 w-5" />}
                          {integration.id === "github" && <Code className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-medium">{integration.name}</h4>
                          <Badge 
                            variant={integration.connected ? "default" : "secondary"}
                            className={integration.connected ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                          >
                            {integration.status}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant={integration.connected ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleIntegration(integration.id)}
                      >
                        {integration.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("Integration")}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Backup Settings */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Data Retention</CardTitle>
                <CardDescription>
                  Configure system backup, logs, and data retention policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Automatic Backup</Label>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={backupSettings.autoBackup} 
                          onCheckedChange={(checked) => setBackupSettings({...backupSettings, autoBackup: checked})}
                          id="auto-backup"
                        />
                        <Label htmlFor="auto-backup">Enable automatic system backups</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="backup-frequency" className="text-right">Backup Frequency</Label>
                    <Select 
                      value={backupSettings.backupFrequency} 
                      onValueChange={(value) => setBackupSettings({...backupSettings, backupFrequency: value})}
                      disabled={!backupSettings.autoBackup}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="retention-period" className="text-right">Retention Period</Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input 
                        id="retention-period" 
                        type="number" 
                        min="7" 
                        max="365"
                        value={backupSettings.retentionPeriod} 
                        onChange={(e) => setBackupSettings({...backupSettings, retentionPeriod: parseInt(e.target.value)})} 
                        className="w-20"
                        disabled={!backupSettings.autoBackup}
                      />
                      <span className="text-muted-foreground">days</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="backup-location" className="text-right">Backup Location</Label>
                    <Select 
                      value={backupSettings.backupLocation} 
                      onValueChange={(value) => setBackupSettings({...backupSettings, backupLocation: value})}
                      disabled={!backupSettings.autoBackup}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="cloud">Cloud Storage</SelectItem>
                        <SelectItem value="both">Both Local & Cloud</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Backup Status</h3>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Last Backup</Label>
                    <div className="col-span-3">
                      <p className="text-muted-foreground">{backupSettings.lastBackup}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div></div>
                    <div className="col-span-3">
                      <Button variant="outline">
                        Backup Now
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">System Logs</h3>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="log-level" className="text-right">Log Level</Label>
                    <Select defaultValue="info">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="log-retention" className="text-right">Log Retention</Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Select defaultValue="90">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div></div>
                    <div className="col-span-3 space-x-2">
                      <Button variant="outline">
                        Download Logs
                      </Button>
                      <Button variant="outline">
                        Clear Logs
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("Backup")}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// Missing Cloud and Code components for icons
const Cloud = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

const Code = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
