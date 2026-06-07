'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden w-full">
      {/* Sidebar component - handles desktop (visible/collapsible) and mobile overlay drawer */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navigation Bar with sidebar toggle triggers */}
        <TopNav onMenuClick={() => setIsMobileOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
