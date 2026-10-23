import React from "react";

export default function RiskBadge({ level }) {
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide risk-badge-${level}`}>
      {level}
    </span>
  );
}
