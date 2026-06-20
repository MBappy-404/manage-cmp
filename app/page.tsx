'use client';

import { StatisticsCard } from '@/components/dashboard/StatisticsCard';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { OrganizationCard } from '@/components/organizations/OrganizationCard';
import { ClientCards } from '@/components/clients/ClientCards';
import { IncomeOverviewCards } from '@/components/income/IncomeOverviewCards';
import { IncomeCharts } from '@/components/income/IncomeCharts';
import { TransactionTable } from '@/components/income/TransactionTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import {
  mockStatistics,
  mockOrganizations,
  mockClients,
  mockChartData,
  mockIncomeDistribution,
  mockTransactions,
} from '@/lib/mockData';

export default function Page() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Welcome back! Here&apos;s your business overview.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={18} />
            Export
          </Button>
          <Button className="gap-2">
            <Plus size={18} />
            New Organization
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Key Metrics</h2>
        <DashboardGrid columns={4}>
          {mockStatistics.map((stat) => (
            <StatisticsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              trend={stat.trend}
              color={stat.color}
            />
          ))}
        </DashboardGrid>
      </div>

      {/* Income Overview */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Income Overview</h2>
        <IncomeOverviewCards
          todayIncome={12450}
          monthlyIncome={125890}
          yearlyIncome={1445230}
          pendingPayments={34560}
        />
      </div>

      {/* Charts */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Revenue Analytics</h2>
        <IncomeCharts revenueData={mockChartData} distributionData={mockIncomeDistribution} />
      </div>

      {/* Recent Transactions */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <TransactionTable transactions={mockTransactions.slice(0, 5)} />
      </div>

      {/* Organizations Overview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Organizations</h2>
          <Button variant="link">View All →</Button>
        </div>
        <DashboardGrid columns={2}>
          {mockOrganizations.slice(0, 2).map((org) => (
            <OrganizationCard key={org._id} organization={org} />
          ))}
        </DashboardGrid>
      </div>

      {/* Clients Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Top Clients</h2>
          <Button variant="link">View All →</Button>
        </div>
        <ClientCards clients={mockClients.slice(0, 3)} />
      </div>

      {/* Quick Actions */}
      <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="h-auto flex-col gap-2 py-6">
            <span className="text-2xl">📊</span>
            <span>Generate Report</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-6">
            <span className="text-2xl">➕</span>
            <span>Add Client</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-6">
            <span className="text-2xl">📄</span>
            <span>Create Invoice</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-6">
            <span className="text-2xl">👥</span>
            <span>Manage Team</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
