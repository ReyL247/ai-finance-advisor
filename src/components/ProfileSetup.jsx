import { useState } from "react";

const PRESETS = {
  student: { name: "Student Budget", income: 2200, rent: 700, food: 350, transport: 120, entertainment: 150, other: 180, savingsGoal: 3000, currentSavings: 200 },
  earlyCareer: { name: "Early Career", income: 4500, rent: 1200, food: 500, transport: 200, entertainment: 250, other: 300, savingsGoal: 10000, currentSavings: 1500 },
  family: { name: "Young Family", income: 7500, rent: 2000, food: 900, transport: 450, entertainment: 400, other: 600, savingsGoal: 25000, currentSavings: 5000 },
};

export default function ProfileSetup({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    income: "",
    rent: "",
    food: "",
    transport: "",
    entertainment: "",
    other: "",
    savingsGoal: "",
    currentSavings: "0",
  });
  const [errors, setErrors] = useState({});

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const applyPreset = (key) => {
    const p = PRESETS[key];
    setForm({
      name: p.name,
      income: String(p.income),
      rent: String(p.rent),
      food: String(p.food),
      transport: String(p.transport),
      entertainment: String(p.entertainment),
      other: String(p.other),
      savingsGoal: String(p.savingsGoal),
      currentSavings: String(p.currentSavings),
    });
    setErrors({});
  };

  const validate = () => {
    const e = {};
    const required = ["income", "rent", "food", "transport", "savingsGoal"];
    required.forEach((f) => { if (!form[f] || isNaN(Number(form[f]))) e[f] = "Required"; });
    const totalExp =
      Number(form.rent) + Number(form.food) + Number(form.transport) +
      Number(form.entertainment || 0) + Number(form.other || 0);
    if (totalExp >= Number(form.income)) e.income = "Expenses exceed income";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({
      name: form.name || "User",
      income: Number(form.income),
      rent: Number(form.rent),
      food: Number(form.food),
      transport: Number(form.transport),
      entertainment: Number(form.entertainment || 0),
      other: Number(form.other || 0),
      savingsGoal: Number(form.savingsGoal),
      currentSavings: Number(form.currentSavings || 0),
    });
  };

  const totalExp =
    (Number(form.rent) || 0) + (Number(form.food) || 0) + (Number(form.transport) || 0) +
    (Number(form.entertainment) || 0) + (Number(form.other) || 0);
  const disposable = (Number(form.income) || 0) - totalExp;

  return (
    <div className="page-enter profile-page">
      <div className="profile-hero">
        <div className="hero-tag">Step 1 of 1</div>
        <h1 className="hero-title">Build Your<br /><span className="accent">Financial Profile</span></h1>
        <p className="hero-sub">Enter your simulated monthly figures. No real data is stored or used.</p>
      </div>

      <div className="presets-row">
        <span className="presets-label">Quick start:</span>
        {Object.entries(PRESETS).map(([k, p]) => (
          <button key={k} className="preset-chip" onClick={() => applyPreset(k)}>{p.name}</button>
        ))}
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="section-label">Identity</div>
          <div className="form-field full">
            <label>Profile Name</label>
            <input type="text" placeholder="e.g. My Budget Plan" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
        </div>

        <div className="form-section">
          <div className="section-label">Monthly Income</div>
          <div className="form-field full">
            <label>Monthly Income ($) *</label>
            <input type="number" placeholder="0.00" value={form.income} onChange={e => set("income", e.target.value)} className={errors.income ? "err" : ""} />
            {errors.income && <span className="err-msg">{errors.income}</span>}
          </div>
        </div>

        <div className="form-section">
          <div className="section-label">Monthly Expenses</div>
          <div className="form-grid">
            {[
              { id: "rent", label: "Rent / Housing *" },
              { id: "food", label: "Food & Groceries *" },
              { id: "transport", label: "Transportation *" },
              { id: "entertainment", label: "Entertainment" },
              { id: "other", label: "Other Expenses" },
            ].map(({ id, label }) => (
              <div key={id} className={`form-field ${errors[id] ? "has-err" : ""}`}>
                <label>{label}</label>
                <input type="number" placeholder="0.00" value={form[id]} onChange={e => set(id, e.target.value)} className={errors[id] ? "err" : ""} />
                {errors[id] && <span className="err-msg">{errors[id]}</span>}
              </div>
            ))}
          </div>

          {form.income && (
            <div className="expense-bar-wrap">
              <div className="expense-bar">
                <div className="bar-fill" style={{ width: `${Math.min((totalExp / Number(form.income)) * 100, 100)}%`, background: disposable < 0 ? "var(--err)" : "var(--accent)" }} />
              </div>
              <div className={`bar-label ${disposable < 0 ? "neg" : ""}`}>
                {disposable >= 0
                  ? `$${disposable.toLocaleString()} disposable / month`
                  : `⚠ Expenses exceed income by $${Math.abs(disposable).toLocaleString()}`}
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <div className="section-label">Savings</div>
          <div className="form-grid">
            <div className={`form-field ${errors.savingsGoal ? "has-err" : ""}`}>
              <label>Savings Goal ($) *</label>
              <input type="number" placeholder="e.g. 10000" value={form.savingsGoal} onChange={e => set("savingsGoal", e.target.value)} className={errors.savingsGoal ? "err" : ""} />
              {errors.savingsGoal && <span className="err-msg">{errors.savingsGoal}</span>}
            </div>
            <div className="form-field">
              <label>Current Savings ($)</label>
              <input type="number" placeholder="0.00" value={form.currentSavings} onChange={e => set("currentSavings", e.target.value)} />
            </div>
          </div>
        </div>

        <button className="submit-btn" type="submit">
          <span>Initialize Profile</span>
          <span className="btn-arrow">→</span>
        </button>
      </form>
    </div>
  );
}