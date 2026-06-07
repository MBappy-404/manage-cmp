'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { Transaction, Client } from '@/lib/types';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  onToggleStatus?: (transactionId: string) => void;
  clients?: Client[];
}

const statusColors = {
  Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  onToggleStatus,
  clients = [],
}: TransactionTableProps) {
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : `Client #${clientId}`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-lg">Transactions & Invoices</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left font-semibold text-foreground">Invoice #</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Client</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Amount</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Payment Method
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-foreground">
                  {transaction.invoiceNumber}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {getClientName(transaction.clientId)}
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  ${transaction.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {transaction.paymentMethod}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[transaction.status]}>
                    {transaction.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                      <MoreVertical size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye size={16} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(transaction)}>
                          <Edit size={16} className="mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                      )}
                      {transaction.status !== 'Paid' && onToggleStatus && (
                        <DropdownMenuItem onClick={() => onToggleStatus(transaction.id)}>
                          <CheckCircle2 size={16} className="mr-2 text-green-600" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(transaction.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete Invoice
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
