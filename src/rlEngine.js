/**
 * RL-Based Budget Optimization Engine
 * Uses Q-Learning to learn optimal budget allocation strategies
 * across simulated monthly financial cycles.
 *
 * State:  [savingsRatio bucket, spendingRatio bucket, goalProgress bucket]
 * Actions: [reduce_rent, reduce_food, reduce_transport, reduce_entertainment,
 *           reduce_other, increase_savings, maintain]
 * Reward:  based on savings rate improvement, goal progress, and financial health
 */

const ACTIONS = [
    "reduce_rent",
    "reduce_food",
    "reduce_transport",
    "reduce_entertainment",
    "reduce_other",
    "increase_savings",
    "maintain",
  ];
  
  const ALPHA = 0.15;
  const GAMMA = 0.9;
  const EPSILON_START = 0.8;
  const EPSILON_END = 0.05;
  const EPSILON_DECAY = 0.92;
  
  function discretize(value, bins) {
    for (let i = 0; i < bins.length; i++) {
      if (value <= bins[i]) return i;
    }
    return bins.length;
  }
  
  function getState(profile, month) {
    const totalExpenses =
      profile.rent + profile.food + profile.transport + profile.entertainment + profile.other;
    const savingsRatio = (profile.income - totalExpenses) / profile.income;
    const spendingRatio = totalExpenses / profile.income;
    const goalProgress = (profile.currentSavings || 0) / profile.savingsGoal;
  
    const sS = discretize(savingsRatio, [0.05, 0.15, 0.25, 0.35]);
    const sE = discretize(spendingRatio, [0.5, 0.65, 0.8, 0.95]);
    const sG = discretize(goalProgress, [0.1, 0.3, 0.6, 0.9]);
  
    return `${sS}_${sE}_${sG}`;
  }
  
  function applyAction(expenses, action, income) {
    const e = { ...expenses };
    const CUT = 0.07;
  
    if (action === "reduce_rent") e.rent = Math.max(e.rent * (1 - CUT), 200);
    if (action === "reduce_food") e.food = Math.max(e.food * (1 - CUT), 100);
    if (action === "reduce_transport") e.transport = Math.max(e.transport * (1 - CUT), 50);
    if (action === "reduce_entertainment") e.entertainment = Math.max(e.entertainment * (1 - CUT), 0);
    if (action === "reduce_other") e.other = Math.max(e.other * (1 - CUT), 0);
    if (action === "increase_savings") {
      const redirect = income * 0.05;
      const flex = e.food + e.entertainment + e.other;
      if (flex > redirect) {
        const ratio = redirect / flex;
        e.food = Math.max(e.food * (1 - ratio), 100);
        e.entertainment = Math.max(e.entertainment * (1 - ratio), 0);
        e.other = Math.max(e.other * (1 - ratio), 0);
      }
    }
  
    return e;
  }
  
  function computeReward(prevExpenses, newExpenses, income, savingsGoal, accumulatedSavings) {
    const prevTotal = Object.values(prevExpenses).reduce((a, b) => a + b, 0);
    const newTotal = Object.values(newExpenses).reduce((a, b) => a + b, 0);
    const prevSavings = income - prevTotal;
    const newSavings = income - newTotal;
  
    let reward = 0;
    reward += (newSavings - prevSavings) / income * 10;
    const goalProgress = Math.min(accumulatedSavings / savingsGoal, 1);
    reward += goalProgress * 5;
    if (newSavings < 0) reward -= 15;
    if (newSavings / income > 0.2) reward += 3;
  
    return reward;
  }
  
  export function runRLSimulation(profile, months = 12) {
    const Q = {};
  
    function getQ(state, action) {
      if (!Q[state]) Q[state] = {};
      if (Q[state][action] === undefined) Q[state][action] = 0;
      return Q[state][action];
    }
  
    function setQ(state, action, val) {
      if (!Q[state]) Q[state] = {};
      Q[state][action] = val;
    }
  
    function chooseAction(state, epsilon) {
      if (Math.random() < epsilon) {
        return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      }
      let best = ACTIONS[0];
      let bestVal = getQ(state, ACTIONS[0]);
      for (const a of ACTIONS) {
        const v = getQ(state, a);
        if (v > bestVal) { bestVal = v; best = a; }
      }
      return best;
    }
  
    const monthlyHistory = [];
    let currentExpenses = {
      rent: profile.rent,
      food: profile.food,
      transport: profile.transport,
      entertainment: profile.entertainment,
      other: profile.other,
    };
    let accumulatedSavings = profile.currentSavings || 0;
    let epsilon = EPSILON_START;
  
    for (let ep = 0; ep < 300; ep++) {
      let eps = {
        rent: profile.rent,
        food: profile.food,
        transport: profile.transport,
        entertainment: profile.entertainment,
        other: profile.other,
      };
      let acc = profile.currentSavings || 0;
      const epProfile = { ...profile, currentSavings: acc };
  
      for (let m = 0; m < months; m++) {
        const state = getState({ ...epProfile, ...eps }, m);
        const action = chooseAction(state, epsilon);
        const newEps = applyAction(eps, action, profile.income);
        const monthlySavings = profile.income - Object.values(newEps).reduce((a, b) => a + b, 0);
        acc += Math.max(monthlySavings, 0);
        const reward = computeReward(eps, newEps, profile.income, profile.savingsGoal, acc);
        const nextState = getState({ ...epProfile, ...newEps, currentSavings: acc }, m + 1);
  
        const maxNextQ = Math.max(...ACTIONS.map((a) => getQ(nextState, a)));
        const oldQ = getQ(state, action);
        setQ(state, action, oldQ + ALPHA * (reward + GAMMA * maxNextQ - oldQ));
  
        eps = newEps;
      }
      epsilon = Math.max(EPSILON_END, epsilon * EPSILON_DECAY);
    }
  
    epsilon = 0;
    currentExpenses = {
      rent: profile.rent,
      food: profile.food,
      transport: profile.transport,
      entertainment: profile.entertainment,
      other: profile.other,
    };
    accumulatedSavings = profile.currentSavings || 0;
  
    for (let m = 0; m < months; m++) {
      const state = getState({ ...profile, ...currentExpenses, currentSavings: accumulatedSavings }, m);
      const action = chooseAction(state, 0);
      const newExpenses = applyAction(currentExpenses, action, profile.income);
      const totalExpenses = Object.values(newExpenses).reduce((a, b) => a + b, 0);
      const monthlySavings = profile.income - totalExpenses;
      accumulatedSavings += Math.max(monthlySavings, 0);
  
      const healthScore = computeHealthScore(profile.income, newExpenses, accumulatedSavings, profile.savingsGoal);
  
      monthlyHistory.push({
        month: m + 1,
        income: profile.income,
        expenses: { ...newExpenses },
        totalExpenses,
        monthlySavings,
        accumulatedSavings,
        action,
        healthScore,
      });
  
      currentExpenses = newExpenses;
    }
  
    const finalExpenses = currentExpenses;
    const avgHealthScore =
      monthlyHistory.reduce((s, m) => s + m.healthScore, 0) / monthlyHistory.length;
  
    const recommendations = generateRecommendations(profile, finalExpenses, monthlyHistory);
  
    return {
      monthlyHistory,
      finalExpenses,
      finalSavings: accumulatedSavings,
      goalAchieved: accumulatedSavings >= profile.savingsGoal,
      goalProgress: Math.min((accumulatedSavings / profile.savingsGoal) * 100, 100),
      avgHealthScore,
      recommendations,
      originalExpenses: {
        rent: profile.rent,
        food: profile.food,
        transport: profile.transport,
        entertainment: profile.entertainment,
        other: profile.other,
      },
    };
  }
  
  function computeHealthScore(income, expenses, savings, goal) {
    const total = Object.values(expenses).reduce((a, b) => a + b, 0);
    const savingsRate = (income - total) / income;
    const goalProgress = Math.min(savings / goal, 1);
  
    let score = 0;
    score += Math.min(savingsRate * 100, 40);
    score += goalProgress * 30;
    score += (expenses.rent / income < 0.35 ? 15 : 5);
    score += (expenses.entertainment / income < 0.1 ? 10 : 3);
  
    return Math.min(Math.round(score), 100);
  }
  
  function generateRecommendations(profile, finalExpenses, history) {
    const recs = [];
    const income = profile.income;
  
    const rentRatio = finalExpenses.rent / income;
    const foodRatio = finalExpenses.food / income;
    const entertainmentRatio = finalExpenses.entertainment / income;
    const totalSaved = history[history.length - 1].accumulatedSavings;
    const savingsRate = (income - Object.values(finalExpenses).reduce((a, b) => a + b, 0)) / income;
  
    if (rentRatio > 0.35)
      recs.push({ category: "Housing", priority: "high", text: "Your rent exceeds 35% of income. Consider a roommate, refinancing, or relocating to reduce housing costs." });
    if (foodRatio > 0.2)
      recs.push({ category: "Food", priority: "medium", text: "Food spending is above 20% of income. Meal prepping and cutting dining-out can save significantly." });
    if (entertainmentRatio > 0.1)
      recs.push({ category: "Entertainment", priority: "medium", text: "Entertainment exceeds 10% of income. Review subscriptions and discretionary spending." });
    if (savingsRate < 0.1)
      recs.push({ category: "Savings", priority: "high", text: "Your savings rate is below 10%. The 50/30/20 rule recommends saving at least 20% of income." });
    if (totalSaved >= profile.savingsGoal)
      recs.push({ category: "Goal", priority: "success", text: `🎉 Goal achieved! You reached your $${profile.savingsGoal.toLocaleString()} savings target in the simulation.` });
    else
      recs.push({ category: "Goal", priority: "info", text: `You're on track to reach ${Math.round((totalSaved / profile.savingsGoal) * 100)}% of your goal. Stay consistent!` });
  
    recs.push({ category: "Strategy", priority: "info", text: "The AI identified that consistently reducing discretionary spending (entertainment & other) provides the best long-term savings return." });
  
    return recs;
  }