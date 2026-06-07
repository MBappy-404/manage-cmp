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
import { MoreVertical, Mail, Phone } from 'lucide-react';
import { Client } from '@/lib/types';

interface ClientCardsProps {
  clients: Client[];
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
}

const packageColors = {
  Basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Standard: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Premium: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const statusColors = {
  Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function ClientCards({ clients, onView, onEdit, onDelete }: ClientCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <Card key={client.id} className="card-hover p-6 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-lg">{client.name}</h3>
              <p className="text-sm text-muted-foreground">Client ID: {client.id}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                <MoreVertical size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(client)}>👁️ View Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(client)}>✏️ Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(client.id)} className="text-red-600 focus:text-red-600">🗑️ Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-2 py-3 border-y border-border">
            <a
              href={`mailto:${client.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={16} />
              {client.email}
            </a>
            <a
              href={`tel:${client.phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone size={16} />
              {client.phone}
            </a>
          </div>

          {/* Package & Status */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge className={packageColors[client.package]}>
                {client.package}
              </Badge>
              <Badge className={statusColors[client.paymentStatus]}>
                {client.paymentStatus}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Total Spent</p>
              <p className="text-lg font-semibold">
                ${client.totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Renewal Info */}
          <div className="flex flex-col gap-1 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Renewal Date</p>
            <p className="text-sm font-medium">
              {new Date(client.renewalDate).toLocaleDateString()}
            </p>
          </div>

          {/* Action Button */}
          <Button className="w-full mt-auto" onClick={() => onView?.(client)}>View Details</Button>
        </Card>
      ))}
    </div>
  );
}
