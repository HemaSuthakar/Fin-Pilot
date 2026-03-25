import { motion } from 'framer-motion';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, ArrowRight } from 'lucide-react';

export function SpendingEditor() {
  const { spending, updateSpending, debts, updateDebt, addDebt, debtPriority, profile, plan } = useFinance();
  const total = spending.reduce((sum, entry) => sum + entry.amount, 0);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const nextDebt = debtPriority[0];
  const firstDebtMonth = plan[0];
  const debtFreeMonth = plan.find((month) => month.remainingDebt === 0 && month.debtPayment > 0);
  const typeOptions = [
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'personal-loan', label: 'Personal Loan' },
    { value: 'car-loan', label: 'Car Loan' },
    { value: 'home-loan', label: 'Home Loan' },
    { value: 'education-loan', label: 'Education Loan' },
    { value: 'other', label: 'Other' },
  ] as const;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass-card p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl tracking-tight">Monthly Spending</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter each spending category. Expense Breakdown updates from these values.
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Expenses</p>
            <p className="font-display text-2xl font-bold tracking-tight">Rs {total.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground">
              {((total / Math.max(profile.monthlySalary, 1)) * 100).toFixed(0)}% of income
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {spending.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-border/50 bg-background/30 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <label className="text-sm font-medium">{entry.name}</label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rs</span>
                <input
                  type="number"
                  min="0"
                  value={entry.amount}
                  onChange={(event) => updateSpending(entry.id, Number(event.target.value))}
                  className="w-full rounded-lg border border-border bg-muted py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl tracking-tight">Debt List</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track balances, EMI and due dates. The app recommends which debt to finish first.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Debt</p>
              <p className="font-display text-2xl font-bold tracking-tight">Rs {totalDebt.toLocaleString('en-IN')}</p>
            </div>
            <Button type="button" onClick={addDebt}>
              <Plus className="h-4 w-4" />
              Add Debt
            </Button>
          </div>
        </div>

        {nextDebt && (
          <div className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">Recommended first payoff</span>
            </div>
            <p className="font-display text-lg tracking-tight text-foreground">{nextDebt.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with this because it combines a {nextDebt.interestRate}% interest rate, Rs {nextDebt.emi.toLocaleString('en-IN')} EMI,
              and a due date on day {nextDebt.dueDay} of each month.
            </p>
          </div>
        )}

        {totalDebt > 0 && firstDebtMonth && (
          <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-foreground">Debt payoff plan</p>
            <p className="mt-1 text-sm text-muted-foreground">
              In {firstDebtMonth.month}, pay Rs {firstDebtMonth.debtPayment.toLocaleString('en-IN')} toward debt after covering expenses and EMIs.
              {debtFreeMonth
                ? ` Debt reaches Rs 0 in ${debtFreeMonth.month}.`
                : ` Remaining debt after 12 months: Rs ${plan[plan.length - 1]?.remainingDebt.toLocaleString('en-IN')}.`}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {debts.map((debt, index) => (
            <div key={debt.id} className="rounded-2xl border border-border/50 bg-background/30 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">#{index + 1} {debt.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {debtPriority[0]?.id === debt.id ? 'Highest payoff priority' : `Priority #${debtPriority.findIndex((item) => item.id === debt.id) + 1}`}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  Due day {debt.dueDay}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Debt Name</label>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(event) => updateDebt(debt.id, { name: event.target.value })}
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Type</label>
                  <select
                    value={debt.type}
                    onChange={(event) => updateDebt(debt.id, { type: event.target.value as typeof debt.type })}
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Balance</label>
                  <input
                    type="number"
                    min="0"
                    value={debt.balance}
                    onChange={(event) => updateDebt(debt.id, { balance: Number(event.target.value) })}
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Interest %</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={debt.interestRate}
                    onChange={(event) => updateDebt(debt.id, { interestRate: Number(event.target.value) })}
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Monthly EMI</label>
                  <input
                    type="number"
                    min="0"
                    value={debt.emi}
                    onChange={(event) => updateDebt(debt.id, { emi: Number(event.target.value) })}
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Due Day</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={debt.dueDay}
                    onChange={(event) => updateDebt(debt.id, { dueDay: Number(event.target.value) })}
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div className="rounded-xl border border-border/50 bg-background/40 px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Monthly Interest Estimate</p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    Rs {Math.round((debt.balance * debt.interestRate) / 1200).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
