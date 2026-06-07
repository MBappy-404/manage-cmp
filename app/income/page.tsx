'use client';

import { IncomeOverviewCards } from '@/components/income/IncomeOverviewCards';
import { IncomeCharts } from '@/components/income/IncomeCharts';
import { TransactionTable } from '@/components/income/TransactionTable';
import { TransactionModal } from '@/components/income/TransactionModal';
import { Button } from '@/components/ui/button';
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
import { Plus, Download, Filter } from 'lucide-react';
import { mockChartData, mockIncomeDistribution, mockTransactions, mockClients, mockOrganizations } from '@/lib/mockData';
import { Transaction } from '@/lib/types';
import { useState } from 'react';
import { toast } from 'sonner';

export default function IncomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);

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

  // Recalculate metrics based on current state
  const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);
  const paidIncome = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const pendingIncome = transactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);
  const overdueIncome = transactions.filter(t => t.status === 'Overdue').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Income Management</h1>
          <p className="mt-2 text-muted-foreground">Track your revenue, invoices, and payments.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Export
          </Button>
          <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
            <Plus size={18} />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Income Overview Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Income Overview</h2>
        <IncomeOverviewCards
          todayIncome={12450}
          monthlyIncome={paidIncome}
          yearlyIncome={totalIncome}
          pendingPayments={pendingIncome + overdueIncome}
        />
      </div>

      {/* Charts */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="gap-2" />}>
              <Filter size={18} />
              Period
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 Days</DropdownMenuItem>
              <DropdownMenuItem>Last Year</DropdownMenuItem>
              <DropdownMenuItem>Custom Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <IncomeCharts revenueData={mockChartData} distributionData={mockIncomeDistribution} />
      </div>

      {/* Transactions Table */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">All Transactions</h2>
        <TransactionTable
          transactions={transactions}
          onEdit={startEditTransaction}
          onDelete={startDeleteTransaction}
          onToggleStatus={handleToggleStatus}
          clients={mockClients}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 border-t border-border">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Total Income</p>
          <p className="text-2xl font-bold text-foreground">
            ${totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold text-green-600">
            ${paidIncome.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            ${pendingIncome.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold text-red-600">
            ${overdueIncome.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <TransactionModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        transaction={null}
        onAddTransaction={handleAddTransaction}
        clients={mockClients}
        organizations={mockOrganizations}
      />

      {/* Edit Invoice Modal */}
      <TransactionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        transaction={selectedTx}
        onEditTransaction={handleEditTransaction}
        clients={mockClients}
        organizations={mockOrganizations}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice transaction? This action will permanently delete all history associated with it.
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
