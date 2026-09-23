// Inline stroke icons drawn in currentColor — no icon-font dependencies.
type IconProps = { className?: string };

export function CarIcon({ className = 'h-6 w-12' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 48 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 15 L43 15" />
      <path d="M9 8 L24 8" />
      <path d="M24 8 L43 15" />
      <path d="M9 8 L5 15" />
      <path d="M9 8 L9 12 M24 8 L24 12" />
      <path d="M8 12 L40 12" opacity={0.5} />
      <circle cx="13" cy="20" r="3" />
      <circle cx="37" cy="20" r="3" />
    </svg>
  );
}

export function CalendarIcon({ className = 'h-6 w-6' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M9 11 L15 11 M9 15 L15 15" />
      <path d="M4 5 L20 5 M4 6.5 L20 6.5" opacity={0.5} />
    </svg>
  );
}

export function KeyIcon({ className = 'h-6 w-6' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M11.5 7 L18 7 L18 15" />
      <path d="M18 9.5 L14.5 9.5 M18 12.5 L14.5 12.5" />
    </svg>
  );
}

export function PriceIcon({ className = 'h-6 w-6' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8 L11 3 L18 8 Z" />
      <path d="M8 13 L16 13 M9 17 L15 17" />
      <circle cx="20" cy="18" r="3" />
    </svg>
  );
}

export function CheckIcon({ className = 'h-6 w-6' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M7 16 L11 12 L15 8 M15 8 L17.5 6.5" strokeWidth={2.6} />
    </svg>
  );
}

export function MenuIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M4 6 L16 6 M4 10 L16 10 M4 14 L16 14" />
    </svg>
  );
}

export function CloseIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M5 5 L15 15 M15 5 L5 15" />
    </svg>
  );
}