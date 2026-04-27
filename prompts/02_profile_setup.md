# Prompt 2 — ProfileSetup Component (`src/components/ProfileSetup.jsx`)

```
CRITICAL: You are a React 18 developer building a validated financial
profile input form. The component MUST prevent invalid data from ever
reaching the RL engine. Validation MUST run before onSubmit is called.
```

## Steps
1. Define `PRESETS` object with 3 profiles: `student`, `earlyCareer`, `family`
2. Initialize `form` state with 9 controlled fields (all empty strings)
3. Initialize `errors` state as empty object
4. Implement `set(field, val)` — updates a single form field
5. Implement `applyPreset(key)` — fills all form fields from PRESETS and clears errors
6. Implement `validate()` — checks required fields and expense-vs-income rule
7. Implement `handleSubmit(e)` — calls validate(), blocks on errors, calls `onSubmit()`
8. Render live expense bar showing `totalExpenses / income` percentage in real time

## Module Plan (MoT Stage 1)
| # | Element | Purpose |
|---|---|---|
| 1 | `PRESETS` | Quick-start budget profiles |
| 2 | `form` state | Controlled inputs for all fields |
| 3 | `errors` state | Field-level validation messages |
| 4 | `validate()` | Guards RL engine from bad input |
| 5 | `applyPreset()` | One-click profile population |
| 6 | `handleSubmit()` | Final gate before data flows to App |
| 7 | Expense bar | Live visual feedback on budget balance |

## Context
- Required fields: income, rent, food, transport, savingsGoal
- Optional fields: entertainment, other, currentSavings, name
- Validation rules:
  - Required fields must be non-empty valid numbers
  - Total expenses MUST be less than income
  - No negative values allowed

## Acceptance Criteria
- Submitting with empty required fields shows inline error messages
- Submitting where total expenses ≥ income shows "Expenses exceed income"
- Preset buttons fill all fields instantly and clear all errors
- Live expense bar turns red when expenses exceed income
- `onSubmit` is never called with invalid or unconverted data
- All values passed to parent are `Number` type not strings

## Stop and Verify
```
1. Open http://localhost:5173
2. Click "Initialize Profile" with empty form
   → Expected: required field errors appear inline
3. Enter income: 2000, rent: 1500, food: 600
   → Expected: bar turns red, error "Expenses exceed income"
4. Click "Student Budget" preset
   → Expected: all fields populate, errors clear
5. Click "Initialize Profile"
   → Expected: navigates to Dashboard
```

```
MANDATORY: Call e.preventDefault() in handleSubmit.
MANDATORY: Never call onSubmit() when validate() returns errors.
CRITICAL: All numeric values passed to parent MUST use Number() casting.
```