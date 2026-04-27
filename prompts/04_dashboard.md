# Prompt 4 — Dashboard Component (`src/components/Dashboard.jsx`)

```
CRITICAL: You are a React 18 developer building a financial dashboard.
The component MUST display live budget analysis using Recharts and MUST
classify the savings rate into a health band with color coding.
```

## Steps
1. Define `COLORS` array and `LABELS` map for 5 expense categories
2. Compute `totalExp`, `monthlySavings`, `savingsRate`, `goalProgress` from profile
3. Implement `getHealthBand()` — returns `{ label, color, icon }` based on savings rate
4. Build `pieData` array mapping expense categories to Recharts format
5. Render 4 KPI cards: income, totalExpenses, monthlySavings, savingsRate
6. Render donut `PieChart` with legend
7. Render budget allocation bars for each category
8. Render SVG goal progress ring using `strokeDashoffset` formula
9. Render simulation CTA section

## Module Plan (MoT Stage 1)
| # | Element | Purpose |
|---|---|---|
| 1 | `getHealthBand()` | Classifies savings rate into health band |
| 2 | `pieData` array | Maps expenses to Recharts PieChart format |
| 3 | KPI row | 4 summary cards at top of dashboard |
| 4 | PieChart | Donut chart of expense breakdown |
| 5 | Allocation bars | Horizontal bars per category |
| 6 | Goal ring | SVG circle showing savings goal progress |
| 7 | Sim CTA | Button to launch the RL simulation |

## Context
- Health bands: ≥20% = Healthy, 10–19% = Moderate, <10% = At Risk
- COLORS: `["#e8c87a", "#7ab8e8", "#7ae8b8", "#e87ab8", "#b87ae8"]`
- Goal ring formula: `strokeDashoffset = 2 * Math.PI * 52 * (1 - goalProgress/100)`
- Charts library: recharts (PieChart, Pie, Cell, Tooltip, ResponsiveContainer)

## Acceptance Criteria
- Savings rate ≥ 20% → label "Healthy", color `#7ae8b8`
- Savings rate 10–19% → label "Moderate", color `#e8c87a`
- Savings rate < 10% → label "At Risk", color `#e87a7a`
- Goal ring fills proportionally to `currentSavings / savingsGoal`
- Negative `monthlySavings` displays in red with `.neg` class
- All dollar values formatted with `.toLocaleString()`

## Stop and Verify
```
1. Load "Early Career" preset → Initialize Profile
   → Expected: income $4,500, savings rate and health band badge visible
2. Check pie chart
   → Expected: 5 colored segments matching expense categories
3. Check goal ring
   → Expected: ring partially filled, percentage shown in center
4. Click "Run AI Simulation"
   → Expected: navigates to Simulation page
```

```
MANDATORY: All dollar values must use .toLocaleString() for formatting.
CRITICAL: Goal ring strokeDashoffset = 2 * Math.PI * 52 * (1 - goalProgress/100)
```