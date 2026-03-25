export interface UserProfile {
  name: string;
  age: number;
  monthlySalary: number;
  monthlyExpenses: number;
  monthlySavings: number;
  totalDebts: number;
  monthlyEMI: number;
  emergencyFund: number;
  totalInvestments: number;
  creditCardDebt: number;
  retirementAge: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface MoneyScore {
  total: number;
  emergencyFund: number;
  savingsRate: number;
  debtRatio: number;
  investmentLevel: number;
}

export interface FinancialTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  impact: string;
  completed: boolean;
  category: 'savings' | 'investment' | 'debt' | 'emergency' | 'tax' | 'custom';
}

export interface MonthlyPlan {
  month: string;
  sipAmount: number;
  emergencyFundContribution: number;
  debtPayment: number;
  remainingDebt: number;
  savings: number;
  cumulativeWealth: number;
}

export interface TaxComparison {
  oldRegimeTax: number;
  newRegimeTax: number;
  savings: number;
  recommendation: string;
  deductions: { name: string; amount: number; section: string }[];
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface SpendingEntry {
  id: string;
  name: string;
  amount: number;
  color: string;
}

export interface DebtEntry {
  id: string;
  name: string;
  type: 'credit-card' | 'personal-loan' | 'car-loan' | 'home-loan' | 'education-loan' | 'other';
  balance: number;
  interestRate: number;
  emi: number;
  dueDay: number;
}

export const DEFAULT_SPENDING: SpendingEntry[] = [
  { id: 'housing', name: 'Housing', amount: 14000, color: 'hsl(var(--chart-1))' },
  { id: 'food', name: 'Food & Groceries', amount: 8000, color: 'hsl(var(--chart-2))' },
  { id: 'transport', name: 'Transport', amount: 4800, color: 'hsl(var(--chart-3))' },
  { id: 'utilities', name: 'Utilities', amount: 3200, color: 'hsl(var(--chart-4))' },
  { id: 'entertainment', name: 'Entertainment', amount: 4000, color: 'hsl(var(--chart-5))' },
  { id: 'others', name: 'Others', amount: 6000, color: 'hsl(var(--muted-foreground))' },
];

export const DEFAULT_DEBTS: DebtEntry[] = [
  { id: 'debt-cc', name: 'Credit Card', type: 'credit-card', balance: 25000, interestRate: 36, emi: 3000, dueDay: 5 },
  { id: 'debt-personal', name: 'Personal Loan', type: 'personal-loan', balance: 175000, interestRate: 15, emi: 5000, dueDay: 12 },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Rahul',
  age: 28,
  monthlySalary: 80000,
  monthlyExpenses: 40000,
  monthlySavings: 15000,
  totalDebts: 200000,
  monthlyEMI: 8000,
  emergencyFund: 50000,
  totalInvestments: 300000,
  creditCardDebt: 25000,
  retirementAge: 55,
  riskTolerance: 'moderate',
};
