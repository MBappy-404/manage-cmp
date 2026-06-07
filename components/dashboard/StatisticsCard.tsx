'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatisticsCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  trend: 'up' | 'down';
  color: string;
}

export function StatisticsCard({
  label,
  value,
  change,
  icon,
  trend,
  color,
}: StatisticsCardProps) {
  const isPositive = trend === 'up';

  return (
    <Card className="overflow-hidden card-hover p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-4 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp size={16} className="text-green-500" />
            ) : (
              <TrendingDown size={16} className="text-red-500" />
            )}
            <span
              className={`text-sm font-semibold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        </div>

        {/* Icon Section */}
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-2xl`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
