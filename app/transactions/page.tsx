'use client';

import { TransactionTable } from '@/components/income/TransactionTable';
import { TransactionModal } from '@/components/income/TransactionModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { Plus, Search, Download, Filter } from 'lucide-react';
import { mockTransactions, mockClients, mockOrganizations } from '@/lib/mockData';
import { Transaction } from '@/lib/types';
import { useState } from 'react';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || transaction.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: String(Math.max(...transactions.map(t => parseInt(t.id) || 0), 0) + 1),
    };
    setTransactions([newTx, ...transactions]);
  };

  const handleEditTransaction = (updatedTx: Transaction) => {
    setTransactions(transactions.map(t => t.id === updatedTx.id ? updatedTx : t));
    setEditModalOpen(false);
  };

  const startEditTransaction = (tx: Transaction) => {
    setSelectedTx(tx);
    setEditModalOpen(true);
  };

  const startDeleteTransaction = (id: string) => {
    setTxToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!txToDelete) return;
    const tx = transactions.find(t => t.id === txToDelete);
    setTransactions(transactions.filter(t => t.id !== txToDelete));
    setDeleteConfirmOpen(false);
    setTxToDelete(null);
    if (tx) {
      toast.success(`Transaction ${tx.invoiceNumber} has been deleted successfully`);
    }
  };

  const handleToggleStatus = (id: string) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status: 'Paid' } : t));
    toast.success('Invoice marked as paid successfully');
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="mt-2 text-muted-foreground">View and manage all your transactions and invoices.</p>
        </div>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus size={18} />
          New Transaction
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="gap-2" />}>
              <Filter size={18} />
              Status: {filterStatus || 'All'}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Paid')}>💰 Paid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Pending')}>⏳ Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Overdue')}>⚠️ Overdue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onEdit={startEditTransaction}
        onDelete={startDeleteTransaction}
        onToggleStatus={handleToggleStatus}
        clients={mockClients}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 border-t border-border">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
          <p className="text-3xl font-bold text-foreground">{filteredTransactions.length}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
          <p className="text-3xl font-bold text-foreground">
            ${filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
          <p className="text-3xl font-bold text-green-600">
            ${filteredTransactions
              .filter(t => t.status === 'Paid')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
          <p className="text-3xl font-bold text-red-600">
            ${filteredTransactions
              .filter(t => t.status !== 'Paid')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Create Transaction Modal */}
      <TransactionModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        transaction={null}
        onAddTransaction={handleAddTransaction}
        clients={mockClients}
        organizations={mockOrganizations}
      />

      {/* Edit Transaction Modal */}
      <TransactionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        transaction={selectedTx}
        onEditTransaction={handleEditTransaction}
        clients={mockClients}
        organizations={mockOrganizations}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction invoice? This action will permanently remove all payment ledger history associated with this entry.
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
