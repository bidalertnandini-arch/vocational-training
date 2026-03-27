import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import InstituteRankingTable from '@/components/dashboard/InstituteRankingTable';
import { Building2, MapPin } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { districts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Institutes = () => {
    const { t, isTeluguActive } = useLanguage();
    const { user } = useAuth();

    // Initialize district based on user role
    const initialDistrict = user?.role === 'dto' && user.district
        ? districts.find(d => d.name.toLowerCase() === user.district?.toLowerCase())?.id || 'all'
        : 'all';

    const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
    const isLocked = user?.role === 'dto';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-primary" />
                        {t('nav.institutes')}
                    </h1>
                    <p className="text-muted-foreground">
                        Overview of all Industrial Training Institutes in Andhra Pradesh
                    </p>
                </div>

                {/* District Filter */}
                <div className="flex items-center gap-2 bg-card p-1 rounded-lg border shadow-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground ml-2" />
                    <Select
                        value={selectedDistrict}
                        onValueChange={setSelectedDistrict}
                        disabled={isLocked}
                    >
                        <SelectTrigger className={cn(
                            "w-[200px] border-0 focus:ring-0 shadow-none",
                            isLocked && "opacity-80"
                        )}>
                            <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {districts.map((dist) => (
                                <SelectItem key={dist.id} value={dist.id}>
                                    {isTeluguActive ? dist.nameTE : dist.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <InstituteRankingTable selectedDistrict={selectedDistrict} />
        </div>
    );
};

export default Institutes;
