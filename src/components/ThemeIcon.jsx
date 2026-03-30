/**
 * Returns an inline SVG icon for each of the 13 themes.
 * Icons are from the approved homepage v2 prototype.
 */
export default function ThemeIcon({ slug }) {
  const icons = {
    'core-building-blocks': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="4" y="4" width="6" height="6" fill="#221C2B" opacity="0.45"/>
        <rect x="17" y="4" width="6" height="6" fill="#221C2B" opacity="0.45"/>
        <rect x="30" y="4" width="6" height="6" fill="#221C2B" opacity="0.45"/>
        <rect x="4" y="17" width="6" height="6" fill="#221C2B" opacity="0.45"/>
        <rect x="17" y="17" width="6" height="6" fill="#9B51E0" opacity="0.8"/>
        <rect x="30" y="17" width="6" height="6" fill="#221C2B" opacity="0.45"/>
        <rect x="4" y="30" width="6" height="6" fill="#221C2B" opacity="0.45"/>
        <rect x="17" y="30" width="6" height="6" fill="#221C2B" opacity="0.45"/>
        <rect x="30" y="30" width="6" height="6" fill="#221C2B" opacity="0.45"/>
      </svg>
    ),
    'system-behaviours': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M4 34 C12 6, 28 6, 36 34" stroke="#221C2B" strokeWidth="1.5" fill="none" opacity="0.35"/>
        <circle cx="10" cy="28" r="2.5" fill="#9B51E0" opacity="0.8"/>
        <circle cx="20" cy="10" r="2.5" fill="#221C2B" opacity="0.4"/>
        <circle cx="30" cy="28" r="2.5" fill="#221C2B" opacity="0.4"/>
      </svg>
    ),
    'systems-archetypes': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="13" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.2"/>
        <path d="M20 7 L20 20 L30 26" stroke="#9B51E0" strokeWidth="1.5" fill="none" opacity="0.7"/>
        <circle cx="20" cy="20" r="2.5" fill="#221C2B" opacity="0.45"/>
      </svg>
    ),
    'leverage-and-intervention': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <line x1="4" y1="36" x2="36" y2="4" stroke="#221C2B" strokeWidth="1.2" opacity="0.2"/>
        <circle cx="14" cy="26" r="3.5" fill="#9B51E0" opacity="0.7"/>
        <circle cx="26" cy="14" r="3.5" fill="#221C2B" opacity="0.35"/>
      </svg>
    ),
    'complexity-and-uncertainty': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M4 20 Q12 4, 20 20 Q28 36, 36 20" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.3"/>
        <path d="M4 24 Q12 8, 20 24 Q28 40, 36 24" stroke="#9B51E0" strokeWidth="1.2" fill="none" opacity="0.5"/>
      </svg>
    ),
    'mental-models': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="4" y="4" width="32" height="32" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.15"/>
        <rect x="12" y="12" width="16" height="16" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.2"/>
        <rect x="17" y="17" width="6" height="6" fill="#9B51E0" opacity="0.7"/>
      </svg>
    ),
    'resilience-and-change': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M8 32 Q8 8, 32 8" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.25"/>
        <circle cx="8" cy="32" r="3" fill="#221C2B" opacity="0.35"/>
        <circle cx="32" cy="8" r="3" fill="#9B51E0" opacity="0.7"/>
        <path d="M20 24 L24 20" stroke="#221C2B" strokeWidth="1" opacity="0.2"/>
      </svg>
    ),
    'boundaries-and-power': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="4" y="4" width="14" height="14" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.2"/>
        <rect x="22" y="4" width="14" height="14" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.2"/>
        <rect x="4" y="22" width="14" height="14" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.2"/>
        <rect x="22" y="22" width="14" height="14" stroke="#9B51E0" strokeWidth="1.2" fill="none" opacity="0.5"/>
      </svg>
    ),
    'organisational-systems': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="14" cy="14" r="4" fill="#221C2B" opacity="0.3"/>
        <circle cx="28" cy="14" r="4" fill="#221C2B" opacity="0.3"/>
        <circle cx="21" cy="28" r="4" fill="#9B51E0" opacity="0.65"/>
        <line x1="14" y1="18" x2="21" y2="24" stroke="#221C2B" strokeWidth="1" opacity="0.15"/>
        <line x1="28" y1="18" x2="21" y2="24" stroke="#221C2B" strokeWidth="1" opacity="0.15"/>
      </svg>
    ),
    'measurement-and-signals': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <line x1="4" y1="32" x2="36" y2="32" stroke="#221C2B" strokeWidth="1" opacity="0.2"/>
        <rect x="8" y="22" width="4" height="10" fill="#221C2B" opacity="0.25"/>
        <rect x="16" y="16" width="4" height="16" fill="#221C2B" opacity="0.25"/>
        <rect x="24" y="10" width="4" height="22" fill="#9B51E0" opacity="0.6"/>
        <rect x="32" y="18" width="4" height="14" fill="#221C2B" opacity="0.25"/>
      </svg>
    ),
    'design-and-intervention': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="12" cy="20" r="3" fill="#221C2B" opacity="0.3"/>
        <circle cx="28" cy="20" r="3" fill="#221C2B" opacity="0.3"/>
        <path d="M15 20 L25 20" stroke="#9B51E0" strokeWidth="1.5" opacity="0.6" strokeDasharray="2 3"/>
        <circle cx="20" cy="12" r="2" fill="#9B51E0" opacity="0.5"/>
      </svg>
    ),
    'natural-metaphors': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M8 32 Q14 20, 20 22 Q26 24, 32 12" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.25"/>
        <circle cx="14" cy="26" r="2" fill="#221C2B" opacity="0.3"/>
        <circle cx="26" cy="18" r="2" fill="#9B51E0" opacity="0.6"/>
        <circle cx="8" cy="32" r="1.5" fill="#221C2B" opacity="0.2"/>
        <circle cx="32" cy="12" r="1.5" fill="#221C2B" opacity="0.2"/>
      </svg>
    ),
    'human-dimensions': (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="16" r="8" stroke="#221C2B" strokeWidth="1.2" fill="none" opacity="0.2"/>
        <circle cx="20" cy="16" r="3" fill="#9B51E0" opacity="0.6"/>
        <line x1="14" y1="30" x2="26" y2="30" stroke="#221C2B" strokeWidth="1.2" opacity="0.2"/>
        <line x1="16" y1="34" x2="24" y2="34" stroke="#221C2B" strokeWidth="1.2" opacity="0.15"/>
      </svg>
    ),
  };

  return icons[slug] || icons['core-building-blocks'];
}
