'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bell, Check, Trash2, MailOpen, AlertCircle, TrendingUp, Users, ShieldAlert, Award } from 'lucide-react';

interface SystemNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  category: 'Finance' | 'Security' | 'Client' | 'System';
  isRead: boolean;
}

const initialNotifications: SystemNotification[] = [
  {
    id: '1',
    title: 'Payment received from Alex Johnson',
    description: 'Invoice INV-2024-001 has been settled in full via Credit Card.',
    time: '2 hours ago',
    category: 'Finance',
    isRead: false,
  },
  {
    id: '2',
    title: 'Invoice INV-2024-004 is overdue',
    description: 'Emily Davis (Davis Consulting) has not completed the payment due on 2026-06-01.',
    time: '1 day ago',
    category: 'Finance',
    isRead: false,
  },
  {
    id: '3',
    title: 'New client registration complete',
    description: 'Robert Brown (Brown Industries) has successfully joined organization TechVision Inc.',
    time: '3 days ago',
    category: 'Client',
    isRead: true,
  },
  {
    id: '4',
    title: 'Suspicious login attempt detected',
    description: 'An login attempt was blocked from IP 198.51.100.42 using Admin credentials.',
    time: '5 days ago',
    category: 'Security',
    isRead: false,
  },
  {
    id: '5',
    title: 'Monthly automated billing run completed',
    description: 'Generated 15 new invoices for the upcoming subscription cycle.',
    time: '1 week ago',
    category: 'System',
    isRead: true,
  },
];

const categoryIcons = {
  Finance: { icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50' },
  Security: { icon: ShieldAlert, color: 'text-red-500 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50' },
  Client: { icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50' },
  System: { icon: AlertCircle, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    toast.success('Notification marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('Cleared all notifications');
  };

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="mt-2 text-muted-foreground">Stay updated on recent transactions, billing, and system access.</p>
        </div>
        <div className="flex gap-2.5">
          {unreadCount > 0 && (
            <Button variant="outline" className="gap-2" onClick={markAllAsRead}>
              <Check size={16} />
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="destructive" className="gap-2" onClick={clearAll}>
              <Trash2 size={16} />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All Notifications ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'ghost'}
          onClick={() => setFilter('unread')}
          size="sm"
          className="relative"
        >
          Unread ({unreadCount})
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center border border-dashed border-border bg-card/40">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <Bell size={28} />
            </div>
            <h3 className="font-semibold text-lg text-foreground">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">You are all caught up! No recent alerts are pending review.</p>
          </Card>
        ) : (
          filteredNotifications.map((notif) => {
            const config = categoryIcons[notif.category];
            const Icon = config.icon;

            return (
              <Card
                key={notif.id}
                className={`border border-border/80 transition-all duration-200 hover:shadow-md ${
                  notif.isRead ? 'opacity-75 bg-card/40' : 'bg-card border-l-4 border-l-primary shadow-sm'
                }`}
              >
                <CardContent className="p-5 flex gap-4 items-start">
                  {/* Category Icon */}
                  <div className={`p-3 rounded-xl border ${config.color} shrink-0`}>
                    <Icon size={20} />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <h4 className="font-semibold text-base text-foreground flex items-center gap-2">
                        {notif.title}
                        {!notif.isRead && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" title="New Alert" />
                        )}
                      </h4>
                      <span className="text-xs text-muted-foreground">{notif.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{notif.description}</p>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="outline">{notif.category}</Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0 self-center">
                    {!notif.isRead && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => markAsRead(notif.id)}
                        title="Mark as Read"
                      >
                        <MailOpen size={16} />
                      </Button>
                    )}
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notif.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                      title="Delete Notification"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
