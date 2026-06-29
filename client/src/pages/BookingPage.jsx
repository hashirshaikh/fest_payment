import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TICKET_OPTIONS = [1, 5, 8, 10];
const PRICES = { 1: 300, 5: 1200, 8: 1680, 10: 1800 };

function getOrdinal(n) {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

function PersonBlock({ index, name, roll, onChange, errors }) {
  const ord = `${index}${getOrdinal(index)}`;
  return (
    <div className="person-block">
      <div className="person-block-title">🧑 Person {index}</div>
      <div className="form-group">
        <label className="form-label">Full Name of {ord} Person</label>
        <input
          type="text"
          className={`form-control${errors?.name ? ' error' : ''}`}
          placeholder={`Name of ${ord} person`}
          value={name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          required
        />
        {errors?.name && <div className="form-error">⚠ {errors.name}</div>}
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Roll Number of {ord} Person</label>
        <input
          type="text"
          className={`form-control${errors?.roll ? ' error' : ''}`}
          placeholder={`Roll number of ${ord} person`}
          value={roll}
          onChange={(e) => onChange(index, 'roll', e.target.value)}
          required
        />
        {errors?.roll && <div className="form-error">⚠ {errors.roll}</div>}
      </div>
    </div>
  );
}

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Prefill state when coming back from payment with order_id
  const [orderId, setOrderId] = useState('');
  const [numTickets, setNumTickets] = useState(1);
  const [persons, setPersons] = useState([{ name: '', roll: '' }]);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [personErrors, setPersonErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(false);

  // Prefill if coming back from payment (order_id in state)
  useEffect(() => {
    const oid = location.state?.order_id;
    if (oid) {
      setPrefilling(true);
      fetch(`/api/booking?order_id=${oid}`)
        .then((r) => r.json())
        .then(({ formData }) => {
          if (formData) {
            setOrderId(oid);
            const count = formData.Numoftickets || 1;
            setNumTickets(count);
            const names = Array.isArray(formData.Name) ? formData.Name : [];
            const rolls = Array.isArray(formData.RollNo) ? formData.RollNo : [];
            setPersons(
              Array.from({ length: count }, (_, i) => ({
                name: names[i] || '',
                roll: rolls[i] || '',
              }))
            );
            setEmail(formData.Email || '');
          }
        })
        .catch(console.error)
        .finally(() => setPrefilling(false));
    }
  }, [location.state]);

  // Sync person fields when ticket count changes
  useEffect(() => {
    setPersons((prev) =>
      Array.from({ length: numTickets }, (_, i) => prev[i] || { name: '', roll: '' })
    );
    setPersonErrors([]);
  }, [numTickets]);

  const handlePersonChange = useCallback((idx, field, val) => {
    setPersons((prev) => {
      const copy = [...prev];
      copy[idx - 1] = { ...copy[idx - 1], [field]: val };
      return copy;
    });
    setPersonErrors((prev) => {
      const copy = [...prev];
      if (copy[idx - 1]) copy[idx - 1] = { ...copy[idx - 1], [field]: undefined };
      return copy;
    });
  }, []);

  function validate() {
    const newErrors = {};
    const pErrors = persons.map((p) => {
      const e = {};
      if (!p.name.trim()) e.name = 'Name is required';
      if (!p.roll.trim()) e.roll = 'Roll number is required';
      return e;
    });
    const hasPersonError = pErrors.some((e) => e.name || e.roll);
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    setErrors(newErrors);
    setPersonErrors(pErrors);
    return !hasPersonError && Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const body = {
      numTickets,
      email,
      order_id: orderId || undefined,
    };
    persons.forEach((p, i) => {
      body[`name${i + 1}`] = p.name;
      body[`roll${i + 1}`] = p.roll;
    });

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // Navigate to payment page, pass data via router state
      navigate('/payment', { state: data });
    } catch (err) {
      setErrors({ submit: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  const price = PRICES[numTickets] || 300;
  const original = numTickets * 300;
  const saved = original - price;

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ paddingTop: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '14px' }}>Step 1 of 2</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', marginBottom: '8px' }}>
            Book Your <span className="accent-text">Tickets</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
            Fill in the details below to proceed to payment
          </p>
        </div>

        {prefilling ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 16px' }} />
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading your booking details…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="glass-card" style={{ padding: '32px 28px', marginBottom: '20px' }}>

              {/* Ticket count */}
              <div className="form-group">
                <label className="form-label" htmlFor="numTickets">
                  Number of Tickets
                </label>
                <div className="select-wrapper">
                  <select
                    id="numTickets"
                    className="form-select"
                    value={numTickets}
                    onChange={(e) => setNumTickets(Number(e.target.value))}
                  >
                    {TICKET_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Ticket' : 'Tickets'} — ₹{PRICES[n]}
                        {n > 1 ? ` (${Math.round((1 - PRICES[n] / (n * 300)) * 100)}% off)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live price preview */}
              <div className="price-preview">
                <div>
                  <div className="price-preview-label">Total Amount</div>
                  {saved > 0 && (
                    <div className="price-preview-note">You save ₹{saved}! 🎉</div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="price-preview-amount">₹{price}</div>
                  {saved > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>
                      ₹{original}
                    </div>
                  )}
                </div>
              </div>

              {/* Person fields */}
              {persons.map((p, i) => (
                <PersonBlock
                  key={i}
                  index={i + 1}
                  name={p.name}
                  roll={p.roll}
                  onChange={handlePersonChange}
                  errors={personErrors[i]}
                />
              ))}

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-control${errors.email ? ' error' : ''}`}
                  placeholder="payment receipt will be sent here"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  required
                />
                {errors.email && <div className="form-error">⚠ {errors.email}</div>}
              </div>

              {/* Hidden order id */}
              {orderId && <input type="hidden" value={orderId} />}

              {/* Submit error */}
              {errors.submit && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#fca5a5',
                  fontSize: '0.88rem',
                  marginBottom: '20px',
                }}>
                  ⚠ {errors.submit}
                </div>
              )}

              <button
                id="proceed-to-pay-btn"
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner" /> Processing…</>
                ) : (
                  '💳 Proceed to Payment'
                )}
              </button>
            </div>

            {/* Combo offers reminder */}
            <div style={{
              textAlign: 'center',
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.4)',
              padding: '0 8px',
            }}>
              💡 Select 5, 8, or 10 tickets to get group discounts up to 40% off
            </div>
          </form>
        )}
      </div>
    </>
  );
}
