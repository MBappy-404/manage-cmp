'use client';

import { useState } from 'react';
import { Client } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClient: (client: Omit<Client, 'id'>) => void;
  organizations: Array<{ id: string; name: string }>;
}

export function AddClientModal({
  open,
  onOpenChange,
  onAddClient,
  organizations,
}: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organizationId: '',
    package: 'Basic' as const,
    companyName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.organizationId) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create new client
    const newClient: Omit<Client, 'id'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      organizationId: formData.organizationId,
      package: formData.package,
      paymentStatus: 'Pending',
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalSpent: 0,
      totalProducts: 0,
      status: 'Active',
      lastActivity: new Date().toISOString().split('T')[0],
      totalCustomers: 0,
      notes: '',
      companyName: formData.companyName,
      joinDate: new Date().toISOString().split('T')[0],
    };

    onAddClient(newClient);
    setFormData({
      name: '',
      email: '',
      phone: '',
      organizationId: '',
      package: 'Basic',
      companyName: '',
    });
    onOpenChange(false);
    toast.success(`${newClient.name} has been added successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-full">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client profile. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Client Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1-555-0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Company Inc"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Organization & Package */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Service Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="org">
                  Organization <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.organizationId} onValueChange={(value) => handleSelectChange('organizationId', value)}>
                  <SelectTrigger id="org">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="package">Package</Label>
                <Select value={formData.package} onValueChange={(value) => handleSelectChange('package', value as any)}>
                  <SelectTrigger id="package">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <span>Add Client</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
