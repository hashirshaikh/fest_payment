import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Confetti burst
function spawnConfetti() {
  const colors = ['#3399cc', '#67c8f5', '#f0c040', '#86efac', '#f9a8d4', '#ffffff'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-dot';
    const size = Math.random() * 10 + 5;
    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}vw;
      top: -${Math.random() * 40 + 20}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 2 + 2}s;
      animation-delay: ${Math.random() * 1.5}s;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

export default function SuccessPage() {
  const { order_id } = useParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      if (!confettiFired.current) {
        confettiFired.current = true;
        spawnConfetti();
      }
    }, 100);
    return () => clearTimeout(t);
  }, []);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/download/${order_id}`);
      if (!res.ok) throw new Error('Failed to download');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fest_payment_slip.pdf';
      a.click();
      URL.revokeObjectURL(url);
      alert('Payment slip PDF will also be sent to your registered email 📧');
    } catch {
      alert('Could not download. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ paddingTop: '60px' }}>
        <div
          className="glass-card"
          style={{
            padding: '48px 36px',
            textAlign: 'center',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
            transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Animated Check */}
          <div className="success-check">✅</div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', margin: '16px 0 8px' }}>
            Payment <span style={{ color: 'var(--success)' }}>Successful!</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginBottom: '8px' }}>
            Your booking for{' '}
            <strong style={{ color: 'var(--sky)' }}>SAMGATHA × VASHIST</strong> is confirmed 🎉
          </p>

          {/* Order ID */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            padding: '10px 18px',
            display: 'inline-block',
            margin: '12px 0 32px',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Order ID: </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--sky-soft)', fontFamily: 'monospace' }}>
              {order_id}
            </span>
          </div>

          {/* What's next */}
          <div style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '14px',
            padding: '20px 24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}>
            <div style={{ fontWeight: 600, marginBottom: '12px', color: '#86efac', fontSize: '0.88rem' }}>
              📋 What happens next?
            </div>
            {[
              '📧 Payment receipt sent to your email',
              '🎟️ Show this confirmation at the gate',
              '🎉 Enjoy the fest!',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>
                {item}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              id="download-receipt-btn"
              className="btn btn-success btn-lg"
              onClick={handleDownload}
              disabled={downloading}
              style={{ minWidth: '200px' }}
            >
              {downloading ? (
                <><div className="spinner" /> Downloading…</>
              ) : (
                '⬇️ Download Receipt'
              )}
            </button>
            <button
              id="home-btn"
              className="btn btn-outline"
              onClick={() => navigate('/')}
              style={{ minWidth: '140px' }}
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
