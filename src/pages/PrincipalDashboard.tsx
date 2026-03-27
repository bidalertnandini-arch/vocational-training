import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  getInstituteById,
  getFacultyByInstitute,
  getAlertsByInstitute,
  classroomSessions,
  studentFeedback,
  getFacultyById,
} from '@/data/mockData';
import KPICard from '@/components/dashboard/KPICard';
import FacultyStatusTable from '@/components/dashboard/FacultyStatusTable';
import AttendanceLog from '@/components/dashboard/AttendanceLog';
import DashboardHero from '@/components/dashboard/DashboardHero';
import {
  Users,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  MonitorPlay,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrincipalDashboard = () => {
  const { t, isTeluguActive } = useLanguage();
  const { user } = useAuth();

  // Get institute data
  const instituteId = user?.instituteId || 'GU28000260';
  const institute = getInstituteById(instituteId);
  const facultyList = getFacultyByInstitute(instituteId);
  const alerts = getAlertsByInstitute(instituteId);
  const activeAlerts = alerts.filter((a) => a.status !== 'resolved');

  // Calculate stats
  const avgAttendance = facultyList.reduce((sum, f) => sum + f.attendanceRate, 0) / facultyList.length;
  const avgEngagement = facultyList.reduce((sum, f) => sum + f.engagementScore, 0) / facultyList.length;

  // Get today's sessions for this institute
  const todaySessions = classroomSessions.filter((s) => {
    const faculty = getFacultyById(s.facultyId);
    return faculty?.instituteId === instituteId;
  });

  // Recent feedback for this institute
  const instituteFeedback = studentFeedback.filter((fb) => {
    const faculty = getFacultyById(fb.facultyId);
    return faculty?.instituteId === instituteId;
  }).slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Hero Section */}
      <DashboardHero
        title={isTeluguActive ? institute?.nameTE : institute?.name}
        subtitle={`Primary administration hub for ${isTeluguActive ? institute?.districtTE : institute?.district} industrial training.`}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Overview</h2>
          <p className="text-sm text-slate-500 font-medium">Monitoring {facultyList.length} faculty members today</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-bold text-emerald-600 bg-white px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm whitespace-nowrap">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>Secure Surveillance Active</span>
        </div>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <KPICard
          title={t('kpi.totalFaculty')}
          value={facultyList.length}
          subtitle={`${facultyList.filter((f) => f.status === 'active').length} active`}
          icon={Users}
          variant="engagement"
          href="/faculty"
        />
        <KPICard
          title={t('kpi.attendance')}
          value={`${avgAttendance.toFixed(1)}%`}
          icon={CalendarCheck}
          variant="attendance"
          trend={{ value: 1.5, isPositive: true }}
          href="/attendance"
        />
        <KPICard
          title={t('kpi.engagement')}
          value={`${avgEngagement.toFixed(1)}%`}
          icon={TrendingUp}
          variant="engagement"
          href="/sessions"
        />
        <KPICard
          title={t('kpi.violations')}
          value={activeAlerts.length}
          subtitle="Active alerts"
          icon={AlertTriangle}
          variant="violations"
          href="/alerts"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faculty Status - Takes 2 columns */}
        <div className="lg:col-span-2">
          <FacultyStatusTable instituteId={instituteId} />
        </div>

        {/* Today's Sessions */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MonitorPlay className="h-5 w-5 text-info" />
              {t('dashboard.todaysSessions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaySessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No sessions today
              </p>
            ) : (
              todaySessions.map((session) => {
                const faculty = getFacultyById(session.facultyId);
                return (
                  <div
                    key={session.id}
                    className="p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {isTeluguActive ? faculty?.nameTE : faculty?.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          session.engagementScore >= 85
                            ? 'bg-success/10 text-success border-success/30'
                            : session.engagementScore >= 70
                              ? 'bg-warning/10 text-warning border-warning/30'
                              : 'bg-destructive/10 text-destructive border-destructive/30'
                        )}
                      >
                        {session.engagementScore.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.startTime} - {session.endTime}
                      </span>
                      <span>{session.trade}</span>
                      <span>{session.studentCount} students</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attendance Log - New Feature */}
      <div className="animate-fade-in">
        <AttendanceLog instituteId={instituteId} limit={5} />
      </div>

      {/* Recent Feedback */}
      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-accent" />
            Recent Student Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {instituteFeedback.map((fb) => {
              const faculty = getFacultyById(fb.facultyId);
              return (
                <div
                  key={fb.id}
                  className="p-4 bg-muted/30 rounded-lg border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      {isTeluguActive ? faculty?.nameTE : faculty?.name}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3 w-3',
                            i < fb.rating
                              ? 'text-accent fill-accent'
                              : 'text-muted-foreground/30'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    "{isTeluguActive ? fb.feedbackTextTE : fb.feedbackText}"
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      'mt-2 text-xs',
                      fb.sentiment === 'positive'
                        ? 'bg-success/10 text-success border-success/30'
                        : fb.sentiment === 'negative'
                          ? 'bg-destructive/10 text-destructive border-destructive/30'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {t(`feedback.${fb.sentiment}`)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrincipalDashboard;
