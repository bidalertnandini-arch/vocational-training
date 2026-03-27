import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { institutes } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface InstituteRankingTableProps {
  selectedDistrict?: string;
}

const InstituteRankingTable = ({ selectedDistrict = 'all' }: InstituteRankingTableProps) => {
  const { t, isTeluguActive } = useLanguage();
  const navigate = useNavigate();

  // Filter based on district (if not 'all')
  const filteredInstitutes = institutes.filter(inst =>
    selectedDistrict === 'all' || inst.district.toLowerCase() === selectedDistrict.toLowerCase()
  );

  // Sort institutes by a composite score (attendance + engagement)
  const rankedInstitutes = [...filteredInstitutes]
    .map((inst) => ({
      ...inst,
      score: (inst.attendanceRate + inst.engagementScore) / 2,
    }))
    .sort((a, b) => b.score - a.score);

  const getTrendIcon = (rate: number) => {
    if (rate >= 90) return <TrendingUp className="h-4 w-4 text-success" />;
    if (rate >= 80) return <Minus className="h-4 w-4 text-warning" />;
    return <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'bg-success/10 text-success border-success/30';
    if (score >= 75) return 'bg-warning/10 text-warning border-warning/30';
    return 'bg-destructive/10 text-destructive border-destructive/30';
  };

  return (
    <div className="bg-card rounded-lg border shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b bg-muted/30">
        <h3 className="font-semibold text-lg">{t('dashboard.instituteRanking')}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-16 text-center">#</th>
              <th>{t('table.institute')}</th>
              <th className="text-center">{t('table.attendance')}</th>
              <th className="text-center">{t('table.engagement')}</th>
              <th className="text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {rankedInstitutes.map((inst, index) => (
              <tr
                key={inst.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/institutes/${inst.id}`)}
              >
                <td className="text-center">
                  <span
                    className={cn(
                      'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
                      index === 0 && 'bg-accent text-accent-foreground',
                      index === 1 && 'bg-secondary text-secondary-foreground',
                      index === 2 && 'bg-muted text-muted-foreground',
                      index > 2 && 'bg-background text-foreground'
                    )}
                  >
                    {index + 1}
                  </span>
                </td>
                <td>
                  <div>
                    <p className="font-medium">
                      {isTeluguActive ? inst.nameTE : inst.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isTeluguActive ? inst.districtTE : inst.district}
                    </p>
                  </div>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getTrendIcon(inst.attendanceRate)}
                    <span className="font-medium">{inst.attendanceRate}%</span>
                  </div>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getTrendIcon(inst.engagementScore)}
                    <span className="font-medium">{inst.engagementScore}%</span>
                  </div>
                </td>
                <td className="text-center">
                  <Badge
                    variant="outline"
                    className={cn('font-semibold', getScoreBadge(inst.score))}
                  >
                    {inst.score.toFixed(1)}
                  </Badge>
                </td>
              </tr>
            ))}
            {rankedInstitutes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No institutes found for this district.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstituteRankingTable;
