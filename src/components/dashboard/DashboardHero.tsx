import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, LayoutDashboard, Calendar, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeroProps {
    title?: string;
    subtitle?: string;
    showFilters?: boolean;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({ title, subtitle }) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-10 shadow-2xl transition-all duration-500 hover:shadow-primary/20 group">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 -m-20 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
            <div className="absolute bottom-0 left-0 -m-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
            <div className="absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-700">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>{user?.role === 'admin' ? 'Strategic Command Center' : 'District Insights'}</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                            {title || `${t('common.welcome')}, ${user?.name.split(' ')[0]}`}
                        </h1>
                        <p className="text-lg text-white/70 font-medium animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                            {subtitle || "Overseeing technical excellence across the state's industrial training infrastructure."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                        <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                            <Calendar className="h-4 w-4" />
                            <span>{today}</span>
                        </div>
                        {user?.district && (
                            <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                                <MapPin className="h-4 w-4" />
                                <span>{user.district} Region</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Status Badge */}
                <div className="flex-shrink-0 animate-in fade-in zoom-in duration-700 delay-500">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl flex flex-col items-center gap-4 shadow-xl">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest leading-none">AI Monitoring</span>
                            <span className="text-emerald-400 font-bold text-lg flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                ACTIVE
                            </span>
                        </div>
                        <div className="w-full h-px bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white leading-none">94.2%</div>
                            <div className="text-[10px] text-white/50 uppercase font-semibold mt-1">Avg. Attendance</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHero;
