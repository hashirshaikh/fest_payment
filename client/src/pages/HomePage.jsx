import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ComboOffersModal from '../components/ComboOffersModal';

// Floating particles background
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 12,
    duration: Math.random() * 10 + 12,
  }));
  return (
    <div className="particles-bg">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// Infinite ticker marquee
function Ticker() {
  const msg = '🎉 Exciting Combo Offers Available! Book in Groups & Save More 🎉';
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="ticker-item">{msg}</span>
  ));
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items}
        {items}
      </div>
    </div>
  );
}

// Stat pill
function StatPill({ icon, label, value }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '16px 24px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
      minWidth: '120px',
    }}>
      <span style={{ fontSize: '1.6rem' }}>{icon}</span>
      <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Poppins, sans-serif' }}>{value}</span>
      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Entrance animation trigger
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Particles />
      <Navbar />
      <Ticker />

      <div style={{ position: 'relative', zIndex: 1, padding: '48px 20px 80px' }}>
        {/* ── Hero Section ── */}
        <div style={{
          maxWidth: '780px',
          margin: '0 auto',
          textAlign: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          {/* Badge */}
          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-accent">✨ Annual Cultural & Tech Fest 2025</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(2.4rem, 8vw, 4.5rem)', marginBottom: '8px', lineHeight: 1.1 }}>
            <span className="gradient-text">SAMGATHA</span>
          </h1>
          <h2 style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '12px',
            letterSpacing: '0.15em',
          }}>
            × VASHIST
          </h2>

          {/* Subtitle */}
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Get ready for an unforgettable cultural & technical extravaganza at&nbsp;
            <span style={{ color: 'var(--sky)', fontWeight: 600 }}>IIITDM Kancheepuram</span>!
            Live performances, competitions, workshops, and more.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '40px',
          }}>
            <StatPill icon="🎭" label="Events" value="20+" />
            <StatPill icon="🏫" label="Campus" value="IIITDM" />
            <StatPill icon="🎟️" label="Per Ticket" value="₹300" />
          </div>

          {/* Main Card */}
          <div className="glass-card" style={{ padding: '40px', marginBottom: '32px' }}>
            {/* Price section */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Ticket Price
              </div>
              <div className="price-highlight">₹300</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
                per person &nbsp;•&nbsp; Limited seats available
              </div>
            </div>

            <hr className="divider" />

            {/* Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '14px',
              marginBottom: '32px',
            }}>
              {[
                ['🎵', 'Live Music'],
                ['🤖', 'Tech Talks'],
                ['🏆', 'Competitions'],
                ['🍽️', 'Food Stalls'],
              ].map(([icon, label]) => (
                <div key={label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                id="book-tickets-btn"
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/booking')}
                style={{ minWidth: '180px' }}
              >
                🎟️ Book Tickets
              </button>
              <button
                id="view-combos-btn"
                className="btn btn-outline btn-lg"
                onClick={() => setShowModal(true)}
                style={{ minWidth: '180px' }}
              >
                💡 View Combo Offers
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            🔒 Secure payments powered by Razorpay &nbsp;•&nbsp; Instant e-tickets
          </p>
        </div>
      </div>

      {/* Combo Modal */}
      {showModal && <ComboOffersModal onClose={() => setShowModal(false)} />}
    </>
  );
}
