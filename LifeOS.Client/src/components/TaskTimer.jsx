import React, { useState, useEffect } from 'react';

const formatDigits = (val) => String(val).padStart(2, '0');

export function TaskTimer({ deadline }) {
  const [timeStr, setTimeStr] = useState({ days: 0, hrs: '00', mins: '00', secs: '00', isOverdue: false });

  useEffect(() => {
    if (!deadline || deadline.startsWith('2099')) return;

    const updateTime = () => {
      const targetTime = new Date(deadline);
      const now = new Date();
      const diffMs = targetTime - now;
      const absDiff = Math.abs(diffMs);
      const totalSecs = Math.floor(absDiff / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hrs = Math.floor((totalSecs % 86400) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      setTimeStr({
        days,
        hrs: formatDigits(hrs),
        mins: formatDigits(mins),
        secs: formatDigits(secs),
        isOverdue: diffMs <= 0
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline || deadline.startsWith('2099')) return null;

  const hasDays = timeStr.days > 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: hasDays ? '140px' : '110px'
      }}>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'inherit',
          lineHeight: '1.1',
          letterSpacing: '1.5px',
        }}>
          {hasDays && <>{formatDigits(timeStr.days)} : </>}{timeStr.hrs} : {timeStr.mins} : {timeStr.secs}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          fontSize: '0.65rem',
          fontWeight: 600,
          color: 'inherit',
          opacity: 0.8,
          letterSpacing: '1px',
          marginTop: '4px',
          padding: '0 2px'
        }}>
          {hasDays && <span>DAYS</span>}
          <span>HRS</span>
          <span>MINS</span>
          <span>SECS</span>
        </div>
      </div>
    </div>
  );
}
