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
import { Organization } from '@/lib/types';
import {
  Globe,
  Calendar,
  Hash,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Users,
  Shield,
  DollarSign,
  ExternalLink,
  Info,
  CalendarDays,
  Briefcase,
  Layers,
  Settings2
} from 'lucide-react';

interface ViewOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
}

const statusColors = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  inactive: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900',
};

const planColors = {
  starter: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
  professional: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900',
  premium: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
};

const planNames = {
  starter: 'স্টার্টার (Starter)',
  professional: 'প্রফেশনাল (Professional)',
  premium: 'প্রিমিয়াম (Premium)',
};

const libraryTypes = {
  public: 'সরকারি (Public)',
  private: 'বেসরকারি (Private)',
  academic: 'একাডেমিক (Academic)',
  community: 'কমিউনিটি (Community)',
  personal: 'ব্যক্তিগত (Personal)',
};

export function ViewOrganizationModal({
  open,
  onOpenChange,
  organization,
}: ViewOrganizationModalProps) {
  if (!organization) return null;

  const formatLimit = (val?: number) => (val === -1 || val === undefined) ? 'অসীমিত' : String(val);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-w-full p-0 overflow-hidden max-h-[90vh] flex flex-col border border-border shadow-2xl bg-card/95 backdrop-blur-md">

        {/* Banner Section */}
        <div className="relative h-44 w-full bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900">
          {organization.banner && (
            <img
              src={organization.banner}
              alt="Organization Banner"
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
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
                🏢
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 right-6 flex gap-2">
            <Badge className={`${statusColors[organization.status]} px-3 py-1 font-medium border text-xs`}>
              {organization.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            <Badge className={`${planColors[organization.subscription?.planName || 'starter']} px-3 py-1 font-medium border text-xs`}>
              {planNames[organization.subscription?.planName || 'starter']}
            </Badge>
          </div>
        </div>

        {/* Header & Meta */}
        <div className="pt-10 px-6 pb-4 border-b border-border bg-card/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{organization.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5 font-medium">/{organization.slug}</p>
            </div>
            {organization.website && (
              <a href={organization.website} target="_blank" rel="noopener noreferrer" className="self-start md:self-auto">
                <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                  <Globe size={15} />
                  ওয়েবসাইট ভিজিট করুন
                  <ExternalLink size={12} />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left Column - Library Type & Basic Info Card */}
            <div className="md:col-span-1 space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
                <h3 className="font-semibold text-foreground border-b border-border/60 pb-2 flex items-center gap-2">
                  <Info size={16} className="text-primary" />
                  সংক্ষিপ্ত তথ্য
                </h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground block">গ্রন্থাগারের ধরন</span>
                    <span className="font-medium text-foreground flex items-center gap-1.5 mt-1">
                      <Layers size={14} className="text-muted-foreground" />
                      {libraryTypes[organization.libraryType || 'private']}
                    </span>
                  </div>

                  {organization.establishedYear && (
                    <div>
                      <span className="text-xs text-muted-foreground block">প্রতিষ্ঠা সাল</span>
                      <span className="font-medium text-foreground flex items-center gap-1.5 mt-1">
                        <CalendarDays size={14} className="text-muted-foreground" />
                        {organization.establishedYear} সাল
                      </span>
                    </div>
                  )}

                  {organization.regNumber && (
                    <div>
                      <span className="text-xs text-muted-foreground block">নিবন্ধন নম্বর</span>
                      <span className="font-medium text-foreground flex items-center gap-1.5 mt-1">
                        <Hash size={14} className="text-muted-foreground" />
                        {organization.regNumber}
                      </span>
                    </div>
                  )}

                  {organization.openingHours && (
                    <div>
                      <span className="text-xs text-muted-foreground block">খোলার সময় ও বন্ধের দিন</span>
                      <span className="font-medium text-foreground flex items-center gap-1.5 mt-1">
                        <Clock size={14} className="text-muted-foreground" />
                        {organization.openingHours}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Links block */}
              {(organization.socialLinks?.facebook ||
                organization.socialLinks?.twitter ||
                organization.socialLinks?.youtube ||
                organization.socialLinks?.instagram) && (
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                    <h3 className="font-semibold text-foreground text-xs text-muted-foreground border-b border-border/40 pb-1.5">
                      সোশ্যাল লিংকসমূহ
                    </h3>
                    <div className="flex gap-2.5">
                      {organization.socialLinks?.facebook && (
                        <a href={organization.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-blue-600 transition-colors">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      {organization.socialLinks?.youtube && (
                        <a href={organization.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-red-600 transition-colors">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 0 1 1.768-1.768C5.745 5 12 5 12 5s6.255 0 8.012.418zM10.05 8.946v6.108l5.217-3.054L10.05 8.946z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      {organization.socialLinks?.twitter && (
                        <a href={organization.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-sky-500 transition-colors">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                      {organization.socialLinks?.instagram && (
                        <a href={organization.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-pink-600 transition-colors">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.219 2.425.466a4.863 4.863 0 0 1 1.77 1.153 4.863 4.863 0 0 1 1.153 1.77c.247.636.416 1.36.465 2.425.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.219 1.79-.465 2.425a4.88 4.88 0 0 1-1.153 1.77 4.89 4.89 0 0 1-1.77 1.153c-.636.247-1.36.416-2.425.465-1.066.05-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.219-2.425-.465a4.868 4.868 0 0 1-1.77-1.153 4.868 4.868 0 0 1-1.153-1.77c-.247-.636-.416-1.36-.465-2.425C2.01 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.065.219-1.79.465-2.425a4.883 4.883 0 0 1 1.153-1.77 4.89 4.89 0 0 1 1.77-1.153c.636-.247 1.36-.416 2.425-.465C8.944 2.01 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Right Column - Main Details */}
            <div className="md:col-span-2 space-y-6">

              {/* Description */}
              {organization.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    📖 গ্রন্থাগার সম্পর্কে বিবরণ
                  </h3>
                  <p className="text-muted-foreground leading-relaxed bg-muted/10 p-4 rounded-xl border border-border/55 italic">
                    "{organization.description}"
                  </p>
                </div>
              )}

              {/* Limits Cards */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  সীমা ও রিসোর্স কোটা
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">বইয়ের সীমা (Limit)</span>
                      <span className="text-lg font-bold text-foreground">
                        {formatLimit(organization.limits?.books)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                      <Users size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">সদস্যের সীমা (Limit)</span>
                      <span className="text-lg font-bold text-foreground">
                        {formatLimit(organization.limits?.members)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Org Contact details */}
                <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2 text-xs text-muted-foreground">
                    🏢 লাইব্রেরি যোগাযোগ
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

                {/* Primary Contact Person */}
                {organization.contactPerson?.name && (
                  <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2 text-xs text-muted-foreground">
                      👤 প্রধান যোগাযোগের ব্যক্তি
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 text-foreground font-medium">
                        <User size={15} className="shrink-0 text-primary" />
                        <span>{organization.contactPerson.name}</span>
                      </div>
                      {organization.contactPerson.designation && (
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                          <Briefcase size={15} className="shrink-0 text-primary" />
                          <span>{organization.contactPerson.designation}</span>
                        </div>
                      )}
                      {organization.contactPerson.phone && (
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                          <Phone size={15} className="shrink-0 text-primary" />
                          <span>{organization.contactPerson.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
