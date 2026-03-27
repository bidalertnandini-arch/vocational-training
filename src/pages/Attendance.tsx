import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { markAttendance } from '@/data/mockData';
import { toast } from 'sonner';
import {
    Camera,
    MapPin,
    CheckCircle,
    Loader2,
    ShieldCheck,
    UserCheck,
    RefreshCw,
    ScanFace,
    Target,
    Clock,
    AlertTriangle,
    Lock
} from 'lucide-react';

const Attendance = () => {
    const { user } = useAuth();
    const { t, isTeluguActive } = useLanguage();

    // Access Control: Only faculty can mark their own biometric attendance
    if (user?.role !== 'faculty') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-700">
                <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 text-center shadow-2xl relative overflow-hidden max-w-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <ShieldCheck className="h-40 w-40 text-rose-500" />
                    </div>
                    <div className="bg-rose-500 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/20">
                        <AlertTriangle className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Access Restricted</h2>
                    <p className="text-slate-500 font-bold mb-8">
                        The Biometric Attendance module is reserved strictly for <span className="text-rose-600">Faculty Members</span>.
                        Administrators and District Officers can monitor attendance reports via the <span className="text-primary underline cursor-pointer">Reports Dashboard</span>.
                    </p>
                    <div className="bg-white/50 p-6 rounded-3xl border border-rose-100 flex items-center gap-4 text-left">
                        <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                            <Lock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Context</p>
                            <p className="text-sm font-bold text-slate-700">Unauthorized role: {user?.role || 'Guest'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [scanStep, setScanStep] = useState<string>('');

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImgSrc(imageSrc);
            handleVerification(imageSrc);
        }
    }, [webcamRef]);

    const handleVerification = async (imageSrc: string) => {
        setIsVerifying(true);
        setStatus('scanning');

        try {
            // Step 1: Face Analysis
            setScanStep('Detecting face landmarks...');
            await new Promise(resolve => setTimeout(resolve, 1500));

            setScanStep('Matching biometric pattern...');
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Step 2: Location Check
            setScanStep('Verifying geolocation...');

            // Get real location if possible
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const loc = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        setLocation(loc);

                        // Final Step: Mark Attendance
                        setScanStep('Registering attendance...');
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        if (user?.id) {
                            markAttendance(user.id, loc);
                            setStatus('success');
                            toast.success(`Attendance Marked: ${new Date().toLocaleTimeString()}`, {
                                description: `Location: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`
                            });
                        } else {
                            throw new Error("User not identified");
                        }
                        setIsVerifying(false);
                    },
                    (error) => {
                        console.error("Location error", error);
                        // Fallback for demo if location permission denied
                        const mockLoc = { lat: 16.5062, lng: 80.6480 }; // Vijayawada
                        setLocation(mockLoc);
                        if (user?.id) {
                            markAttendance(user.id, mockLoc);
                            setStatus('success');
                            toast.success("Attendance Marked (Location Simulated)");
                        }
                        setIsVerifying(false);
                    }
                );
            } else {
                // Fallback
                setIsVerifying(false);
                setStatus('error');
                toast.error("Geolocation not supported");
            }

        } catch (error) {
            console.error(error);
            setIsVerifying(false);
            setStatus('error');
            toast.error("Verification Failed");
        }
    };

    const resetScanner = () => {
        setImgSrc(null);
        setStatus('idle');
        setScanStep('');
        setLocation(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* High-Security Module Header - Vibrant Gov Theme */}
            <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-8 border-accent">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
                    <ShieldCheck className="h-64 w-64" />
                </div>
                {/* Decorative Saffron Pulse */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-[100px] animate-pulse"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-accent/20 border-none">
                                Security Level: High
                            </Badge>
                            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Biometric Link Active</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                            Biometric <br className="md:hidden" /> Verification
                        </h1>
                        <p className="text-slate-400 font-bold text-sm tracking-wide max-w-lg leading-relaxed">
                            Secured AI Facial Recognition System for <span className="text-accent">ITI Andhra Pradesh</span> Faculty Network.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="px-8 py-5 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-xl text-center shadow-inner group hover:border-accent/40 transition-colors">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 group-hover:text-accent/60 transition-colors">Shift Code</p>
                            <p className="text-2xl font-black text-white">S1-MORNING</p>
                        </div>
                        <div className="px-8 py-5 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-xl text-center shadow-inner group hover:border-accent/40 transition-colors">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 group-hover:text-accent/60 transition-colors">Network Time</p>
                            <div className="flex items-center gap-3 justify-center">
                                <Clock className="h-4 w-4 text-accent" />
                                <p className="text-2xl font-black text-white">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Scanner Section */}
                <Card className="overflow-hidden border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[3.5rem] bg-white group hover:shadow-[0_40px_80px_-15px_rgba(var(--primary),0.2)] transition-all duration-500">
                    <CardHeader className="bg-slate-50/50 pb-8 pt-8 px-10 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <div className="h-8 w-1.5 bg-accent rounded-full"></div>
                                Neural Interface
                            </CardTitle>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Biometric Hash Matching Engaged</p>
                        </div>
                        {status === 'scanning' && (
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-accent/5 text-accent rounded-full border border-accent/20 animate-pulse">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {scanStep}
                                </span>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-0 relative bg-slate-950 h-[550px] flex flex-col items-center justify-center overflow-hidden">
                        {imgSrc ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-black">
                                <img src={imgSrc} alt="Captured" className="w-full h-full object-cover opacity-60" />
                                {status === 'success' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/80 backdrop-blur-md animate-in fade-in zoom-in duration-500">
                                        <div className="bg-emerald-500 text-white p-6 rounded-full mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                                            <CheckCircle className="h-16 w-16" />
                                        </div>
                                        <h3 className="text-4xl font-black text-white mb-2 tracking-tight">Identity Verified</h3>
                                        <div className="bg-white/10 px-6 py-2 rounded-full border border-white/20">
                                            <p className="text-sm font-bold text-white/90 font-mono tracking-widest uppercase">
                                                {new Date().toLocaleTimeString()} • COMPLIANT
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative w-full h-full bg-slate-900 overflow-hidden flex items-center justify-center">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover opacity-60 transition-opacity duration-1000 group-hover:opacity-70"
                                    videoConstraints={{
                                        facingMode: "user"
                                    }}
                                />

                                {/* Specialized UI Overlay */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {/* Viewfinder brackets - High precision */}
                                    <div className="absolute inset-12 border border-white/5 rounded-[2.5rem]">
                                        <div className="absolute -top-1 -left-1 w-14 h-14 border-t-[6px] border-l-[6px] border-accent rounded-tl-3xl shadow-[0_0_30px_rgba(249,115,22,0.4)]" />
                                        <div className="absolute -top-1 -right-1 w-14 h-14 border-t-[6px] border-r-[6px] border-accent rounded-tr-3xl shadow-[0_0_30px_rgba(249,115,22,0.4)]" />
                                        <div className="absolute -bottom-1 -left-1 w-14 h-14 border-b-[6px] border-l-[6px] border-accent rounded-bl-3xl shadow-[0_0_30px_rgba(249,115,22,0.4)]" />
                                        <div className="absolute -bottom-1 -right-1 w-14 h-14 border-b-[6px] border-r-[6px] border-accent rounded-br-3xl shadow-[0_0_30px_rgba(249,115,22,0.4)]" />

                                        {/* Saffron Scan Line Animation - High Visibility */}
                                        <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent absolute top-0 animate-[scan_2.5s_ease-in-out_infinite] shadow-[0_0_25px_rgba(249,115,22,0.8)] mix-blend-screen opacity-80" />
                                    </div>

                                    {/* Data Stream Decoration - Refined */}
                                    <div className="absolute top-12 left-12 space-y-2.5 opacity-60">
                                        <div className="h-1 w-16 bg-accent/50 rounded-full" />
                                        <div className="h-1 w-10 bg-accent/30 rounded-full" />
                                        <div className="h-1 w-20 bg-accent/40 rounded-full" />
                                    </div>
                                </div>

                                <div className="absolute top-10 right-10 flex items-center gap-3 bg-[#0f172a]/80 backdrop-blur-2xl px-6 py-2.5 rounded-full border border-white/10 shadow-2xl">
                                    <div className="relative flex h-3 w-3">
                                        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></div>
                                        <div className="relative inline-flex rounded-full h-3 w-3 bg-accent"></div>
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Security: Live Link</span>
                                </div>
                            </div>
                        )}

                        {/* Actions Bar - Elevated with Premium Gradient */}
                        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black via-black/60 to-transparent flex justify-center items-end h-[280px]">
                            {status === 'success' ? (
                                <Button onClick={resetScanner} variant="secondary" className="w-full max-w-sm h-16 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all mb-4 bg-white/10 text-white border border-white/20 backdrop-blur-md">
                                    <RefreshCw className="mr-3 h-6 w-6 text-accent" />
                                    Re-Scan Identity
                                </Button>
                            ) : (
                                <Button
                                    onClick={capture}
                                    disabled={isVerifying}
                                    size="lg"
                                    className="w-full max-w-sm h-20 bg-gradient-to-br from-accent to-[#ea580c] hover:from-[#ea580c] hover:to-accent text-white shadow-[0_25px_60px_-10px_rgba(249,115,22,0.5)] rounded-[2.5rem] font-black text-xl group transition-all hover:-translate-y-2 mb-4 uppercase tracking-[0.05em] border-t border-white/20"
                                >
                                    {isVerifying ? (
                                        <>
                                            <Loader2 className="mr-3 h-7 w-7 animate-spin" />
                                            Encrypting...
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-5">
                                            <div className="bg-white/20 p-2.5 rounded-2xl group-hover:bg-white/30 transition-all shadow-inner">
                                                <ScanFace className="h-8 w-8" />
                                            </div>
                                            <span className="drop-shadow-sm">Capture Portrait</span>
                                        </div>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Info & Protocol Section */}
                <div className="space-y-8">
                    <Card className="rounded-[3.5rem] border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-4 bg-white relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 h-64 w-64 bg-primary/5 rounded-full blur-[60px] group-hover:bg-accent/10 transition-colors duration-1000"></div>
                        <CardHeader className="pb-6">
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <Target className="h-7 w-7 text-primary" />
                                Live Intelligence
                            </CardTitle>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contextual Session Analysis</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-5 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group/item hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                                <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-lg shadow-slate-900/10 group-hover/item:bg-primary transition-colors">
                                    <UserCheck className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Primary Operator</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tight">{user?.name || "Verified Faculty"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group/item hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                                <div className="bg-white text-blue-600 p-4 rounded-3xl shadow-lg border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                                    <MapPin className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Station Coordinates</p>
                                    {location ? (
                                        <div className="flex items-center gap-3">
                                            <p className="font-black text-slate-900 text-lg tracking-tight">
                                                {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
                                            </p>
                                            <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black px-3 py-1 rounded-full uppercase">Geo-Synced</Badge>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-amber-500 animate-pulse tracking-wide italic">Triangulating Station...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operational Protocols - High Contrast */}
                    <Card className="rounded-[3.5rem] border-none shadow-2xl p-6 bg-[#0f172a] text-white relative h-[250px] overflow-hidden group">
                        <div className="absolute -bottom-24 -right-24 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                            <ShieldCheck className="h-80 w-80" />
                        </div>
                        <CardHeader className="pb-6">
                            <CardTitle className="text-lg font-black uppercase tracking-[0.3em] text-accent flex items-center gap-3">
                                <div className="h-1 w-10 bg-accent rounded-full"></div>
                                System Protocols
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-5">
                                <li className="flex gap-5 items-center group/p">
                                    <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_15px_rgba(var(--accent),0.6)] group-hover/p:scale-150 transition-transform"></div>
                                    <span className="text-xs font-bold text-slate-300 tracking-wide uppercase group-hover/p:text-white transition-colors">Center facial features within neural markers</span>
                                </li>
                                <li className="flex gap-5 items-center group/p">
                                    <div className="h-3 w-3 rounded-full bg-accent/40 group-hover/p:bg-accent transition-colors shadow-[0_0_10px_rgba(var(--accent),0.3)]"></div>
                                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase group-hover/p:text-white transition-colors">System valid only in ITI secure zones</span>
                                </li>
                                <li className="flex gap-5 items-center group/p">
                                    <div className="h-3 w-3 rounded-full bg-accent/20 group-hover/p:bg-accent transition-colors"></div>
                                    <span className="text-xs font-bold text-slate-500 tracking-wide uppercase group-hover/p:text-white transition-colors">Auth cross-check with 128-bit GPS hash</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

};

export default Attendance;
