import { useState, useEffect } from "react";
import { runRLSimulation } from "../rlEngine";

const STEPS = [
  { pct: 5,   msg: "Initializing Q-table with state space..." },
  { pct: 15,  msg: "Episode 1–50: Exploring random strategies (ε=0.8)..." },
  { pct: 30,  msg: "Episode 51–100: Learning spending patterns..." },
  { pct: 45,  msg: "Episode 101–150: Optimizing reward function..." },
  { pct: 60,  msg: "Episode 151–200: Refining budget allocations..." },
  { pct: 72,  msg: "Episode 201–250: Converging on optimal policy..." },
  { pct: 85,  msg: "Episode 251–300: Final greedy policy extraction..." },
  { pct: 95,  msg: "Running 12-month simulation with learned policy..." },
  { pct: 100, msg: "Simulation complete. Generating financial report..." },
];

export default function Simulation({ profile, onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    let idx = 0;
    const advance = () => {
      if (idx < STEPS.length - 1) {
        idx++;
        setStepIdx(idx);
        setTimeout(advance, 400 + Math.random() * 300);
      } else {
        setTimeout(() => {
          const r = runRLSimulation(profile, 12);
          setResults(r);
          setDone(true);
        }, 400);
      }
    };
    const t = setTimeout(advance, 600);
    return () => clearTimeout(t);
  }, [profile]);

  const step = STEPS[stepIdx];

  return (
    <div className="page-enter sim-page">
      <div className="sim-hero">
        <div className="sim-icon-wrap">
          <div className={`sim-icon ${done ? "done" : "spinning"}`}>◈</div>
        </div>
        <h2 className="sim-title">{done ? "Training Complete" : "AI Training in Progress"}</h2>
        <p className="sim-sub">
          {done
            ? "Q-Learning policy converged. Your optimized financial plan is ready."
            : "The RL agent is running 300 episodes to learn the optimal budget allocation policy."}
        </p>
      </div>

      <div className="sim-progress-card">
        <div className="sim-progress-header">
          <span className="sim-progress-label">Training Progress</span>
          <span className="sim-progress-pct">{step.pct}%</span>
        </div>
        <div className="sim-bar-outer">
          <div className="sim-bar-inner" style={{ width: `${step.pct}%` }} />
        </div>
        <div className="sim-log">
          {STEPS.slice(0, stepIdx + 1).map((s, i) => (
            <div key={i} className={`sim-log-row ${i === stepIdx ? "active" : "past"}`}>
              <span className="log-icon">{i < stepIdx ? "✓" : i === stepIdx ? "▶" : "○"}</span>
              <span>{s.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {done && results && (
        <div className="sim-preview page-enter">
          <div className="preview-kpis">
            <div className="preview-kpi">
              <div className="preview-label">Final Savings</div>
              <div className="preview-val">
                ${results.finalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="preview-kpi">
              <div className="preview-label">Goal Progress</div>
              <div className="preview-val">{results.goalProgress.toFixed(1)}%</div>
            </div>
            <div className="preview-kpi">
              <div className="preview-label">Avg Health Score</div>
              <div className="preview-val">{results.avgHealthScore.toFixed(0)}/100</div>
            </div>
          </div>
          <button className="submit-btn" onClick={() => onComplete(results)}>
            <span>View Full Report</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      )}
    </div>
  );
}