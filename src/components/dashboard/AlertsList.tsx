import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { anomalyAlerts, getFacultyById, getInstituteById } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, UserX, TrendingDown, MessageSquareWarning, Timer, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const alertTypeIcons = {
  late_arrival: Clock,
  frequent_absence: UserX,
  low_engagement: TrendingDown,
  negative_feedback: MessageSquareWarning,
  duration_mismatch: Timer,
};

const AlertsList = () => {
  const { t, isTeluguActive } = useLanguage();

  // Show only new and acknowledged alerts, sorted by severity
  const activeAlerts = anomalyAlerts
    .filter((a) => a.status !== 'resolved')
    .sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    })
    .slice(0, 5);

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

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return t('alert.severity.high');
      case 'medium':
        return t('alert.severity.medium');
      case 'low':
        return t('alert.severity.low');
      default:
        return severity;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="bg-card rounded-lg border shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="font-semibold text-lg">{t('dashboard.recentAlerts')}</h3>
        </div>
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
          {activeAlerts.length} Active
        </Badge>
      </div>

      <div className="divide-y divide-border">
        {activeAlerts.map((alert) => {
          const IconComponent = alertTypeIcons[alert.type] || AlertTriangle;
          const faculty = getFacultyById(alert.facultyId);
          const institute = getInstituteById(alert.instituteId);

          return (
            <div
              key={alert.id}
              className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg flex-shrink-0',
                    alert.severity === 'high' && 'bg-destructive/10',
                    alert.severity === 'medium' && 'bg-warning/10',
                    alert.severity === 'low' && 'bg-info/10'
                  )}
                >
                  <IconComponent
                    className={cn(
                      'h-5 w-5',
                      alert.severity === 'high' && 'text-destructive',
                      alert.severity === 'medium' && 'text-warning',
                      alert.severity === 'low' && 'text-info'
                    )}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={getSeverityClass(alert.severity)}>
                      {getSeverityText(alert.severity)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(alert.detectedAt)}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-foreground mb-1">
                    {isTeluguActive ? alert.descriptionTE : alert.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{isTeluguActive ? faculty?.nameTE : faculty?.name}</span>
                    <span>•</span>
                    <span>{isTeluguActive ? institute?.nameTE : institute?.name}</span>
                  </div>

                  {/* AI Explanation Preview */}
                  <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{t('alert.aiExplanation')}:</span>{' '}
                    {(isTeluguActive ? alert.explanationTE : alert.explanation).slice(0, 100)}...
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t bg-muted/20">
        <Button variant="outline" className="w-full" size="sm" asChild>
          <Link to="/alerts">
            View All Alerts
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AlertsList;
