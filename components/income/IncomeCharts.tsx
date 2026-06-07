'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '@/lib/types';

interface IncomeChartsProps {
  revenueData: ChartDataPoint[];
  distributionData: ChartDataPoint[];
}

const COLORS = [
  'oklch(0.505 0.229 264.376)',
  'oklch(0.488 0.243 264.376)',
  'oklch(0.671 0.191 264.376)',
  'oklch(0.824 0.106 264.376)',
  'oklch(0.902 0.055 264.376)',
];

export function IncomeCharts({ revenueData, distributionData }: IncomeChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Line Chart */}
      <Card className="lg:col-span-2 p-6">
        <h3 className="font-semibold text-lg mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-primary)"
              dot={{ fill: 'var(--color-primary)', r: 5 }}
              activeDot={{ r: 7 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Income Distribution Pie Chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Income Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}k`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
                borderRadius: '0.5rem',
              }}
              formatter={(value: any) => `$${(value / 1000).toFixed(1)}k`}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Growth Bar Chart */}
      <Card className="lg:col-span-3 p-6">
        <h3 className="font-semibold text-lg mb-4">Monthly Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Bar
              dataKey="growth"
              fill="var(--color-primary)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
