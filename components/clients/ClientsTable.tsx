'use client';

import { Client } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';

interface ClientsTableProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export function ClientsTable({ clients, onView, onEdit, onDelete }: ClientsTableProps) {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPackageColor = (pkg: string) => {
    switch (pkg) {
      case 'Basic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Standard':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Premium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (clients.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No clients found for this organization</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left font-semibold text-foreground">Client Name</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Phone</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Package</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Payment Status</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Total Spent</th>
              <th className="px-6 py-4 text-right font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-border transition-colors hover:bg-muted/50"
              >
                <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{client.email}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{client.phone}</td>
                <td className="px-6 py-4">
                  <Badge className={`w-fit ${getPackageColor(client.package)}`}>
                    {client.package}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={`w-fit ${getPaymentStatusColor(client.paymentStatus)}`}>
                    {client.paymentStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  ${client.totalSpent?.toLocaleString() || '0'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(client)}
                      title="View details"
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button size="sm" variant="ghost" className="h-8 w-8 p-0" />}>
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => onEdit(client)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(client.id)}
                            className="gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
