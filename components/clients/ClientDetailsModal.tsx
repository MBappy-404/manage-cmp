'use client';

import { Client } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Edit, Trash2, Mail, Phone, Building, Calendar, Package, Users, Activity } from 'lucide-react';

interface ClientDetailsModalProps {
  client: Client | null;
  organizationName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
}

export function ClientDetailsModal({
  client,
  organizationName,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ClientDetailsModalProps) {
  if (!client) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pr-0">
          <div className="flex-1">
            <DialogTitle className="text-2xl font-bold">{client.name}</DialogTitle>
          </div>
          <DialogClose render={<button className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status and Contact Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge className={`w-fit ${getStatusColor(client.status || 'Active')}`}>
                {client.status || 'Active'}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
              <Badge className={`w-fit ${getPaymentStatusColor(client.paymentStatus)}`}>
                {client.paymentStatus}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity & Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-1 flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium break-all">{client.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1 flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{client.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-1 flex items-start gap-3">
                    <Building className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Organization</p>
                      <p className="text-sm font-medium">{organizationName}</p>
                    </div>
                  </div>
                  <div className="space-y-1 flex items-start gap-3">
                    <Building className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="text-sm font-medium">{client.companyName || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Service Information</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Package</label>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <Badge variant="secondary">{client.package}</Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Total Products</label>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{client.totalProducts || 0}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Total Customers</label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{client.totalCustomers || 0}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Renewal Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {new Date(client.renewalDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Financial Information</h3>
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Total Spent</label>
                    <p className="text-2xl font-bold text-primary">
                      ${client.totalSpent?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Payment Status</label>
                    <Badge className={`w-fit ${getPaymentStatusColor(client.paymentStatus)}`}>
                      {client.paymentStatus}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Avg. Monthly Spend</label>
                    <p className="text-2xl font-bold text-primary">
                      ${Math.round((client.totalSpent || 0) / 12).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Timeline</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Join Date</label>
                    <p className="text-sm font-medium">
                      {client.joinDate ? new Date(client.joinDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Last Activity</label>
                    <p className="text-sm font-medium">
                      {client.lastActivity ? new Date(client.lastActivity).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              {/* Activity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </h3>
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Last activity recorded</p>
                      <p className="text-xs text-muted-foreground">
                        {client.lastActivity ? new Date(client.lastActivity).toLocaleDateString() : 'No activity'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Active customer</p>
                      <p className="text-xs text-muted-foreground">Status: {client.status || 'Active'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Notes & Comments</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {client.notes || 'No notes added yet'}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="default"
              onClick={() => {
                onEdit?.(client);
                onOpenChange(false);
              }}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.(client.id);
                onOpenChange(false);
              }}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
