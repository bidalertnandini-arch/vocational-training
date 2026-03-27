import { useState, useEffect } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';
import { districts, institutes } from '@/data/mockData';
import {
    FileText,
    Download,
    Printer,
    Calendar,
    BarChart3,
    PieChart,
    TrendingUp,
    Filter,
    Users,
    Building2,
    CalendarCheck,
    AlertTriangle,
    ChevronDown,
    Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import DashboardHero from '@/components/dashboard/DashboardHero';


const reportTypes = [
    { id: 'attendance', label: 'Attendance Analysis', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'engagement', label: 'Quality & Engagement', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'compliance', label: 'Compliance & Alerts', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'faculty', label: 'Faculty Performance', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const mockMonthlyData = [
    { month: 'Oct', attendance: 82, engagement: 75, alerts: 12 },
    { month: 'Nov', attendance: 85, engagement: 78, alerts: 8 },
    { month: 'Dec', attendance: 88, engagement: 82, alerts: 15 },
    { month: 'Jan', attendance: 91, engagement: 85, alerts: 5 },
];

const mockDistrictCompare = [
    { name: 'Guntur', value: 92, alerts: 4 },
    { name: 'Krishna', value: 88, alerts: 7 },
    { name: 'Visakhapatnam', value: 94, alerts: 2 },
    { name: 'East Godavari', value: 85, alerts: 11 },
    { name: 'Chittoor', value: 89, alerts: 6 },
];

const Reports = () => {
    const { t, isTeluguActive } = useLanguage();
    const [activeReport, setActiveReport] = useState('attendance');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [dateRange, setDateRange] = useState('last30');
    const [isUpdating, setIsUpdating] = useState(false);

    // Auto-update report when category changes for better UX
    useEffect(() => {
        handleUpdateReport(true); // silent update
    }, [activeReport]);

    const handleUpdateReport = (silent = false) => {
        setIsUpdating(true);
        let toastId;

        if (!silent) {
            toastId = toast.loading("Updating Report Data...", {
                description: "Fetching the latest records from the strategic hub."
            });
        }

        setTimeout(() => {
            setIsUpdating(false);
            if (!silent && toastId) {
                toast.success("Report Updated", {
                    id: toastId,
                    description: `Showing data for ${selectedDistrict === 'all' ? 'State-wide' : 'District'} for ${dateRange}.`
                });
            }
        }, 800);
    };


    const handleExport = (format: string) => {

        const reportName = reportTypes.find(r => r.id === activeReport)?.label || 'Report';
        const toastId = toast.loading(`Preparing ${reportName}...`, {
            description: `Generating high-resolution ${format.toUpperCase()} document.`
        });

        // Simulate server-side processing
        setTimeout(() => {
            toast.success(`${format.toUpperCase()} Ready`, {
                id: toastId,
                description: `${reportName} has been downloaded successfully.`,
                action: {
                    label: 'Open',
                    onClick: () => console.log('Opening file...')
                }
            });

            // Simulate actual file download trigger
            const dummyContent = "ITI Monitoring System - Performance Report\nGenerated on: " + new Date().toLocaleString();
            const blob = new Blob([dummyContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${activeReport}_report_${new Date().getTime()}.${format === 'excel' ? 'csv' : 'pdf'}`;
            a.click();
            window.URL.revokeObjectURL(url);
        }, 2000);
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Premium Hero */}
            <DashboardHero
                title="Performance Intelligence"
                subtitle="Comprehensive analytical reports for data-driven strategic decisions."
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Report Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Geographic Scope</label>
                                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                    <SelectTrigger className="rounded-xl border-slate-200 h-11">
                                        <SelectValue placeholder="Select District" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="all">State-wide</SelectItem>
                                        {districts.filter(d => d.id !== 'all').map(d => (
                                            <SelectItem key={d.id} value={d.id}>{isTeluguActive ? d.nameTE : d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Time Horizon</label>
                                <Select value={dateRange} onValueChange={setDateRange}>
                                    <SelectTrigger className="rounded-xl border-slate-200 h-11">
                                        <SelectValue placeholder="Date Range" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="last7">Last 7 Days</SelectItem>
                                        <SelectItem value="last30">Last 30 Days</SelectItem>
                                        <SelectItem value="quarter">Current Quarter</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full rounded-xl mt-2 font-bold"
                                variant="outline"
                                onClick={() => handleUpdateReport()}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Report"
                                )}
                            </Button>

                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-3">Report Categories</h3>
                        {reportTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setActiveReport(type.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-4 rounded-2xl transition-all border text-left",
                                    activeReport === type.id
                                        ? "bg-white border-primary shadow-md translate-x-1"
                                        : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                                )}
                            >
                                <div className={cn("p-2 rounded-xl", type.id === activeReport ? type.bg : "bg-white")}>
                                    <type.icon className={cn("h-5 w-5", type.id === activeReport ? type.color : "text-slate-400")} />
                                </div>
                                <span className={cn("font-bold text-sm", activeReport === type.id ? "text-slate-900" : "text-slate-500")}>
                                    {type.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Report Content */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Action Toolbar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 px-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {reportTypes.find(r => r.id === activeReport)?.label}
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">Generated just now</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="rounded-xl gap-2 text-slate-600 font-bold" onClick={() => window.print()}>
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                            <Button size="sm" className="rounded-xl gap-2 font-bold bg-emerald-600 hover:bg-emerald-700" onClick={() => handleExport('excel')}>
                                <Download className="h-4 w-4" />
                                Excel
                            </Button>
                            <Button size="sm" className="rounded-xl gap-2 font-bold bg-red-600 hover:bg-red-700" onClick={() => handleExport('pdf')}>
                                <Download className="h-4 w-4" />
                                PDF
                            </Button>
                        </div>
                    </div>

                    {/* Report Stats Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {(() => {
                            const metrics = {
                                attendance: { label: 'Period Average', val: '91.4%', trend: '+2.4%', color: 'text-emerald-500' },
                                quality: { label: 'Peak Quality', val: '8.9/10', trend: '+0.5', color: 'text-blue-500' },
                                compliance: { label: 'Alert Frequency', val: 'Lo/Med', trend: '-12%', color: 'text-red-500' },
                                faculty: { label: 'Top Performers', val: '24/30', trend: 'Stable', color: 'text-slate-400' }
                            };
                            const current = metrics[activeReport as keyof typeof metrics] || metrics.attendance;

                            return (
                                <>
                                    <Card className="rounded-3xl border-slate-200 shadow-sm p-6 bg-gradient-to-br from-white to-slate-50">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{current.label}</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-900">{current.val}</span>
                                            <span className={cn("text-xs font-bold", current.color)}>{current.trend}</span>
                                        </div>
                                    </Card>
                                    <Card className="rounded-3xl border-slate-200 shadow-sm p-6 bg-gradient-to-br from-white to-slate-50">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Peak Utilization</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-900">97.2%</span>
                                            <span className="text-xs font-bold text-slate-400">Stable</span>
                                        </div>
                                    </Card>
                                    <Card className="rounded-3xl border-slate-200 shadow-sm p-6 bg-gradient-to-br from-white to-slate-50">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Target Deviation</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-900">-0.8%</span>
                                            <span className={cn("text-xs font-bold", activeReport === 'compliance' ? 'text-red-500' : 'text-slate-400')}>
                                                {activeReport === 'compliance' ? 'Critical' : 'Low Risk'}
                                            </span>
                                        </div>
                                    </Card>
                                </>
                            );
                        })()}
                    </div>


                    {/* Visualization Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="rounded-[2rem] border-slate-200 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-slate-800">Growth Projection</h3>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Actual</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Target</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockMonthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            tickFormatter={(v) => `${v}%`}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey={activeReport === 'attendance' ? 'attendance' : 'engagement'}
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={4}
                                            dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="rounded-[2rem] border-slate-200 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-slate-800">Regional Comparison</h3>
                                <Select defaultValue="top5">
                                    <SelectTrigger className="w-32 rounded-xl border-slate-100 h-8 text-xs font-bold bg-slate-50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl text-xs">
                                        <SelectItem value="top5">Top 5 Regions</SelectItem>
                                        <SelectItem value="bottom5">Needs Attention</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mockDistrictCompare} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                                        />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                                            {mockDistrictCompare.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(210, 65%, 22%)' : '#e2e8f0'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Deep Data Table */}
                    <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b p-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold">Consolidated Data Table</CardTitle>
                                <div className="flex gap-4">
                                    <div className="text-xs font-bold text-slate-400">Total Records: 42</div>
                                    <div className="text-xs font-bold text-slate-400">Mean Deviation: 0.2%</div>
                                </div>
                            </div>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b">
                                    <tr>
                                        <th className="px-6 py-4">Institution Name</th>
                                        <th className="px-6 py-4">District</th>
                                        <th className="px-6 py-4">Reporting Rate</th>
                                        <th className="px-6 py-4">KPI Score</th>
                                        <th className="px-6 py-4">Anomalies</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-slate-900">Govt ITI Guntur #{i}</td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">Guntur</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                                                        <div className="bg-emerald-500 h-full w-[92%] rounded-full"></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold">92%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-50 text-blue-600 font-black text-xs min-w-[40px]">
                                                    8.4
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-400">0</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-wider">
                                                    Optimal
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-slate-50 border-t flex items-center justify-between text-xs text-slate-400 font-medium">
                            <div>Page 1 of 4</div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-white transition-colors">Prev</button>
                                <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-white transition-colors">Next</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Reports;
