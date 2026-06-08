interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SwordsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 17.5L20 20L19 14.5L17 12.5L14 14L12.5 17L14.5 17.5Z" />
      <path d="M9.5 6.5L4 4L5 9.5L7 11.5L10 10L11.5 7L9.5 6.5Z" />
      <line x1="12" y1="12" x2="4" y2="20" />
      <line x1="12" y1="12" x2="20" y2="4" />
    </svg>
  );
}

export function CrossedSwordsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 4L10 8L6 12L2 8L6 4Z" />
      <path d="M18 4L14 8L18 12L22 8L18 4Z" />
      <line x1="8" y1="10" x2="8" y2="20" />
      <line x1="16" y1="10" x2="16" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  );
}

export function RunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="5" r="2" />
      <path d="M9 20L12 14L15 11" />
      <path d="M7 13L10 11L12 14" />
      <path d="M12 14L15 20" />
      <path d="M15 6L18 9" />
      <path d="M18 6L15 9" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L20 5V11C20 15.5 16.4 19.5 12 21C7.6 19.5 4 15.5 4 11V5L12 2Z" />
      <path d="M9 12L11 14L15 10" />
    </svg>
  );
}

export function ScrollIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 2H18C19 2 20 3 20 4V20C20 21 19 22 18 22H6C5 22 4 21 4 20V17" />
      <path d="M4 17H8V22" />
      <line x1="10" y1="8" x2="16" y2="8" />
      <line x1="10" y1="12" x2="16" y2="12" />
      <line x1="10" y1="16" x2="13" y2="16" />
    </svg>
  );
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4C3 9 2 8 2 7V5C2 4 3 3 4 3H6" />
      <path d="M18 9H20C21 9 22 8 22 7V5C22 4 21 3 20 3H18" />
      <path d="M6 3H18V14C18 16 16 18 14 18H10C8 18 6 16 6 14V3Z" />
      <path d="M8 21H16" />
      <path d="M12 18V21" />
    </svg>
  );
}

export function TowerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 3H20" />
      <path d="M6 3V21" />
      <path d="M18 3V21" />
      <path d="M8 21H16" />
      <path d="M8 7H10" />
      <path d="M8 11H10" />
      <path d="M14 7H16" />
      <path d="M14 11H16" />
    </svg>
  );
}

export function GemIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 3L3 9L12 21L21 9L18 3H6Z" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="3" x2="7" y2="9" />
      <line x1="15" y1="3" x2="17" y2="9" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21V19C17 16.8 15.2 15 13 15H5C2.8 15 1 16.8 1 19V21" />
      <path d="M9 11C11.2 11 13 9.2 13 7C13 4.8 11.2 3 9 3C6.8 3 5 4.8 5 7C5 9.2 6.8 11 9 11Z" />
      <path d="M23 21V19C22.7 17.1 21.2 15.6 19.2 15.3" />
      <path d="M16 3.3C17.7 3.8 19 5.3 19 7.1C19 8.9 17.7 10.4 16 10.9" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function MagicWandIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 4L18 1L20 3L17 6L15 4Z" />
      <path d="M18 2L22 6" />
      <path d="M17 5L13 9L15 11L19 7L17 5Z" />
      <line x1="3" y1="21" x2="12" y2="12" />
    </svg>
  );
}

export function AnvilIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 8L19 8" />
      <path d="M12 3V8" />
      <path d="M4 14L20 14" />
      <path d="M2 14L6 8L18 8L22 14" />
      <path d="M4 14V21H20V14" />
    </svg>
  );
}

export function CrownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 20H22" />
      <path d="M4 20L6 8L10 13L12 3L14 13L18 8L20 20" />
    </svg>
  );
}

export function SkullIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="11" r="8" />
      <circle cx="9" cy="11" r="1.5" fill="currentColor" />
      <circle cx="15" cy="11" r="1.5" fill="currentColor" />
      <path d="M10 15C11 16 13 16 14 15" />
      <path d="M8 20L7 21" />
      <path d="M16 20L17 21" />
      <path d="M12 19V21" />
    </svg>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5C4 18.1 5.1 17 6.5 17H20" />
      <path d="M6.5 2H20V21H6.5C5.1 21 4 19.9 4 18.5V4.5C4 3.1 5.1 2 6.5 2Z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function MapIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 7V21L9 17L15 21L21 17V3L15 7L9 3Z" />
      <line x1="9" y1="3" x2="9" y2="17" />
      <line x1="15" y1="7" x2="15" y2="21" />
    </svg>
  );
}

export function WatchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="7" />
      <polyline points="12 9 12 12 14 14" />
      <path d="M9 2H15" />
      <path d="M9 22H15" />
      <path d="M8 4C6.3 5.2 5 7.4 5 10" />
      <path d="M16 4C17.7 5.2 19 7.4 19 10" />
      <path d="M8 20C6.3 18.8 5 16.6 5 14" />
      <path d="M16 20C17.7 18.8 19 16.6 19 14" />
    </svg>
  );
}

export function SyncIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.5 9C4.5 6.5 7 4.5 10 3.5C13 2.5 16.5 3 19 5" />
      <path d="M20.5 15C19.5 17.5 17 19.5 14 20.5C11 21.5 7.5 21 5 19" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5Z" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 11.5L12 4L21 11.5" />
      <path d="M5.5 10V20H18.5V10" />
      <path d="M9.5 20V14H14.5V20" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M4 7H20" />
      <path d="M4 12H20" />
      <path d="M4 17H20" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}
