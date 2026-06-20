'use client';

import { useState, useEffect } from 'react';
import { POSOrganization } from '@/lib/types';
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

interface EditPOSOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: POSOrganization | null;
  onEditOrganization: (org: POSOrganization) => void;
}

export function EditPOSOrganizationModal({
  open,
  onOpenChange,
  organization,
  onEditOrganization,
}: EditPOSOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    email: '',
    phone: '',
    address: '',
    logo: '',
    planName: 'basic',
    subscriptionStatus: 'active',
    autoRenew: true,
    amount: 0,
    productsLimit: 500,
    usersLimit: 2,
    storageMB: 500,
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    language: 'bn',
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        industry: organization.industry || '',
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
        logo: organization.logo || '',
        planName: organization.subscription?.planName || 'trial',
        subscriptionStatus: organization.subscription?.status || 'trial',
        autoRenew: organization.subscription?.autoRenew !== false,
        amount: organization.subscription?.amount || 0,
        productsLimit: organization.limits?.products ?? 500,
        usersLimit: organization.limits?.users ?? 2,
        storageMB: organization.limits?.storageMB ?? 500,
        currency: organization.settings?.currency || 'BDT',
        timezone: organization.settings?.timezone || 'Asia/Dhaka',
        language: organization.settings?.language || 'bn',
      });
    }
  }, [organization, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!organization) return;
    if (!formData.name) { toast.error('সংগঠনের নাম আবশ্যক'); return; }

    const updated: POSOrganization = {
      ...organization,
      name: formData.name,
      industry: formData.industry,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      logo: formData.logo,
      subscription: {
        ...organization.subscription,
        planName: formData.planName,
        status: formData.subscriptionStatus as any,
        autoRenew: formData.autoRenew,
        amount: formData.amount,
      },
      limits: {
        ...organization.limits,
        products: formData.productsLimit,
        users: formData.usersLimit,
        storageMB: formData.storageMB,
      },
      settings: {
        ...organization.settings,
        currency: formData.currency,
        timezone: formData.timezone,
        language: formData.language,
      },
    };

    onEditOrganization(updated);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ERP & POS সংগঠন পরিবর্তন করুন</DialogTitle>
          <DialogDescription>সংগঠনের তথ্য পরিবর্তন করার পর সংরক্ষন করুন।</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">মৌলিক তথ্য</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>সংগঠনের নাম *</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>ইন্ডাস্ট্রি / ব্যবসা ধরন</Label>
                <Input name="industry" value={formData.industry} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>লোগো URL</Label>
                <Input name="logo" value={formData.logo} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>ইমেইল</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} />
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

          {/* Limits */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">ব্যবহারকারী এবং প্রোডাক্টস লিমিট</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>প্রোডাক্ট লিমিট (-১ = অসীমিত)</Label>
                <Input name="productsLimit" type="number" value={formData.productsLimit} onChange={handleNumberChange} />
              </div>
              <div className="space-y-2">
                <Label>ইউজার লিমিট (-১ = অসীমিত)</Label>
                <Input name="usersLimit" type="number" value={formData.usersLimit} onChange={handleNumberChange} />
              </div>
              <div className="space-y-2">
                <Label>স্টোরেজ লিমিট MB (-১ = অসীমিত)</Label>
                <Input name="storageMB" type="number" value={formData.storageMB} onChange={handleNumberChange} />
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">সাবস্ক্রিপশন ও প্ল্যান</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>প্ল্যান নাম</Label>
                <select className="h-10 w-full rounded-xl border border-border/80 bg-muted/10 px-3.5 text-base transition-all duration-200 outline-none hover:border-border focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer md:text-sm" value={formData.planName} onChange={(e) => setFormData(prev => ({ ...prev, planName: e.target.value }))}>
                  <option value="trial">ট্রায়াল (Trial)</option>
                  <option value="basic">বেসিক (Basic)</option>
                  <option value="standard">স্ট্যান্ডার্ড (Standard)</option>
                  <option value="premium">প্রিমিয়াম (Premium)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>সাবস্ক্রিপশন স্ট্যাটাস</Label>
                <select className="h-10 w-full rounded-xl border border-border/80 bg-muted/10 px-3.5 text-base transition-all duration-200 outline-none hover:border-border focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer md:text-sm" value={formData.subscriptionStatus} onChange={(e) => setFormData(prev => ({ ...prev, subscriptionStatus: e.target.value }))}>
                  <option value="active">সক্রিয় (Active)</option>
                  <option value="trial">ট্রায়াল (Trial)</option>
                  <option value="expired">মেয়াদোত্তীর্ণ (Expired)</option>
                  <option value="cancelled">বাতিল (Cancelled)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>বার্ষিক ফি (৳)</Label>
                <Input name="amount" type="number" value={formData.amount} onChange={handleNumberChange} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="editAutoRenew" checked={formData.autoRenew} onChange={(e) => setFormData(prev => ({ ...prev, autoRenew: e.target.checked }))} className="w-4 h-4" />
              <Label htmlFor="editAutoRenew" className="cursor-pointer">স্বয়ংক্রিয় নবীকরণ চালু রাখুন</Label>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">ডিফল্ট সেটিংস</h3>
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
                <select className="h-10 w-full rounded-xl border border-border/80 bg-muted/10 px-3.5 text-base transition-all duration-200 outline-none hover:border-border focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer md:text-sm" value={formData.language} onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}>
                  <option value="bn">বাংলা</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>বাতিল</Button>
            <Button type="submit">পরিবর্তন সংরক্ষণ করুন</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
