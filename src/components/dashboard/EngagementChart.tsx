import { useLanguage } from '@/contexts/LanguageContext';
import { faculty } from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Get top performers by engagement
const topPerformers = [...faculty]
  .sort((a, b) => b.engagementScore - a.engagementScore)
  .slice(0, 8)
  .map((f) => ({
    name: f.name.split(' ')[0],
    score: f.engagementScore,
  }));

const EngagementChart = () => {
  const { t } = useLanguage();

  const getBarColor = (score: number) => {
    if (score >= 85) return 'hsl(142, 71%, 45%)'; // success
    if (score >= 75) return 'hsl(28, 90%, 55%)'; // accent
    return 'hsl(199, 89%, 48%)'; // info
  };

  return (
    <div className="bg-card rounded-lg border shadow-card p-6 animate-fade-in">
      <h3 className="font-semibold text-lg mb-4">{t('dashboard.engagementOverview')}</h3>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topPerformers}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal className="stroke-border" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-elevated)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Engagement']}
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
              {topPerformers.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-success" />
          <span className="text-muted-foreground">≥85%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-accent" />
          <span className="text-muted-foreground">75-84%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-info" />
          <span className="text-muted-foreground">&lt;75%</span>
        </div>
      </div>
    </div>
  );
};

export default EngagementChart;
