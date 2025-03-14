
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function NewAuditForm({ onSuccess }: { onSuccess?: () => void }) {
  const [auditName, setAuditName] = useState("");
  const [framework, setFramework] = useState("");
  const [auditor, setAuditor] = useState("");
  const [scope, setScope] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 30))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auditName || !framework || !startDate || !endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (endDate && startDate && endDate < startDate) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Audit created",
        description: `Audit "${auditName}" has been successfully created`,
      });
      
      // Reset form or call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="auditName">Audit Name*</Label>
        <Input
          id="auditName"
          value={auditName}
          onChange={(e) => setAuditName(e.target.value)}
          placeholder="e.g. Q2 2023 ISO 27001 Audit"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="framework">Compliance Framework*</Label>
          <Select value={framework} onValueChange={setFramework}>
            <SelectTrigger id="framework">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ISO 27001">ISO 27001</SelectItem>
              <SelectItem value="SOC 2">SOC 2</SelectItem>
              <SelectItem value="PCI DSS">PCI DSS</SelectItem>
              <SelectItem value="HIPAA">HIPAA</SelectItem>
              <SelectItem value="GDPR">GDPR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="auditor">Lead Auditor*</Label>
          <Input
            id="auditor"
            value={auditor}
            onChange={(e) => setAuditor(e.target.value)}
            placeholder="Name of lead auditor"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>End Date*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) =>
                  date < new Date() || (startDate ? date < startDate : false)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="scope">Audit Scope</Label>
        <Input
          id="scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          placeholder="e.g. All cloud infrastructure and application services"
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Audit"}
        </Button>
      </div>
    </form>
  );
}
