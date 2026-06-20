'use client';

import { useState } from 'react';
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
import { Eye, EyeOff } from 'lucide-react';

interface AddPOSOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddOrganization: (org: any) => void;
}

const POS_PLANS = {
  basic: {
    name: 'বেসিক',
    description: 'ছোট ব্যবসার জন্য উপযুক্ত',
    price: 10000,
    limits: {
      products: 1000,
      users: 3,
      storageMB: 1024,
    }
  },
  standard: {
    name: 'স্ট্যান্ডার্ড',
    description: 'ক্রমবর্ধমান ব্যবসার জন্য',
    price: 25000,
    limits: {
      products: 5000,
      users: 10,
      storageMB: 5120,
    }
  },
  premium: {
    name: 'প্রিমিয়াম',
    description: 'বৃহৎ ও মাল্টি-ব্রাঞ্চ ব্যবসার জন্য',
    price: 50000,
    limits: {
      products: -1,
      users: -1,
      storageMB: -1,
    }
  }
};

export function AddPOSOrganizationModal({
  open,
  onOpenChange,
  onAddOrganization,
}: AddPOSOrganizationModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    email: '',
    phone: '',
    address: '',
    logo: '',
    planName: 'basic' as 'basic' | 'standard' | 'premium',
    subscriptionStatus: 'trial' as 'active' | 'trial' | 'expired' | 'cancelled',
    autoRenew: true,
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    language: 'bn',
    firstName: '',
    lastName: '',
    ownerEmail: '',
    password: '',
    adminPhone: '',
    amount: '' as string | number,
    productsLimit: 1000,
    usersLimit: 3,
    storageMB: 1024,
  });

  const selectedPlan = POS_PLANS[formData.planName];
  const planAmount = formData.amount === '' ? selectedPlan.price : Number(formData.amount);

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

    if (!formData.name) { toast.error('সংগঠনের নাম আবশ্যক'); return; }
    if (!formData.email) { toast.error('ইমেইল আবশ্যক'); return; }
    if (!formData.firstName) { toast.error('অ্যাডমিন প্রথম নাম আবশ্যক'); return; }
    if (!formData.lastName) { toast.error('অ্যাডমিন শেষ নাম আবশ্যক'); return; }
    if (!formData.ownerEmail) { toast.error('অ্যাডমিন ইমেইল আবশ্যক'); return; }
    if (!formData.password) { toast.error('পাসওয়ার্ড আবশ্যক'); return; }
    if (formData.password.length < 7) { toast.error('পাসওয়ার্ড কমপক্ষে ৭ অক্ষর হতে হবে'); return; }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Form POS payload
    const payload = {
      name: formData.name,
      industry: formData.industry,
      email: formData.email,
      phone: formData.phone || formData.adminPhone,
      address: formData.address,
      logo: formData.logo,
      subscription: {
        planName: formData.planName,
        status: formData.subscriptionStatus,
        autoRenew: formData.autoRenew,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        amount: planAmount,
      },
      limits: {
        products: formData.productsLimit,
        users: formData.usersLimit,
        storageMB: formData.storageMB,
      },
      settings: {
        currency: formData.currency,
        timezone: formData.timezone,
        language: formData.language,
      },
      // Admin details for Backend user creation
      firstName: formData.firstName,
      lastName: formData.lastName,
      ownerEmail: formData.ownerEmail,
      password: formData.password,
      createdBy: '665f1a2b3c4d5e6f7a8b9c00',
    };

    onAddOrganization(payload);

    setFormData({
      name: '', industry: '', email: '', phone: '', address: '', logo: '',
      planName: 'basic', subscriptionStatus: 'trial', autoRenew: true, currency: 'BDT', timezone: 'Asia/Dhaka', language: 'bn',
      firstName: '', lastName: '', ownerEmail: '', password: '', adminPhone: '', amount: '',
      productsLimit: 1000, usersLimit: 3, storageMB: 1024,
    });
    onOpenChange(false);
  };

  const formatLimit = (val: number) => val === -1 ? 'অসীমিত' : String(val);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>নতুন ERP & POS সংগঠন তৈরি করুন</DialogTitle>
          <DialogDescription>* চিহ্নিত ঘরগুলো পূরণ করা আবশ্যক।</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plans */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">ERP/POS সাবস্ক্রিপশন প্ল্যান</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(POS_PLANS).map(([key, plan]) => (
                <div
                  key={key}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-[border-color,background-color] duration-200 ${
                    formData.planName === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    planName: key as any,
                    productsLimit: plan.limits.products,
                    usersLimit: plan.limits.users,
                    storageMB: plan.limits.storageMB
                  }))}
                >
                  <div className="font-semibold text-foreground">{plan.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{plan.description}</div>
                  <div className="text-sm font-bold text-primary mt-2">৳{plan.price.toLocaleString()}/বছর</div>
                  <div className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                    <div>প্রোডাক্ট: {formatLimit(plan.limits.products)}</div>
                    <div>ইউজার: {formatLimit(plan.limits.users)}</div>
                    <div>স্টোরেজ: {plan.limits.storageMB === -1 ? 'অসীমিত' : `${plan.limits.storageMB / 1024} GB`}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Basic */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">মৌলিক তথ্য</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>সংগঠনের নাম *</Label>
                <Input name="name" placeholder="যেমন: মা এন্টারপ্রাইজ" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>ইন্ডাস্ট্রি / ব্যবসা ধরন</Label>
                <Input name="industry" placeholder="যেমন: grocery, electronics, general" value={formData.industry} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>লোগো URL</Label>
                <Input name="logo" placeholder="https://example.com/logo.png" value={formData.logo} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>ইমেইল *</Label>
                <Input name="email" type="email" placeholder="info@company.com" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>ফোন</Label>
                <Input name="phone" placeholder="যেমন: ০১৭XXXXXXXX" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>ঠিকানা</Label>
                <Input name="address" placeholder="যেমন: গুলশান, ঢাকা" value={formData.address} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Admin */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">মালিক / অ্যাডমিন ব্যবহারকারী তৈরি করুন</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>প্রথম নাম *</Label>
                <Input name="firstName" placeholder="যেমন: মো:" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>শেষ নাম *</Label>
                <Input name="lastName" placeholder="যেমন: রহমান" value={formData.lastName} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>অ্যাডমিন ইমেইল *</Label>
                <Input name="ownerEmail" type="email" placeholder="admin@company.com" value={formData.ownerEmail} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>পাসওয়ার্ড *</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="কমপক্ষে ৭ অক্ষর"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={7}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>অ্যাডমিন ফোন</Label>
                <Input name="adminPhone" placeholder="যেমন: ০১৭XXXXXXXX" value={formData.adminPhone} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Subscription Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">সাবস্ক্রিপশন ও প্ল্যান</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>সাবস্ক্রিপশন স্ট্যাটাস</Label>
                <select className="h-10 w-full rounded-xl border border-border/80 bg-muted/10 px-3.5 text-base transition-all duration-200 outline-none hover:border-border focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer md:text-sm" value={formData.subscriptionStatus} onChange={(e) => setFormData(prev => ({ ...prev, subscriptionStatus: e.target.value as any }))}>
                  <option value="active">সক্রিয় (Active)</option>
                  <option value="trial">ট্রায়াল (Trial)</option>
                  <option value="expired">মেয়াদোত্তীর্ণ (Expired)</option>
                  <option value="cancelled">বাতিল (Cancelled)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>ফি পরিমাণ (৳)</Label>
                <Input
                  name="amount"
                  type="number"
                  placeholder={String(selectedPlan.price)}
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value === '' ? '' : Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="addAutoRenew" checked={formData.autoRenew} onChange={(e) => setFormData(prev => ({ ...prev, autoRenew: e.target.checked }))} className="w-4 h-4" />
              <Label htmlFor="addAutoRenew" className="cursor-pointer">স্বয়ংক্রিয় নবীকরণ চালু রাখুন</Label>
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
            <Button type="submit">তৈরি করুন</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
