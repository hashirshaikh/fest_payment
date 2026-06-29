import { useState, useEffect, useRef } from 'react';

export default function CountdownTimer({ durationSeconds = 300, onExpire }) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpire && onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [onExpire]);

  const min = String(Math.floor(remaining / 60)).padStart(2, '0');
  const sec = String(remaining % 60).padStart(2, '0');
  const isUrgent = remaining <= 60;

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: isUrgent ? 'rgba(239,68,68,0.1)' : 'rgba(51,153,204,0.1)',
        border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(51,153,204,0.3)'}`,
        borderRadius: '50px',
        padding: '8px 20px',
        transition: 'all 0.3s ease',
      }}>
        <span style={{ fontSize: '1rem' }}>⏱️</span>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
          Session expires in
        </span>
        <span className={`timer-display${isUrgent ? ' urgent' : ''}`}>
          {min}:{sec}
        </span>
      </div>
    </div>
  );
}
