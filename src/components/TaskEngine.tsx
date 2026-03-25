import { FormEvent, useMemo, useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Flame,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const priorityIcon = {
  high: <Flame className="w-3.5 h-3.5" />,
  medium: <AlertTriangle className="w-3.5 h-3.5" />,
  low: <TrendingUp className="w-3.5 h-3.5" />,
};

const priorityWeight = { high: 0, medium: 1, low: 2 };

const categoryEmoji: Record<string, string> = {
  emergency: '🛡️',
  savings: '💰',
  debt: '💳',
  investment: '📈',
  tax: '🧾',
  custom: '📝',
};

export function TaskEngine() {
  const { tasks, toggleTask, addTask, completionPct } = useFinance();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
  }, [tasks]);

  const openTasks = sortedTasks.filter(task => !task.completed);
  const doneTasks = sortedTasks.filter(task => task.completed);
  const completedCount = tasks.filter(task => task.completed).length;

  const handleAddTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  const renderTask = (task: (typeof tasks)[number]) => (
    <motion.div
      key={task.id}
      layout
      initial={{ opacity: 0, x: task.completed ? 16 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: task.completed ? 16 : -16, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={() => toggleTask(task.id)}
      className={`group flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
        task.completed
          ? 'cursor-pointer border-border/20 bg-muted/20 opacity-60 hover:opacity-80'
          : 'cursor-pointer border-border/50 hover:border-primary/30 hover:bg-primary/[0.02]'
      }`}
    >
      <div className="mt-0.5 flex-shrink-0">
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary/60" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium leading-snug ${task.completed ? 'text-muted-foreground line-through' : ''}`}>
            {categoryEmoji[task.category] || '📋'} {task.title}
          </p>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{task.description}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className={`priority-badge-${task.priority} inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold`}>
            {priorityIcon[task.priority]}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            📅 {task.deadline}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-primary">
            <ArrowRight className="h-3 w-3" />
            {task.impact}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-6 pb-0">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">AI To-Do Engine</h2>
          <span className="text-xs font-medium text-muted-foreground">
            {completedCount}/{tasks.length} done
          </span>
        </div>

        <div className="mb-5 mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(170, 58%, 40%))' }}
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="min-w-[3ch] text-right font-display text-sm font-bold text-primary">{completionPct}%</span>
        </div>

        <form onSubmit={handleAddTask} className="flex flex-col gap-2 pb-5 sm:flex-row">
          <Input
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
            placeholder="Add a task"
            aria-label="Add a task"
            className="bg-background/70"
          />
          <Button type="submit">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </form>
      </div>

      <div className="grid gap-4 px-6 pb-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-background/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight">To Do</h3>
            <span className="text-xs text-muted-foreground">{openTasks.length} tasks</span>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">{openTasks.map(renderTask)}</AnimatePresence>
            {openTasks.length === 0 && (
              <p className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
                No open tasks.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-background/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight">Done</h3>
            <span className="text-xs text-muted-foreground">{doneTasks.length} tasks</span>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">{doneTasks.map(renderTask)}</AnimatePresence>
            {doneTasks.length === 0 && (
              <p className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
                Completed tasks will move here.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
