import { useLanguage } from '@/contexts/LanguageContext';
import { attendanceRecords, getFacultyById } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, UserCheck, Clock } from 'lucide-react';

interface AttendanceLogProps {
    instituteId?: string; // If provided, filter by institute (Principal view)
    limit?: number;
}

const AttendanceLog = ({ instituteId, limit = 10 }: AttendanceLogProps) => {
    const { t, isTeluguActive } = useLanguage();

    // Filter and sort records
    const filteredRecords = attendanceRecords
        .filter((record) => {
            // 1. Filter by specific institute if provided
            if (instituteId) {
                const faculty = getFacultyById(record.facultyId);
                return faculty?.instituteId === instituteId;
            }
            return true; // Show all for Admin/DTO
        })
        .sort((a, b) => {
            // Sort by date/time descending (newest first)
            // Since IDs have timestamp appended, we can sort by that if date is same, or just string compare date
            if (a.date === b.date) {
                // If checkin exists, compare strings "09:00" > "08:00"
                return (b.checkIn || "").localeCompare(a.checkIn || "");
            }
            return b.date.localeCompare(a.date);
        })
        .slice(0, limit);

    const getMethodBadge = (method: string) => {
        switch (method) {
            case 'face':
                return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600"><UserCheck className="w-3 h-3 mr-1" /> Face ID</Badge>;
            case 'biometric':
                return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Biometric</Badge>;
            default:
                return <Badge variant="outline">Manual</Badge>;
        }
    };

    return (
        <Card className="animate-fade-in shadow-sm border-muted">
            <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>{t('kpi.attendance')} Monitor</span>
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                        Latest {limit} Records
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Faculty Name</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Verification</TableHead>
                                <TableHead className="text-right">Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No recent attendance records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRecords.map((record) => {
                                    const faculty = getFacultyById(record.facultyId);
                                    return (
                                        <TableRow key={record.id} className="group">
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p>{isTeluguActive ? faculty?.nameTE : faculty?.name}</p>
                                                    <p className="text-xs text-muted-foreground">{faculty?.trade}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span>{record.date}</span>
                                                    <span className="text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {record.checkIn || "-"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        record.status === 'present' ? 'text-green-600 border-green-200 bg-green-50' :
                                                            record.status === 'late' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                                                                'text-red-500 border-red-200 bg-red-50'
                                                    }
                                                >
                                                    {record.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {getMethodBadge(record.method)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {record.location ? (
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-xs font-mono bg-muted/50 px-2 py-0.5 rounded flex items-center gap-1 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors cursor-pointer" title="View on map">
                                                            <MapPin className="w-3 h-3" />
                                                            {record.location.lat.toFixed(4)}, {record.location.lng.toFixed(4)}
                                                        </span>
                                                        <span className="text-[10px] text-green-600 font-medium">Synced</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">N/A</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default AttendanceLog;
