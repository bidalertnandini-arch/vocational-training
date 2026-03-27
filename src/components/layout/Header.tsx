import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Languages, LogOut, Bell, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { anomalyAlerts } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const newAlerts = anomalyAlerts.filter((a) => a.status === 'new').length;

  return (
    <header className="gov-header w-full z-50 shrink-0">
      {/* Saffron leading accent bar - Full Width */}
      <div className="accent-bar" />

      <div className="flex items-center justify-between px-4 py-3 lg:px-8 h-20">
        {/* Left: Branding & Menu */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary-foreground hover:bg-white/10"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Master Government Logo - Now in Header for "Full Bar" look */}
          <div className="flex items-center gap-4">
            <div className="gov-seal-icon w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/30 shadow-inner">
              <svg viewBox="0 0 100 100" className="w-8 h-8 lg:w-9 lg:h-9 text-white" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="10" />
                {[...Array(24)].map((_, i) => (
                  <line key={i} x1="50" y1="12" x2="50" y2="22" stroke="currentColor" strokeWidth="3" transform={`rotate(${i * 15} 50 50)`} />
                ))}
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base lg:text-xl font-black leading-none tracking-tight text-white uppercase group-hover:text-accent transition-colors">
                {t('app.title')}
              </h1>
              <span className="text-[10px] lg:text-xs text-white/70 font-bold uppercase tracking-[0.2em] mt-0.5">
                {t('app.subtitle')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: User and Tools */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 shadow-sm backdrop-blur-sm mr-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">System Live</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-white/10 gap-2 rounded-xl transition-all h-10"
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline font-bold">
              {language === 'en' ? 'తెలుగు' : 'English'}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-primary-foreground hover:bg-white/10 rounded-xl h-10 w-10"
            asChild
          >
            <Link to="/alerts">
              <Bell className="h-5 w-5" />
              {newAlerts > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-[10px] font-black border-2 border-[#1a365d] rounded-full">
                  {newAlerts}
                </Badge>
              )}
            </Link>
          </Button>

          {user && (
            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-white/20">
              <div className="hidden md:flex flex-col text-right">
                <p className="text-xs font-black text-white leading-tight uppercase tracking-wider">{user.name}</p>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{user.role}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-white/10 rounded-full h-10 w-10 border border-white/10 bg-white/5"
                onClick={logout}
                title={t('nav.logout')}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
