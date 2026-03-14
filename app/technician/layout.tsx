'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import { Home, Map, ClipboardList, User, Zap, Settings } from 'lucide-react';
import Link from 'next/link';

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { t } = useSettings();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'technician')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Zap className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/technician', icon: Home, label: t('dashboard') },
    { href: '/technician/map', icon: Map, label: t('mapView') },
    { href: '/technician/faults', icon: ClipboardList, label: t('faults') },
    { href: '/technician/profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-3 px-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6" />
            <div>
              <h1 className="font-semibold text-sm">{t('technician')} Portal</h1>
              <p className="text-xs text-primary-foreground/80">{user.name}</p>
            </div>
          </div>
          <Link
            href="/technician/settings"
            className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/technician' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
