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
import { MoreVertical, Mail, Phone, MapPin, Database, Users, HardDrive } from 'lucide-react';
import { POSOrganization } from '@/lib/types';

interface POSOrganizationCardProps {
  organization: POSOrganization;
  onView?: (org: POSOrganization) => void;
  onEdit?: (org: POSOrganization) => void;
  onDelete?: (orgId: string) => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  trial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  cancelled: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

const planColors: Record<string, string> = {
  trial: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  standard: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  premium: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const planNames: Record<string, string> = {
  trial: 'ট্রায়াল',
  basic: 'বেসিক',
  standard: 'স্ট্যান্ডার্ড',
  premium: 'প্রিমিয়াম',
};

export function POSOrganizationCard({ organization, onView, onEdit, onDelete }: POSOrganizationCardProps) {
  const currentPlan = organization.subscription?.planName || 'trial';
  const limits = organization.limits || { products: 500, users: 2, storageMB: 500 };

  return (
    <Card className="card-hover p-6 flex flex-col gap-4 border border-border bg-card/75">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {organization.logo ? (
            <img
              src={organization.logo}
              alt={organization.name}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl ${organization.logo ? 'hidden' : ''}`}>
            🛍️
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg">{organization.name}</h3>
            {organization.industry && (
              <Badge variant="secondary" className="w-fit text-[10px] py-0.5">
                {organization.industry}
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="cursor-pointer" />}>
            <MoreVertical size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(organization)} className="cursor-pointer">View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(organization)} className="cursor-pointer">Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(organization._id)} className="text-red-600 focus:text-red-600 cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-2 py-4 border-y border-border">
        {organization.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail size={16} />
            <span className="truncate">{organization.email}</span>
          </div>
        )}
        {organization.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone size={16} />
            <span>{organization.phone}</span>
          </div>
        )}
        {organization.address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span className="truncate">{organization.address}</span>
          </div>
        )}
      </div>

      {/* Limits */}
      <div className="grid grid-cols-3 gap-2 py-3 border-b border-border">
        <div className="flex flex-col items-center gap-1">
          <Database size={14} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">প্রোডাক্টস</span>
          <span className="text-xs font-semibold">
            {limits.products === -1 ? 'অসীমিত' : limits.products || 0}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Users size={14} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">ইউজার</span>
          <span className="text-xs font-semibold">
            {limits.users === -1 ? 'অসীমিত' : limits.users || 0}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <HardDrive size={14} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">স্টোরেজ</span>
          <span className="text-xs font-semibold">
            {limits.storageMB === -1 ? 'অসীমিত' : `${limits.storageMB || 0} MB`}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge className={statusColors[organization.subscription?.status || 'trial']}>
          {organization.subscription?.status || 'Trial'}
        </Badge>
        <Badge className={planColors[currentPlan]}>
          {planNames[currentPlan] || currentPlan}
        </Badge>
        {organization.subscription?.amount && organization.subscription.amount > 0 && (
          <Badge variant="outline">৳{organization.subscription.amount.toLocaleString()}/বছর</Badge>
        )}
      </div>

      {/* Created Date */}
      <p className="text-xs text-muted-foreground">
        Created: {organization.createdAt ? new Date(organization.createdAt).toLocaleDateString() : '-'}
      </p>

      <Button className="w-full mt-auto cursor-pointer" onClick={() => onView?.(organization)}>
        View Details
      </Button>
    </Card>
  );
}
