'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Organization } from '@/lib/types';

interface OrganizationTableProps {
  organizations: Organization[];
  onView?: (org: Organization) => void;
  onEdit?: (org: Organization) => void;
  onDelete?: (orgId: string) => void;
}

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const planColors = {
  starter: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  professional: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  premium: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const planNames = {
  starter: 'স্টার্টার',
  professional: 'প্রফেশনাল',
  premium: 'প্রিমিয়াম',
};

export function OrganizationTable({ organizations, onView, onEdit, onDelete }: OrganizationTableProps) {
  return (
    <Card className="overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Plan</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Limits</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Created</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr
                key={org._id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="w-8 h-8 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-8 h-8 rounded bg-muted flex items-center justify-center text-lg ${org.logo ? 'hidden' : ''}`}>
                      🏢
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{org.name}</span>
                      <p className="text-xs text-muted-foreground">/{org.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{org.email}</td>
                <td className="px-6 py-4">
                  <Badge className={planColors[org.subscription?.planName || 'starter']}>
                    {planNames[org.subscription?.planName || 'starter']}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    ৳{org.subscription?.amount?.toLocaleString() || 0}/বছর
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">
                  <div>{org.limits?.books === -1 ? 'অসীমিত বই' : `${org.limits?.books || 0} বই`}</div>
                  <div>{org.limits?.members === -1 ? 'অসীমিত সদস্য' : `${org.limits?.members || 0} সদস্য`}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[org.status]}>
                    {org.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border/30"
                      />
                    }>
                      <MoreVertical size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onView?.(org)} className="cursor-pointer gap-2">
                        <Eye size={16} className="text-muted-foreground" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(org)} className="cursor-pointer gap-2">
                        <Edit size={16} className="text-muted-foreground" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete?.(org._id)}
                        className="cursor-pointer gap-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </DropdownMenuItem>
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
