'use client';

import { useState, useEffect } from 'react';
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

interface EditOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
  onEditOrganization: (org: Organization) => void;
}

export function EditOrganizationModal({
  open,
  onOpenChange,
  organization,
  onEditOrganization,
}: EditOrganizationModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    logo: string;
    type: 'Individual' | 'Business' | 'Startup' | 'Enterprise';
    activePlan: 'Starter' | 'Professional' | 'Enterprise';
    membersCount: string;
    status: 'Active' | 'Inactive' | 'Suspended';
  }>({
    name: '',
    logo: '🏢',
    type: 'Business',
    activePlan: 'Professional',
    membersCount: '0',
    status: 'Active',
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        logo: organization.logo || '🏢',
        type: organization.type,
        activePlan: organization.activePlan,
        membersCount: String(organization.members),
        status: organization.status,
      });
    }
  }, [organization, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!organization) return;

    if (!formData.name) {
      toast.error('Organization name is required');
      return;
    }

    const updatedOrganization: Organization = {
      ...organization,
      name: formData.name,
      logo: formData.logo,
      type: formData.type as 'Individual' | 'Business' | 'Startup' | 'Enterprise',
      members: parseInt(formData.membersCount) || 0,
      activePlan: formData.activePlan as 'Starter' | 'Professional' | 'Enterprise',
      status: formData.status as 'Active' | 'Inactive' | 'Suspended',
    };

    onEditOrganization(updatedOrganization);
    onOpenChange(false);
    toast.success(`${updatedOrganization.name} has been updated successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-full">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Modify the organization configuration and subscription details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Organization Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-name">
                  Organization Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Acme Corporation"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-logo">Logo/Emoji</Label>
                <Input
                  id="edit-logo"
                  name="logo"
                  placeholder="🏢"
                  value={formData.logo}
                  onChange={handleInputChange}
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger id="edit-type">
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

          {/* Plan & Members & Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Subscription & Status</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plan</Label>
                <Select value={formData.activePlan} onValueChange={(value) => handleSelectChange('activePlan', value)}>
                  <SelectTrigger id="edit-plan">
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
                <Label htmlFor="edit-members">Team Members</Label>
                <Input
                  id="edit-members"
                  name="membersCount"
                  type="number"
                  placeholder="5"
                  value={formData.membersCount}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
