'use client';

import { useState, useEffect } from 'react';
import { Transaction, Client, Organization } from '@/lib/types';
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

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onAddTransaction?: (t: Omit<Transaction, 'id'>) => void;
  onEditTransaction?: (t: Transaction) => void;
  clients: Client[];
  organizations: Organization[];
}

export function TransactionModal({
  open,
  onOpenChange,
  transaction,
  onAddTransaction,
  onEditTransaction,
  clients,
  organizations,
}: TransactionModalProps) {
  const [formData, setFormData] = useState<{
    invoiceNumber: string;
    clientId: string;
    organizationId: string;
    amount: string;
    paymentMethod: 'Credit Card' | 'Bank Transfer' | 'PayPal' | 'Check';
    status: 'Paid' | 'Pending' | 'Overdue';
    date: string;
    dueDate: string;
  }>({
    invoiceNumber: '',
    clientId: '',
    organizationId: '',
    amount: '',
    paymentMethod: 'Credit Card',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setFormData({
        invoiceNumber: transaction.invoiceNumber,
        clientId: transaction.clientId,
        organizationId: transaction.organizationId,
        amount: String(transaction.amount),
        paymentMethod: transaction.paymentMethod,
        status: transaction.status,
        date: transaction.date,
        dueDate: transaction.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        clientId: clients[0]?.id || '',
        organizationId: organizations[0]?._id || '',
        amount: '',
        paymentMethod: 'Credit Card',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
  }, [transaction, open, clients, organizations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!formData.clientId || !formData.organizationId) {
      toast.error('Please select a client and organization');
      return;
    }

    if (isEditing && transaction) {
      const updated: Transaction = {
        ...transaction,
        invoiceNumber: formData.invoiceNumber,
        clientId: formData.clientId,
        organizationId: formData.organizationId,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        date: formData.date,
        dueDate: formData.dueDate,
      };
      onEditTransaction?.(updated);
      toast.success(`Transaction ${updated.invoiceNumber} updated successfully`);
    } else {
      const added: Omit<Transaction, 'id'> = {
        invoiceNumber: formData.invoiceNumber,
        clientId: formData.clientId,
        organizationId: formData.organizationId,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        date: formData.date,
        dueDate: formData.dueDate,
      };
      onAddTransaction?.(added);
      toast.success(`Transaction ${added.invoiceNumber} added successfully`);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details for this transaction / invoice.'
              : 'Create a new invoice transaction manually.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Transaction Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-num">Invoice Number</Label>
                <Input
                  id="invoice-num"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="2500"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Client & Org */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org-select">Organization</Label>
              <Select value={formData.organizationId} onValueChange={(value) => handleSelectChange('organizationId', value)}>
                <SelectTrigger id="org-select">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map(org => (
                    <SelectItem key={org._id} value={org._id}>
                      {org.logo} {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-select">Client</Label>
              <Select value={formData.clientId} onValueChange={(value) => handleSelectChange('clientId', value)}>
                <SelectTrigger id="client-select">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients
                    .filter(c => !formData.organizationId || c.organizationId === formData.organizationId)
                    .map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Transaction Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Method & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger id="status">
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

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
