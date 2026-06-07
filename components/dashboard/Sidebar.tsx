'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  TrendingUp,
  Receipt,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Organizations', icon: Building2, href: '/organizations' },
  { label: 'Clients', icon: Users, href: '/clients' },
  { label: 'Income', icon: TrendingUp, href: '/income' },
  { label: 'Transactions', icon: Receipt, href: '/transactions' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
];

const bottomItems = [
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col gap-8 border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 
          lg:sticky lg:top-0 lg:h-screen lg:flex lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} 
          w-64 h-full`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between gap-3 px-6 pt-8">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              📊
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <h1 className="text-xl font-bold text-sidebar-foreground">Bright</h1>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden p-1 hover:bg-sidebar-accent rounded-md lg:block"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${isCollapsed ? 'rotate-90' : '-rotate-90'}`}
            />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col gap-2 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const collapsedMode = isCollapsed && !isMobileOpen;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                } ${collapsedMode ? 'justify-center px-2' : ''}`}
                title={collapsedMode ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <nav className="flex flex-col gap-2 border-t border-sidebar-border px-3 py-4">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const collapsedMode = isCollapsed && !isMobileOpen;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                } ${collapsedMode ? 'justify-center px-2' : ''}`}
                title={collapsedMode ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
