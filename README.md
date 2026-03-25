**“FinPilot AI – Personal Money Mentor”**.



## 🧩 Core Features

### 1. Money Health Score

* Collect user inputs: salary, expenses, savings, debts, goals
* Calculate a score out of 100 based on:

  * Emergency fund
  * Savings rate
  * Debt ratio
  * Investment level
* Display score with visual breakdown (charts)

---

### 2. AI Financial Planner (FIRE Planner)

* Generate a personalized monthly plan:

  * SIP investment suggestions
  * Emergency fund plan
  * Debt reduction strategy
* Show timeline (month-by-month roadmap)

---

### 3. AI Financial To-Do Engine (IMPORTANT)

* Automatically generate tasks based on user data
* Example tasks:

  * “Save ₹10,000 this month”
  * “Invest ₹5,000 in SIP”
  * “Pay credit card before 25th”
* Each task must include:

  * priority (high/medium/low)
  * deadline
  * impact (how it improves financial health)
* Tasks should dynamically update when user data changes
* Include task completion tracking and progress %

---

### 4. AI Chat Mentor

* Chat interface where user can ask:

  * “Can I afford a car?”
  * “How to save tax?”
  * “Where should I invest?”
* Use LLM API to generate contextual responses based on user profile

---

### 5. Tax Optimizer

* Compare old vs new tax regime
* Suggest deductions and tax-saving strategies
* Output clear savings amount

---

### 6. Dashboard UI

* Sections:

  * Money Score (top)
  * Charts (expenses, savings)
  * AI Plan
  * To-Do Tasks (highlighted)
* Clean, modern, mobile-first UI

---

## 🧠 Architecture (IMPORTANT)

Use a modular multi-agent backend:

* Profile Agent → stores user data
* Analysis Agent → calculates metrics
* Planning Agent → generates roadmap
* Task Agent → generates dynamic to-do list
* Chat Agent → handles user queries

---

## 🛠 Tech Stack

Frontend:

* React (with Vite or Next.js)
* Tailwind CSS
* Chart.js or Recharts

Backend:

* Python (FastAPI)
* REST API endpoints

AI:

* OpenAI API (or equivalent LLM)
* Prompt-based reasoning for financial advice

Database:

* SQLite or PostgreSQL

---

## 🎨 UI/UX Requirements

* Modern fintech style (like Groww / Zerodha)
* Soft shadows, rounded cards, clean layout
* Use icons and color-coded priorities
* Responsive design (mobile + desktop)

---

## 📊 Bonus Features (if possible)

* Daily AI nudges (“You overspent ₹500 this week”)
* Gamification (streaks, progress bar)
* “Impact per task” (future wealth increase)

---

## 🔐 Constraints

* Keep logic simple but realistic
* Avoid fake claims — show calculated outputs
* Use mock data where needed

---

## 📁 Output Requirements

* Full working code (frontend + backend)
* Clean folder structure
* README with setup instructions
* Sample data for testing

---

## 🎯 Priority

Focus on:

1. Working To-Do Engine
2. Money Score + Dashboard
3. AI Chat integration

