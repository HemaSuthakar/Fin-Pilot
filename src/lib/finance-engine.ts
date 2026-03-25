import type { UserProfile, MoneyScore, FinancialTask, MonthlyPlan, TaxComparison, ExpenseCategory, SpendingEntry, DebtEntry } from '@/types/finance';

export function calculateMoneyScore(profile: UserProfile): MoneyScore {
  const monthsOfExpenses = profile.emergencyFund / profile.monthlyExpenses;
  const emergencyScore = Math.min(25, (monthsOfExpenses / 6) * 25);

  const savingsRate = ((profile.monthlySalary - profile.monthlyExpenses) / profile.monthlySalary) * 100;
  const savingsScore = Math.min(25, (savingsRate / 30) * 25);

  const debtToIncome = profile.totalDebts / (profile.monthlySalary * 12);
  const debtScore = Math.min(25, Math.max(0, (1 - debtToIncome) * 25));

  const investmentToIncome = profile.totalInvestments / (profile.monthlySalary * 12);
  const investmentScore = Math.min(25, investmentToIncome * 25);

  return {
    total: Math.round(emergencyScore + savingsScore + debtScore + investmentScore),
    emergencyFund: Math.round(emergencyScore),
    savingsRate: Math.round(savingsScore),
    debtRatio: Math.round(debtScore),
    investmentLevel: Math.round(investmentScore),
  };
}

export function generateTasks(profile: UserProfile): FinancialTask[] {
  const tasks: FinancialTask[] = [];
  const now = new Date();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const monthsOfExpenses = profile.emergencyFund / profile.monthlyExpenses;
  if (monthsOfExpenses < 6) {
    const needed = profile.monthlyExpenses * 6 - profile.emergencyFund;
    const monthly = Math.min(Math.round(needed / 6), Math.round(profile.monthlySavings * 0.4));
    tasks.push({
      id: 'ef-1',
      title: `Save ₹${monthly.toLocaleString('en-IN')} for emergency fund`,
      description: `You have ${monthsOfExpenses.toFixed(1)} months of expenses saved. Target: 6 months (₹${(profile.monthlyExpenses * 6).toLocaleString('en-IN')})`,
      priority: monthsOfExpenses < 3 ? 'high' : 'medium',
      deadline: formatDate(monthEnd),
      impact: `+${Math.round((monthly / (profile.monthlyExpenses * 6)) * 25)} points on Money Score`,
      completed: false,
      category: 'emergency',
    });
  }

  const savingsRate = ((profile.monthlySalary - profile.monthlyExpenses) / profile.monthlySalary) * 100;
  if (savingsRate < 20) {
    const target = Math.round(profile.monthlySalary * 0.2);
    const cutNeeded = target - (profile.monthlySalary - profile.monthlyExpenses);
    tasks.push({
      id: 'sv-1',
      title: `Reduce expenses by ₹${cutNeeded.toLocaleString('en-IN')}/month`,
      description: `Current savings rate: ${savingsRate.toFixed(0)}%. Aim for at least 20%.`,
      priority: savingsRate < 10 ? 'high' : 'medium',
      deadline: formatDate(monthEnd),
      impact: 'Boost savings score significantly',
      completed: false,
      category: 'savings',
    });
  }

  if (profile.creditCardDebt > 0) {
    tasks.push({
      id: 'cc-1',
      title: `Pay credit card debt of ₹${profile.creditCardDebt.toLocaleString('en-IN')}`,
      description: 'Credit card debt carries 30-40% interest. Clear this first.',
      priority: 'high',
      deadline: formatDate(new Date(now.getFullYear(), now.getMonth(), 25)),
      impact: 'Saves ₹' + Math.round(profile.creditCardDebt * 0.03).toLocaleString('en-IN') + '/month in interest',
      completed: false,
      category: 'debt',
    });
  }

  const sipAmount = Math.round(profile.monthlySavings * 0.5);
  if (sipAmount > 0) {
    tasks.push({
      id: 'sip-1',
      title: `Invest ₹${sipAmount.toLocaleString('en-IN')} in SIP this month`,
      description: profile.riskTolerance === 'aggressive'
        ? 'Consider equity-heavy mutual funds for long-term growth'
        : 'Consider balanced or debt funds for stable returns',
      priority: 'medium',
      deadline: formatDate(new Date(now.getFullYear(), now.getMonth(), 5)),
      impact: `At 12% returns, this grows to ₹${Math.round(sipAmount * Math.pow(1.01, (profile.retirementAge - profile.age) * 12)).toLocaleString('en-IN')} by retirement`,
      completed: false,
      category: 'investment',
    });
  }

  if (profile.monthlySalary > 50000) {
    tasks.push({
      id: 'tax-1',
      title: 'Review tax-saving investments under 80C',
      description: 'Maximize ₹1.5L deduction with ELSS, PPF, or NPS',
      priority: 'medium',
      deadline: formatDate(new Date(now.getFullYear(), 2, 31)),
      impact: 'Save up to ₹46,800 in taxes (30% bracket)',
      completed: false,
      category: 'tax',
    });
  }

  if (profile.totalDebts > profile.monthlySalary * 6) {
    tasks.push({
      id: 'debt-1',
      title: `Accelerate debt repayment – add ₹${Math.round(profile.monthlySavings * 0.3).toLocaleString('en-IN')}/month`,
      description: `Total debt ₹${profile.totalDebts.toLocaleString('en-IN')} is more than 6× your salary. Focus on high-interest debt first.`,
      priority: 'high',
      deadline: formatDate(monthEnd),
      impact: 'Reduce debt burden and improve debt score',
      completed: false,
      category: 'debt',
    });
  }

  return tasks;
}

export function generateMonthlyPlan(profile: UserProfile): MonthlyPlan[] {
  const months: MonthlyPlan[] = [];
  const monthlySurplus = Math.max(0, profile.monthlySalary - profile.monthlyExpenses - profile.monthlyEMI);
  const sipPct = profile.riskTolerance === 'aggressive' ? 0.5 : profile.riskTolerance === 'moderate' ? 0.4 : 0.3;

  let cumWealth = profile.totalInvestments + profile.emergencyFund;
  let remainingDebt = Math.max(0, profile.totalDebts);
  let currentEmergencyFund = profile.emergencyFund;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const monthIdx = (now.getMonth() + i) % 12;
    const year = now.getFullYear() + Math.floor((now.getMonth() + i) / 12);
    const emergencyTarget = profile.monthlyExpenses * 6;
    const emergencyNeeded = Math.max(0, emergencyTarget - currentEmergencyFund);
    const reserveForDebt = i === 0
      ? Math.max(0, currentEmergencyFund - profile.monthlyExpenses)
      : 0;
    const debtBudget = remainingDebt > 0 ? monthlySurplus + reserveForDebt : 0;
    const debtPay = Math.min(remainingDebt, debtBudget);
    const reserveUsed = Math.min(reserveForDebt, debtPay);

    remainingDebt = Math.max(0, remainingDebt - debtPay);
    currentEmergencyFund = Math.max(0, currentEmergencyFund - reserveUsed);
    cumWealth = Math.max(0, cumWealth - reserveUsed);

    const debtStillActive = remainingDebt > 0;
    const efContrib = debtStillActive
      ? 0
      : emergencyNeeded > 0
        ? Math.min(Math.round(monthlySurplus * 0.3), Math.round(emergencyNeeded / Math.max(1, 6 - i)))
        : 0;
    const sipAmount = debtStillActive ? 0 : Math.round(monthlySurplus * sipPct);
    const sav = debtStillActive ? 0 : Math.max(0, monthlySurplus - sipAmount - efContrib);

    cumWealth += sipAmount + efContrib + sav;
    currentEmergencyFund += efContrib;
    cumWealth *= 1.01; // ~12% annual growth

    months.push({
      month: `${monthNames[monthIdx]} ${year}`,
      sipAmount,
      emergencyFundContribution: efContrib,
      debtPayment: debtPay,
      remainingDebt: Math.round(remainingDebt),
      savings: sav,
      cumulativeWealth: Math.round(cumWealth),
    });
  }
  return months;
}

export function calculateTax(profile: UserProfile): TaxComparison {
  const annual = profile.monthlySalary * 12;
  const stdDeduction = 50000;

  // Old regime
  const deductions = [
    { name: 'Standard Deduction', amount: stdDeduction, section: 'Sec 16' },
    { name: '80C (PPF/ELSS/LIC)', amount: 150000, section: 'Sec 80C' },
    { name: '80D (Health Insurance)', amount: 25000, section: 'Sec 80D' },
    { name: 'NPS (80CCD)', amount: 50000, section: 'Sec 80CCD(1B)' },
  ];
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const oldTaxable = Math.max(0, annual - totalDeductions);
  const oldTax = calcOldRegimeTax(oldTaxable);

  // New regime
  const newTaxable = Math.max(0, annual - 75000); // standard deduction in new regime
  const newTax = calcNewRegimeTax(newTaxable);

  return {
    oldRegimeTax: oldTax,
    newRegimeTax: newTax,
    savings: Math.abs(oldTax - newTax),
    recommendation: oldTax < newTax ? 'Old Regime saves you more' : 'New Regime saves you more',
    deductions,
  };
}

function calcOldRegimeTax(income: number): number {
  if (income <= 250000) return 0;
  let tax = 0;
  if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05;
  if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.20;
  if (income > 1000000) tax += (income - 1000000) * 0.30;
  return Math.round(tax * 1.04); // 4% cess
}

function calcNewRegimeTax(income: number): number {
  if (income <= 400000) return 0;
  let tax = 0;
  const slabs = [
    [400000, 800000, 0.05],
    [800000, 1200000, 0.10],
    [1200000, 1600000, 0.15],
    [1600000, 2000000, 0.20],
    [2000000, 2400000, 0.25],
    [2400000, Infinity, 0.30],
  ] as const;
  for (const [low, high, rate] of slabs) {
    if (income > low) tax += Math.min(income - low, high - low) * rate;
  }
  return Math.round(tax * 1.04);
}

export function getExpenseBreakdown(spending: SpendingEntry[]): ExpenseCategory[] {
  const total = spending.reduce((sum, entry) => sum + entry.amount, 0);

  return spending.map(entry => ({
    name: entry.name,
    amount: entry.amount,
    percentage: total > 0 ? Math.round((entry.amount / total) * 100) : 0,
    color: entry.color,
  }));
}

export function rankDebts(debts: DebtEntry[]) {
  return [...debts].sort((a, b) => {
    const scoreA = a.interestRate * 4 + (a.emi / Math.max(a.balance, 1)) * 100 + Math.max(0, 31 - a.dueDay);
    const scoreB = b.interestRate * 4 + (b.emi / Math.max(b.balance, 1)) * 100 + Math.max(0, 31 - b.dueDay);
    return scoreB - scoreA;
  });
}
