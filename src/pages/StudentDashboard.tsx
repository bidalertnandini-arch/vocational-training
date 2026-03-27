import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardHero from '@/components/dashboard/DashboardHero';
import { MessageSquare, ListTodo, History, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const StudentDashboard = () => {
    const { t, isTeluguActive } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();

    const quickActions = [
        {
            title: isTeluguActive ? 'అభిప్రాయాన్ని సమర్పించండి' : 'Submit Feedback',
            desc: isTeluguActive ? 'మీ ఫ్యాకల్టీ గురించి అభిప్రాయాన్ని తెలపండి' : 'Provide feedback for your faculty members',
            icon: MessageSquare,
            color: 'blue',
            path: '/feedback/submit'
        },
        {
            title: isTeluguActive ? 'నా అభ్యర్థనలు' : 'My Submissions',
            desc: isTeluguActive ? 'మీరు సమర్పించిన అభిప్రాయాల చరిత్ర' : 'History of your submitted feedback',
            icon: History,
            color: 'amber',
            path: '/feedback'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <DashboardHero
                title={isTeluguActive ? 'విద్యార్థి డ్యాష్‌బోర్డ్' : 'Student Voice Portal'}
                subtitle={isTeluguActive ? 'స్వాగతం! మీరు ఇక్కడ ఫ్యాకల్టీ అభిప్రాయాన్ని సమర్పించవచ్చు.' : 'Welcome! Your feedback helps us maintain the highest standards of technical education.'}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quick Actions</h2>
                    <p className="text-sm text-slate-500 font-medium">Select a service to proceed</p>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-blue-600 bg-white px-6 py-3 rounded-2xl border border-blue-100 shadow-sm whitespace-nowrap">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Anonymous Submission Secured</span>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {quickActions.map((action, i) => (
                    <div
                        key={i}
                        className="group relative bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => navigate(action.path)}
                    >
                        <div className={cn(
                            "absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity",
                            action.color === 'blue' ? "text-blue-600" : "text-amber-600"
                        )}>
                            <action.icon className="h-24 w-24" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-4 rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110",
                                    action.color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                                )}>
                                    <action.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">{action.desc}</p>
                                </div>
                            </div>

                            <Button variant="ghost" className="w-full justify-between rounded-xl group-hover:bg-slate-50 border border-transparent group-hover:border-slate-100 font-bold">
                                <span>{isTeluguActive ? 'కొనసాగించు' : 'Proceed to Submission'}</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>


            {/* Instruction Card */}
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <ListTodo className="h-5 w-5" />
                        {isTeluguActive ? 'ముఖ్యాంశాలు' : 'Important Instructions'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>• {isTeluguActive ? 'అభిప్రాయం అనామకంగా సమర్పించవచ్చు.' : 'Feedback can be submitted anonymously.'}</p>
                    <p>• {isTeluguActive ? 'ఫ్యాకల్టీ పనితీరును మెరుగుపరచడానికి మీ నిజాయితీ గల అభిప్రాయం అవసరం.' : 'Your honest feedback helps improve faculty performance.'}</p>
                    <p>• {isTeluguActive ? 'ప్రతి సెషన్ లేదా వారం చివరలో అభిప్రాయాన్ని అందించండి.' : 'Provide feedback after sessions or at the end of each week.'}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentDashboard;
