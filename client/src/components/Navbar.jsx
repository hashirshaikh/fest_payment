export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <img
          src="/images/logo.png"
          alt="IIITDM Logo"
          className="navbar-logo"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span className="navbar-title">
          IIITDM Kancheepuram — Samgatha × Vashist
        </span>
      </div>
    </nav>
  );
}
