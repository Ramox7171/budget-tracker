import { useTranslation } from 'react-i18next'
import { NAV_ITEMS, SETTINGS_ITEM } from './navItems'
import type { ModuleKey } from '../../App'

interface Props {
  active: ModuleKey
  onSelect: (module: ModuleKey) => void
}

export function Sidebar({ active, onSelect }: Props) {
  const { t } = useTranslation('nav')

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-ink/10 bg-white/40 px-3 py-5 print:hidden md:flex dark:border-white/10 dark:bg-white/5">
      <p className="mb-6 px-2 text-sm font-semibold tracking-tight">{t('appName')}</p>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              active === item.key
                ? 'bg-ink text-paper dark:bg-slate-100 dark:text-slate-900'
                : 'text-ink/60 hover:bg-ink/5 hover:text-ink dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100'
            }`}
          >
            {item.icon}
            {t(item.key)}
          </button>
        ))}
      </nav>

      <div className="mt-2 border-t border-ink/10 pt-2 dark:border-white/10">
        <button
          onClick={() => onSelect(SETTINGS_ITEM.key)}
          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            active === SETTINGS_ITEM.key
              ? 'bg-ink text-paper dark:bg-slate-100 dark:text-slate-900'
              : 'text-ink/60 hover:bg-ink/5 hover:text-ink dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100'
          }`}
        >
          {SETTINGS_ITEM.icon}
          {t(SETTINGS_ITEM.key)}
        </button>
      </div>
    </aside>
  )
}
