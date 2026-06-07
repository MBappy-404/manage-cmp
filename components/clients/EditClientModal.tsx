'use client';

import { useState, useEffect } from 'react';
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

interface EditClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onEditClient: (client: Client) => void;
  organizations: Array<{ id: string; name: string }>;
}

export function EditClientModal({
  open,
  onOpenChange,
  client,
  onEditClient,
  organizations,
}: EditClientModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    organizationId: string;
    package: 'Basic' | 'Standard' | 'Premium';
    companyName: string;
    status: 'Active' | 'Inactive' | 'Suspended';
    paymentStatus: 'Paid' | 'Pending' | 'Overdue';
    notes: string;
  }>({
    name: '',
    email: '',
    phone: '',
    organizationId: '',
    package: 'Basic',
    companyName: '',
    status: 'Active',
    paymentStatus: 'Pending',
    notes: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        organizationId: client.organizationId,
        package: client.package,
        companyName: client.companyName || '',
        status: (client.status as any) || 'Active',
        paymentStatus: client.paymentStatus,
        notes: client.notes || '',
      });
    }
  }, [client, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!client) return;

    if (!formData.name || !formData.email || !formData.organizationId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedClient: Client = {
      ...client,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      organizationId: formData.organizationId,
      package: formData.package as 'Basic' | 'Standard' | 'Premium',
      companyName: formData.companyName,
      status: formData.status as 'Active' | 'Inactive' | 'Suspended',
      paymentStatus: formData.paymentStatus as 'Paid' | 'Pending' | 'Overdue',
      notes: formData.notes,
    };

    onEditClient(updatedClient);
    onOpenChange(false);
    toast.success(`${updatedClient.name} has been updated successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Client Profile</DialogTitle>
          <DialogDescription>
            Update client configuration and subscription metadata.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Client Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-client-name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-client-name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-client-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-client-email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-client-phone">Phone Number</Label>
                <Input
                  id="edit-client-phone"
                  name="phone"
                  placeholder="+1-555-0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-client-company">Company Name</Label>
                <Input
                  id="edit-client-company"
                  name="companyName"
                  placeholder="Company Inc"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Org & Service details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Service Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-client-org">Organization <span className="text-destructive">*</span></Label>
                <Select value={formData.organizationId} onValueChange={(value) => handleSelectChange('organizationId', value)}>
                  <SelectTrigger id="edit-client-org">
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
                <Label htmlFor="edit-client-package">Package</Label>
                <Select value={formData.package} onValueChange={(value) => handleSelectChange('package', value)}>
                  <SelectTrigger id="edit-client-package">
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

          {/* Status & Payments */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Status & Financials</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-client-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger id="edit-client-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-client-payment">Payment Status</Label>
                <Select value={formData.paymentStatus} onValueChange={(value) => handleSelectChange('paymentStatus', value)}>
                  <SelectTrigger id="edit-client-payment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-client-notes">Notes</Label>
            <Input
              id="edit-client-notes"
              name="notes"
              placeholder="Enter client notes..."
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
