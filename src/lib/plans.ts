export type Plan = "free" | "pro" | "agency";

export interface PlanLimits {
  name: string;
  auditsPerDay: number; // -1 = unlimited
  sites: number;
  historyDays: number; // -1 = unlimited
  monitoring: boolean;
  comparison: boolean;
  pdfExport: boolean;
  apiAccess: boolean;
  apiCallsPerMonth: number;
  priceMonthly: number;
}

export const PLANS: Record<Plan, PlanLimits> = {
  free: {
    name: "Free",
    auditsPerDay: 1,
    sites: 1,
    historyDays: 7,
    monitoring: false,
    comparison: false,
    pdfExport: false,
    apiAccess: false,
    apiCallsPerMonth: 0,
    priceMonthly: 0,
  },
  pro: {
    name: "Pro",
    auditsPerDay: -1,
    sites: 10,
    historyDays: -1,
    monitoring: true,
    comparison: true,
    pdfExport: true,
    apiAccess: true,
    apiCallsPerMonth: 1000,
    priceMonthly: 29,
  },
  agency: {
    name: "Agency",
    auditsPerDay: -1,
    sites: 75,
    historyDays: -1,
    monitoring: true,
    comparison: true,
    pdfExport: true,
    apiAccess: true,
    apiCallsPerMonth: 10000,
    priceMonthly: 79,
  },
};

export const ANON_AUDITS_PER_DAY = 1;

export function limitsFor(plan: Plan): PlanLimits {
  return PLANS[plan] ?? PLANS.free;
}
