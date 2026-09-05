import { useTranslation } from 'react-i18next'
import { NAV_ITEMS, SETTINGS_ITEM } from './navItems'
import type { ModuleKey } from '../../App'

interface Props {
  active: ModuleKey
  onSelect: (module: ModuleKey) => void
}

const ITEMS = [...NAV_ITEMS, SETTINGS_ITEM]

export function MobileNav({ active, onSelect }: Props) {
  const { t } = useTranslation('nav')

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-ink/10 bg-paper/95 backdrop-blur print:hidden md:hidden dark:border-white/10 dark:bg-slate-950/95"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          aria-label={t(item.key)}
          className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
            active === item.key ? 'text-ledger-green' : 'text-ink/45 dark:text-slate-500'
          }`}
        >
          {item.icon}
          <span className="truncate px-0.5">{t(item.key)}</span>
        </button>
      ))}
    </nav>
  )
}
