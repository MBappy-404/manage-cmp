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
import { MoreVertical, Users, TrendingUp } from 'lucide-react';
import { Organization } from '@/lib/types';

interface OrganizationCardProps {
  organization: Organization;
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

export function OrganizationCard({ organization, onEdit, onDelete }: OrganizationCardProps) {
  return (
    <Card className="card-hover p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{organization.logo}</div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg">{organization.name}</h3>
            <p className="text-sm text-muted-foreground">{organization.type}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            <MoreVertical size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>👁️ View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(organization)}>✏️ Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(organization.id)} className="text-red-600 focus:text-red-600">🗑️ Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Users size={16} />
            Members
          </p>
          <p className="text-xl font-semibold">{organization.members}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <TrendingUp size={16} />
            Revenue
          </p>
          <p className="text-xl font-semibold">${(organization.revenue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge className={planColors[organization.activePlan]}>
          {organization.activePlan}
        </Badge>
        <Badge className={statusColors[organization.status]}>
          {organization.status}
        </Badge>
      </div>

      {/* Created Date */}
      <p className="text-xs text-muted-foreground">
        Created: {new Date(organization.createdDate).toLocaleDateString()}
      </p>

      {/* Action Button */}
      <Button className="w-full mt-auto">View Organization</Button>
    </Card>
  );
}
