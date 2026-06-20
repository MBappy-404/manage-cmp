'use client';

import { useState, useEffect } from 'react';
import { Organization } from '@/lib/types';
import { PLANS } from '@/lib/plans';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EditOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
  onEditOrganization: (org: Organization) => void;
}

export function EditOrganizationModal({
  open,
  onOpenChange,
  organization,
  onEditOrganization,
}: EditOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    phone: '',
    address: '',
    logo: '',
    banner: '',
    description: '',
    establishedYear: '',
    regNumber: '',
    website: '',
    facebook: '',
    twitter: '',
    youtube: '',
    instagram: '',
    contactPersonName: '',
    contactPersonDesignation: '',
    contactPersonPhone: '',
    libraryType: 'private' as 'public' | 'private' | 'academic' | 'community' | 'personal',
    openingHours: '',
    status: 'active' as 'active' | 'inactive',
    planName: 'starter' as 'starter' | 'professional' | 'premium',
    autoRenew: true,
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    language: 'bn' as 'en' | 'bn',
    amount: '' as string | number,
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        slug: organization.slug,
        email: organization.email,
        phone: organization.phone || '',
        address: organization.address || '',
        logo: organization.logo || '',
        banner: organization.banner || '',
        description: organization.description || '',
        establishedYear: organization.establishedYear ? String(organization.establishedYear) : '',
        regNumber: organization.regNumber || '',
        website: organization.website || '',
        facebook: organization.socialLinks?.facebook || '',
        twitter: organization.socialLinks?.twitter || '',
        youtube: organization.socialLinks?.youtube || '',
        instagram: organization.socialLinks?.instagram || '',
        contactPersonName: organization.contactPerson?.name || '',
        contactPersonDesignation: organization.contactPerson?.designation || '',
        contactPersonPhone: organization.contactPerson?.phone || '',
        libraryType: organization.libraryType || 'private',
        openingHours: organization.openingHours || '',
        status: organization.status,
        planName: organization.subscription?.planName || 'starter',
        autoRenew: organization.subscription?.autoRenew ?? true,
        currency: organization.settings?.currency || 'BDT',
        timezone: organization.settings?.timezone || 'Asia/Dhaka',
        language: organization.settings?.language || 'bn',
        amount: (organization.subscription?.amount !== undefined && organization.subscription?.amount !== null) ? organization.subscription.amount : '',
      });
    }
  }, [organization, open]);

  const selectedPlan = PLANS[formData.planName];
  const planAmount = formData.amount === '' ? selectedPlan.price : Number(formData.amount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
    setFormData(prev => ({ ...prev, slug: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    if (!formData.name) { toast.error('নাম আবশ্যক'); return; }
    if (!formData.slug) { toast.error('স্লাগ আবশ্যক'); return; }
    if (!formData.email) { toast.error('ইমেইল আবশ্যক'); return; }

    const updatedOrganization: Organization = {
      ...organization,
      name: formData.name,
      slug: formData.slug,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      logo: formData.logo,
      banner: formData.banner,
      description: formData.description,
      establishedYear: formData.establishedYear ? Number(formData.establishedYear) : undefined,
      regNumber: formData.regNumber,
      website: formData.website,
      socialLinks: {
        facebook: formData.facebook,
        twitter: formData.twitter,
        youtube: formData.youtube,
        instagram: formData.instagram,
      },
      contactPerson: {
        name: formData.contactPersonName,
        designation: formData.contactPersonDesignation,
        phone: formData.contactPersonPhone,
      },
      libraryType: formData.libraryType,
      openingHours: formData.openingHours,
      status: formData.status,
      subscription: {
        planName: formData.planName,
        status: organization.subscription?.status || 'active',
        autoRenew: formData.autoRenew,
        startDate: organization.subscription?.startDate || new Date().toISOString(),
        endDate: organization.subscription?.endDate,
        amount: planAmount,
      },
      limits: {
        books: selectedPlan.limits.books,
        members: selectedPlan.limits.members,
      },
      settings: {
        currency: formData.currency,
        timezone: formData.timezone,
        language: formData.language,
      },
    };

    onEditOrganization(updatedOrganization);
    onOpenChange(false);
    toast.success(`${updatedOrganization.name} সফলভাবে আপডেট হয়েছে`);
  };

  const formatLimit = (val: number) => val === -1 ? 'অসীমিত' : String(val);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>সংগঠন সম্পাদনা</DialogTitle>
          <DialogDescription>সংগঠনের তথ্য আপডেট করুন।</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">সাবস্ক্রিপশন প্ল্যান</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(PLANS).map(([key, plan]) => (
                <div
                  key={key}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-[border-color,background-color] duration-200 ${formData.planName === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  onClick={() => setFormData(prev => ({ ...prev, planName: key as typeof formData.planName }))}
                >
                  <div className="font-semibold text-foreground">{plan.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{plan.description}</div>
                  <div className="text-lg font-bold text-primary mt-2">{formatLimit(plan.limits.books)} বই</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatLimit(plan.limits.books)} বই • {formatLimit(plan.limits.members)} সদস্য
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">মৌলিক তথ্য</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>সংগঠনের নাম *</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>স্লাগ *</Label>
                <Input name="slug" value={formData.slug} onChange={handleSlugChange} required />
              </div>
              <div className="space-y-2">
                <Label>লোগো URL</Label>
                <Input name="logo" placeholder="https://example.com/logo.png" value={formData.logo} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>ব্যানার URL</Label>
                <Input name="banner" placeholder="https://example.com/banner.png" value={formData.banner} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>গ্রন্থাগার সম্পর্কে বিবরণ</Label>
                <Input name="description" placeholder="গ্রন্থাগারের সংক্ষিপ্ত বিবরণ বা ইতিহাস" value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>প্রতিষ্ঠা সাল</Label>
                <Input name="establishedYear" type="number" placeholder="যেমন: ২০১৮" value={formData.establishedYear} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>নিবন্ধন নম্বর</Label>
                <Input name="regNumber" placeholder="নিবন্ধন নম্বর" value={formData.regNumber} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>ওয়েবসাইট</Label>
                <Input name="website" placeholder="https://example.com" value={formData.website} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>গ্রন্থাগারের ধরন</Label>
                <select className="h-10 w-full rounded-xl border border-border/80 bg-muted/10 px-3.5 text-base transition-all duration-200 outline-none hover:border-border focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer md:text-sm" value={formData.libraryType} onChange={(e) => setFormData(prev => ({ ...prev, libraryType: e.target.value as any }))}>
                  <option value="private">বেসরকারি (Private)</option>
                  <option value="public">সরকারি (Public)</option>
                  <option value="academic">একাডেমিক (Academic)</option>
                  <option value="community">সামাজিক/কমিউনিটি (Community)</option>
                  <option value="personal">ব্যক্তিগত (Personal)</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>খোলার সময় ও বন্ধের দিন</Label>
                <Input name="openingHours" placeholder="যেমন: শনি - বৃহস্পতি সকাল ৯টা - বিকাল ৫টা, শুক্রবার বন্ধ" value={formData.openingHours} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Contact Person Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">যোগাযোগের প্রধান ব্যক্তি</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>ব্যক্তির নাম</Label>
                <Input name="contactPersonName" placeholder="নাম" value={formData.contactPersonName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>পদবী</Label>
                <Input name="contactPersonDesignation" placeholder="যেমন: সাধারণ সম্পাদক" value={formData.contactPersonDesignation} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>ফোন নম্বর</Label>
                <Input name="contactPersonPhone" placeholder="ফোন নম্বর" value={formData.contactPersonPhone} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">সোশ্যাল মিডিয়া লিংক</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ফেসবুক (Facebook)</Label>
                <Input name="facebook" placeholder="https://facebook.com/..." value={formData.facebook} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>ইউটিউব (YouTube)</Label>
                <Input name="youtube" placeholder="https://youtube.com/..." value={formData.youtube} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>টুইটার (Twitter)</Label>
                <Input name="twitter" placeholder="https://twitter.com/..." value={formData.twitter} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>ইনস্টাগ্রাম (Instagram)</Label>
                <Input name="instagram" placeholder="https://instagram.com/..." value={formData.instagram} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">যোগাযোগ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ইমেইল *</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>ফোন</Label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>ঠিকানা</Label>
                <Input name="address" value={formData.address} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">সেটিংস</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>মুদ্রা</Label>
                <select className="h-10 w-full rounded-xl border border-border/80 bg-muted/10 px-3.5 text-base transition-all duration-200 outline-none hover:border-border focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer md:text-sm" value={formData.currency} onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}>
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>টাইমজোন</Label>
                <select className="h-10 w-full rounded-xl border border-border/80 bg-muted/10 px-3.5 text-base transition-all duration-200 outline-none hover:border-border focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer md:text-sm" value={formData.timezone} onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}>
                  <option value="Asia/Dhaka">Asia/Dhaka</option>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>ভাষা</Label>
                <select className="h-10 w-full rounded-xl border border-border/80 bg-muted/10 px-3.5 text-base transition-all duration-200 outline-none hover:border-border focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer md:text-sm" value={formData.language} onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as 'en' | 'bn' }))}>
                  <option value="bn">বাংলা</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Auto Renew & Amount */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="edit-autoRenew" checked={formData.autoRenew} onChange={(e) => setFormData(prev => ({ ...prev, autoRenew: e.target.checked }))} className="w-4 h-4" />
              <Label htmlFor="edit-autoRenew" className="cursor-pointer">স্বয়ংক্রিয় নবীকরণ চালু করুন</Label>
            </div>
            <div className="space-y-2">
              <Label>পেমেন্ট পরিমাণ (৳)</Label>
              <Input
                name="amount"
                type="number"
                placeholder={String(selectedPlan.price)}
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value === '' ? '' : Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">প্ল্যান সারসংক্ষেপ</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">প্ল্যান:</span> <span className="font-medium">{selectedPlan.name}</span></div>
              <div><span className="text-muted-foreground">মূল্য:</span> <span className="font-medium">৳{planAmount.toLocaleString()}/বছর</span></div>
              <div><span className="text-muted-foreground">বই লিমিট:</span> <span className="font-medium">{formatLimit(selectedPlan.limits.books)}</span></div>
              <div><span className="text-muted-foreground">সদস্য লিমিট:</span> <span className="font-medium">{formatLimit(selectedPlan.limits.members)}</span></div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>বাতিল</Button>
            <Button type="submit">সংরক্ষণ করুন</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
