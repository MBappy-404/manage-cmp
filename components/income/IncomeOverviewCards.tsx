'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface IncomeOverviewCardsProps {
  todayIncome: number;
  monthlyIncome: number;
  yearlyIncome: number;
  pendingPayments: number;
}

export function IncomeOverviewCards({
  todayIncome,
  monthlyIncome,
  yearlyIncome,
  pendingPayments,
}: IncomeOverviewCardsProps) {
  const cards = [
    {
      label: "Today's Income",
      value: todayIncome,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Monthly Income',
      value: monthlyIncome,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Yearly Income',
      value: yearlyIncome,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Pending Payments',
      value: pendingPayments,
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className="card-hover p-6 flex items-start justify-between"
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold text-foreground">
                ${(card.value / 1000).toFixed(1)}k
              </p>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} text-white`}
            >
              <Icon size={24} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
