import type { ModuleKey } from '../../App'

export interface NavItem {
  key: ModuleKey
  icon: JSX.Element
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    key: 'simulator',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          d="M8 7.5h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"
        />
      </svg>
    ),
  },
  {
    key: 'pets',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="7" cy="8" r="1.7" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="5.5" r="1.7" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="8" r="1.7" stroke="currentColor" strokeWidth="1.5" />
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          d="M12 12c-3 0-5.5 2-5.5 4.5S8.2 20 12 20s5.5-1 5.5-3.5S15 12 12 12Z"
        />
      </svg>
    ),
  },
  {
    key: 'cars',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          d="M5 15h14l-1.6-4.8a1.6 1.6 0 0 0-1.5-1.1H8.1a1.6 1.6 0 0 0-1.5 1.1L5 15Z"
        />
        <path stroke="currentColor" strokeWidth="1.6" d="M3.5 15h17" />
        <circle cx="8" cy="17" r="1.4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="16" cy="17" r="1.4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    key: 'accounts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path stroke="currentColor" strokeWidth="1.6" d="M3 9.5h18" />
      </svg>
    ),
  },
]

export const SETTINGS_ITEM: NavItem = {
  key: 'settings',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.6" />
      <path
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7 6.3 6.3"
      />
    </svg>
  ),
}
