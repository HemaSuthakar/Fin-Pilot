import { useFinance } from '@/context/FinanceContext';
import { motion } from 'framer-motion';
//score card details
export function MoneyScoreCard() {
  const { score } = useFinance();

  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-primary';
    if (s >= 50) return 'text-accent';
    return 'text-destructive';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 75) return 'Excellent';
    if (s >= 50) return 'Good';
    if (s >= 25) return 'Needs Work';
    return 'Critical';
  };

  const breakdown = [
    { label: 'Emergency Fund', value: score.emergencyFund, max: 25, emoji: '🛡️' },
    { label: 'Savings Rate', value: score.savingsRate, max: 25, emoji: '💰' },
    { label: 'Debt Health', value: score.debtRatio, max: 25, emoji: '💳' },
    { label: 'Investments', value: score.investmentLevel, max: 25, emoji: '📈' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Subtle glow behind score */}
      <div className="absolute top-4 left-4 w-32 h-32 bg-primary/[0.06] rounded-full blur-[60px] pointer-events-none" />

      <h2 className="font-display text-sm font-medium text-muted-foreground mb-5 uppercase tracking-wider">Money Health Score</h2>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 264' }}
              animate={{ strokeDasharray: `${score.total * 2.64} 264` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`text-3xl font-display font-bold ${getScoreColor(score.total)}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              {score.total}
            </motion.span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">/100</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <p className={`text-sm font-semibold ${getScoreColor(score.total)}`}>{getScoreLabel(score.total)}</p>
          {breakdown.map((item, idx) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="flex items-center gap-1.5">{item.emoji} {item.label}</span>
                <span className="font-medium">{item.value}/{item.max}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / item.max) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
