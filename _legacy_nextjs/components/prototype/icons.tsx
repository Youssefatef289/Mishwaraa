// أيقونات خطية مرسومة بـ currentColor — نفس أسلوب components/icons.tsx
type IconProps = { className?: string };

export function HomeIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11 L12 4 L20 11" /><path d="M6 10 V20 H18 V10" />
    </svg>
  );
}

export function SearchIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" /><path d="M16 16 L21 21" />
    </svg>
  );
}

export function RouteIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" />
      <path d="M8.5 17 C12 15 12 9 15.5 7.5" /><circle cx="6" cy="18" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="18" cy="6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TicketIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7 H20 V10 C18.3 10 17 11.3 17 13 C17 14.7 18.3 16 20 16 V19 H4 V16 C5.7 16 7 14.7 7 13 C7 11.3 5.7 10 4 10 Z" />
      <path d="M12 7 V19" opacity="0.4" />
    </svg>
  );
}

export function WalletIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8 H21 V19 H3 Z" /><path d="M3 8 L3 5.5 H21 V8" />
      <path d="M16 12.5 H20 M17.5 14.5 H20" />
    </svg>
  );
}

export function GridIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function PhoneIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6.5" y="3" width="11" height="18" rx="2.5" /><path d="M10 17 H14" />
    </svg>
  );
}

export function WhatsAppIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 a9 9 0 0 0 -7.7 13.6 L3 21 l4.5 -1.2 A9 9 0 1 0 12 3 Z" />
      <path d="M8.4 8.8 C9.4 7 11 8 11.5 9.6 C12 11 13.5 12.5 15 12.6 C16.6 12.8 16.4 14.6 14.7 14.4 C12.8 14.2 9.8 11.2 8.4 8.8" />
    </svg>
  );
}

export function GpsIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22" />
    </svg>
  );
}

export function BellIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 9 a6 6 0 0 0 -12 0 c0 5 -2 6 -2 7 h16 c0 -1 -2 -2 -2 -7" /><path d="M10 20 a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function PlusIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M12 5 V19 M5 12 H19" />
    </svg>
  );
}

export function ChevronDownIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9 L12 15 L18 9" />
    </svg>
  );
}

export function ChevronUpIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 15 L12 9 L18 15" />
    </svg>
  );
}

export function ShieldIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z" /><path d="M8.5 12 L11 14.5 L15.5 9.5" />
    </svg>
  );
}

export function FuelIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3 H13 V14 H6 Z" /><path d="M5 14 H14 V20 H5 Z" />
      <path d="M9 6 H11 M13 6 L17 9 V18 H20 V9 L17 6" />
    </svg>
  );
}
export function GearIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22 M4.9 4.9 L7 7 M17 17 L19.1 19.1 M19.1 4.9 L17 7 M7 17 L4.9 19.1" />
    </svg>
  );
}

export function SeatIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" /><path d="M3 20 C3 15.5 5.8 13 9 13 C12.2 13 15 15.5 15 20 Z" />
      <path d="M15.5 4.5 A3.5 3.5 0 0 1 15.5 11.5 M18 13.5 C20 15 21 17 21 20" />
    </svg>
  );
}

export function CameraIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2.5" /><circle cx="12" cy="13" r="3.5" />
      <path d="M8 7 L9.5 4 H14.5 L16 7" />
    </svg>
  );
}

export function SnowIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 V21 M5 6.5 L19 17.5 M5 17.5 L19 6.5" /><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MapPinIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z" /><circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function ClockIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7 V12 L15.5 14" />
    </svg>
  );
}

export function StarIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L14.8 8.7 L21 9.5 L16.5 13.9 L17.5 20 L12 17 L6.5 20 L7.5 13.9 L3 9.5 L9.2 8.7 Z" />
    </svg>
  );
}

export function RadarIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5.5" opacity="0.55" />
      <path d="M12 12 L17 7" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LockIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11 V8 A4 4 0 0 1 16 8 V11" />
    </svg>
  );
}

export function DocIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3 H15 L19 7 V21 H6 Z" /><path d="M14 3 V8 H19" /><path d="M9 13 H15 M9 17 H13" />
    </svg>
  );
}

export function WifiIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9 A10 10 0 0 1 20 9 M7 12.5 A6.5 6.5 0 0 1 17 12.5 M10 16 A3 3 0 0 1 14 16" />
      <circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function RefreshIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12 A8 8 0 1 1 18 6" /><path d="M18 3 V7 H14" />
    </svg>
  );
}

export function SendIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4 L21 12 L3 20 L6 12 Z" /><path d="M6 12 H21" />
    </svg>
  );
}

export function UserIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21 C4 16.5 7.5 14 12 14 C16.5 14 20 16.5 20 21" />
    </svg>
  );
}

export function CaretIcon({ className = 'h-5 w-5' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6 L9 12 L15 18" />
    </svg>
  );
}