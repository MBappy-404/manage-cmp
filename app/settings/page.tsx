'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Shield, Sliders, Bell, Key, Save, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Admin',
    timezone: 'GMT+6',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyDigest: false,
    securityAlerts: true,
    paymentAlerts: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleTimezoneChange = (value: string | null) => {
    setProfile(prev => ({ ...prev, timezone: value || '' }));
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile settings saved successfully!');
  };

  const saveNotifications = () => {
    toast.success('Notification preferences updated!');
  };

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Security settings updated successfully!');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your personal profile, notification preferences, and security settings.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
          <TabsTrigger value="profile" className="gap-2">
            <User size={16} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={16} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={16} />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <form onSubmit={saveProfile}>
            <Card className="border border-border/80 shadow-sm bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Configure your personal profile details and contact configurations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-border">
                  <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl shadow-md">
                    JS
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-lg text-foreground">Upload Custom Avatar</p>
                    <p className="text-xs text-muted-foreground">Supports PNG, JPG, or SVG up to 2MB.</p>
                    <Button variant="outline" size="sm" type="button" className="mt-2">Choose File</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value={profile.role}
                      disabled
                      className="bg-muted/30 opacity-70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={profile.timezone} onValueChange={handleTimezoneChange}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GMT-8">Pacific Time (GMT-8)</SelectItem>
                        <SelectItem value="GMT-5">Eastern Time (GMT-5)</SelectItem>
                        <SelectItem value="GMT+0">Greenwich Mean Time (GMT+0)</SelectItem>
                        <SelectItem value="GMT+1">Central European Time (GMT+1)</SelectItem>
                        <SelectItem value="GMT+6">Bangladesh Time (GMT+6)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-6 border-t bg-muted/20">
                <Button type="submit" className="gap-2">
                  <Save size={16} />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border border-border/80 shadow-sm bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Email & Push Notifications</CardTitle>
              <CardDescription>Control how and when you receive system transaction statements and team event logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">Critical Security Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive instant alerts regarding login attempts and access modifications.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    checked={notifications.securityAlerts}
                    onChange={() => handleNotificationToggle('securityAlerts')}
                  />
                </div>

                <div className="flex items-start justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">Transaction & Invoicing Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive email copies of invoice creations, payments, and overdue statements.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    checked={notifications.paymentAlerts}
                    onChange={() => handleNotificationToggle('paymentAlerts')}
                  />
                </div>

                <div className="flex items-start justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">General Email Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive client updates and team expansion announcements.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    checked={notifications.emailAlerts}
                    onChange={() => handleNotificationToggle('emailAlerts')}
                  />
                </div>

                <div className="flex items-start justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">Weekly Digest Report</p>
                    <p className="text-sm text-muted-foreground">Receive a consolidated visual report of earnings, metrics, and logs every Monday.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    checked={notifications.weeklyDigest}
                    onChange={() => handleNotificationToggle('weeklyDigest')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6 border-t bg-muted/20">
              <Button onClick={saveNotifications} className="gap-2">
                <Save size={16} />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <form onSubmit={updatePassword}>
            <Card className="border border-border/80 shadow-sm bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Ensure your login credentials remain secure by changing your password periodically.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={security.currentPassword}
                      onChange={handleSecurityChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={security.newPassword}
                      onChange={handleSecurityChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={security.confirmPassword}
                      onChange={handleSecurityChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-6 border-t bg-muted/20">
                <Button type="submit" className="gap-2">
                  <Key size={16} />
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
