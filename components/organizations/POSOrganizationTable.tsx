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
import { POSOrganization } from '@/lib/types';

interface POSOrganizationTableProps {
  organizations: POSOrganization[];
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

export function POSOrganizationTable({ organizations, onView, onEdit, onDelete }: POSOrganizationTableProps) {
  return (
    <Card className="overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left font-semibold text-foreground">সংগঠন / ইন্ডাস্ট্রি</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">ইমেইল ও ফোন</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">প্ল্যান ও মূল্য</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">লিমিটস</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">স্ট্যাটাস</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">তৈরি হয়েছে</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => {
              const limits = org.limits || { products: 500, users: 2, storageMB: 500 };
              return (
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
                        🛍️
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{org.name}</span>
                        {org.industry && (
                          <p className="text-[10px] text-muted-foreground">{org.industry}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    <div>{org.email || '-'}</div>
                    <div className="mt-0.5">{org.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={planColors[org.subscription?.planName || 'trial']}>
                      {planNames[org.subscription?.planName || 'trial'] || org.subscription?.planName}
                    </Badge>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      ৳{org.subscription?.amount?.toLocaleString() || 0}/বছর
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    <div>প্রোডাক্টস: {limits.products === -1 ? 'অসীমিত' : limits.products}</div>
                    <div>ইউজার্স: {limits.users === -1 ? 'অসীমিত' : limits.users}</div>
                    <div>স্টোরেজ: {limits.storageMB === -1 ? 'অসীমিত' : `${limits.storageMB} MB`}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[org.subscription?.status || 'trial']}>
                      {org.subscription?.status || 'trial'}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
