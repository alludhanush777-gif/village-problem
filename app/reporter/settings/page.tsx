'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Globe, Moon, Sun, Monitor, LogOut, Bell, BellOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ReporterSettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { language, theme, setLanguage, setTheme, t } = useSettings();
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);

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
    <div className="p-4 space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/reporter" className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold">{t('settings')}</h1>
      </div>

      {/* Language Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t('language')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                language === lang.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              <span className="font-medium">{lang.nativeLabel}</span>
              {language === lang.value && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
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
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                    theme === themeOption.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{themeOption.label}</span>
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
            <Label htmlFor="sms-notif" className="flex items-center gap-2 cursor-pointer">
              {smsNotifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              {t('smsNotifications')}
            </Label>
            <button
              id="sms-notif"
              onClick={() => setSmsNotifications(!smsNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                smsNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  smsNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="app-notif" className="flex items-center gap-2 cursor-pointer">
              {appNotifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              {t('appNotifications')}
            </Label>
            <button
              id="app-notif"
              onClick={() => setAppNotifications(!appNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                appNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  appNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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
