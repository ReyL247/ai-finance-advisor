import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
  } from "recharts";
  
  const LABELS = { rent: "Rent", food: "Food", transport: "Transport", entertainment: "Entertainment", other: "Other" };
  const PRIORITY_COLORS = { high: "#e87a7a", medium: "#e8c87a", info: "#7ab8e8", success: "#7ae8b8" };
  
  export default function Report({ profile, results, onBack }) {
    const { monthlyHistory, finalExpenses, originalExpenses, recommendations, goalProgress, avgHealthScore } = results;
  
    const chartData = monthlyHistory.map((m) => ({
      month: `M${m.month}`,
      savings: Math.round(m.accumulatedSavings),
      health: m.healthScore,
      income: m.income,
      expenses: Math.round(m.totalExpenses),
    }));
  
    const compareData = Object.keys(LABELS).map((k) => ({
      name: LABELS[k],
      Before: originalExpenses[k],
      After: Math.round(finalExpenses[k]),
    }));
  
    const healthColor = avgHealthScore >= 70 ? "#7ae8b8" : avgHealthScore >= 50 ? "#e8c87a" : "#e87a7a";
    const healthLabel = avgHealthScore >= 70 ? "Excellent" : avgHealthScore >= 50 ? "Good" : "Needs Work";
  
    return (
      <div className="page-enter report-page">
        <div className="report-header">
          <div>
            <div className="report-tag">12-Month Simulation Report</div>
            <h2 className="report-title">{profile.name} — AI Financial Analysis</h2>
            <p className="report-sub">Optimized using Q-Learning reinforcement over 300 training episodes.</p>
          </div>
          <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
        </div>
  
        <div className="kpi-row report-kpis">
          <div className="kpi-card">
            <div className="kpi-label">Final Savings</div>
            <div className="kpi-value pos">
              ${results.finalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="kpi-sub">after 12 months</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Goal Achievement</div>
            <div className="kpi-value" style={{ color: goalProgress >= 100 ? "#7ae8b8" : "var(--accent)" }}>
              {goalProgress.toFixed(1)}%
            </div>
            <div className="kpi-sub">{results.goalAchieved ? "🎉 Goal Reached!" : `of $${profile.savingsGoal.toLocaleString()}`}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Health Score</div>
            <div className="kpi-value" style={{ color: healthColor }}>{avgHealthScore.toFixed(0)}/100</div>
            <div className="kpi-badge" style={{ background: healthColor + "22", color: healthColor }}>{healthLabel}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Optimized Expenses</div>
            <div className="kpi-value">
              ${Object.values(finalExpenses).reduce((a, b) => a + b, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="kpi-sub-inline">/mo</span>
            </div>
            <div className="kpi-sub">
              saved ${(
                Object.values(originalExpenses).reduce((a, b) => a + b, 0) -
                Object.values(finalExpenses).reduce((a, b) => a + b, 0)
              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
            </div>
          </div>
        </div>
  
        <div className="report-grid">
  
          <div className="report-card span2">
            <div className="card-title">Accumulated Savings Over 12 Months</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <Tooltip
                  formatter={(v, n) => [`$${Number(v).toLocaleString()}`, n]}
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
                />
                <Line type="monotone" dataKey="savings" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--accent)" }} name="Savings" />
                <Line type="monotone" dataKey="expenses" stroke="#7ab8e8" strokeWidth={2} dot={false} name="Expenses" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
  
          <div className="report-card">
            <div className="card-title">Financial Health Score / Month</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
                />
                <Bar dataKey="health" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Health Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
  
          <div className="report-card">
            <div className="card-title">Before vs After Optimization</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={compareData} layout="vertical" margin={{ top: 5, right: 30, bottom: 0, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tickFormatter={(v) => `$${v}`} tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => `$${Number(v).toLocaleString()}`}
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted)" }} />
                <Bar dataKey="Before" fill="#7ab8e880" radius={[0, 4, 4, 0]} />
                <Bar dataKey="After" fill="var(--accent)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
  
          <div className="report-card action-log-card">
            <div className="card-title">AI Decision Log (RL Policy)</div>
            <div className="action-log">
              {monthlyHistory.map((m) => (
                <div key={m.month} className="action-row">
                  <span className="action-month">Month {m.month}</span>
                  <span className="action-badge">{m.action.replace(/_/g, " ")}</span>
                  <span className="action-score" style={{ color: m.healthScore >= 70 ? "#7ae8b8" : m.healthScore >= 50 ? "#e8c87a" : "#e87a7a" }}>
                    ♥ {m.healthScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
  
          <div className="report-card recs-card span2">
            <div className="card-title">AI Financial Recommendations</div>
            <div className="recs-list">
              {recommendations.map((r, i) => (
                <div key={i} className="rec-item" style={{ borderLeftColor: PRIORITY_COLORS[r.priority] }}>
                  <div className="rec-header">
                    <span className="rec-cat" style={{ color: PRIORITY_COLORS[r.priority] }}>{r.category}</span>
                    <span className="rec-priority" style={{ background: PRIORITY_COLORS[r.priority] + "22", color: PRIORITY_COLORS[r.priority] }}>
                      {r.priority}
                    </span>
                  </div>
                  <p className="rec-text">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
  
        </div>
      </div>
    );
  }