import { Plan } from './types';

export const PLANS: Record<string, Plan> = {
  starter: {
    name: 'স্টার্টার',
    nameEn: 'Starter',
    description: 'স্কুল, মাদ্রাসা, ছোট ও মাঝারি পাঠাগার',
    price: 5000,
    currency: 'BDT',
    duration: 'yearly',
    limits: { books: 5000, members: 5000 },
  },
  professional: {
    name: 'প্রফেশনাল',
    nameEn: 'Professional',
    description: 'ইউনিয়ন, উপজেলা, কলেজ লাইব্রেরি',
    price: 10000,
    currency: 'BDT',
    duration: 'yearly',
    limits: { books: 15000, members: 15000 },
  },
  premium: {
    name: 'প্রিমিয়াম আনলিমিটেড',
    nameEn: 'Premium Unlimited',
    description: 'বিশ্ববিদ্যালয়, জেলা গ্রন্থাগার, বৃহৎ পাঠাগার',
    price: 25000,
    currency: 'BDT',
    duration: 'yearly',
    limits: { books: -1, members: -1 },
  },
};

export const PLAN_BADGE_COLORS = {
  starter: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  professional: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  premium: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};
