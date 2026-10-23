import React from 'react';

export default function Logo({ className = "h-6 w-6 text-orange-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Outer Eye Shape representing "Drishti" (Vision) */}
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      {/* Inner Globe/Radar lines representing "Bhu" (Earth/Terrain) */}
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8c-1.5 1.5-1.5 6.5 0 8" />
      <path d="M12 8c1.5 1.5 1.5 6.5 0 8" />
      <path d="M8.5 12h7" />
    </svg>
  );
}
