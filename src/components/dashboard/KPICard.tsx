import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant: 'attendance' | 'engagement' | 'violations' | 'feedback';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
  href?: string;
}

const variantStyles = {
  attendance: {
    iconBg: 'bg-emerald-50 text-emerald-600',
    accent: 'bg-emerald-500',
    glow: 'group-hover:shadow-emerald-500/20',
    bg: 'from-emerald-500/5 to-transparent'
  },
  engagement: {
    iconBg: 'bg-blue-50 text-blue-600',
    accent: 'bg-blue-500',
    glow: 'group-hover:shadow-blue-500/20',
    bg: 'from-blue-500/5 to-transparent'
  },
  violations: {
    iconBg: 'bg-red-50 text-red-600',
    accent: 'bg-red-500',
    glow: 'group-hover:shadow-red-500/20',
    bg: 'from-red-500/5 to-transparent'
  },
  feedback: {
    iconBg: 'bg-amber-50 text-amber-600',
    accent: 'bg-amber-500',
    glow: 'group-hover:shadow-amber-500/20',
    bg: 'from-amber-500/5 to-transparent'
  },
};

const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  trend,
  className,
  onClick,
  href,
}: KPICardProps) => {
  const styles = variantStyles[variant];
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    if (href) navigate(href);
  };

  const isClickable = !!onClick || !!href;

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative overflow-hidden rounded-[2rem] bg-white p-6 border border-slate-200 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2',
        isClickable && 'cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]',
        styles.glow,
        className
      )}
    >
      {/* Dynamic Background Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", styles.bg)}></div>

      {/* Bottom Accent Bar */}
      <div className={cn("absolute bottom-0 left-0 h-1.5 transition-all duration-500 w-0 group-hover:w-full", styles.accent)}></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3.5 rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3', styles.iconBg)}>
            <Icon className="h-6 w-6" />
          </div>
          {isClickable && (
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <ArrowUpRight className="h-5 w-5 text-slate-300" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-full",
                trend.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              )}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>

          {(subtitle || trend) && (
            <p className="text-xs font-medium text-slate-500 mt-2 line-clamp-1">
              {subtitle || (trend?.isPositive ? 'Trending upwards' : 'Requires review')}
              <span className="text-slate-300 ml-1">vs last period</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
