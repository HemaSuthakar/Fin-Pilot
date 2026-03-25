import { describe, expect, it } from 'vitest';
import { generateMonthlyPlan } from '@/lib/finance-engine';
import type { UserProfile } from '@/types/finance';

const baseProfile: UserProfile = {
  name: 'Test User',
  age: 30,
  monthlySalary: 80000,
  monthlyExpenses: 30000,
  monthlySavings: 0,
  totalDebts: 90000,
  monthlyEMI: 10000,
  emergencyFund: 60000,
  totalInvestments: 200000,
  creditCardDebt: 25000,
  retirementAge: 55,
  riskTolerance: 'moderate',
};

describe('generateMonthlyPlan', () => {
  it('prioritizes debt before savings and reaches zero debt before investing again', () => {
    const plan = generateMonthlyPlan(baseProfile);

    expect(plan[0].debtPayment).toBeGreaterThan(0);
    expect(plan[0].remainingDebt).toBeLessThan(baseProfile.totalDebts);
    expect(plan[0].sipAmount).toBe(0);
    expect(plan[0].savings).toBe(0);

    const debtFreeIndex = plan.findIndex((month) => month.remainingDebt === 0);
    expect(debtFreeIndex).toBeGreaterThanOrEqual(0);

    const monthAfterDebtFree = plan[debtFreeIndex + 1];
    expect(monthAfterDebtFree?.debtPayment ?? 0).toBe(0);
    expect((monthAfterDebtFree?.sipAmount ?? 0) + (monthAfterDebtFree?.savings ?? 0)).toBeGreaterThan(0);
  });
});
