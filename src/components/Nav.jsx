export default function Nav({ page, setPage, simResults }) {
    const tabs = [
      { id: "dashboard", label: "Dashboard" },
      { id: "simulation", label: "Run Simulation" },
      ...(simResults ? [{ id: "report", label: "Report" }] : []),
    ];
  
    return (
      <nav className="main-nav">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`nav-btn ${page === t.id ? "active" : ""}`}
            onClick={() => setPage(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
    );
  }