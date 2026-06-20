'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IncomeCharts } from '@/components/income/IncomeCharts';
import { TransactionTable } from '@/components/income/TransactionTable';
import { Download, BarChart3 } from 'lucide-react';
import { mockChartData, mockIncomeDistribution, mockTransactions, mockOrganizations, mockClients } from '@/lib/mockData';

export default function ReportsPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="mt-2 text-muted-foreground">Generate and view detailed business reports.</p>
        </div>
        <Button className="gap-2">
          <Download size={18} />
          Export All Reports
        </Button>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        {/* Revenue Report */}
        <TabsContent value="revenue" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Revenue Trend Analysis</h3>
            <IncomeCharts revenueData={mockChartData} distributionData={mockIncomeDistribution} />
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                <p className="text-3xl font-bold text-foreground">{mockOrganizations.length}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {mockOrganizations.filter(o => o.status === 'active').length}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-3xl font-bold text-muted-foreground">
                  {mockOrganizations.filter(o => o.status === 'inactive').length}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Client Report */}
        <TabsContent value="clients" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Client Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold text-foreground">{mockClients.length}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Premium Clients</p>
                <p className="text-3xl font-bold text-purple-600">
                  {mockClients.filter(c => c.package === 'Premium').length}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Total Client Value</p>
                <p className="text-3xl font-bold text-foreground">
                  ${mockClients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Avg. Client Value</p>
                <p className="text-3xl font-bold text-foreground">
                  ${Math.round(mockClients.reduce((sum, c) => sum + c.totalSpent, 0) / mockClients.length).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Payment Status Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockClients.filter(c => c.paymentStatus === 'Paid').length}
                </p>
              </div>
              <div className="flex flex-col gap-2 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockClients.filter(c => c.paymentStatus === 'Pending').length}
                </p>
              </div>
              <div className="flex flex-col gap-2 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockClients.filter(c => c.paymentStatus === 'Overdue').length}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Organizations Report */}
        <TabsContent value="organizations" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Organization Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                <p className="text-3xl font-bold text-foreground">{mockOrganizations.length}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {mockOrganizations.filter(o => o.status === 'active').length}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-3xl font-bold text-muted-foreground">
                  {mockOrganizations.filter(o => o.status === 'inactive').length}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Total Emails</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockOrganizations.filter(o => o.email).length}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Payments Report */}
        <TabsContent value="payments" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Total Amount Received</p>
                <p className="text-3xl font-bold text-green-600">
                  ${mockTransactions
                    .filter(t => t.status === 'Paid')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                <p className="text-3xl font-bold text-yellow-600">
                  ${mockTransactions
                    .filter(t => t.status === 'Pending')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Overdue Amount</p>
                <p className="text-3xl font-bold text-red-600">
                  ${mockTransactions
                    .filter(t => t.status === 'Overdue')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Transactions</h3>
            <TransactionTable transactions={mockTransactions} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
