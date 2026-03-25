import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Target, MessageCircle, Calculator, UserCog, TrendingUp, Menu, X, Zap, Wallet, Award, ListChecks, Receipt } from 'lucide-react';
import { MoneyScoreCard } from '@/components/MoneyScoreCard';
import { TaskEngine } from '@/components/TaskEngine';
import { ExpenseChart, WealthChart } from '@/components/Charts';
import { FirePlanner } from '@/components/FirePlanner';
import { ChatMentor } from '@/components/ChatMentor';
import { TaxOptimizer } from '@/components/TaxOptimizer';
import { ProfileEditor } from '@/components/ProfileEditor';
import { SpendingEditor } from '@/components/SpendingEditor';
import { useFinance } from '@/context/FinanceContext';

type Tab = 'dashboard' | 'planner' | 'chat' | 'tax' | 'spending' | 'profile';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'planner', label: 'FIRE Plan', icon: <Target className="w-4 h-4" /> },
  { id: 'chat', label: 'AI Mentor', icon: <MessageCircle className="w-4 h-4" /> },
  { id: 'tax', label: 'Tax', icon: <Calculator className="w-4 h-4" /> },
  { id: 'spending', label: 'Spending', icon: <Receipt className="w-4 h-4" /> },
  { id: 'profile', label: 'Profile', icon: <UserCog className="w-4 h-4" /> },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
};

const pageTransition = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.2 } },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [mobileMenu, setMobileMenu] = useState(false);
  const { profile, score, completionPct } = useFinance();
  const surplus = profile.monthlySalary - profile.monthlyExpenses;

  const stats = [
    { label: 'Monthly Income', value: `₹${(profile.monthlySalary / 1000).toFixed(0)}K`, sub: 'Gross salary', icon: <Wallet className="w-4 h-4" />, color: 'primary' as const },
    { label: 'Monthly Surplus', value: `₹${(surplus / 1000).toFixed(0)}K`, sub: `${((surplus / profile.monthlySalary) * 100).toFixed(0)}% savings rate`, icon: <Zap className="w-4 h-4" />, color: 'accent' as const },
    { label: 'Money Score', value: `${score.total}`, sub: score.total >= 75 ? 'Excellent' : score.total >= 50 ? 'Good' : 'Needs work', icon: <Award className="w-4 h-4" />, color: 'primary' as const },
    { label: 'Task Progress', value: `${completionPct}%`, sub: `This month`, icon: <ListChecks className="w-4 h-4" />, color: 'accent' as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-2xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Fin<span className="gradient-text">Pilot</span>
              <span className="text-xs font-medium text-muted-foreground ml-1.5 align-top">AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-muted/30 border border-border/30">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? 'nav-pill-active' : 'nav-pill-inactive'}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors">
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border/50 overflow-hidden bg-background/90 backdrop-blur-xl"
            >
              <div className="p-3 space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMobileMenu(false); }}
                    className={`w-full ${activeTab === tab.id ? 'nav-pill-active' : 'nav-pill-inactive'}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-6">
              {/* Greeting */}
              <motion.div variants={itemVariants}>
                <h1 className="font-display text-2xl font-bold tracking-tight">
                  Welcome back, <span className="gradient-text">{profile.name}</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Here's your financial health overview</p>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="stat-card group cursor-default"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                      stat.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                    }`}>
                      {stat.icon}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-2xl font-display font-bold mt-0.5 tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MoneyScoreCard />
                <ExpenseChart />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TaskEngine />
              </motion.div>

              <motion.div variants={itemVariants}>
                <WealthChart />
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'planner' && (
            <motion.div key="planner" {...pageTransition}>
              <FirePlanner />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div key="chat" {...pageTransition}>
              <ChatMentor />
            </motion.div>
          )}

          {activeTab === 'tax' && (
            <motion.div key="tax" {...pageTransition}>
              <TaxOptimizer />
            </motion.div>
          )}

          {activeTab === 'spending' && (
            <motion.div key="spending" {...pageTransition}>
              <div className="space-y-6">
                <SpendingEditor />
                <ExpenseChart />
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" {...pageTransition}>
              <ProfileEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
