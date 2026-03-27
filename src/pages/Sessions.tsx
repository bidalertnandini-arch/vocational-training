import { useState, useMemo } from 'react';
import { toast } from "sonner";
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { classroomSessions, getFacultyById, getInstituteById } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Users,
    Clock,
    Search,
    BookOpen,
    Video,
    CheckCircle2,
    Clock3,
    Mic,
    MicOff,
    Maximize2,
    Calendar
} from 'lucide-react';

const Sessions = () => {
    const { t, isTeluguActive } = useLanguage();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStream, setSelectedStream] = useState<any>(null);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [selectedDetails, setSelectedDetails] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(false);

    // Enrich sessions with faculty names
    const enrichedSessions = useMemo(() => {
        return classroomSessions.map(session => {
            const fac = getFacultyById(session.facultyId);
            return {
                ...session,
                facultyName: fac?.name || 'Unknown Faculty',
                facultyNameTE: fac?.nameTE || 'తెలియని ఫ్యాకల్టీ',
                facultyInstituteId: fac?.instituteId
            };
        }).filter(session => {
            if (!user) return false;
            if (user.role === 'admin') return true;
            if (user.role === 'dto') {
                const inst = getInstituteById(session.facultyInstituteId || '');
                return inst?.district.toLowerCase() === user.district?.toLowerCase();
            }
            if (user.role === 'principal') {
                return session.facultyInstituteId === user.instituteId;
            }
            if (user.role === 'faculty') {
                return session.facultyId === user.id;
            }
            return true;
        });
    }, [user]);

    const filteredSessions = enrichedSessions.filter(session =>
        session.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.facultyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const liveSessions = filteredSessions.slice(0, 1);
    const upcomingSessions = filteredSessions.slice(1, 2);
    const completedSessions = filteredSessions.slice(2);

    const handleJoinStream = (session: typeof enrichedSessions[0]) => {
        setSelectedStream(session);
    };

    const handleViewReport = (session: typeof enrichedSessions[0]) => {
        setSelectedReport(session);
    };

    const handleViewDetails = (session: typeof enrichedSessions[0]) => {
        setSelectedDetails(session);
    };

    const SessionCard = ({ session, status }: { session: typeof enrichedSessions[0], status: 'live' | 'upcoming' | 'completed' }) => (
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: status === 'live' ? '#22c55e' : status === 'upcoming' ? '#3b82f6' : '#94a3b8' }}>
            <CardContent className="p-5">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                                <BookOpen className="h-3.5 w-3.5" />
                                {session.trade}
                            </Badge>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${status === 'live' ? 'bg-green-100 text-green-700 animate-pulse' :
                                status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                {status === 'live' && <Video className="h-3 w-3" />}
                                {status === 'live' ? 'LIVE NOW' : status === 'upcoming' ? 'SCHEDULED' : 'COMPLETED'}
                            </span>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-primary">
                                {session.trade} Practical Session
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                by <span className="font-medium text-foreground">{isTeluguActive ? session.facultyNameTE : session.facultyName}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {session.startTime} - {session.endTime}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4" />
                                {session.studentCount} Students
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-end gap-3 min-w-[120px]">
                        {status === 'completed' && (
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Engagement Score</p>
                                <div className="text-2xl font-bold text-blue-600">{session.engagementScore}%</div>
                            </div>
                        )}
                        {status === 'live' && (
                            <Button
                                size="sm"
                                className="w-full gap-2 bg-green-600 hover:bg-green-700"
                                onClick={() => handleJoinStream(session)}
                            >
                                <Video className="h-4 w-4" />
                                Join Stream
                            </Button>
                        )}
                        {status === 'upcoming' && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleViewDetails(session)}
                            >
                                View Details
                            </Button>
                        )}
                        {status === 'completed' && (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-full"
                                onClick={() => handleViewReport(session)}
                            >
                                View Report
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Users className="h-8 w-8 text-primary" />
                        Classroom Sessions
                    </h1>
                    <p className="text-muted-foreground">
                        Monitor live classes, view schedules, and track student engagement.
                    </p>
                </div>
                <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by trade or faculty..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="live" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="live" className="gap-2">
                        <Video className="h-4 w-4" /> Live
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="gap-2">
                        <Clock3 className="h-4 w-4" /> Upcoming
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="gap-2">
                        <CheckCircle2 className="h-4 w-4" /> History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="live" className="space-y-4">
                    {liveSessions.length > 0 ? (
                        liveSessions.map(session => (
                            <SessionCard key={session.id} session={session} status="live" />
                        ))
                    ) : (
                        <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
                            <Video className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                            <h3>No active sessions right now</h3>
                            <p className="text-muted-foreground">Check the upcoming schedule.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                    {upcomingSessions.map(session => (
                        <SessionCard key={session.id} session={session} status="upcoming" />
                    ))}
                    {upcomingSessions.length === 0 && <p className="text-muted-foreground">No upcoming sessions scheduled.</p>}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                    {completedSessions.map(session => (
                        <SessionCard key={session.id} session={session} status="completed" />
                    ))}
                </TabsContent>
            </Tabs>

            {/* LIVE STREAM VIEWER DIALOG */}
            <Dialog open={!!selectedStream} onOpenChange={(open) => !open && setSelectedStream(null)}>
                <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-slate-800 text-white">
                    <DialogHeader className="p-4 bg-slate-900 border-b border-slate-800 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <DialogTitle className="flex items-center gap-2 text-white">
                                <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                                LIVE: {selectedStream?.trade} Class
                            </DialogTitle>
                            <p className="text-xs text-slate-400">
                                Faculty: {isTeluguActive ? selectedStream?.facultyNameTE : selectedStream?.facultyName}
                            </p>
                        </div>
                        <Badge variant="outline" className="text-red-500 border-red-900 bg-red-950/30">
                            REC 00:14:32
                        </Badge>
                    </DialogHeader>

                    {/* Simulated Video Feed Area */}
                    <div className="relative aspect-video bg-slate-900 flex items-center justify-center group">
                        <div className="text-center space-y-4">
                            <Video className="h-16 w-16 text-slate-700 mx-auto" />
                            <p className="text-slate-500 font-mono text-sm">Waiting for camera feed...</p>
                            <p className="text-xs text-slate-600">Stream ID: {selectedStream?.id}</p>
                        </div>

                        {/* Overlay Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-white hover:bg-white/20"
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                </Button>
                                <span className="text-xs font-mono text-slate-300">LIVE</span>
                            </div>
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                                <Maximize2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900 grid grid-cols-3 gap-4 border-t border-slate-800">
                        <div className="text-center p-2 rounded bg-slate-800">
                            <p className="text-xs text-slate-400">Students Present</p>
                            <p className="text-xl font-bold">{selectedStream?.studentCount}</p>
                        </div>
                        <div className="text-center p-2 rounded bg-slate-800">
                            <p className="text-xs text-slate-400">Duration</p>
                            <p className="text-xl font-bold">45m</p>
                        </div>
                        <div className="text-center p-2 rounded bg-slate-800">
                            <p className="text-xs text-slate-400">Engagement</p>
                            <p className="text-xl font-bold text-green-400">High</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* SESSION REPORT DIALOG */}
            <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Session Report</DialogTitle>
                    </DialogHeader>
                    {selectedReport && (
                        <div className="space-y-6">
                            <div className="bg-muted/30 p-4 rounded-lg flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedReport.trade} Practical</h3>
                                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-3.5 w-3.5" />
                                            <span>Faculty: {isTeluguActive ? selectedReport.facultyNameTE : selectedReport.facultyName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>Date: {new Date().toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>Time: {selectedReport.startTime} - {selectedReport.endTime}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-md py-1 px-3">
                                    Score: {selectedReport.engagementScore}%
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-3 text-center">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Attendance</p>
                                    <p className="text-2xl font-bold text-primary mt-1">{selectedReport.studentCount}/30</p>
                                    <p className="text-xs text-green-600 mt-1">93% Present</p>
                                </div>
                                <div className="border rounded-lg p-3 text-center">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Anomalies</p>
                                    <p className="text-2xl font-bold text-orange-500 mt-1">1</p>
                                    <p className="text-xs text-muted-foreground mt-1">Low attention detected</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Session Highlights
                                </h4>
                                <ul className="text-sm space-y-2 text-muted-foreground ml-6 list-disc">
                                    <li>Instructor demonstrated safety protocols effectively.</li>
                                    <li>Student participation was highest during the practical demo.</li>
                                    <li>One minor disruption detected at 11:45 AM.</li>
                                    <li>All equipment checks were logged as passed.</li>
                                </ul>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button className="w-full" onClick={() => setSelectedReport(null)}>
                                    Close Report
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={() => {
                                        toast.info("Generating report...", { duration: 1500 });
                                        setTimeout(() => {
                                            const reportContent = `SESSION REPORT
--------------------------------
Trade: ${selectedReport.trade}
Faculty: ${isTeluguActive ? selectedReport.facultyNameTE : selectedReport.facultyName}
Date: ${new Date().toLocaleDateString()}
Time: ${selectedReport.startTime} - ${selectedReport.endTime}

STATISTICS
--------------------------------
Attendance: ${selectedReport.studentCount} Students
Engagement Score: ${selectedReport.engagementScore}%
Status: Completed

HIGHLIGHTS
--------------------------------
- Instructor demonstrated safety protocols effectively.
- Student participation was highest during the practical demo.
- All equipment checks were logged as passed.

Generated by ITI Faculty Monitoring System`;

                                            const link = document.createElement('a');
                                            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent);
                                            link.download = `${selectedReport.trade}-Report.txt`;
                                            link.click();
                                            toast.success("Report downloaded successfully");
                                        }, 1500);
                                    }}
                                >
                                    <Clock className="h-4 w-4" />
                                    Download Report
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* SESSION DETAILS DIALOG */}
            <Dialog open={!!selectedDetails} onOpenChange={(open) => !open && setSelectedDetails(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Session Details</DialogTitle>
                    </DialogHeader>
                    {selectedDetails && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold">{selectedDetails.trade}</h3>
                                <p className="text-muted-foreground">Upcoming Practical Session</p>
                            </div>

                            <div className="space-y-2 text-sm text-foreground/80">
                                <div className="flex justify-between">
                                    <span>Faculty:</span>
                                    <span className="font-medium">{isTeluguActive ? selectedDetails.facultyNameTE : selectedDetails.facultyName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Time:</span>
                                    <span className="font-medium">{selectedDetails.startTime} - {selectedDetails.endTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Expected Students:</span>
                                    <span className="font-medium">{selectedDetails.studentCount}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Agenda</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li>Introduction to new machinery</li>
                                    <li>Safety gear inspection</li>
                                    <li>Practical demonstration: Part A</li>
                                    <li>Student practice & assessment</li>
                                </ul>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-2 text-orange-600">Prerequisites</h4>
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="outline">Safety Shoes</Badge>
                                    <Badge variant="outline">Apron</Badge>
                                    <Badge variant="outline">Log Book</Badge>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <Button className="flex-1" onClick={() => setSelectedDetails(null)}>Close</Button>
                                <Button
                                    className="flex-1"
                                    variant="default"
                                    onClick={() => {
                                        toast.success("Reminder set for 15 mins before session.");
                                        setSelectedDetails(null);
                                    }}
                                >
                                    Remind Me
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Sessions;
