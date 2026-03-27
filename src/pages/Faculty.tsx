import { useLanguage } from '@/contexts/LanguageContext';
import FacultyStatusTable from '@/components/dashboard/FacultyStatusTable';
import { Users } from 'lucide-react';

const Faculty = () => {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        {t('nav.faculty')}
                    </h1>
                    <p className="text-muted-foreground">
                        Monitor and manage faculty attendance and performance
                    </p>
                </div>
            </div>

            <FacultyStatusTable limit={20} />
        </div>
    );
};

export default Faculty;
