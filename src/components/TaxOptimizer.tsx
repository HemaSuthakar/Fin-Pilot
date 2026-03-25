import { useFinance } from '@/context/FinanceContext';
import { motion } from 'framer-motion';

export function TaxOptimizer() {
  const { tax } = useFinance();

  const winner = tax.oldRegimeTax < tax.newRegimeTax ? 'old' : 'new';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
      <h2 className="font-display text-xl mb-6">Tax Optimizer</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${winner === 'old' ? 'border-primary bg-primary/5 glow-primary' : 'border-border'}`}>
          <p className="text-xs text-muted-foreground mb-1">Old Regime Tax</p>
          <p className="text-2xl font-display font-bold">₹{tax.oldRegimeTax.toLocaleString('en-IN')}</p>
          {winner === 'old' && <span className="text-xs text-primary mt-2 inline-block">✓ Recommended</span>}
        </div>
        <div className={`p-4 rounded-lg border ${winner === 'new' ? 'border-primary bg-primary/5 glow-primary' : 'border-border'}`}>
          <p className="text-xs text-muted-foreground mb-1">New Regime Tax</p>
          <p className="text-2xl font-display font-bold">₹{tax.newRegimeTax.toLocaleString('en-IN')}</p>
          {winner === 'new' && <span className="text-xs text-primary mt-2 inline-block">✓ Recommended</span>}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-6">
        <p className="text-sm font-medium text-primary">{tax.recommendation}</p>
        <p className="text-xs text-muted-foreground mt-1">You save ₹{tax.savings.toLocaleString('en-IN')} with the recommended regime</p>
      </div>

      <h3 className="font-display text-sm text-muted-foreground mb-3">Available Deductions (Old Regime)</h3>
      <div className="space-y-2">
        {tax.deductions.map((d, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">{d.name}</p>
              <p className="text-xs text-muted-foreground">{d.section}</p>
            </div>
            <span className="text-sm font-display font-semibold text-primary">₹{d.amount.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
