import { NavLink, useNavigate } from 'react-router-dom';
import { CalendarDays, ChartLine, House, NotebookPen, Plus, Settings } from 'lucide-react';
import { useI18n } from '@/i18n';
import { cn } from '@/utils/cn';

const items = [
  { to: '/', labelKey: 'nav.home', icon: House },
  { to: '/calendar', labelKey: 'nav.calendar', icon: CalendarDays },
  { to: '/log', labelKey: 'nav.log', icon: NotebookPen },
  { to: '/analytics', labelKey: 'nav.analytics', icon: ChartLine },
  { to: '/settings', labelKey: 'nav.settings', icon: Settings },
] as const;

/** Navigation à 5 destinations (§10.1) : barre inférieure mobile, latérale desktop. */
export function BottomNav() {
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <nav
      aria-label={t('nav.home')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-2 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div className="relative mx-auto flex max-w-content items-stretch justify-around">
        {items.slice(0, 2).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <button
          type="button"
          aria-label={t('nav.quickLog')}
          onClick={() => navigate('/log')}
          className="tap-target -mt-4 flex h-14 w-14 items-center justify-center self-center rounded-full bg-gradient-to-br from-primary to-primary-strong text-white shadow-lifted active:scale-95 motion-reduce:active:scale-100"
        >
          <Plus className="h-6 w-6" aria-hidden />
        </button>
        {items.slice(3).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ to, labelKey, icon: Icon }: (typeof items)[number]) {
  const { t } = useI18n();
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'tap-target flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.65rem] transition-colors',
          isActive ? 'font-semibold text-primary-strong dark:text-primary' : 'text-muted hover:text-ink',
        )
      }
    >
      <Icon className="h-5 w-5" aria-hidden />
      {t(labelKey)}
    </NavLink>
  );
}

export function SideNav() {
  const { t } = useI18n();
  return (
    <nav aria-label={t('nav.home')} className="hidden w-56 shrink-0 flex-col gap-1 p-4 lg:flex">
      <div className="mb-4 flex items-center gap-2 px-3">
        <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="h-8 w-8" />
        <span className="font-display text-lg font-bold">{t('app.name')}</span>
      </div>
      {items.map(({ to, labelKey, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive ? 'bg-primary/10 font-semibold text-primary-strong dark:text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink',
            )
          }
        >
          <Icon className="h-5 w-5" aria-hidden />
          {t(labelKey)}
        </NavLink>
      ))}
    </nav>
  );
}
