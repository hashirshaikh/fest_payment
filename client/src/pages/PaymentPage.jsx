import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CountdownTimer from '../components/CountdownTimer';

// Inject Razorpay script once
function useRazorpayScript() {
  useEffect(() => {
    if (document.getElementById('razorpay-script')) return;
    const s = document.createElement('script');
    s.id = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  useRazorpayScript();

  const data = location.state;

  // If no data (direct URL access), redirect to booking
  useEffect(() => {
    if (!data) navigate('/booking', { replace: true });
  }, [data, navigate]);

  if (!data) return null;

  const { key_id, order_id, amount, Name, RollNo, Email, Numoftickets } = data;
  const namesStr = Array.isArray(Name) ? Name.join(', ') : Name;
  const rollsStr = Array.isArray(RollNo) ? RollNo.join(', ') : RollNo;

  function handleSessionExpired() {
    alert('Payment session expired. Please try booking again.');
    navigate('/booking');
  }

  function handleEdit() {
    navigate('/booking', { state: { order_id } });
  }

  function handlePay() {
    const options = {
      key: key_id,
      amount: amount * 100,
      currency: 'INR',
      name: 'IIITDM Kancheepuram — Samgatha × Vashist',
      description: 'Fest Ticket Booking',
      order_id: order_id,
      handler: function () {
        navigate(`/success/${order_id}`);
      },
      prefill: { email: Email },
      theme: { color: '#3399cc' },
      method: { upi: true, card: true, wallet: true },
      modal: {
        ondismiss: function () {
          console.log('Payment popup closed.');
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      alert('Payment failed: ' + response.error.description);
      navigate('/booking');
    });
    rzp.open();
  }

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ paddingTop: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '14px' }}>Step 2 of 2</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', marginBottom: '8px' }}>
            Review & <span className="accent-text">Pay</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
            Confirm your details and proceed to payment
          </p>
        </div>

        {/* Countdown */}
        <CountdownTimer durationSeconds={300} onExpire={handleSessionExpired} />

        {/* Booking Summary Card */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--sky-soft)', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem' }}>
            Booking Summary
          </h3>

          <div className="detail-row">
            <span className="detail-label">👤 Names</span>
            <span className="detail-value">{namesStr}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🆔 Roll Numbers</span>
            <span className="detail-value">{rollsStr}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🎟️ Tickets</span>
            <span className="detail-value">{Numoftickets}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📧 Email</span>
            <span className="detail-value">{Email}</span>
          </div>
          <div className="detail-row" style={{ paddingTop: '18px' }}>
            <span className="detail-label" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>💰 Total</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Poppins, sans-serif', color: 'var(--gold)' }}>
              ₹{amount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button
            id="edit-details-btn"
            className="btn btn-outline"
            style={{ flex: 1, minWidth: '140px' }}
            onClick={handleEdit}
          >
            ✏️ Edit Details
          </button>
          <button
            id="razorpay-pay-btn"
            className="btn btn-primary btn-lg"
            style={{ flex: 2, minWidth: '180px' }}
            onClick={handlePay}
          >
            🔒 Pay ₹{amount} Securely
          </button>
        </div>

        {/* Trust indicators */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          {['🔒 256-bit SSL', '⚡ Instant Confirmation', '📧 Receipt via Email'].map((item) => (
            <span key={item} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
