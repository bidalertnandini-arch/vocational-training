import { useLanguage } from '@/contexts/LanguageContext';
import { institutes } from '@/data/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Generate mock trend data for the last 7 days
const generateTrendData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.slice(0, 5).map((day, index) => ({
    day,
    Guntur: 85 + Math.random() * 12,
    Vijayawada: 82 + Math.random() * 15,
    Tenali: 78 + Math.random() * 14,
  }));
};

const trendData = generateTrendData();

const AttendanceChart = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-lg border shadow-card p-6 animate-fade-in">
      <h3 className="font-semibold text-lg mb-4">{t('dashboard.attendanceTrend')}</h3>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGuntur" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 65%, 35%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(210, 65%, 35%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVijayawada" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(28, 90%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(28, 90%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTenali" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="day"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              domain={[70, 100]}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-elevated)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="Guntur"
              stroke="hsl(210, 65%, 35%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGuntur)"
            />
            <Area
              type="monotone"
              dataKey="Vijayawada"
              stroke="hsl(28, 90%, 55%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVijayawada)"
            />
            <Area
              type="monotone"
              dataKey="Tenali"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTenali)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
