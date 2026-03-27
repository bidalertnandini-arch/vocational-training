import { Badge } from "@/components/ui/badge";
import { Users, BarChart3, MapPin, Building2, ChevronRight, GraduationCap } from "lucide-react";
import { Institute } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface InstituteGridProps {
    institutes: Institute[];
    onSelect: (id: string) => void;
    isTeluguActive: boolean;
}

const InstituteGrid = ({ institutes, onSelect, isTeluguActive }: InstituteGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
            {institutes.map((inst, idx) => (
                <div
                    key={inst.id}
                    className="group relative bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => onSelect(inst.id)}
                >
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Building2 className="h-24 w-24" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/10 text-[10px] uppercase tracking-tighter font-bold">
                                        {inst.id}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <MapPin className="h-3 w-3" />
                                        {isTeluguActive ? inst.districtTE : inst.district}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                    {isTeluguActive ? inst.nameTE : inst.name}
                                </h3>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <ChevronRight className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <Users className="h-3 w-3" />
                                    Faculty
                                </div>
                                <div className="text-xl font-black text-slate-700">{inst.totalFaculty}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <GraduationCap className="h-3 w-3" />
                                    Students
                                </div>
                                <div className="text-xl font-black text-slate-700">{inst.totalStudents}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <BarChart3 className="h-3 w-3" />
                                    Attendance
                                </div>
                                <div className={cn(
                                    "text-xl font-black",
                                    inst.attendanceRate >= 90 ? "text-emerald-500" : inst.attendanceRate >= 80 ? "text-amber-500" : "text-red-500"
                                )}>
                                    {inst.attendanceRate}%
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-2">
                            {inst.trades.slice(0, 3).map((trade, i) => (
                                <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                    {trade}
                                </span>
                            ))}
                            {inst.trades.length > 3 && (
                                <span className="text-[10px] font-semibold bg-slate-50 text-slate-400 px-2 py-1 rounded-md">
                                    +{inst.trades.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InstituteGrid;
