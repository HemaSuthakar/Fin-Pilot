import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { UserProfile, FinancialTask, SpendingEntry, DebtEntry } from '@/types/finance';
import { DEFAULT_PROFILE, DEFAULT_SPENDING, DEFAULT_DEBTS } from '@/types/finance';
import { calculateMoneyScore, generateTasks, generateMonthlyPlan, calculateTax, getExpenseBreakdown, rankDebts } from '@/lib/finance-engine';

interface FinanceContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  spending: SpendingEntry[];
  updateSpending: (id: string, amount: number) => void;
  debts: DebtEntry[];
  updateDebt: (id: string, updates: Partial<DebtEntry>) => void;
  addDebt: () => void;
  debtPriority: DebtEntry[];
  tasks: FinancialTask[];
  toggleTask: (id: string) => void;
  addTask: (title: string) => void;
  score: ReturnType<typeof calculateMoneyScore>;
  plan: ReturnType<typeof generateMonthlyPlan>;
  tax: ReturnType<typeof calculateTax>;
  expenses: ReturnType<typeof getExpenseBreakdown>;
  completionPct: number;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

function deriveMonthlySavings(profile: UserProfile) {
  return Math.max(0, profile.monthlySalary - profile.monthlyExpenses - profile.monthlyEMI);
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('finpilot-profile');
    const parsedProfile = saved ? JSON.parse(saved) as UserProfile : DEFAULT_PROFILE;
    return {
      ...parsedProfile,
      monthlySavings: deriveMonthlySavings(parsedProfile),
    };
  });

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('finpilot-completed');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [customTasks, setCustomTasks] = useState<Omit<FinancialTask, 'completed'>[]>(() => {
    const saved = localStorage.getItem('finpilot-custom-tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [spending, setSpending] = useState<SpendingEntry[]>(() => {
    const saved = localStorage.getItem('finpilot-spending');
    return saved ? JSON.parse(saved) : DEFAULT_SPENDING;
  });

  const [debts, setDebts] = useState<DebtEntry[]>(() => {
    const saved = localStorage.getItem('finpilot-debts');
    return saved ? JSON.parse(saved) : DEFAULT_DEBTS;
  });

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      next.monthlySavings = deriveMonthlySavings(next);
      localStorage.setItem('finpilot-profile', JSON.stringify(next));
      return next;
    });
  }, []);

  const score = useMemo(() => calculateMoneyScore(profile), [profile]);
  const generatedTasks = useMemo(() => generateTasks(profile), [profile]);
  const tasks = useMemo(() => {
    const automatedTasks = generatedTasks.map(task => ({
      ...task,
      completed: completedTasks.has(task.id),
    }));
    const manualTasks = customTasks.map(task => ({
      ...task,
      completed: completedTasks.has(task.id),
    }));

    return [...automatedTasks, ...manualTasks];
  }, [generatedTasks, customTasks, completedTasks]);
  const plan = useMemo(() => generateMonthlyPlan(profile), [profile]);
  const tax = useMemo(() => calculateTax(profile), [profile]);
  const expenses = useMemo(() => getExpenseBreakdown(spending), [spending]);
  const debtPriority = useMemo(() => rankDebts(debts), [debts]);

  const completionPct = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  const toggleTask = useCallback((id: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('finpilot-completed', JSON.stringify([...next]));
      return next;
    });
  }, []);

  const addTask = useCallback((title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const nextTask: Omit<FinancialTask, 'completed'> = {
      id: `custom-${Date.now()}`,
      title: trimmedTitle,
      description: 'Manually added task',
      priority: 'medium',
      deadline: dueDate.toISOString().split('T')[0],
      impact: 'Keeps your plan on track',
      category: 'custom',
    };

    setCustomTasks(prev => {
      const next = [...prev, nextTask];
      localStorage.setItem('finpilot-custom-tasks', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateSpending = useCallback((id: string, amount: number) => {
    const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;

    setSpending(prev => {
      const next = prev.map(entry => (
        entry.id === id ? { ...entry, amount: safeAmount } : entry
      ));

      localStorage.setItem('finpilot-spending', JSON.stringify(next));

      const monthlyExpenses = next.reduce((sum, entry) => sum + entry.amount, 0);
      setProfile(current => {
        const updatedProfile = {
          ...current,
          monthlyExpenses,
          monthlySavings: deriveMonthlySavings({ ...current, monthlyExpenses }),
        };
        localStorage.setItem('finpilot-profile', JSON.stringify(updatedProfile));
        return updatedProfile;
      });

      return next;
    });
  }, []);

  const syncDebtProfile = useCallback((nextDebts: DebtEntry[]) => {
    const totalDebts = nextDebts.reduce((sum, debt) => sum + debt.balance, 0);
    const monthlyEMI = nextDebts.reduce((sum, debt) => sum + debt.emi, 0);
    const creditCardDebt = nextDebts
      .filter(debt => debt.type === 'credit-card')
      .reduce((sum, debt) => sum + debt.balance, 0);

    setProfile(current => {
      const updatedProfile = {
        ...current,
        totalDebts,
        monthlyEMI,
        creditCardDebt,
        monthlySavings: deriveMonthlySavings({ ...current, monthlyEMI }),
      };
      localStorage.setItem('finpilot-profile', JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }, []);

  const updateDebt = useCallback((id: string, updates: Partial<DebtEntry>) => {
    setDebts(prev => {
      const next = prev.map(debt => {
        if (debt.id !== id) return debt;

        return {
          ...debt,
          ...updates,
          balance: updates.balance !== undefined ? Math.max(0, Number(updates.balance) || 0) : debt.balance,
          interestRate: updates.interestRate !== undefined ? Math.max(0, Number(updates.interestRate) || 0) : debt.interestRate,
          emi: updates.emi !== undefined ? Math.max(0, Number(updates.emi) || 0) : debt.emi,
          dueDay: updates.dueDay !== undefined ? Math.min(31, Math.max(1, Number(updates.dueDay) || 1)) : debt.dueDay,
        };
      });

      localStorage.setItem('finpilot-debts', JSON.stringify(next));
      syncDebtProfile(next);
      return next;
    });
  }, [syncDebtProfile]);

  const addDebt = useCallback(() => {
    setDebts(prev => {
      const next = [
        ...prev,
        {
          id: `debt-${Date.now()}`,
          name: `Debt ${prev.length + 1}`,
          type: 'other' as const,
          balance: 0,
          interestRate: 0,
          emi: 0,
          dueDay: 1,
        },
      ];

      localStorage.setItem('finpilot-debts', JSON.stringify(next));
      syncDebtProfile(next);
      return next;
    });
  }, [syncDebtProfile]);

  return (
    <FinanceContext.Provider value={{ profile, updateProfile, spending, updateSpending, debts, updateDebt, addDebt, debtPriority, tasks, toggleTask, addTask, score, plan, tax, expenses, completionPct }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
