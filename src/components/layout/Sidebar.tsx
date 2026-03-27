import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  MonitorPlay,
  MessageSquareText,
  AlertTriangle,
  FileBarChart,
  Settings,
  X,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { path: '/faculty', icon: Users, label: t('nav.faculty') },
    { path: '/institutes', icon: Building2, label: t('nav.institutes') },
    { path: '/attendance', icon: CalendarCheck, label: t('nav.attendance') },
    { path: '/sessions', icon: MonitorPlay, label: t('nav.sessions') },
    { path: '/feedback', icon: MessageSquareText, label: t('nav.feedback') },
    { path: '/alerts', icon: AlertTriangle, label: t('nav.alerts') },
    { path: '/reports', icon: FileBarChart, label: t('nav.reports') },
  ];

  const getFilteredNavItems = () => {
    if (!user) return [];
    switch (user.role) {
      case 'faculty':
        return navItems.filter((item) => ['/dashboard', '/attendance', '/feedback'].includes(item.path));
      case 'principal':
        return navItems.filter((item) => ['/dashboard', '/faculty', '/sessions', '/feedback', '/alerts'].includes(item.path));
      case 'student':
        return navItems.filter((item) => ['/dashboard', '/feedback'].includes(item.path));
      default:
        // Admin/DTO can see everything except personal attendance module
        return navItems.filter((item) => item.path !== '/attendance');
    }
  };

  const filteredItems = getFilteredNavItems();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Integrated Vertical Bar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 lg:static flex flex-col border-r border-sidebar-border shadow-2xl',
          'lg:h-auto lg:min-h-0', // On desktop, parent manages height
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'lg:w-24' : 'w-72'
        )}
      >
        {/* Collapse Toggle / Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border/30 shrink-0">
          <span className={cn("font-black uppercase tracking-widest text-[10px] text-white/40 lg:hidden")}>Navigation</span>

          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground lg:hidden"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex text-sidebar-foreground hover:bg-white/10 w-full justify-between items-center group px-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Compact View</span>}
            <ChevronLeft className={cn("h-5 w-5 transition-transform duration-500 group-hover:text-accent", isCollapsed && "rotate-180 m-auto")} />
          </Button>
        </div>

        {/* Navigation - Strategic Vertical Menu */}
        <nav className="flex flex-col gap-2 p-4 mt-4 flex-1 overflow-y-auto hide-scrollbar">
          {filteredItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-sidebar-primary to-orange-400 text-sidebar-primary-foreground shadow-xl scale-[1.02]'
                    : 'hover:bg-white/5 text-sidebar-foreground/60 hover:text-white',
                  isCollapsed ? 'justify-center p-4' : ''
                )}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className={cn('h-6 w-6 flex-shrink-0 transition-transform duration-500 group-hover:scale-125', isActive && 'scale-110')} />

                {!isCollapsed && (
                  <span className="font-bold text-sm tracking-wide truncate transition-all duration-300">
                    {item.label}
                  </span>
                )}

                {/* Active Pill Indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute right-3 h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]"></div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings - Docked at Bottom */}
        <div className="p-4 border-t border-sidebar-border/30 shrink-0 mb-4">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={cn(
              'flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group',
              location.pathname === '/settings'
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-sidebar-foreground/60 hover:text-white hover:bg-white/5',
              isCollapsed ? 'justify-center p-4' : ''
            )}
            title={isCollapsed ? t('nav.settings') : ''}
          >
            <Settings className={cn('h-6 w-6 flex-shrink-0 transition-transform group-hover:rotate-90', location.pathname === '/settings' && 'rotate-45')} />
            {!isCollapsed && <span className="font-bold text-sm truncate">{t('nav.settings')}</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
