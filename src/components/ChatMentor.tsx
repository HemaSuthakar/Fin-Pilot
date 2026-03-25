import { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'Can I afford a car worth ₹8L?',
  'How to save tax this year?',
  'Where should I invest ₹10,000/month?',
  'Am I saving enough for retirement?',
];

function generateLocalResponse(question: string, profile: ReturnType<typeof useFinance>['profile'], score: ReturnType<typeof useFinance>['score']): string {
  const q = question.toLowerCase();
  const surplus = profile.monthlySalary - profile.monthlyExpenses - profile.monthlyEMI;

  if (q.includes('car') || q.includes('afford')) {
    const canAfford = surplus > 15000;
    return canAfford
      ? `Based on your surplus of ₹${surplus.toLocaleString('en-IN')}/month, you could afford a car EMI of ~₹${Math.round(surplus * 0.4).toLocaleString('en-IN')}/month. For an ₹8L car with 20% down payment, EMI would be ~₹12,000/month over 5 years. **Recommendation**: Save for a larger down payment first to reduce EMI burden. Your current money score is ${score.total}/100.`
      : `With your current surplus of ₹${surplus.toLocaleString('en-IN')}/month, a car purchase would strain your finances. Focus on building your emergency fund first (currently at ${(profile.emergencyFund / profile.monthlyExpenses).toFixed(1)} months of expenses, target is 6 months).`;
  }

  if (q.includes('tax') || q.includes('save tax')) {
    return `**Tax Saving Strategies for you:**\n\n1. **Section 80C** (₹1.5L limit): Invest in ELSS mutual funds for best returns + tax savings\n2. **Section 80D**: Get health insurance (₹25K deduction)\n3. **NPS (80CCD(1B))**: Additional ₹50K deduction\n4. **HRA**: If paying rent, claim HRA exemption\n\nAt your salary of ₹${(profile.monthlySalary * 12 / 100000).toFixed(1)}L/year, you could save up to ₹46,800 in taxes using old regime. Check the **Tax Optimizer** tab for a detailed comparison.`;
  }

  if (q.includes('invest') || q.includes('sip')) {
    const reco = profile.riskTolerance === 'aggressive'
      ? 'equity-heavy mutual funds (Nifty 50 Index Fund, Flexi-cap funds)'
      : profile.riskTolerance === 'moderate'
        ? 'a mix of equity (60%) and debt (40%) funds'
        : 'debt funds and PPF for stable, low-risk returns';
    return `Based on your **${profile.riskTolerance}** risk profile:\n\n**Recommended allocation:**\n- SIP: ₹${Math.round(surplus * 0.5).toLocaleString('en-IN')}/month in ${reco}\n- Emergency fund: ₹${Math.round(surplus * 0.3).toLocaleString('en-IN')}/month until you reach 6 months of expenses\n- Debt repayment: ₹${Math.round(surplus * 0.2).toLocaleString('en-IN')}/month\n\n💡 Start with **index funds** — they outperform 80% of actively managed funds over 10+ years.`;
  }

  if (q.includes('retire') || q.includes('saving enough')) {
    const yearsToRetire = profile.retirementAge - profile.age;
    const futureExpense = Math.round(profile.monthlyExpenses * Math.pow(1.06, yearsToRetire));
    const fireTarget = futureExpense * 12 * 25;
    return `**Retirement Analysis:**\n\n- Years to retirement: **${yearsToRetire}**\n- Future monthly expense (6% inflation): ₹${futureExpense.toLocaleString('en-IN')}\n- FIRE target (25x rule): ₹${(fireTarget / 10000000).toFixed(1)} Cr\n- Current investments: ₹${profile.totalInvestments.toLocaleString('en-IN')}\n\nYou need to invest more aggressively. Check the **FIRE Planner** for a month-by-month roadmap.`;
  }

  return `Great question! Based on your profile:\n\n- **Money Score**: ${score.total}/100\n- **Monthly surplus**: ₹${surplus.toLocaleString('en-IN')}\n- **Savings rate**: ${(((profile.monthlySalary - profile.monthlyExpenses) / profile.monthlySalary) * 100).toFixed(0)}%\n\nI'd recommend focusing on your highest-priority tasks in the **To-Do Engine**. ${score.total < 50 ? 'Your score needs improvement — clear high-interest debt first.' : 'You\'re on a good track! Consider increasing SIP investments.'}`;
}

export function ChatMentor() {
  const { profile, score } = useFinance();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hey ${profile.name}! 👋 I'm your AI financial mentor. Ask me anything about your money — investments, taxes, budgeting, or whether you can afford that dream purchase!` },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg: Message = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

    const response = generateLocalResponse(msg, profile, score);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex flex-col h-[600px]">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold">FinPilot AI Mentor</h2>
          <p className="text-xs text-muted-foreground">Personalized financial advice</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-accent" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse-glow" />
            </div>
            <div className="bg-muted p-3 rounded-xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors whitespace-nowrap flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
