import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardStats, districts, institutes } from '@/data/mockData';
import KPICard from '@/components/dashboard/KPICard';
import InstituteGrid from '@/components/dashboard/InstituteGrid';
import AlertsList from '@/components/dashboard/AlertsList';
import AttendanceChart from '@/components/dashboard/AttendanceChart';
import EngagementChart from '@/components/dashboard/EngagementChart';
import FeedbackSummary from '@/components/dashboard/FeedbackSummary';
import AttendanceLog from '@/components/dashboard/AttendanceLog';
import DashboardHero from '@/components/dashboard/DashboardHero';
import StateOverview from '@/components/dashboard/StateOverview';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Users, Building2, CalendarCheck, TrendingUp, AlertTriangle, MapPin, Search, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DTODashboard = () => {
  const { t, isTeluguActive } = useLanguage();
  const { user } = useAuth();

  // Role-based filter initialization
  const initialDistrict = user?.role === 'dto' && user.district
    ? districts.find(d => d.name.toLowerCase() === user.district?.toLowerCase())?.id || 'all'
    : '';

  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedInstitute, setSelectedInstitute] = useState('all');

  const isLockedToDistrict = user?.role === 'dto';

  // Calculate stats based on selection
  const stats = getDashboardStats(selectedDistrict, selectedInstitute);

  // Filter institutes for the dropdown
  const filteredDistrictInstitutes = selectedDistrict === 'all'
    ? institutes
    : institutes.filter(i => {
      const distObj = districts.find(d => d.id === selectedDistrict);
      const distName = distObj ? distObj.name : selectedDistrict;
      return i.district.toLowerCase() === distName.toLowerCase();
    });

  const getDistrictName = () => {
    if (!selectedDistrict) return '';
    const dist = districts.find(d => d.id === selectedDistrict);
    return isTeluguActive ? dist?.nameTE : dist?.name;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Hero Section */}
      <DashboardHero
        title={selectedDistrict ? `${getDistrictName()} ${t('nav.dashboard')}` : undefined}
        subtitle={selectedDistrict ? `Real-time monitoring and analytics for ITIs in ${getDistrictName()} district.` : undefined}
      />

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* District & Institute Selection Toolbar */}
        <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col gap-1.5 min-w-[200px]">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Geographic Focus</label>
            <Select
              value={selectedDistrict}
              onValueChange={(val) => {
                setSelectedDistrict(val);
                setSelectedInstitute('all');
              }}
              disabled={isLockedToDistrict}
            >
              <SelectTrigger className={cn(
                "w-full h-12 bg-slate-50 border-slate-200 shadow-none focus:ring-primary/10 hover:bg-slate-100 transition-all rounded-2xl",
                isLockedToDistrict && "opacity-80 cursor-not-allowed"
              )}>
                <div className="flex items-center gap-3 truncate">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                  </div>
                  <SelectValue placeholder="Select District" />
                  {isLockedToDistrict && <Badge variant="secondary" className="ml-auto text-[8px] bg-slate-200">Locked</Badge>}
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-[300px] rounded-2xl p-2">
                {!isLockedToDistrict && <SelectItem value="all" className="rounded-xl">All Districts</SelectItem>}
                {districts.filter(d => d.id !== 'all').map((dist) => (
                  <SelectItem key={dist.id} value={dist.id} className="rounded-xl">
                    {isTeluguActive ? dist.nameTE : dist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDistrict && (
            <div className="flex flex-col gap-1.5 min-w-[200px] animate-in fade-in slide-in-from-left-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Institute Filter</label>
              <Select
                value={selectedInstitute}
                onValueChange={setSelectedInstitute}
              >
                <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-200 shadow-none focus:ring-primary/10 hover:bg-slate-100 transition-all rounded-2xl">
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
                      <Building2 className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <SelectValue placeholder="Institute" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[300px] rounded-2xl p-2">
                  <SelectItem value="all" className="rounded-xl">All Institutes</SelectItem>
                  {filteredDistrictInstitutes.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id} className="rounded-xl">
                      {isTeluguActive ? inst.nameTE : inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-1.5 justify-end">
            {selectedInstitute !== 'all' && (
              <button
                onClick={() => setSelectedInstitute('all')}
                className="flex items-center justify-center gap-2 px-6 h-12 rounded-2xl bg-primary/5 text-primary hover:bg-primary/10 transition-all text-sm font-bold border border-primary/10"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back to District List
              </button>
            )}
          </div>
        </div>

        {/* Live Badge and Global Tools */}
        <div className="w-full xl:flex-1 flex items-center justify-end gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Last Data Sync</span>
            <span className="text-sm font-bold text-slate-700">Just Now</span>
          </div>

          <button className="p-3 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 shadow-sm transition-all group">
            <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex items-center gap-3 text-sm font-bold text-emerald-600 bg-white px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm whitespace-nowrap">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Live Monitor</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedDistrict ? (
        <StateOverview />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {selectedInstitute === 'all' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 px-1">
                  Institutes in {getDistrictName()}
                </h3>
                <div className="text-sm text-slate-500 font-medium">
                  Showing {filteredDistrictInstitutes.length} results
                </div>
              </div>
              <InstituteGrid
                institutes={filteredDistrictInstitutes}
                onSelect={setSelectedInstitute}
                isTeluguActive={isTeluguActive}
              />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                <KPICard
                  title={'Active Faculty'}
                  value={stats.activeFaculty}
                  subtitle={'Currently checked in'}
                  icon={Building2}
                  variant="engagement"
                  href={`/institutes/${selectedInstitute}`}
                />
                <KPICard
                  title={t('kpi.attendance')}
                  value={`${stats.avgAttendance}%`}
                  icon={CalendarCheck}
                  variant="attendance"
                  trend={{ value: 2.3, isPositive: true }}
                  href="/attendance"
                />
                <KPICard
                  title={t('kpi.engagement')}
                  value={`${stats.avgEngagement}%`}
                  icon={TrendingUp}
                  variant="engagement"
                  trend={{ value: 1.8, isPositive: true }}
                  href="/sessions"
                />
                <KPICard
                  title={t('kpi.violations')}
                  value={stats.totalAlerts}
                  subtitle="Requires attention"
                  icon={AlertTriangle}
                  variant="violations"
                  href="/alerts"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                  <AttendanceChart />
                </div>
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                  <EngagementChart />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm overflow-hidden">
                  <AlertsList />
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm overflow-hidden">
                <AttendanceLog limit={8} />
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm overflow-hidden">
                <FeedbackSummary />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DTODashboard;

