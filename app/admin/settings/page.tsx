'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
  Bell,
  BellOff,
  Moon,
  Sun,
  Monitor,
  Globe,
  Database,
  MessageSquare,
  LogOut,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { language, theme, setLanguage, setTheme, t } = useSettings();
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const languages = [
    { value: 'en', label: 'English', nativeLabel: 'English' },
    { value: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
    { value: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  ] as const;

  const themes = [
    { value: 'light', label: t('lightMode'), icon: Sun },
    { value: 'dark', label: t('darkMode'), icon: Moon },
    { value: 'system', label: t('systemMode'), icon: Monitor },
  ] as const;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
        <p className="text-muted-foreground">Manage system configuration</p>
      </div>

      {/* Language Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t('language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                  language === lang.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                }`}
              >
                <span className="font-medium text-sm">{lang.nativeLabel}</span>
                {language === lang.value && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            {t('theme')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                    theme === themeOption.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{themeOption.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {t('notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex items-center gap-2 cursor-pointer">
              {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              Push Notifications
            </Label>
            <button
              id="notifications"
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
              <MessageSquare className="h-4 w-4" />
              SMS Alerts for Critical Faults
            </Label>
            <button
              id="sms"
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                smsAlerts ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  smsAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* System */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Database Status</p>
              <p className="text-xs text-muted-foreground">Connected to MongoDB</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded text-xs">
              Online
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">SMS Service</p>
              <p className="text-xs text-muted-foreground">Twilio Integration</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded text-xs">
              Active
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        variant="destructive"
        className="w-full"
        size="lg"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-5 w-5" />
        {t('logout')}
      </Button>
    </div>
  );
}
