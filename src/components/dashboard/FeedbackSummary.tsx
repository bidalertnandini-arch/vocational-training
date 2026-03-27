import { useLanguage } from '@/contexts/LanguageContext';
import { studentFeedback, getFacultyById } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, Minus, Star, MessageSquare } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const FeedbackSummary = () => {
  const { t, isTeluguActive } = useLanguage();

  const positiveFeedback = studentFeedback.filter((f) => f.sentiment === 'positive').length;
  const negativeFeedback = studentFeedback.filter((f) => f.sentiment === 'negative').length;
  const neutralFeedback = studentFeedback.filter((f) => f.sentiment === 'neutral').length;
  const total = studentFeedback.length;

  const pieData = [
    { name: t('feedback.positive'), value: positiveFeedback, color: 'hsl(142, 71%, 45%)' },
    { name: t('feedback.negative'), value: negativeFeedback, color: 'hsl(0, 84%, 60%)' },
    { name: t('feedback.neutral'), value: neutralFeedback, color: 'hsl(215, 16%, 47%)' },
  ];

  const recentFeedback = studentFeedback.slice(0, 3);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-success" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b bg-muted/30 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-accent" />
        <h3 className="font-semibold text-lg">{t('dashboard.feedbackSummary')}</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => (
                    <span className="text-sm text-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Feedback List */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Recent Feedback</p>
            {recentFeedback.map((fb) => {
              const faculty = getFacultyById(fb.facultyId);
              return (
                <div
                  key={fb.id}
                  className="p-3 bg-muted/30 rounded-lg border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {isTeluguActive ? faculty?.nameTE : faculty?.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(fb.sentiment)}
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
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {isTeluguActive ? fb.feedbackTextTE : fb.feedbackText}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
