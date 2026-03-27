import React from 'react';
import { getDashboardStats } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Users, CalendarCheck, TrendingUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const StateOverview: React.FC = () => {
    const { t } = useLanguage();
    const stats = getDashboardStats('all', 'all');

    const overviewCards = [
        {
            label: 'Operational Institutes',
            value: stats.totalInstitutes,
            icon: Building2,
            color: 'blue',
            description: 'Across all 13 districts'
        },
        {
            label: 'Total Faculty',
            value: stats.totalFaculty,
            icon: Users,
            color: 'indigo',
            description: 'Active professional educators'
        },
        {
            label: 'Avg. Attendance',
            value: `${stats.avgAttendance}%`,
            icon: CalendarCheck,
            color: 'emerald',
            description: 'State-wide rolling average'
        },
        {
            label: 'Quality Score',
            value: `${stats.avgEngagement}%`,
            icon: TrendingUp,
            color: 'amber',
            description: 'Based on student feedback'
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Featured Insight Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="h-40 w-40" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 border border-primary/20 text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
                            <Zap className="h-3 w-3" />
                            State-wide Pulse
                        </div>
                        <h3 className="text-3xl font-bold max-w-md">Industrial Training at a Glance</h3>
                        <p className="text-slate-400 max-w-lg">
                            Real-time monitoring of ITIs across Andhra Pradesh shows a <span className="text-emerald-400 font-bold">4.2% increase</span> in overall faculty engagement compared to last month. Currently, <span className="text-white font-bold">{stats.activeFaculty}</span> faculty members are actively scanned into the system.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold">13</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Districts</span>
                            </div>
                            <div className="w-px h-10 bg-slate-700"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold">850+</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Weekly Alerts</span>
                            </div>
                            <div className="w-px h-10 bg-slate-700"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold">98%</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Compliance</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-slate-900">Governance Status</h4>
                            <p className="text-sm text-slate-500 mt-1">All audit systems are functioning within normal parameters.</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6">
                        <div className="flex items-center justify-between text-sm font-medium">
                            <span className="text-slate-600 uppercase text-[10px] tracking-widest">System Health</span>
                            <span className="text-emerald-600">Optimal</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[95%] rounded-full"></div>
                        </div>

                        <div className="flex items-center justify-between text-sm font-medium pt-2">
                            <span className="text-slate-600 uppercase text-[10px] tracking-widest">Data Latency</span>
                            <span className="text-slate-900">12ms</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full w-[15%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
                {overviewCards.map((card, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-3xl bg-white p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className={cn(
                            "absolute top-0 right-0 -m-8 h-24 w-24 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-150",
                            idx === 0 ? "bg-blue-600" : idx === 1 ? "bg-indigo-600" : idx === 2 ? "bg-emerald-600" : "bg-amber-600"
                        )}></div>

                        <div className="relative z-10 space-y-4">
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors duration-300",
                                idx === 0 ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" :
                                    idx === 1 ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" :
                                        idx === 2 ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" :
                                            "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
                            )}>
                                <card.icon className="h-6 w-6 text-inherit" />
                            </div>

                            <div>
                                <div className="text-3xl font-extrabold text-slate-900">{card.value}</div>
                                <h5 className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{card.label}</h5>
                            </div>

                            <p className="text-xs text-slate-400 font-medium">
                                {card.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StateOverview;
