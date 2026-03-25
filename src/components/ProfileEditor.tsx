import { useFinance } from '@/context/FinanceContext';
import { motion } from 'framer-motion';
import type { UserProfile } from '@/types/finance';
//Required Details
const fields: { key: keyof UserProfile; label: string; prefix?: string; type?: string }[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'age', label: 'Age' },
  { key: 'monthlySalary', label: 'Monthly Salary', prefix: '₹' },
  { key: 'monthlyExpenses', label: 'Monthly Expenses', prefix: '₹' },
  { key: 'monthlySavings', label: 'Monthly Savings', prefix: '₹' },
  { key: 'totalDebts', label: 'Total Debts', prefix: '₹' },
  { key: 'monthlyEMI', label: 'Monthly EMI', prefix: '₹' },
  { key: 'emergencyFund', label: 'Emergency Fund', prefix: '₹' },
  { key: 'totalInvestments', label: 'Total Investments', prefix: '₹' },
  { key: 'creditCardDebt', label: 'Credit Card Debt', prefix: '₹' },
  { key: 'retirementAge', label: 'Target Retirement Age' },
];

export function ProfileEditor() {
  const { profile, updateProfile } = useFinance();
  const derivedFields = new Set<keyof UserProfile>(['monthlyExpenses', 'monthlySavings', 'totalDebts', 'monthlyEMI', 'creditCardDebt']);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
      <h2 className="font-display text-xl mb-6">Your Financial Profile</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
            <div className="relative">
              {f.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{f.prefix}</span>}
              <input
                type={f.type || 'number'}
                value={profile[f.key]}
                onChange={e => updateProfile({ [f.key]: f.type === 'text' ? e.target.value : Number(e.target.value) })}
                readOnly={derivedFields.has(f.key)}
                className={`w-full bg-muted rounded-lg py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors ${f.prefix ? 'pl-8 pr-3' : 'px-3'} ${derivedFields.has(f.key) ? 'cursor-not-allowed opacity-70' : ''}`}
              />
            </div>
            {derivedFields.has(f.key) && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {f.key === 'monthlyExpenses' && 'Managed from the Spending tab.'}
                {f.key === 'monthlySavings' && 'Auto-calculated as salary minus expenses and monthly EMI.'}
                {(f.key === 'totalDebts' || f.key === 'monthlyEMI' || f.key === 'creditCardDebt') && 'Managed from the Debt list in the Spending tab.'}
              </p>
            )}
          </div>
        ))}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Risk Tolerance</label>
          <select
            value={profile.riskTolerance}
            onChange={e => updateProfile({ riskTolerance: e.target.value as UserProfile['riskTolerance'] })}
            className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors"
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
