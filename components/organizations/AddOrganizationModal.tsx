'use client';

import { useState } from 'react';
import { Organization } from '@/lib/types';
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

interface AddOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddOrganization: (org: Omit<Organization, 'id'>) => void;
}

export function AddOrganizationModal({
  open,
  onOpenChange,
  onAddOrganization,
}: AddOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    logo: '🏢',
    type: 'Business' as const,
    activePlan: 'Professional' as const,
    membersCount: '0',
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

    if (!formData.name) {
      toast.error('Organization name is required');
      return;
    }

    const newOrganization: Omit<Organization, 'id'> = {
      name: formData.name,
      logo: formData.logo,
      type: formData.type as 'Individual' | 'Business' | 'Startup' | 'Enterprise',
      members: parseInt(formData.membersCount) || 0,
      activePlan: formData.activePlan as 'Starter' | 'Professional' | 'Enterprise',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      revenue: 0,
    };

    onAddOrganization(newOrganization);
    setFormData({
      name: '',
      logo: '🏢',
      type: 'Business',
      activePlan: 'Professional',
      membersCount: '0',
    });
    onOpenChange(false);
    toast.success(`${newOrganization.name} has been created successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-full">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Set up a new organization. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Organization Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">
                  Organization Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Acme Corporation"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo/Emoji</Label>
                <Input
                  id="logo"
                  name="logo"
                  placeholder="🏢"
                  value={formData.logo}
                  onChange={handleInputChange}
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Startup">Startup</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Plan & Members */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Subscription & Team</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select value={formData.activePlan} onValueChange={(value) => handleSelectChange('activePlan', value)}>
                  <SelectTrigger id="plan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="members">Team Members</Label>
                <Input
                  id="members"
                  name="membersCount"
                  type="number"
                  placeholder="5"
                  value={formData.membersCount}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Organization
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
