'use client';

import { useState } from 'react';
import { Organization } from '@/lib/types';
import { OrganizationCard } from '@/components/organizations/OrganizationCard';
import { OrganizationTable } from '@/components/organizations/OrganizationTable';
import { AddOrganizationModal } from '@/components/organizations/AddOrganizationModal';
import { EditOrganizationModal } from '@/components/organizations/EditOrganizationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, LayoutGrid, List, Download } from 'lucide-react';
import { mockOrganizations } from '@/lib/mockData';
import { toast } from 'sonner';

export default function OrganizationsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType ||
      (filterType === 'Active' && org.status === 'Active') ||
      (filterType === 'Inactive' && org.status === 'Inactive') ||
      (filterType === 'Startup' && org.type === 'Startup') ||
      (filterType === 'Business' && org.type === 'Business') ||
      (filterType === 'Enterprise' && org.type === 'Enterprise');
    return matchesSearch && matchesFilter;
  });

  const handleAddOrganization = (orgData: Omit<Organization, 'id'>) => {
    const newOrg: Organization = {
      ...orgData,
      id: String(Math.max(...organizations.map(o => parseInt(o.id) || 0), 0) + 1),
    };
    setOrganizations([...organizations, newOrg]);
  };

  const handleEditOrganization = (updatedOrg: Organization) => {
    setOrganizations(organizations.map(o => o.id === updatedOrg.id ? updatedOrg : o));
    setEditModalOpen(false);
  };

  const startEditOrganization = (org: Organization) => {
    setSelectedOrg(org);
    setEditModalOpen(true);
  };

  const startDeleteOrganization = (orgId: string) => {
    setOrgToDelete(orgId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!orgToDelete) return;
    const org = organizations.find(o => o.id === orgToDelete);
    setOrganizations(organizations.filter(o => o.id !== orgToDelete));
    setDeleteConfirmOpen(false);
    setOrgToDelete(null);
    if (org) {
      toast.success(`${org.name} has been deleted successfully`);
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
          <p className="mt-2 text-muted-foreground">Manage all your organizations and teams.</p>
        </div>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus size={18} />
          New Organization
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>Filter: {filterType || 'All'}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilterType(null)}>👁️ All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('Active')}>✅ Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('Inactive')}>❌ Inactive</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('Startup')}>🚀 Startup</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('Business')}>💼 Business</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('Enterprise')}>🏢 Enterprise</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" onClick={() => setViewMode('grid')}>
            <LayoutGrid size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode('table')}>
            <List size={18} />
          </Button>

          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              onEdit={startEditOrganization}
              onDelete={startDeleteOrganization}
            />
          ))}
        </div>
      ) : (
        <OrganizationTable
          organizations={filteredOrganizations}
          onEdit={startEditOrganization}
          onDelete={startDeleteOrganization}
        />
      )}

      {filteredOrganizations.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border py-12">
          <p className="text-muted-foreground">No organizations found</p>
          <Button onClick={() => setAddModalOpen(true)}>Create First Organization</Button>
        </div>
      )}

      {/* Add Organization Modal */}
      <AddOrganizationModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAddOrganization={handleAddOrganization}
      />

      {/* Edit Organization Modal */}
      <EditOrganizationModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        organization={selectedOrg}
        onEditOrganization={handleEditOrganization}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this organization? All connected teams, clients, and transaction histories will be lost. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
