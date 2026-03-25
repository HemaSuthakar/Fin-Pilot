import { useFinance } from '@/context/FinanceContext';
import { motion } from 'framer-motion';
import { WealthChart, PlanBreakdownChart } from './Charts';

export function FirePlanner() {
  const { plan, profile } = useFinance();
  const finalWealth = plan[plan.length - 1]?.cumulativeWealth || 0;
  const yearsToFIRE = profile.retirementAge - profile.age;
  const monthlyExpAtRetire = Math.round(profile.monthlyExpenses * Math.pow(1.06, yearsToFIRE));
  const fireTarget = monthlyExpAtRetire * 12 * 25;
  const hasDebt = profile.totalDebts > 0;
  const debtFreeMonth = plan.find((month) => month.remainingDebt === 0 && month.debtPayment > 0);
  const firstMonthDebtPayment = plan[0]?.debtPayment || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-display text-xl mb-4">FIRE Planner</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Financial Independence, Retire Early - your personalized roadmap based on current data.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: 'FIRE Target', value: `Rs ${(fireTarget / 10000000).toFixed(1)}Cr` },
            { label: 'Years to FIRE', value: `${yearsToFIRE} yrs` },
            { label: '12-Month Wealth', value: `Rs ${(finalWealth / 100000).toFixed(1)}L` },
            { label: 'Monthly Expense@Retire', value: `Rs ${(monthlyExpAtRetire / 1000).toFixed(0)}K` },
          ].map((item, i) => (
            <div key={i} className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-lg font-display font-bold text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <WealthChart />
      <PlanBreakdownChart />

      <div className="glass-card p-6">
        <h3 className="font-display text-sm text-muted-foreground mb-3">12-Month Roadmap</h3>
        {hasDebt && (
          <p className="mb-4 text-xs text-muted-foreground">
            Month 1 puts Rs {firstMonthDebtPayment.toLocaleString('en-IN')} toward debt after expenses and EMIs.
            {debtFreeMonth
              ? ` The plan reaches Rs 0 debt in ${debtFreeMonth.month}, then shifts fully to saving and investing.`
              : ' The plan keeps prioritizing debt before savings and SIPs until the balance reaches Rs 0.'}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium text-muted-foreground">Month</th>
                <th className="py-2 text-right font-medium text-muted-foreground">SIP</th>
                <th className="py-2 text-right font-medium text-muted-foreground">Emergency</th>
                <th className="py-2 text-right font-medium text-muted-foreground">Debt</th>
                <th className="py-2 text-right font-medium text-muted-foreground">Debt Left</th>
                <th className="py-2 text-right font-medium text-muted-foreground">Savings</th>
                <th className="py-2 text-right font-medium text-muted-foreground">Total Wealth</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((month, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-2 font-medium">{month.month}</td>
                  <td className="text-right text-primary">Rs {month.sipAmount.toLocaleString('en-IN')}</td>
                  <td className="text-right">Rs {month.emergencyFundContribution.toLocaleString('en-IN')}</td>
                  <td className="text-right text-destructive">Rs {month.debtPayment.toLocaleString('en-IN')}</td>
                  <td className="text-right font-medium">
                    {month.remainingDebt === 0 ? 'Rs 0' : `Rs ${month.remainingDebt.toLocaleString('en-IN')}`}
                  </td>
                  <td className="text-right text-accent">Rs {month.savings.toLocaleString('en-IN')}</td>
                  <td className="text-right font-semibold">Rs {month.cumulativeWealth.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
