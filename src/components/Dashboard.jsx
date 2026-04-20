import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#e8c87a", "#7ab8e8", "#7ae8b8", "#e87ab8", "#b87ae8"];
const LABELS = { rent: "Rent", food: "Food", transport: "Transport", entertainment: "Entertainment", other: "Other" };

export default function Dashboard({ profile, onRunSim }) {
  const expenses = ["rent", "food", "transport", "entertainment", "other"];
  const totalExp = expenses.reduce((s, k) => s + profile[k], 0);
  const monthlySavings = profile.income - totalExp;
  const savingsRate = ((monthlySavings / profile.income) * 100).toFixed(1);
  const goalProgress = Math.min((profile.currentSavings / profile.savingsGoal) * 100, 100).toFixed(1);

  const pieData = expenses.map((k) => ({ name: LABELS[k], value: profile[k] }));

  const getHealthBand = () => {
    if (savingsRate >= 20) return { label: "Healthy", color: "#7ae8b8", icon: "▲" };
    if (savingsRate >= 10) return { label: "Moderate", color: "#e8c87a", icon: "●" };
    return { label: "At Risk", color: "#e87a7a", icon: "▼" };
  };
  const health = getHealthBand();

  return (
    <div className="page-enter dashboard-page">
      <div className="dash-header">
        <div>
          <div className="dash-welcome">Welcome back,</div>
          <h2 className="dash-name">{profile.name}</h2>
        </div>
        <button className="run-sim-btn" onClick={onRunSim}>
          Run AI Simulation <span>▶</span>
        </button>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Monthly Income</div>
          <div className="kpi-value">${profile.income.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Expenses</div>
          <div className="kpi-value">${totalExp.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Monthly Savings</div>
          <div className={`kpi-value ${monthlySavings < 0 ? "neg" : "pos"}`}>
            ${monthlySavings.toLocaleString()}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Savings Rate</div>
          <div className="kpi-value" style={{ color: health.color }}>
            {health.icon} {savingsRate}%
          </div>
          <div className="kpi-badge" style={{ background: health.color + "22", color: health.color }}>
            {health.label}
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card chart-card">
          <div className="card-title">Expense Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => `$${v.toLocaleString()}`}
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-row">
            {pieData.map((d, i) => (
              <div key={i} className="legend-item">
                <span className="legend-dot" style={{ background: COLORS[i] }} />
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card breakdown-card">
          <div className="card-title">Budget Allocation</div>
          {expenses.map((k, i) => {
            const pct = ((profile[k] / profile.income) * 100).toFixed(1);
            return (
              <div key={k} className="alloc-row">
                <div className="alloc-name">
                  <span className="alloc-dot" style={{ background: COLORS[i] }} />
                  {LABELS[k]}
                </div>
                <div className="alloc-bar-wrap">
                  <div className="alloc-bar">
                    <div className="alloc-fill" style={{ width: `${pct}%`, background: COLORS[i] }} />
                  </div>
                </div>
                <div className="alloc-nums">
                  <span className="alloc-pct">{pct}%</span>
                  <span className="alloc-amt">${profile[k].toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dash-card goal-card">
          <div className="card-title">Savings Goal Progress</div>
          <div className="goal-progress-wrap">
            <svg viewBox="0 0 120 120" className="goal-ring">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="var(--accent)" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - Number(goalProgress) / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="55" textAnchor="middle" fill="var(--text)" fontSize="18" fontWeight="700">{goalProgress}%</text>
              <text x="60" y="72" textAnchor="middle" fill="var(--muted)" fontSize="9">of goal</text>
            </svg>
            <div className="goal-meta">
              <div className="goal-row">
                <span className="goal-label">Current Savings</span>
                <span className="goal-val">${profile.currentSavings.toLocaleString()}</span>
              </div>
              <div className="goal-row">
                <span className="goal-label">Target</span>
                <span className="goal-val">${profile.savingsGoal.toLocaleString()}</span>
              </div>
              <div className="goal-row">
                <span className="goal-label">Remaining</span>
                <span className="goal-val accent">${Math.max(profile.savingsGoal - profile.currentSavings, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="sim-cta">
            <p>Let the AI optimize your budget to reach your goal faster.</p>
            <button className="run-sim-btn sm" onClick={onRunSim}>Run 12-Month Simulation →</button>
          </div>
        </div>
      </div>
    </div>
  );
}