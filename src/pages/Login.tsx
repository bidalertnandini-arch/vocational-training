import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Languages,
  ShieldCheck,
  Building2,
  GraduationCap,
  UserCircle2,
  Sparkles,
  ArrowLeft,
  Fingerprint,
  MapPin,
  RefreshCw,
  Key,
  Smartphone,
  UserCheck2,
  Lock
} from 'lucide-react';
import { User } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Login = () => {
  const { t, language, setLanguage } = useLanguage();
  const { login, loginAsRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<User['role'] | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [geoStatus, setGeoStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(result);
  };

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Captcha validation
    if (captcha.toUpperCase() !== generatedCaptcha) {
      setError('Invalid Captcha');
      refreshCaptcha();
      return;
    }

    // Role specific validations
    if ((selectedRole === 'admin' || selectedRole === 'dto' || selectedRole === 'principal') && !otp) {
      setError('OTP is mandatory for your role');
      return;
    }

    if (selectedRole === 'faculty') {
      if (geoStatus !== 'success') {
        setError('Geo-location permission and verification mandatory');
        return;
      }
    }

    setIsLoading(true);
    try {
      // For demo purposes, we'll allow the mock login to proceed
      const success = await login(username || getDemoUsername(selectedRole), 'password');
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials for selected role');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoUsername = (role: User['role'] | null) => {
    switch (role) {
      case 'admin': return 'ADM_AP_001';
      case 'dto': return 'DTO_GNT_01';
      case 'principal': return 'PRI_ITI_GNT01';
      case 'faculty': return 'FAC_ITI_GNT01_1023';
      case 'student': return 'STU_ITI_GNT01_2024';
      default: return '';
    }
  };

  const handleRoleSelect = (role: User['role']) => {
    setSelectedRole(role);
    setUsername(getDemoUsername(role)); // Autofill for demo
    setError('');
  };

  const simulateGeoLocation = () => {
    setGeoStatus('validating');
    setTimeout(() => {
      setGeoStatus('success');
    }, 1500);
  };

  const roles = [
    { id: 'admin', icon: ShieldCheck, label: 'Administrator', color: 'bg-rose-500', sub: 'State / NIC Level' },
    { id: 'dto', icon: Building2, label: 'District Officer', color: 'bg-orange-500', sub: 'DTO Monitoring' },
    { id: 'principal', icon: GraduationCap, label: 'Principal', color: 'bg-blue-600', sub: 'Institute Head' },
    { id: 'faculty', icon: UserCircle2, label: 'Faculty', color: 'bg-emerald-600', sub: 'Attendance & Teaching' },
    { id: 'student', icon: UserCheck2, label: 'Student', color: 'bg-amber-500', sub: 'Feedback Only' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-slate-950 flex flex-col relative overflow-hidden font-sans">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-500 rounded-full blur-[120px]" />
      </div>

      {/* Gov Header */}
      <header className="relative z-20 bg-[#1e3a8a] text-white shadow-2xl">
        <div className="h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#128807]" />
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full p-2 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="50" cy="50" r="8" />
                {[...Array(24)].map((_, i) => (
                  <line key={i} x1="50" y1="15" x2="50" y2="25" stroke="currentColor" strokeWidth="2" transform={`rotate(${i * 15} 50 50)`} />
                ))}
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight uppercase tracking-tight">ITI Faculty Monitoring System</h1>
              <p className="text-[10px] text-white/70 font-medium">Department of Employment & Training, Andhra Pradesh</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 gap-2 border border-white/20 rounded-full px-4"
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
          >
            <Languages className="h-4 w-4" />
            <span className="font-semibold">{language === 'en' ? 'తెలుగు' : 'English'}</span>
          </Button>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-4xl transition-all duration-500 ease-in-out">
          {!selectedRole ? (
            /* Role Selection Screen */
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-[#111827] dark:text-white">Select Your Login Role</h2>
                <p className="text-slate-500 dark:text-slate-400">Access your specialized dashboard based on your designation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id as User['role'])}
                    className="group relative flex flex-col items-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-transparent hover:border-primary"
                  >
                    <div className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg text-white",
                      role.color
                    )}>
                      <role.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{role.label}</h3>
                    <p className="text-xs text-slate-400 text-center">{role.sub}</p>

                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-widest">
                        Select <ArrowLeft className="w-3 h-3 rotate-180" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Selected Role Form */
            <div className="flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-white dark:border-slate-800 max-w-3xl mx-auto ring-1 ring-black/5">
              {/* Left Side: Info */}
              <div className={cn(
                "w-full lg:w-2/5 p-10 flex flex-col justify-between text-white relative",
                roles.find(r => r.id === selectedRole)?.color
              )}>
                <div className="relative z-10">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/20 p-0 h-auto mb-8 gap-2"
                    onClick={() => setSelectedRole(null)}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to roles
                  </Button>
                  <div className="bg-white/20 w-16 h-16 rounded-2xl p-4 mb-4 backdrop-blur-md">
                    {(() => {
                      const RoleIcon = roles.find(r => r.id === selectedRole)?.icon || UserCircle2;
                      return <RoleIcon className="w-full h-full" />;
                    })()}
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-2">{selectedRole} LOGIN</h2>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Secure gateway for {selectedRole}s in the Andhra Pradesh ITI Faculty Monitoring Network.
                  </p>
                </div>

                <div className="relative z-10 pt-10">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/60 mb-4 uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-4 h-4" /> Multi-Factor Enabled
                  </div>
                  <p className="text-[10px] text-white/50 italic capitalize">
                    System Auto-fetching district, institute, and server context for {selectedRole} ID.
                  </p>
                </div>

                {/* Decorative Circle */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl shadow-inner" />
              </div>

              {/* Right Side: Form */}
              <div className="flex-1 p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Username / User ID</Label>
                    <div className="relative">
                      <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ex: ADM_AP_001"
                        className="pl-12 h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secure Password</Label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-12 h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Role Specific: OTP */}
                  {(selectedRole === 'admin' || selectedRole === 'dto' || selectedRole === 'principal') && (
                    <div className="space-y-2 animate-slide-in-right">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">OTP Verification</Label>
                        <button type="button" className="text-[10px] text-primary font-bold hover:underline">Get SMS OTP</button>
                      </div>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="pl-12 h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary shadow-inner"
                        />
                      </div>
                    </div>
                  )}

                  {/* Role Specific: DTO Modes */}
                  {selectedRole === 'dto' && (
                    <div className="space-y-2 animate-slide-in-right">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Login Mode</Label>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="flex-1 rounded-xl h-11 border-primary/20 bg-primary/5 text-primary">Web Dashboard</Button>
                        <Button type="button" variant="outline" className="flex-1 rounded-xl h-11 text-slate-500">Mobile Hub</Button>
                      </div>
                    </div>
                  )}

                  {/* Role Specific: Faculty Context (Geo Only) */}
                  {selectedRole === 'faculty' && (
                    <div className="space-y-4 py-2">
                      <div
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2",
                          geoStatus === 'success' ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-100 hover:border-blue-200"
                        )}
                        onClick={simulateGeoLocation}
                      >
                        <MapPin className={cn("w-6 h-6", geoStatus === 'validating' && "animate-bounce")} />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {geoStatus === 'success' ? "Location Verified" : "Verify Geo-location"}
                        </span>
                      </div>
                      <p className="text-[9px] text-center text-slate-400 italic">Geofence validation mandatory for faculty authentication.</p>
                    </div>
                  )}

                  {/* Captcha */}
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Security Captcha</Label>
                    <div className="flex items-center gap-3">
                      <div className="h-12 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-mono text-2xl tracking-widest font-black text-slate-700 dark:text-slate-300 italic select-none shadow-inner border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]" />
                        <span className="relative rotate-3">{generatedCaptcha}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-xl bg-slate-50"
                        onClick={refreshCaptcha}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      placeholder="Enter above code"
                      className="h-12 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary shadow-inner"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold animate-pulse border border-red-100">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-[#1e3a8a] hover:bg-[#1e40af] text-lg font-bold shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
                  </Button>

                  <div className="flex items-center justify-between pt-2">
                    <button type="button" className="text-xs font-bold text-slate-400 hover:text-primary underline decoration-primary/30 underline-offset-4">Forgot Password?</button>
                    <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                      <Lock className="w-2.5 h-2.5" /> NIC SECURED NETWORK
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-6 px-4 bg-white/50 backdrop-blur-md border-t border-slate-200/50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 font-medium">
          <p className="text-xs">© 2024 DET-AP. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] uppercase hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] uppercase hover:text-primary transition-colors">Usage Terms</a>
            <a href="#" className="text-[10px] uppercase hover:text-primary transition-colors">Contact NIC Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
