import React from 'react';
import { getStatusDetails } from '../utils/formatters';

export default function StatusBadge({ status, size = 'sm' }) {
  const details = getStatusDetails(status);

  const sizeClasses = size === 'lg'
    ? 'px-3.5 py-1 text-xs'
    : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-neo-mono font-bold uppercase tracking-wider border ${details.bgColor} ${details.textColor} ${details.borderColor} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${details.dotColor} animate-pulse`} />
      <span>{details.label}</span>
    </span>
  );
}
