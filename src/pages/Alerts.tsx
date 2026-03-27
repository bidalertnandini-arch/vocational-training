import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { anomalyAlerts, getFacultyById, getInstituteById } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  Clock,
  UserX,
  TrendingDown,
  MessageSquareWarning,
  Timer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Eye,
  User,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  GraduationCap,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const alertTypeIcons = {
  late_arrival: Clock,
  frequent_absence: UserX,
  low_engagement: TrendingDown,
  negative_feedback: MessageSquareWarning,
  duration_mismatch: Timer,
};

const alertTypeLabels = {
  late_arrival: 'alert.type.lateArrival',
  frequent_absence: 'alert.type.frequentAbsence',
  low_engagement: 'alert.type.lowEngagement',
  negative_feedback: 'alert.type.negativeFeedback',
  duration_mismatch: 'Duration Mismatch',
};

const Alerts = () => {
  const { t, isTeluguActive } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'acknowledged' | 'resolved'>('all');

  // Filter alerts based on role
  const initialAlerts = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') return anomalyAlerts;
    if (user.role === 'dto') {
      const userDistrict = user.district?.toLowerCase();
      return anomalyAlerts.filter(a => {
        const inst = getInstituteById(a.instituteId);
        return inst?.district.toLowerCase() === userDistrict;
      });
    }
    if (user.role === 'principal') {
      return anomalyAlerts.filter(a => a.instituteId === user.instituteId);
    }
    return [];
  }, [user]);

  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const selectedFaculty = selectedFacultyId ? getFacultyById(selectedFacultyId) : null;
  const selectedInstitute = selectedFaculty ? getInstituteById(selectedFaculty.instituteId) : null;

  const filteredAlerts =
    filter === 'all'
      ? alerts
      : alerts.filter((a) => a.status === filter);

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'alert-severity high';
      case 'medium':
        return 'alert-severity medium';
      case 'low':
        return 'alert-severity low';
      default:
        return 'alert-severity';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'acknowledged':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'resolved':
        return 'bg-success/10 text-success border-success/30';
      default:
        return '';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    return 'Just now';
  };

  const statusCounts = {
    new: alerts.filter((a) => a.status === 'new').length,
    acknowledged: alerts.filter((a) => a.status === 'acknowledged').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  };

  const handleUpdateStatus = (id: string, newStatus: 'acknowledged' | 'resolved') => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, status: newStatus } : alert
    ));
    toast.success(`Alert ${newStatus === 'acknowledged' ? 'acknowledged' : 'marked as resolved'} successfully`);
  };

  const handleViewDetails = (facultyId: string) => {
    setSelectedFacultyId(facultyId);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            {t('nav.alerts')}
          </h1>
          <p className="text-muted-foreground">
            AI-detected anomalies and discipline violations
          </p>
        </div>
      </div>

      {/* Stats - Now interactive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className={cn(
            "border-l-4 border-l-destructive cursor-pointer hover:shadow-md transition-all active:scale-95",
            filter === 'new' && "ring-2 ring-destructive/20 bg-destructive/5"
          )}
          onClick={() => setFilter('new')}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-bold">{t('alert.status.new')}</p>
                <p className="text-2xl font-black text-destructive">{statusCounts.new}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "border-l-4 border-l-warning cursor-pointer hover:shadow-md transition-all active:scale-95",
            filter === 'acknowledged' && "ring-2 ring-warning/20 bg-warning/5"
          )}
          onClick={() => setFilter('acknowledged')}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-bold">{t('alert.status.acknowledged')}</p>
                <p className="text-2xl font-black text-warning">{statusCounts.acknowledged}</p>
              </div>
              <Eye className="h-8 w-8 text-warning/30" />
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "border-l-4 border-l-success cursor-pointer hover:shadow-md transition-all active:scale-95",
            filter === 'resolved' && "ring-2 ring-success/20 bg-success/5"
          )}
          onClick={() => setFilter('resolved')}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-bold">{t('alert.status.resolved')}</p>
                <p className="text-2xl font-black text-success">{statusCounts.resolved}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">{t('common.all')} ({alerts.length})</TabsTrigger>
          <TabsTrigger value="new">{t('alert.status.new')} ({statusCounts.new})</TabsTrigger>
          <TabsTrigger value="acknowledged">{t('alert.status.acknowledged')} ({statusCounts.acknowledged})</TabsTrigger>
          <TabsTrigger value="resolved">{t('alert.status.resolved')} ({statusCounts.resolved})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed">
                <p className="text-muted-foreground font-medium">No {filter} alerts found</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const IconComponent = alertTypeIcons[alert.type] || AlertTriangle;
                const faculty = getFacultyById(alert.facultyId);
                const institute = getInstituteById(alert.instituteId);
                const isExpanded = expandedId === alert.id;

                return (
                  <Card
                    key={alert.id}
                    className={cn(
                      'transition-all duration-200 animate-fade-in overflow-hidden relative',
                      isExpanded && 'ring-2 ring-primary/20 shadow-lg'
                    )}
                  >
                    <CardContent className="p-4">
                      <div
                        className="flex items-start gap-4 cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                      >
                        <div
                          className={cn(
                            'p-3 rounded-xl flex-shrink-0',
                            alert.severity === 'high' && 'bg-destructive/10',
                            alert.severity === 'medium' && 'bg-warning/10',
                            alert.severity === 'low' && 'bg-info/10'
                          )}
                        >
                          <IconComponent
                            className={cn(
                              'h-6 w-6',
                              alert.severity === 'high' && 'text-destructive',
                              alert.severity === 'medium' && 'text-warning',
                              alert.severity === 'low' && 'text-info'
                            )}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className={getSeverityClass(alert.severity)}>
                              {t(`alert.severity.${alert.severity}`)}
                            </span>
                            <Badge variant="outline" className={cn("rounded-full font-bold text-[10px] uppercase", getStatusBadge(alert.status))}>
                              {t(`alert.status.${alert.status}`)}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-medium">
                              {formatTimeAgo(alert.detectedAt)}
                            </span>
                          </div>

                          <h3 className="font-bold text-foreground mb-1">
                            {alertTypeLabels[alert.type].startsWith('alert.')
                              ? t(alertTypeLabels[alert.type])
                              : alertTypeLabels[alert.type]}
                          </h3>

                          <p className="text-sm text-muted-foreground mb-2">
                            {isTeluguActive ? alert.descriptionTE : alert.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              <strong>Faculty:</strong>{' '}
                              {isTeluguActive ? faculty?.nameTE : faculty?.name}
                            </span>
                            <span>
                              <strong>Institute:</strong>{' '}
                              {isTeluguActive ? institute?.nameTE : institute?.name}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 hover:bg-muted rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(isExpanded ? null : alert.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>

                      {/* Expanded Content - AI Explanation */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t animate-in slide-in-from-top-2 duration-300">
                          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                            <h4 className="font-bold text-xs mb-3 flex items-center gap-2 text-slate-900 uppercase tracking-widest">
                              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                              Intelligence Analysis
                            </h4>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                              {isTeluguActive ? alert.explanationTE : alert.explanation}
                            </p>
                          </div>

                          <div className="flex gap-3 mt-5">
                            {alert.status === 'new' && (
                              <Button
                                size="sm"
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 font-bold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(alert.id, 'acknowledged');
                                }}
                              >
                                Acknowledge
                              </Button>
                            )}
                            {alert.status !== 'resolved' && (
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-bold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(alert.id, 'resolved');
                                }}
                              >
                                Mark Resolved
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full px-6 font-bold"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(alert.facultyId);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          {selectedFaculty && (
            <div className="flex flex-col">
              {/* Modal Header/Hero */}
              <div className="bg-gradient-to-r from-primary to-primary-dark p-8 pb-12 text-white relative">
                <div className="relative z-10 flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                    <AvatarFallback className="bg-white/10 text-white text-3xl font-bold">
                      {selectedFaculty.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight">
                      {isTeluguActive ? selectedFaculty.nameTE : selectedFaculty.name}
                    </h2>
                    <p className="opacity-80 font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {isTeluguActive ? selectedFaculty.tradeTE : selectedFaculty.trade} Instructor
                    </p>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mt-2">
                      {selectedFaculty.id}
                    </Badge>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Users className="h-32 w-32" />
                </div>
              </div>

              {/* Modal Body */}
              <div className="bg-white p-8 -mt-6 rounded-t-[2rem] relative z-20 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Attendance</p>
                    <p className={cn(
                      "text-xl font-black",
                      selectedFaculty.attendanceRate >= 90 ? "text-success" : "text-warning"
                    )}>
                      {selectedFaculty.attendanceRate}%
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Engagement</p>
                    <p className="text-xl font-black text-primary">
                      {selectedFaculty.engagementScore}/100
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                    <Badge variant={selectedFaculty.status === 'active' ? 'default' : 'secondary'} className="rounded-full">
                      {selectedFaculty.status}
                    </Badge>
                  </div>
                </div>

                {/* Contact & Institute Info */}
                <div className="space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 border-b pb-2">Professional Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-100 rounded-lg"><Phone className="h-4 w-4" /></div>
                        <span className="text-sm font-medium">{selectedFaculty.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-100 rounded-lg"><Mail className="h-4 w-4" /></div>
                        <span className="text-sm font-medium">{selectedFaculty.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-100 rounded-lg"><Calendar className="h-4 w-4" /></div>
                        <span className="text-sm font-medium">Joined {new Date(selectedFaculty.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Assigned Institute</p>
                        <p className="font-bold text-slate-900 leading-tight">
                          {isTeluguActive ? selectedInstitute?.nameTE : selectedInstitute?.name}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-primary hover:text-primary-dark font-bold p-0 mt-2 hover:bg-transparent"
                          onClick={() => {
                            setIsDetailsOpen(false);
                            navigate(`/institutes/${selectedInstitute?.id}`);
                          }}
                        >
                          View Institute Stats <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-2xl font-bold h-12"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 rounded-2xl font-bold h-12 bg-slate-900 hover:bg-slate-800"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      navigate('/reports');
                    }}
                  >
                    Generate Full Report
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Alerts;
