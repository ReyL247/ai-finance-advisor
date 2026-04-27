# Prompt 5 — Report Component (`src/components/Report.jsx`)

```
CRITICAL: You are a React 18 developer building a 12-month financial
analysis report. The component MUST render 4 Recharts visualizations
and MUST display AI recommendations with priority-based color coding.
All chart tooltips MUST use the app design system CSS variables.
```

## Steps
1. Define `LABELS` and `PRIORITY_COLORS` maps
2. Build `chartData` array from `monthlyHistory`
3. Build `compareData` array mapping `originalExpenses` vs `finalExpenses`
4. Compute `healthColor` and `healthLabel` from `avgHealthScore` thresholds
5. Render 4 KPI summary cards
6. Render savings `LineChart` with dual lines (savings + expenses)
7. Render health `BarChart` with monthly scores
8. Render horizontal grouped `BarChart` for before/after comparison
9. Render scrollable AI decision log with action badges per month
10. Render recommendations list with priority color-coded left borders

## Module Plan (MoT Stage 1)
| # | Element | Purpose |
|---|---|---|
| 1 | `chartData` | monthlyHistory mapped for Recharts |
| 2 | `compareData` | Before vs after per expense category |
| 3 | `healthColor/Label` | Derived from avgHealthScore thresholds |
| 4 | Savings LineChart | Dual lines: savings growth + expenses |
| 5 | Health BarChart | Monthly health score 0–100 |
| 6 | Before/After BarChart | Grouped horizontal comparison |
| 7 | Action log | Scrollable RL decision log per month |
| 8 | Recommendations | Priority-coded advice cards |

## Context
- PRIORITY_COLORS: `high=#e87a7a, medium=#e8c87a, info=#7ab8e8, success=#7ae8b8`
- Health thresholds: ≥70 = Excellent, ≥50 = Good, <50 = Needs Work
- Charts library: recharts (LineChart, BarChart, XAxis, YAxis, Tooltip, Legend)
- Grid layout: 2-column on desktop, 1-column on mobile (max-width: 720px)

## Acceptance Criteria
- Savings line chart shows upward trend for valid profiles
- Health chart shows values between 0–100 for all 12 months
- Before/After chart shows reduced "After" bars vs "Before" bars
- Action log shows all 12 months with action name and health score
- Recommendations list shows at minimum 2 items
- `goalAchieved === true` → "🎉 Goal Reached!" shown in KPI card
- "← Back to Dashboard" returns to dashboard without resetting profile

## Stop and Verify
```
1. Run simulation with "Young Family" preset
   → Expected: Final Savings > $5,000 (starting currentSavings)
   → Expected: all 4 charts render without error
2. Check Action Log
   → Expected: 12 rows, each with month, action badge, health score
3. Check Recommendations
   → Expected: at least 1 priority card visible
4. Click "← Back to Dashboard"
   → Expected: returns to Dashboard, profile still loaded
```

```
PRIORITY_COLORS: high=#e87a7a, medium=#e8c87a, info=#7ab8e8, success=#7ae8b8
MANDATORY: All Tooltip contentStyle must use var(--surface) and var(--border).
MANDATORY: span2 cards must collapse to span 1 on screens below 720px.
CRITICAL: All value formatters must use Number(v).toLocaleString().
```