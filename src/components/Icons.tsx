import * as React from "react";

export function IconPersonal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="10" r="6" fill="currentColor" />
      <rect x="6" y="20" width="20" height="8" rx="4" fill="currentColor" />
    </svg>
  );
}

export function IconLightning({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <polygon points="14,2 28,16 18,16 20,30 4,16 14,16" fill="currentColor" />
    </svg>
  );
}

export function IconOptions({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <rect x="4" y="4" width="24" height="24" rx="5" fill="currentColor" />
      <rect x="9" y="9" width="14" height="14" rx="2" fill="#fff" />
    </svg>
  );
}
