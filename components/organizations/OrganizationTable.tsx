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
import { MoreVertical } from 'lucide-react';
import { Organization } from '@/lib/types';

interface OrganizationTableProps {
  organizations: Organization[];
  onEdit?: (org: Organization) => void;
  onDelete?: (orgId: string) => void;
}

const planColors = {
  Starter: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Professional: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Enterprise: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const statusColors = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  Suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function OrganizationTable({ organizations, onEdit, onDelete }: OrganizationTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Type</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Members</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Plan</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Revenue</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Created</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr
                key={org.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{org.logo}</span>
                    <span className="font-medium text-foreground">{org.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{org.type}</td>
                <td className="px-6 py-4 text-muted-foreground">{org.members}</td>
                <td className="px-6 py-4">
                  <Badge className={planColors[org.activePlan]}>
                    {org.activePlan}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[org.status]}>
                    {org.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  ${(org.revenue / 1000).toFixed(0)}k
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(org.createdDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                      <MoreVertical size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>👁️ View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(org)}>✏️ Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete?.(org.id)} className="text-red-600 focus:text-red-600">🗑️ Delete</DropdownMenuItem>
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
