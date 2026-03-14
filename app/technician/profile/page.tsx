'use client';

import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import { useFaultStore } from '@/lib/store';
import { technicians, villages } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Phone, Mail, MapPin, Zap, CheckCircle, Clock, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function TechnicianProfilePage() {
  const { user } = useAuth();
  const { t } = useSettings();
  const { faults } = useFaultStore();

  if (!user) return null;

  const technicianData = technicians.find((tech) => tech.id === user.id) || technicians[0];
  const assignedVillages = villages.filter((v) =>
    technicianData.assignedVillages.includes(v.id)
  );
  const techFaults = faults.filter((f) => f.assignedTechnicianId === user.id);
  const resolvedFaults = techFaults.filter((f) => f.status === 'resolved');
  const inProgressFaults = techFaults.filter((f) => f.status === 'in_progress');

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/technician" className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold">{t('profile')}</h1>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Zap className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{technicianData.name}</h2>
              <Badge variant="secondary" className="mt-1 bg-primary-foreground/20 text-primary-foreground border-none">
                {technicianData.specialization}
              </Badge>
            </div>
          </div>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{t('phone')}</p>
              <p className="font-medium">{technicianData.phone}</p>
            </div>
          </div>
          
          {technicianData.email && (
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t('email')}</p>
                <p className="font-medium">{technicianData.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{t('role')}</p>
              <p className="font-medium capitalize">{t('technician')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <h3 className="font-semibold text-lg">Performance Stats</h3>
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Wrench className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{technicianData.completedJobs}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-amber-600 mb-2" />
            <p className="text-2xl font-bold">{technicianData.activeJobs + inProgressFaults.length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold">{resolvedFaults.length}</p>
            <p className="text-xs text-muted-foreground">{t('resolved')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Villages */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {t('assignedAreas')} ({assignedVillages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {assignedVillages.map((village) => (
            <div
              key={village.id}
              className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{village.name}</p>
                <p className="text-xs text-muted-foreground">
                  {village.mandal}, {village.district}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      {techFaults.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {techFaults.slice(0, 3).map((fault) => (
              <div
                key={fault.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
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
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
