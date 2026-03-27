import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { faculty, getInstituteById, attendanceRecords, districts } from '@/data/mockData';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface FacultyStatusTableProps {
  instituteId?: string;
  limit?: number;
}

const FacultyStatusTable = ({ instituteId, limit = 10 }: FacultyStatusTableProps) => {
  const { t, isTeluguActive } = useLanguage();
  const { user } = useAuth();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Logic: Filter faculty based on provided ID or User Role
  const filteredFaculty = useMemo(() => {
    let list = faculty;

    // 1. If explicit instituteId provided (e.g. from Principal Dashboard)
    if (instituteId) {
      list = list.filter((f) => f.instituteId === instituteId);
    }
    // 2. If no ID provided, check user context
    else if (user) {
      if (user.role === 'dto') {
        const userDistrict = user.district?.toLowerCase();
        list = list.filter((f) => {
          const inst = getInstituteById(f.instituteId);
          return inst?.district.toLowerCase() === userDistrict;
        });
      } else if (user.role === 'principal') {
        list = list.filter((f) => f.instituteId === user.instituteId);
      }
    }

    return list;
  }, [instituteId, user]);

  // Get today's attendance for each faculty
  const facultyWithStatus = filteredFaculty.slice(0, limit).map((fac) => {
    const todayAttendance = attendanceRecords.find(
      (a) => a.facultyId === fac.id && a.date === today
    );
    const institute = getInstituteById(fac.instituteId);
    return {
      ...fac,
      todayStatus: todayAttendance?.status || 'absent',
      checkIn: todayAttendance?.checkIn,
      checkOut: todayAttendance?.checkOut,
      institute,
    };
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'late':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'half-day':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'absent':
      default:
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return t('status.present');
      case 'late':
        return t('status.late');
      case 'half-day':
        return t('status.halfDay');
      case 'absent':
      default:
        return t('status.absent');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'present':
        return 'status-badge present';
      case 'late':
        return 'status-badge late';
      case 'half-day':
        return 'status-badge late';
      case 'absent':
      default:
        return 'status-badge absent';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-card rounded-lg border shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
        <h3 className="font-semibold text-lg">{t('dashboard.facultyStatus')}</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('table.name')}</th>
              <th>{t('table.trade')}</th>
              {!instituteId && <th>{t('table.institute')}</th>}
              <th className="text-center">{t('table.status')}</th>
              <th className="text-center">{t('table.checkIn')}</th>
              <th className="text-center">{t('table.attendance')}</th>
            </tr>
          </thead>
          <tbody>
            {facultyWithStatus.map((fac) => (
              <tr key={fac.id} className="hover:bg-muted/30 transition-colors">
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {getInitials(fac.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {isTeluguActive ? fac.nameTE : fac.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{fac.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-sm">
                    {isTeluguActive ? fac.tradeTE : fac.trade}
                  </span>
                </td>
                {!instituteId && (
                  <td>
                    <span className="text-sm">
                      {isTeluguActive ? fac.institute?.nameTE : fac.institute?.name}
                    </span>
                  </td>
                )}
                <td className="text-center">
                  <span className={getStatusBadgeClass(fac.todayStatus)}>
                    {getStatusIcon(fac.todayStatus)}
                    <span className="ml-1">{getStatusText(fac.todayStatus)}</span>
                  </span>
                </td>
                <td className="text-center">
                  <span className="text-sm font-mono">
                    {fac.checkIn || '--:--'}
                  </span>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          fac.attendanceRate >= 90
                            ? 'bg-success'
                            : fac.attendanceRate >= 80
                              ? 'bg-warning'
                              : 'bg-destructive'
                        )}
                        style={{ width: `${fac.attendanceRate}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-12">
                      {fac.attendanceRate}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyStatusTable;
