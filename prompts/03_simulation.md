# Prompt 3 — Simulation Component (`src/components/Simulation.jsx`)

```
CRITICAL: You are a React 18 developer building an RL training progress
screen. The component MUST animate through training milestones and MUST
call runRLSimulation exactly once. The UI must update before computation
begins to avoid a frozen screen.
```

## Steps
1. Define `STEPS` array with 9 milestone objects `{ pct, msg }`
2. Initialize `stepIdx`, `done`, `results` state
3. Write `useEffect` that starts a recursive `setTimeout` chain advancing `stepIdx`
4. After final step, call `runRLSimulation(profile, 12)` inside a `setTimeout` callback
5. Set `results` and flip `done` to `true` when simulation finishes
6. Conditionally render preview KPIs section when `done === true`
7. Render "View Full Report" button calling `onComplete(results)`

## Module Plan (MoT Stage 1)
| # | Element | Purpose |
|---|---|---|
| 1 | `STEPS[]` | Training milestone messages + percentages |
| 2 | `stepIdx` state | Drives progress bar and log display |
| 3 | `done` state | Gates preview section visibility |
| 4 | `results` state | Stores full RL simulation output |
| 5 | `useEffect` | Orchestrates animation + RL execution |
| 6 | Preview KPIs | Shows finalSavings, goalProgress, avgHealthScore |

## Context
- STEPS array has 9 entries from 5% to 100%
- Each step has a training message describing the RL episode range
- Epsilon decay is shown in messages: ε=0.8 → ε=0.05
- Simulation runs synchronously inside a setTimeout to allow UI render

## Acceptance Criteria
- Progress bar animates from 5% to 100% across 9 steps
- Log shows past steps faded with ✓ checkmark
- Current active step shows ▶ highlighted in accent color
- Spinning icon changes to static green when `done === true`
- Preview KPIs appear only after simulation completes
- "View Full Report" button only visible when `done === true`

## Stop and Verify
```
1. Fill in a profile and click "Run AI Simulation"
   → Expected: progress bar starts animating immediately
2. Wait for completion (~5 seconds)
   → Expected: icon stops spinning and turns green
   → Expected: 3 KPI values appear (Final Savings, Goal %, Health Score)
3. Click "View Full Report"
   → Expected: navigates to Report page with full charts
```

```
MANDATORY: useEffect cleanup must call clearTimeout to prevent memory leaks.
MANDATORY: runRLSimulation must be called inside setTimeout so UI renders first.
CRITICAL: The "spinning" class MUST swap to "done" class on completion.
```