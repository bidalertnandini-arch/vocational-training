import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Building2,
    Users,
    GraduationCap,
    MapPin,
    ArrowLeft,
    Briefcase,
    TrendingUp,
    CalendarCheck
} from 'lucide-react';
import {
    getInstituteById,
    getFacultyByInstitute,
    getAlertsByInstitute,
    institutes
} from '@/data/mockData';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const InstituteDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, isTeluguActive } = useLanguage();

    const institute = getInstituteById(id || '');

    if (!institute) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h2 className="text-xl font-semibold">Institute Not Found</h2>
                <Button onClick={() => navigate('/institutes')}>Back to List</Button>
            </div>
        );
    }

    const facultyList = getFacultyByInstitute(institute.id);
    const alerts = getAlertsByInstitute(institute.id);

    // Mock Chart Data
    const attendanceData = [
        { name: 'Mon', present: 85, absent: 15 },
        { name: 'Tue', present: 88, absent: 12 },
        { name: 'Wed', present: 92, absent: 8 },
        { name: 'Thu', present: 90, absent: 10 },
        { name: 'Fri', present: 87, absent: 13 },
        { name: 'Sat', present: 80, absent: 20 },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 text-muted-foreground hover:text-foreground mb-2"
                        onClick={() => navigate('/institutes')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Institutes
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <Building2 className="h-8 w-8" />
                        {isTeluguActive ? institute.nameTE : institute.name}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{isTeluguActive ? institute.districtTE : institute.district} District</span>
                        <span>•</span>
                        <span>Principal: {institute.principalName}</span>
                    </div>
                </div>
                <Badge variant="outline" className="text-lg py-1 px-4 border-primary/20 bg-primary/5">
                    ID: {institute.id}
                </Badge>
            </div>

            {/* Key Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{institute.totalFaculty}</div>
                        <p className="text-xs text-muted-foreground">Registered in system</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{institute.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Active enrollment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">{institute.attendanceRate}%</div>
                        <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{institute.engagementScore}</div>
                        <p className="text-xs text-muted-foreground">Based on AI analysis</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Stats & Alerts */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Weekly Attendance Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Attendance Trends</CardTitle>
                            <CardDescription>Faculty presence over the last 6 working days.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="present" name="Present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Faculty Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Faculty List</CardTitle>
                            <CardDescription>
                                Detailed performance metrics for all {facultyList.length} faculty members.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {facultyList.map((fac) => (
                                    <div key={fac.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {fac.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{isTeluguActive ? fac.nameTE : fac.name}</p>
                                                <p className="text-sm text-muted-foreground">{fac.trade} • {fac.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs text-muted-foreground">Attendance</p>
                                                <p className={`font-bold ${fac.attendanceRate >= 90 ? 'text-success' : 'text-warning'}`}>
                                                    {fac.attendanceRate}%
                                                </p>
                                            </div>
                                            <Badge variant={fac.status === 'active' ? 'default' : 'secondary'}>
                                                {fac.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {facultyList.length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">
                                        No faculty data available for this institute.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Info & Alerts */}
                <div className="space-y-6">
                    {/* Trades Offered */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Trades Offered</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {institute.trades.map((trade) => (
                                    <Badge key={trade} variant="secondary" className="px-3 py-1">
                                        <Briefcase className="mr-1 h-3 w-3" />
                                        {trade}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Alerts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Activity Alerts
                                {alerts.length > 0 && (
                                    <Badge variant="destructive" className="ml-auto rounded-full h-5 w-5 p-0 flex items-center justify-center">
                                        {alerts.length}
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {alerts.length > 0 ? (
                                alerts.map((alert) => (
                                    <div key={alert.id} className="p-3 bg-muted/40 rounded-lg text-sm border-l-2 border-l-destructive">
                                        <p className="font-medium text-foreground">
                                            {isTeluguActive ? alert.descriptionTE : alert.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(alert.detectedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No recent alerts for this institute.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InstituteDetails;
