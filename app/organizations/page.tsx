'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Organization, POSOrganization } from '@/lib/types';
import { organizationService, CreateOrganizationPayload } from '@/lib/organizationService';

// Library Components
import { OrganizationCard } from '@/components/organizations/OrganizationCard';
import { OrganizationTable } from '@/components/organizations/OrganizationTable';
import { AddOrganizationModal } from '@/components/organizations/AddOrganizationModal';
import { EditOrganizationModal } from '@/components/organizations/EditOrganizationModal';
import { ViewOrganizationModal } from '@/components/organizations/ViewOrganizationModal';

// ERP/POS Components
import { POSOrganizationCard } from '@/components/organizations/POSOrganizationCard';
import { POSOrganizationTable } from '@/components/organizations/POSOrganizationTable';
import { AddPOSOrganizationModal } from '@/components/organizations/AddPOSOrganizationModal';
import { EditPOSOrganizationModal } from '@/components/organizations/EditPOSOrganizationModal';
import { ViewPOSOrganizationModal } from '@/components/organizations/ViewPOSOrganizationModal';

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
import { Plus, Search, LayoutGrid, List, Loader2, Building2, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OrganizationsPage() {
  const [activeTab, setActiveTab] = useState<'library' | 'erp_pos'>('erp_pos');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Library Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  // POS Modals
  const [posAddModalOpen, setPosAddModalOpen] = useState(false);
  const [posEditModalOpen, setPosEditModalOpen] = useState(false);
  const [posViewModalOpen, setPosViewModalOpen] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedPOSOrg, setSelectedPOSOrg] = useState<POSOrganization | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);
  
  const [libraryOrgs, setLibraryOrgs] = useState<Organization[]>([]);
  const [posOrgs, setPOSOrgs] = useState<POSOrganization[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });



  const fetchOrganizations = useCallback(async () => {
    if (activeTab === 'library') {
      try {
        setLoading(true);
        const params: Record<string, string | number> = {
          page: pagination.page,
          pageSize: 10,
        };

        if (searchTerm) {
          params.searchTerm = searchTerm;
        }

        if (filterStatus) {
          params.filter_status = filterStatus;
        }

        const response = await organizationService.getAll(params);

        if (response.status === 'success' || response.success) {
          // Filter to only show organizations that have libraryType or limits.books
          const libraryOnly = response.data.filter(org => org.libraryType !== undefined || org.limits?.books !== undefined);
          setLibraryOrgs(libraryOnly);
          setPagination({
            page: response.metaData?.page || 1,
            totalPages: response.metaData?.totalPages || 1,
            total: libraryOnly.length,
          });
        } else {
          setLibraryOrgs([]);
        }
      } catch (err) {
        console.error('Failed to load library organizations:', err);
        toast.error('Failed to load library organizations');
        setLibraryOrgs([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // ERP/POS real API fetch
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        page: pagination.page,
        pageSize: 10,
      };

      if (searchTerm) {
        params.searchTerm = searchTerm;
      }

      if (filterStatus) {
        params.filter_status = filterStatus;
      }

      const response = await organizationService.getAllPOS(params);

      if (response.status === 'success' || response.success) {
        setPOSOrgs(response.data);
        if (response.metaData) {
          setPagination({
            page: response.metaData.page,
            totalPages: response.metaData.totalPages,
            total: response.metaData.total,
          });
        } else {
          setPagination({
            page: 1,
            totalPages: 1,
            total: response.data?.length || 0,
          });
        }
      } else {
        setPOSOrgs([]);
      }
    } catch (error) {
      console.error('Failed to fetch POS organizations:', error);
      toast.error('Failed to load POS organizations');
      setPOSOrgs([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, searchTerm, filterStatus, activeTab]);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      if (active) {
        fetchOrganizations();
      }
    }, searchTerm ? 300 : 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchTerm, filterStatus, activeTab, pagination.page, fetchOrganizations]);

  // Library Handlers
  const handleAddOrganization = async (orgData: CreateOrganizationPayload) => {
    try {
      const response = await organizationService.create(orgData);
      if (response.status === 'success') {
        toast.success(`${orgData.name} has been created successfully`);
        fetchOrganizations();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create organization';
      toast.error(errorMessage);
    }
  };

  const handleEditOrganization = async (updatedOrg: Organization) => {
    try {
      const response = await organizationService.update(updatedOrg._id, updatedOrg);
      if (response.status === 'success') {
        toast.success(`${updatedOrg.name} has been updated successfully`);
        setEditModalOpen(false);
        fetchOrganizations();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update organization';
      toast.error(errorMessage);
    }
  };

  const startViewOrganization = (org: Organization) => {
    setSelectedOrg(org);
    setViewModalOpen(true);
  };

  const startEditOrganization = (org: Organization) => {
    setSelectedOrg(org);
    setEditModalOpen(true);
  };

  // POS Handlers
  const handleAddPOSOrganization = async (payload: any) => {
    try {
      const response = await organizationService.createPOS(payload);
      if (response.status === 'success' || response.success) {
        toast.success(`${payload.name} has been created successfully`);
        fetchOrganizations();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create POS organization';
      toast.error(errorMessage);
    }
  };

  const handleEditPOSOrganization = async (updatedOrg: POSOrganization) => {
    try {
      const response = await organizationService.updatePOS(updatedOrg._id, updatedOrg);
      if (response.status === 'success' || response.success) {
        toast.success(`${updatedOrg.name} has been updated successfully`);
        setPosEditModalOpen(false);
        fetchOrganizations();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update POS organization';
      toast.error(errorMessage);
    }
  };

  const startViewPOSOrganization = (org: POSOrganization) => {
    setSelectedPOSOrg(org);
    setPosViewModalOpen(true);
  };

  const startEditPOSOrganization = (org: POSOrganization) => {
    setSelectedPOSOrg(org);
    setPosEditModalOpen(true);
  };

  // General Delete
  const startDeleteOrganization = (orgId: string) => {
    setOrgToDelete(orgId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!orgToDelete) return;
    if (activeTab === 'library') {
      // Local delete for mock
      setLibraryOrgs(prev => prev.filter(o => o._id !== orgToDelete));
      toast.success('Organization deleted (local only)');
      setDeleteConfirmOpen(false);
      setOrgToDelete(null);
      return;
    }

    try {
      const response = await organizationService.deletePOS(orgToDelete);
      if (response.status === 'success' || response.success) {
        toast.success('Organization has been deleted successfully');
        fetchOrganizations();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete organization';
      toast.error(errorMessage);
    } finally {
      setDeleteConfirmOpen(false);
      setOrgToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-8 p-6 lg:p-8 min-h-[75vh]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
          <p className="mt-2 text-muted-foreground">Manage all your organizations and teams.</p>
        </div>
        <Button className="gap-2" onClick={() => {
          if (activeTab === 'library') {
            setAddModalOpen(true);
          } else {
            setPosAddModalOpen(true);
          }
        }}>
          <Plus size={18} />
          New Organization
        </Button>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(val) => {
          setActiveTab(val as any);
          setPagination(prev => ({ ...prev, page: 1 }));
        }} 
        className="w-full space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-[280px] !h-10 !bg-muted/70 dark:!bg-muted/30 border border-border/50 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="library" className="gap-2 rounded-lg font-medium text-sm cursor-pointer">
            <Building2 size={15} />
            Library
          </TabsTrigger>
          <TabsTrigger value="erp_pos" className="gap-2 rounded-lg font-medium text-sm cursor-pointer">
            <Receipt size={15} />
            ERP/POS
          </TabsTrigger>
        </TabsList>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-6 mt-0 animate-in fade-in-50 duration-200">
          {/* Filter & Search Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              />
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" />}>
                  Filter: {filterStatus ? (filterStatus === 'active' ? 'Active' : 'Inactive') : 'All'}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => { setFilterStatus(null); setPagination(prev => ({ ...prev, page: 1 })); }}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setFilterStatus('active'); setPagination(prev => ({ ...prev, page: 1 })); }}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setFilterStatus('inactive'); setPagination(prev => ({ ...prev, page: 1 })); }}>Inactive</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon" onClick={() => setViewMode('grid')}>
                <LayoutGrid size={18} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode('table')}>
                <List size={18} />
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading organizations...</p>
            </div>
          ) : (
            <>
              {/* Content */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {libraryOrgs.map((org) => (
                    <OrganizationCard
                      key={org._id}
                      organization={org}
                      onView={startViewOrganization}
                      onEdit={startEditOrganization}
                      onDelete={startDeleteOrganization}
                    />
                  ))}
                </div>
              ) : (
                <OrganizationTable
                  organizations={libraryOrgs}
                  onView={startViewOrganization}
                  onEdit={startEditOrganization}
                  onDelete={startDeleteOrganization}
                />
              )}

              {libraryOrgs.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border py-12">
                  <p className="text-muted-foreground text-lg font-medium">অর্গানাইজেশন ডাটা নেই</p>
                  <Button onClick={() => setAddModalOpen(true)}>Create First Organization</Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* ERP/POS Tab */}
        <TabsContent value="erp_pos" className="space-y-6 mt-0 animate-in fade-in-50 duration-200">
          {/* Filter & Search Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search ERP & POS organizations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              />
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" />}>
                  Filter: {filterStatus ? (filterStatus === 'active' ? 'Active' : 'Inactive') : 'All'}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => { setFilterStatus(null); setPagination(prev => ({ ...prev, page: 1 })); }}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setFilterStatus('active'); setPagination(prev => ({ ...prev, page: 1 })); }}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setFilterStatus('inactive'); setPagination(prev => ({ ...prev, page: 1 })); }}>Inactive</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon" onClick={() => setViewMode('grid')}>
                <LayoutGrid size={18} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode('table')}>
                <List size={18} />
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading ERP & POS organizations...</p>
            </div>
          ) : (
            <>
              {/* Content */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posOrgs.map((org) => (
                    <POSOrganizationCard
                      key={org._id}
                      organization={org}
                      onView={startViewPOSOrganization}
                      onEdit={startEditPOSOrganization}
                      onDelete={startDeleteOrganization}
                    />
                  ))}
                </div>
              ) : (
                <POSOrganizationTable
                  organizations={posOrgs}
                  onView={startViewPOSOrganization}
                  onEdit={startEditPOSOrganization}
                  onDelete={startDeleteOrganization}
                />
              )}

              {posOrgs.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border py-12">
                  <p className="text-muted-foreground text-lg font-medium">অর্গানাইজেশন ডাটা নেই</p>
                  <Button onClick={() => setPosAddModalOpen(true)}>Create First ERP & POS Organization</Button>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {posOrgs.length} of {pagination.total} organizations
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Library Modals */}
      <AddOrganizationModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAddOrganization={handleAddOrganization}
      />

      <EditOrganizationModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        organization={selectedOrg}
        onEditOrganization={handleEditOrganization}
      />

      <ViewOrganizationModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        organization={selectedOrg}
      />

      {/* ERP/POS Modals */}
      <AddPOSOrganizationModal
        open={posAddModalOpen}
        onOpenChange={setPosAddModalOpen}
        onAddOrganization={handleAddPOSOrganization}
      />

      <EditPOSOrganizationModal
        open={posEditModalOpen}
        onOpenChange={setPosEditModalOpen}
        organization={selectedPOSOrg}
        onEditOrganization={handleEditPOSOrganization}
      />

      <ViewPOSOrganizationModal
        open={posViewModalOpen}
        onOpenChange={setPosViewModalOpen}
        organization={selectedPOSOrg}
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
