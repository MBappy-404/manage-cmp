'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { POSOrganization } from '@/lib/types';
import {
  Database,
  Users,
  HardDrive,
  Mail,
  Phone,
  MapPin,
  Shield,
  DollarSign,
  Info,
  Layers,
  Settings2
} from 'lucide-react';

interface ViewPOSOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: POSOrganization | null;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  inactive: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900',
  trial: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-900',
  expired: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
  cancelled: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900',
};

const planColors: Record<string, string> = {
  trial: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-900',
  basic: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
  standard: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900',
  premium: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
};

const planNames: Record<string, string> = {
  trial: 'ট্রায়াল (Trial)',
  basic: 'বেসিক (Basic)',
  standard: 'স্ট্যান্ডার্ড (Standard)',
  premium: 'প্রিমিয়াম (Premium)',
};

export function ViewPOSOrganizationModal({
  open,
  onOpenChange,
  organization,
}: ViewPOSOrganizationModalProps) {
  if (!organization) return null;

  const formatLimit = (val?: number) => (val === -1 || val === undefined) ? 'অসীমিত' : String(val);
  const limits = organization.limits || { products: 500, users: 2, storageMB: 500 };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-w-full p-0 overflow-hidden max-h-[90vh] flex flex-col border border-border shadow-2xl bg-card/95 backdrop-blur-md">
        
        {/* Banner Section */}
        <div className="relative h-44 w-full bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Logo overlapping banner */}
          <div className="absolute -bottom-8 left-6 flex items-end gap-4">
            <div className="h-20 w-20 rounded-2xl border-4 border-background bg-background shadow-lg overflow-hidden flex items-center justify-center">
              {organization.logo ? (
                <img
                  src={organization.logo}
                  alt={organization.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-muted flex items-center justify-center text-3xl ${organization.logo ? 'hidden' : ''}`}>
                🛍️
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 right-6 flex gap-2">
            <Badge className={`${statusColors[organization.subscription?.status || 'trial']} px-3 py-1 font-medium border text-xs`}>
              {organization.subscription?.status || 'trial'}
            </Badge>
            <Badge className={`${planColors[organization.subscription?.planName || 'trial']} px-3 py-1 font-medium border text-xs`}>
              {planNames[organization.subscription?.planName || 'trial'] || organization.subscription?.planName}
            </Badge>
          </div>
        </div>

        {/* Header & Meta */}
        <div className="pt-10 px-6 pb-4 border-b border-border bg-card/40 text-sm">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{organization.name}</h2>
            {organization.industry && (
              <Badge variant="secondary" className="mt-1">
                {organization.industry}
              </Badge>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column - Basic Info Card */}
            <div className="md:col-span-1 space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
                <h3 className="font-semibold text-foreground border-b border-border/60 pb-2 flex items-center gap-2">
                  <Info size={16} className="text-primary" />
                  সংক্ষিপ্ত তথ্য
                </h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground block">ব্যবসার ধরন (Industry)</span>
                    <span className="font-medium text-foreground flex items-center gap-1.5 mt-1">
                      <Layers size={14} className="text-muted-foreground" />
                      {organization.industry || 'জেনারেল (General)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Main Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Limits Cards */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  সীমা ও রিসোর্স কোটা
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <Database size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">প্রোডাক্টস সীমা</span>
                      <span className="text-sm font-bold text-foreground">
                        {formatLimit(limits.products)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                      <Users size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">ইউজার সীমা</span>
                      <span className="text-sm font-bold text-foreground">
                        {formatLimit(limits.users)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400">
                      <HardDrive size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">স্টোরেজ সীমা</span>
                      <span className="text-sm font-bold text-foreground">
                        {limits.storageMB === -1 ? 'অসীমিত' : `${limits.storageMB} MB`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2 text-xs text-muted-foreground">
                  🛍️ যোগাযোগ
                </h4>
                <div className="space-y-2">
                  {organization.email && (
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Mail size={15} className="shrink-0 text-primary" />
                      <span className="truncate">{organization.email}</span>
                    </div>
                  )}
                  {organization.phone && (
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Phone size={15} className="shrink-0 text-primary" />
                      <span>{organization.phone}</span>
                    </div>
                  )}
                  {organization.address && (
                    <div className="flex items-start gap-2.5 text-muted-foreground">
                      <MapPin size={15} className="shrink-0 mt-0.5 text-primary" />
                      <span className="line-clamp-2">{organization.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing and Subscription Config */}
              <div className="p-4 rounded-xl border border-border bg-muted/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <DollarSign size={13} />
                    সাবস্ক্রিপশন মূল্য
                  </h4>
                  <p className="text-base font-bold text-foreground">
                    ৳{organization.subscription?.amount?.toLocaleString() || 0} / বছর
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    রিনিউয়াল: {organization.subscription?.autoRenew ? 'স্বয়ংক্রিয় নবীকরণ সচল' : 'ম্যানুয়াল নবীকরণ'}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Settings2 size={13} />
                    অ্যাপ কনফিগারেশন
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>মুদ্রা (Currency): <span className="font-semibold text-foreground">{organization.settings?.currency || 'BDT'}</span></div>
                    <div>টাইমজোন: <span className="font-semibold text-foreground">{organization.settings?.timezone || 'Asia/Dhaka'}</span></div>
                    <div>ভাষা (Language): <span className="font-semibold text-foreground">{organization.settings?.language === 'bn' ? 'বাংলা (BN)' : 'English (EN)'}</span></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-muted/20">
          <Button onClick={() => onOpenChange(false)}>বন্ধ করুন</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
