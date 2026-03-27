import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft } from 'lucide-react';

interface ComingSoonProps {
    title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
            <div className="bg-primary/10 p-6 rounded-full">
                <Rocket className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    We're working hard to bring you this feature. This module is currently under development
                    as part of the next phase of the ITI Monitoring System.
                </p>
            </div>
            <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
            </Button>
        </div>
    );
};

export default ComingSoon;
