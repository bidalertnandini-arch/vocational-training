import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { User, Bell, Shield, Palette, Save, LogOut, Mail, Globe, Lock } from 'lucide-react';

const Settings = () => {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    // Form states (mock)
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
        security: true
    });

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Settings updated successfully");
        }, 1500);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] lg:grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">Notify</TabsTrigger>
                </TabsList>

                {/* PROFILE TAB */}
                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your photo and personal details here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="/placeholder-avatar.jpg" />
                                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                        {user?.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <Button variant="outline" size="sm">Change Photo</Button>
                                    <p className="text-xs text-muted-foreground">
                                        JPG, GIF or PNG. Max 1MB.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="name" defaultValue={user?.name} className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" defaultValue={user?.email} className="pl-9" disabled />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input id="role" defaultValue={user?.role} disabled className="capitalize" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" placeholder="+91 98765 43210" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Input id="bio" placeholder="Brief description for your profile..." />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="ghost" className="text-destructive hover:text-destructive/90" onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                            <Button onClick={handleSave} disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* ACCOUNT TAB */}
                <TabsContent value="account" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password & Security</CardTitle>
                            <CardDescription>
                                Manage your password and security questions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current">Current Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="current" type="password" className="pl-9" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new">New Password</Label>
                                    <Input id="new" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirm Password</Label>
                                    <Input id="confirm" type="password" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave} disabled={isLoading}>Update Password</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible and destructive actions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                                <div>
                                    <p className="font-medium text-destructive">Delete Account</p>
                                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                                </div>
                                <Button variant="destructive" size="sm">Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* APPEARANCE TAB */}
                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance & Language</CardTitle>
                            <CardDescription>
                                Customize the look and feel of the application.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <div className="flex items-center gap-4">
                                    <Globe className="h-5 w-5 text-muted-foreground" />
                                    <Select
                                        value={language}
                                        onValueChange={(val: 'en' | 'te') => setLanguage(val)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <p className="text-sm text-muted-foreground pt-1">
                                    Select your preferred language for the interface.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="border-2 border-primary rounded-md p-2 bg-background space-y-2 cursor-pointer">
                                        <div className="h-2 w-full bg-primary/20 rounded-full" />
                                        <div className="h-2 w-2/3 bg-muted rounded-full" />
                                        <span className="block text-center text-xs font-medium mt-2">Light</span>
                                    </div>
                                    <div className="border-2 border-transparent rounded-md p-2 bg-slate-950 space-y-2 cursor-pointer opacity-50">
                                        <div className="h-2 w-full bg-slate-800 rounded-full" />
                                        <div className="h-2 w-2/3 bg-slate-800 rounded-full" />
                                        <span className="block text-center text-xs font-medium mt-2 text-white">Dark</span>
                                    </div>
                                    <div className="border-2 border-transparent rounded-md p-2 bg-muted space-y-2 cursor-pointer opacity-50">
                                        <div className="h-2 w-full bg-muted-foreground/20 rounded-full" />
                                        <div className="h-2 w-2/3 bg-muted-foreground/20 rounded-full" />
                                        <span className="block text-center text-xs font-medium mt-2">System</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* NOTIFICATIONS TAB */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose what you want to be notified about.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <Label htmlFor="email-notifs" className="font-medium">Email Notifications</Label>
                                    <span className="text-sm text-muted-foreground">Receive daily summaries and alerts via email.</span>
                                </div>
                                <Switch
                                    id="email-notifs"
                                    checked={notifications.email}
                                    onCheckedChange={(c) => setNotifications(prev => ({ ...prev, email: c }))}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <Label htmlFor="push-notifs" className="font-medium">Push Notifications</Label>
                                    <span className="text-sm text-muted-foreground">Receive real-time alerts on your device.</span>
                                </div>
                                <Switch
                                    id="push-notifs"
                                    checked={notifications.push}
                                    onCheckedChange={(c) => setNotifications(prev => ({ ...prev, push: c }))}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <Label htmlFor="security-notifs" className="font-medium">Security Alerts</Label>
                                    <span className="text-sm text-muted-foreground">Get notified about suspicious logins.</span>
                                </div>
                                <Switch
                                    id="security-notifs"
                                    checked={notifications.security}
                                    disabled
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave} disabled={isLoading}>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
