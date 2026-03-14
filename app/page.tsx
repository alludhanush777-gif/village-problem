'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { villages } from '@/lib/data';
import { Sun, Zap, Users, Shield, Phone, Lock, User, MapPin } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login, register, isLoading, user } = useAuth();
  const [loginData, setLoginData] = useState({ phone: '', password: '', role: 'reporter' as UserRole });
  const [registerData, setRegisterData] = useState({ name: '', phone: '', village: '', password: '' });
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'reporter') router.push('/reporter');
      else if (user.role === 'technician') router.push('/technician');
      else if (user.role === 'admin') router.push('/admin');
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Sun className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(loginData.phone, loginData.password, loginData.role);
    if (success) {
      if (loginData.role === 'reporter') router.push('/reporter');
      else if (loginData.role === 'technician') router.push('/technician');
      else if (loginData.role === 'admin') router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!registerData.village) {
      setError('Please select a village');
      return;
    }
    const success = await register(registerData.name, registerData.phone, registerData.village, registerData.password);
    if (success) {
      router.push('/reporter');
    } else {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-primary-foreground/20 rounded-full">
              <Sun className="h-8 w-8" />
            </div>
            <Zap className="h-6 w-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-balance">Village Renewable Energy</h1>
          <p className="text-sm text-primary-foreground/80">Fault Reporting System</p>
        </div>
      </header>

      {/* Features */}
      <div className="bg-secondary py-4 px-4">
        <div className="max-w-md mx-auto flex justify-around">
          <div className="text-center">
            <div className="p-2 bg-primary/10 rounded-full mx-auto w-fit mb-1">
              <Sun className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Solar</p>
          </div>
          <div className="text-center">
            <div className="p-2 bg-accent/10 rounded-full mx-auto w-fit mb-1">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Microgrid</p>
          </div>
          <div className="text-center">
            <div className="p-2 bg-primary/10 rounded-full mx-auto w-fit mb-1">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Support</p>
          </div>
          <div className="text-center">
            <div className="p-2 bg-accent/10 rounded-full mx-auto w-fit mb-1">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Secure</p>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <main className="flex-1 p-4 flex items-start justify-center pt-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to report faults or manage repairs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <Select
                      value={loginData.role}
                      onValueChange={(value: UserRole) => setLoginData({ ...loginData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reporter">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Reporter (Village User)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="technician">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            <span>Technician</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        className="pl-10"
                        value={loginData.phone}
                        onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    Sign In
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Demo: Use any phone number and password to login
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        className="pl-10"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village">Village</Label>
                    <Select
                      value={registerData.village}
                      onValueChange={(value) => setRegisterData({ ...registerData, village: value })}
                    >
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select your village" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {villages.map((village) => (
                          <SelectItem key={village.id} value={village.id}>
                            {village.name}, {village.mandal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create password"
                        className="pl-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-4 px-4 text-center text-sm text-muted-foreground">
        <p>Telangana Renewable Energy Department</p>
        <p className="text-xs mt-1">Serving 12 districts across Telangana</p>
      </footer>
    </div>
  );
}
