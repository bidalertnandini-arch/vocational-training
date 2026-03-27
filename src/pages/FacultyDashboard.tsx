import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DashboardHero from '@/components/dashboard/DashboardHero';
import KPICard from '@/components/dashboard/KPICard';
import {
  ScanFace,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
  Star,
  Clock,
  XCircle,
  AlertCircle,
  MonitorPlay,
  MapPin,
  Target
} from 'lucide-react';
import {
  faculty,
  getAttendanceByFaculty,
  getFeedbackByFaculty
} from '@/data/mockData';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const FacultyDashboard = () => {
  const { t, isTeluguActive } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Identify the faculty member
  const facultyMember = faculty.find(f => f.id === user?.id) || faculty[0];
  const displayName = isTeluguActive ? facultyMember.nameTE : facultyMember.name;

  // Get data for this faculty
  const attendanceRecords = getAttendanceByFaculty(facultyMember.id);
  const feedback = getFeedbackByFaculty(facultyMember.id);

  const recentAttendance = attendanceRecords.slice(0, 5);
  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;

  const engagementTrend = [
    { day: 'Mon', score: 82 },
    { day: 'Tue', score: 88 },
    { day: 'Wed', score: 85 },
    { day: 'Thu', score: 92 },
    { day: 'Fri', score: 90 },
  ];

  const mockPerformanceData = [
    { month: 'Oct', attendance: 82, engagement: 75 },
    { month: 'Nov', attendance: 85, engagement: 78 },
    { month: 'Dec', attendance: 88, engagement: 82 },
    { month: 'Jan', attendance: 91, engagement: 85 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'late': return <Clock className="h-5 w-5 text-warning" />;
      case 'half-day': return <AlertCircle className="h-5 w-5 text-warning" />;
      default: return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <DashboardHero
        title={`Faculty Portal: ${displayName}`}
        subtitle={`${facultyMember.trade} Department • Managed via AI Biometrics`}
      />

      {/* Strategic Intelligence HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Attendance Score"
          value={`${facultyMember.attendanceRate}%`}
          icon={CalendarCheck}
          variant="attendance"
          trend={{ value: 1.5, isPositive: true }}
        />
        <KPICard
          title="Quality Index"
          value="8.4/10"
          icon={Star}
          variant="engagement"
          trend={{ value: 0.2, isPositive: true }}
        />
        <KPICard
          title="Sessions Held"
          value="42"
          icon={MonitorPlay}
          variant="violations"
        />
        <KPICard
          title="Syllabus Progress"
          value="78%"
          icon={Target}
          variant="feedback"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Performance & Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Performance Analytics</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Historical Growth Trends</p>
          </div>

          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm p-8 bg-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <TrendingUp className="h-48 w-48" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Student Engagement & Attendance
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    Attendance
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                    Quality
                  </div>
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPerformanceData}>
                    <defs>
                      <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(210, 65%, 22%)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(210, 65%, 22%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="attendance" stroke="hsl(210, 65%, 22%)" strokeWidth={4} fillOpacity={1} fill="url(#colorAttend)" />
                    <Area type="monotone" dataKey="engagement" stroke="#60a5fa" strokeWidth={4} fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-slate-200 shadow-sm p-6 overflow-hidden">
            <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between border-b pb-6 border-slate-100">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black text-slate-900">Voice of Students</CardTitle>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Latest Feedback Entries</p>
              </div>
              <Badge variant="outline" className="rounded-full bg-slate-50 px-4 py-1.5 font-black text-[10px] uppercase">{feedback.length} Entries</Badge>
            </CardHeader>
            <CardContent className="px-0 mt-8">
              {feedback.length === 0 ? (
                <p className="text-slate-400 py-12 text-center">No student feedback available for this period.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {feedback.slice(0, 4).map((fb) => (
                    <div key={fb.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-4 hover:shadow-md transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn('h-3 w-3', i < fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200')} />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{fb.date}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 italic leading-relaxed group-hover:text-slate-900 transition-colors">
                        "{isTeluguActive ? fb.feedbackTextTE : fb.feedbackText}"
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <Badge className={cn('rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase border-none',
                          fb.sentiment === 'positive' ? 'bg-emerald-500 text-white' : fb.sentiment === 'negative' ? 'bg-red-500 text-white' : 'bg-slate-400 text-white'
                        )}>
                          {fb.sentiment}
                        </Badge>
                        <div className="text-[9px] font-black text-slate-300 uppercase underline decoration-slate-200 underline-offset-4 cursor-help">Anonymous</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Quick Actions & Status */}
        <div className="space-y-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Duty</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Today's Presence</p>
          </div>

          <Card className="rounded-[2.5rem] border-slate-200 shadow-xl overflow-hidden border-l-8 border-l-emerald-500 relative bg-white">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <CheckCircle2 className="h-32 w-32" />
            </div>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-inner">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 px-4 py-2 rounded-2xl font-black text-[10px] uppercase shadow-sm">
                  Today Verified
                </Badge>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">Status: Present</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter mb-8">Ref: AI-ATT-9428-X-GNT</p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-colors">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm border group-hover:bg-blue-50">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Geo-Locality</span>
                    <span className="text-sm font-bold text-slate-700">Guntur Strategic ITI</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-colors">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm border group-hover:bg-emerald-50">
                    <Clock className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Check-In Time</span>
                    <span className="text-sm font-bold text-slate-700">09:12 AM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button
              onClick={() => navigate('/attendance')}
              className="w-full h-16 rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-white font-black text-lg gap-3 shadow-2xl hover:-translate-y-1 transition-all group"
            >
              <ScanFace className="h-6 w-6 group-hover:scale-125 transition-transform" />
              Go to Scanner
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/sessions')}
                className="h-16 rounded-[1.3rem] border-2 font-black text-xs uppercase tracking-widest gap-2 bg-white"
              >
                <MonitorPlay className="h-4 w-4" />
                Sessions
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/alerts')}
                className="h-16 rounded-[1.3rem] border-2 font-black text-xs uppercase tracking-widest gap-2 bg-white"
              >
                <AlertCircle className="h-4 w-4" />
                Alerts
              </Button>
            </div>
          </div>

          <Card className="rounded-[2rem] border-slate-200 shadow-sm p-6 overflow-hidden">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-md font-black uppercase text-slate-400 tracking-widest">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4 mt-4">
                {recentAttendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-50">
                        {getStatusIcon(record.status)}
                      </div>
                      <div className="flex flex-col">
                        <p className="font-bold text-slate-900 text-sm">
                          {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <span className="text-[9px] font-black text-slate-400 uppercase">Verification ID: {record.id.slice(0, 6)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-700 text-sm">{record.checkIn || '--:--'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
