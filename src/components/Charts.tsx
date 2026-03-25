import { useFinance } from '@/context/FinanceContext';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

const chartColors = {
  grid: 'hsl(225,16%,15%)',
  tick: 'hsl(218,14%,50%)',
  tooltip: {
    bg: 'hsl(225,20%,9%)',
    border: 'hsl(225,16%,18%)',
    label: 'hsl(210,20%,96%)',
  },
};

export function ExpenseChart() {
  const { expenses } = useFinance();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
      <h2 className="font-display text-sm font-medium text-muted-foreground mb-5 uppercase tracking-wider">Expense Breakdown</h2>
      <div className="flex items-center gap-6">
        <div className="w-36 h-36 flex-shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={expenses} dataKey="amount" nameKey="name" cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3} strokeWidth={0}>
                {expenses.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: chartColors.tooltip.bg, border: `1px solid ${chartColors.tooltip.border}`, borderRadius: '10px', fontSize: '12px' }}
                labelStyle={{ color: chartColors.tooltip.label }}
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {expenses.map((exp, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-background" style={{ backgroundColor: exp.color, boxShadow: `0 0 6px ${exp.color}40` }} />
                <span className="text-muted-foreground">{exp.name}</span>
              </div>
              <span className="font-medium font-display tabular-nums">₹{exp.amount.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function WealthChart() {
  const { plan } = useFinance();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
      <h2 className="font-display text-sm font-medium text-muted-foreground mb-5 uppercase tracking-wider">Wealth Growth Projection</h2>
      <div className="h-56">
        <ResponsiveContainer>
          <AreaChart data={plan}>
            <defs>
              <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(152,62%,46%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(152,62%,46%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: chartColors.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} tick={{ fill: chartColors.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
            <Tooltip
              contentStyle={{ backgroundColor: chartColors.tooltip.bg, border: `1px solid ${chartColors.tooltip.border}`, borderRadius: '10px', fontSize: '12px' }}
              labelStyle={{ color: chartColors.tooltip.label }}
              formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Wealth']}
            />
            <Area type="monotone" dataKey="cumulativeWealth" stroke="hsl(152,62%,46%)" fill="url(#wealthGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(225,22%,5%)' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function PlanBreakdownChart() {
  const { plan } = useFinance();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
      <h2 className="font-display text-sm font-medium text-muted-foreground mb-5 uppercase tracking-wider">Monthly Allocation</h2>
      <div className="h-56">
        <ResponsiveContainer>
          <BarChart data={plan.slice(0, 6)} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: chartColors.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} tick={{ fill: chartColors.tick, fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
            <Tooltip
              contentStyle={{ backgroundColor: chartColors.tooltip.bg, border: `1px solid ${chartColors.tooltip.border}`, borderRadius: '10px', fontSize: '12px' }}
              labelStyle={{ color: chartColors.tooltip.label }}
              formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`]}
            />
            <Bar dataKey="sipAmount" name="SIP" fill="hsl(152,62%,46%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="emergencyFundContribution" name="Emergency" fill="hsl(200,82%,52%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="debtPayment" name="Debt" fill="hsl(0,76%,54%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="savings" name="Savings" fill="hsl(38,95%,58%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}