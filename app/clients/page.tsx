'use client';

import { useState } from 'react';
import { Client } from '@/lib/types';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientDetailsModal } from '@/components/clients/ClientDetailsModal';
import { AddClientModal } from '@/components/clients/AddClientModal';
import { EditClientModal } from '@/components/clients/EditClientModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Plus, Search, Download, Users, DollarSign, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { mockClients, mockOrganizations } from '@/lib/mockData';

export default function ClientsPage() {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Get clients for selected organization
  const orgClients = clients.filter(client => client.organizationId === selectedOrgId);

  // Filter clients by search term
  const filteredClients = orgClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected organization name
  const selectedOrg = mockOrganizations.find(org => org.id === selectedOrgId);
  const selectedOrgName = selectedOrg?.name || 'Unknown Organization';

  // Handlers
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setEditModalOpen(true);
  };

  const handleSaveEditClient = (updatedClient: Client) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    setEditModalOpen(false);
    // Sync active client preview
    if (selectedClient && selectedClient.id === updatedClient.id) {
      setSelectedClient(updatedClient);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!clientToDelete) return;

    const clientToRemove = clients.find(c => c.id === clientToDelete);
    setClients(clients.filter(c => c.id !== clientToDelete));
    setDeleteConfirmOpen(false);
    setModalOpen(false);
    setClientToDelete(null);

    if (clientToRemove) {
      toast.success(`${clientToRemove.name} has been deleted successfully`);
    }
  };

  const handleAddClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: String(Math.max(...clients.map(c => parseInt(c.id) || 0), 0) + 1),
    };
    setClients([...clients, newClient]);
  };

  // Calculate stats for selected organization
  const currentOrgClients = clients.filter(client => client.organizationId === selectedOrgId);
  const orgStats = {
    totalClients: currentOrgClients.length,
    totalRevenue: currentOrgClients.reduce((sum, c) => sum + c.totalSpent, 0),
    pendingPayments: currentOrgClients
      .filter(c => c.paymentStatus === 'Pending' || c.paymentStatus === 'Overdue')
      .reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="mt-2 text-muted-foreground">Manage and track clients by organization.</p>
        </div>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus size={18} />
          Add Client
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-6 rounded-2xl border border-border/80 bg-card/50 backdrop-blur-md shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Clients</p>
            <p className="text-3xl font-bold text-foreground mt-0.5">{orgStats.totalClients}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-6 rounded-2xl border border-border/80 bg-card/50 backdrop-blur-md shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold text-foreground mt-0.5">${orgStats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-2xl border border-border/80 bg-card/50 backdrop-blur-md shadow-sm transition-all duration-200 hover:shadow-md col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Payments</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-500 mt-0.5">${orgStats.pendingPayments.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Organization Tabs */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Select Organization</h2>
        <Tabs value={selectedOrgId} onValueChange={setSelectedOrgId} className="w-full">
          <TabsList variant="pills">
            {mockOrganizations.map(org => (
              <TabsTrigger key={org.id} value={org.id} className="text-sm">
                <span className="text-base mr-1">{org.logo}</span>
                <span>{org.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>Filter</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem>All Clients</DropdownMenuItem>
                <DropdownMenuItem>💰 Paid</DropdownMenuItem>
                <DropdownMenuItem>⏳ Pending</DropdownMenuItem>
                <DropdownMenuItem>⚠️ Overdue</DropdownMenuItem>
                <DropdownMenuItem>Premium</DropdownMenuItem>
                <DropdownMenuItem>Standard</DropdownMenuItem>
                <DropdownMenuItem>Basic</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Clients Table */}
      <ClientsTable
        clients={filteredClients}
        onView={handleViewClient}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />



      {/* Client Details Modal */}
      <ClientDetailsModal
        client={selectedClient}
        organizationName={selectedOrgName}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be undone and all associated data will be permanently removed.
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

      {/* Add Client Modal */}
      <AddClientModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAddClient={handleAddClient}
        organizations={mockOrganizations}
      />

      {/* Edit Client Modal */}
      <EditClientModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        client={selectedClient}
        onEditClient={handleSaveEditClient}
        organizations={mockOrganizations}
      />
    </div>
  );
}
