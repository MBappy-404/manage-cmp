'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, LogOut, LogIn, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Payment received from Alex Johnson',
      time: '2 hours ago',
      category: 'Finance',
      isRead: false,
    },
    {
      id: '2',
      title: 'Invoice INV-2024-004 is overdue',
      time: '1 day ago',
      category: 'Finance',
      isRead: false,
    },
    {
      id: '3',
      title: 'New client registration complete',
      time: '3 days ago',
      category: 'Client',
      isRead: true,
    },
    {
      id: '4',
      title: 'Suspicious login attempt detected',
      time: '5 days ago',
      category: 'Security',
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/50 backdrop-blur-md dark:bg-slate-950/50">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-4">
          {/* Mobile Menu Button */}
          <button className="p-2 hover:bg-accent rounded-lg lg:hidden" onClick={onMenuClick}>
            <Menu size={20} />
          </button>

          {/* Organization Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="hidden gap-2 font-semibold md:flex text-foreground" />}>
              <span className="text-lg">🏢</span>
              <span>TechVision Inc</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Select Organization</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>🏢 TechVision Inc</DropdownMenuItem>
                <DropdownMenuItem>💼 Digital Solutions Ltd</DropdownMenuItem>
                <DropdownMenuItem>🚀 StartupHub</DropdownMenuItem>
                <DropdownMenuItem>☁️ CloudNet Systems</DropdownMenuItem>
                <DropdownMenuItem>🎨 Design Studios Co</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:flex">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2"
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>

          {/* Mobile Search Button */}
          <button className="p-2 hover:bg-accent rounded-lg md:hidden">
            <Search size={20} />
          </button>

          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="relative hover:bg-accent hover:text-foreground">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 -translate-y-1 translate-x-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden bg-slate-50 dark:bg-slate-900 border border-border shadow-xl rounded-2xl">
              <div className="flex items-center justify-between p-4 border-b border-border/80 bg-slate-50 dark:bg-slate-900">
                <span className="font-semibold text-sm text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-2 space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2 bg-card dark:bg-slate-950 border border-border/50 rounded-xl">
                    <span className="text-2xl">🔔</span>
                    <p>No new notifications</p>
                  </div>
                ) : (
                  <DropdownMenuGroup className="space-y-2">
                    {notifications.map((notif) => {
                      const categoryEmoji =
                        notif.category === 'Finance' ? '💰' :
                          notif.category === 'Security' ? '🚨' :
                            notif.category === 'Client' ? '👥' : '⚙️';

                      return (
                        <DropdownMenuItem
                          key={notif.id}
                          onClick={(e) => handleMarkAsRead(notif.id, e)}
                          className={`flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-card dark:bg-slate-950 transition-all shadow-xs cursor-pointer     dark:focus:bg-blue-950/40! ${!notif.isRead ? 'border-l-2 border-l-primary bg-primary/5 dark:bg-primary/10' : ''}`}
                        >
                          <span className="text-base mt-0.5 select-none">{categoryEmoji}</span>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs leading-normal truncate group-focus:text-foreground! ${!notif.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                                {notif.title}
                              </p>
                              {!notif.isRead && (
                                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground group-focus:text-muted-foreground!">{notif.time}</span>
                              <button
                                onClick={(e) => handleDelete(notif.id, e)}
                                className="text-muted-foreground hover:text-destructive group-focus:text-muted-foreground! p-0.5 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                )}
              </div>
              <div className="p-3 border-t border-border/80 bg-slate-50 dark:bg-slate-900/50 text-center">
                <Link
                  href="/notifications"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
                >
                  View all notifications
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                JS
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">John Smith</p>
                  <p className="text-sm text-muted-foreground">john.smith@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>👤 My Profile</DropdownMenuItem>
                <DropdownMenuItem>⚙️ Account Settings</DropdownMenuItem>
                <DropdownMenuItem>🔐 Security</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-red-600">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
