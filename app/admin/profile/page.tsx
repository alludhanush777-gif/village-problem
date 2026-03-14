'use client';

import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import { useFaultStore } from '@/lib/store';
import { technicians, villages } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, Shield, Users, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const { t } = useSettings();
  const { faults } = useFaultStore();

  if (!user) return null;

  const totalFaults = faults.length;
  const resolvedFaults = faults.filter((f) => f.status === 'resolved').length;
  const pendingFaults = faults.filter((f) => f.status === 'pending' || f.status === 'assigned').length;
  const criticalFaults = faults.filter((f) => f.urgency === 'critical' && f.status !== 'resolved').length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('profile')}</h1>
        <p className="text-muted-foreground">{t('personalDetails')}</p>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Shield className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-primary-foreground/80 capitalize">{t('admin')}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t('phone')}</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
            
            {user.email && (
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('email')}</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t('role')}</p>
                <p className="font-medium capitalize">{t('admin')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Access Level</p>
                <p className="font-medium">Full Access</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <h3 className="font-semibold text-lg">System Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{totalFaults}</p>
            <p className="text-xs text-muted-foreground">Total Faults</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold">{resolvedFaults}</p>
            <p className="text-xs text-muted-foreground">{t('resolved')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto text-amber-600 mb-2" />
            <p className="text-2xl font-bold">{pendingFaults}</p>
            <p className="text-xs text-muted-foreground">{t('pending')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold">{criticalFaults}</p>
            <p className="text-xs text-muted-foreground">{t('critical')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('technicians')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{technicians.length}</p>
            <p className="text-sm text-muted-foreground">Active technicians</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t('villages')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{villages.length}</p>
            <p className="text-sm text-muted-foreground">Covered villages</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
