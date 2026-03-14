'use client';

import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import { getVillageById } from '@/lib/data';
import { useFaultStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Phone, MapPin, Calendar, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ReporterProfilePage() {
  const { user } = useAuth();
  const { t } = useSettings();
  const { faults } = useFaultStore();

  if (!user) return null;

  const village = user.village ? getVillageById(user.village) : null;
  const userFaults = faults.filter((f) => f.reporterId === user.id);
  const resolvedFaults = userFaults.filter((f) => f.status === 'resolved');
  const pendingFaults = userFaults.filter((f) => f.status === 'pending' || f.status === 'assigned');

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/reporter" className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold">{t('profile')}</h1>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-primary-foreground/80 capitalize">{t(user.role)}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{t('phone')}</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
          
          {user.email && (
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t('email')}</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          )}

          {village && (
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t('village')}</p>
                <p className="font-medium">{village.name}, {village.mandal}</p>
                <p className="text-sm text-muted-foreground">{village.district}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{t('memberSince')}</p>
              <p className="font-medium">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <h3 className="font-semibold text-lg">{t('totalReports')}</h3>
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <ClipboardList className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{userFaults.length}</p>
            <p className="text-xs text-muted-foreground">{t('totalReports')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold">{resolvedFaults.length}</p>
            <p className="text-xs text-muted-foreground">{t('resolved')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-amber-600 mb-2" />
            <p className="text-2xl font-bold">{pendingFaults.length}</p>
            <p className="text-xs text-muted-foreground">{t('pending')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      {userFaults.length > 0 && (
        <>
          <h3 className="font-semibold text-lg">{t('history')}</h3>
          <div className="space-y-2">
            {userFaults.slice(0, 3).map((fault) => (
              <Card key={fault.id} className="overflow-hidden">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{fault.villageName}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {fault.deviceType.replace('_', ' ')}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      fault.status === 'resolved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : fault.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}
                  >
                    {t(fault.status === 'in_progress' ? 'inProgress' : fault.status)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
