import { useState } from "react";
import ProfileSetup from "./components/ProfileSetup";
import Dashboard from "./components/Dashboard";
import Simulation from "./components/Simulation";
import Report from "./components/Report";
import Nav from "./components/Nav";

export default function App() {
  const [page, setPage] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [simResults, setSimResults] = useState(null);

  const handleProfileSubmit = (data) => {
    setProfile(data);
    setPage("dashboard");
  };

  const handleSimComplete = (results) => {
    setSimResults(results);
    setPage("report");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">FinMind<span className="logo-ai">AI</span></span>
          </div>
          {profile && (
            <Nav page={page} setPage={setPage} simResults={simResults} />
          )}
        </div>
      </header>

      <main className="app-main">
        {page === "profile" && <ProfileSetup onSubmit={handleProfileSubmit} />}
        {page === "dashboard" && profile && (
          <Dashboard profile={profile} onRunSim={() => setPage("simulation")} />
        )}
        {page === "simulation" && profile && (
          <Simulation profile={profile} onComplete={handleSimComplete} />
        )}
        {page === "report" && simResults && (
          <Report profile={profile} results={simResults} onBack={() => setPage("dashboard")} />
        )}
      </main>
    </div>
  );
}