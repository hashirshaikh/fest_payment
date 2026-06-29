export default function ComboOffersModal({ onClose }) {
  const offers = [
    {
      icon: '👫',
      title: '5 Tickets',
      sub: '₹1,200 total',
      discount: '20% OFF',
      original: '₹1,500',
      color: '#67c8f5',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: '8 Tickets',
      sub: '₹1,680 total',
      discount: '30% OFF',
      original: '₹2,400',
      color: '#f0c040',
    },
    {
      icon: '🎊',
      title: '10 Tickets',
      sub: '₹1,800 total',
      discount: '40% OFF',
      original: '₹3,000',
      color: '#86efac',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>
              🎉 Combo <span className="accent-text">Offers</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
              Book in groups and save big!
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            ✕
          </button>
        </div>

        {/* Base price note */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '16px',
          fontSize: '0.82rem',
          color: 'rgba(255,255,255,0.55)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>🎟️</span>
          <span>Base price: <strong style={{ color: 'white' }}>₹300 per person</strong></span>
        </div>

        {/* Offer Cards */}
        {offers.map((offer) => (
          <div key={offer.title} className="combo-card">
            <span className="combo-icon">{offer.icon}</span>
            <div className="combo-info">
              <div className="combo-title">{offer.title}</div>
              <div className="combo-sub">
                {offer.sub}
                <span style={{
                  marginLeft: '8px',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.3)',
                  textDecoration: 'line-through',
                }}>
                  {offer.original}
                </span>
              </div>
            </div>
            <div className="combo-discount" style={{ color: offer.color }}>
              {offer.discount}
            </div>
          </div>
        ))}

        <button className="btn btn-primary btn-full" style={{ marginTop: '20px' }} onClick={onClose}>
          Got It! Let's Book 🎟️
        </button>
      </div>
    </div>
  );
}
