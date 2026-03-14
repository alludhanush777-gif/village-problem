'use client';

import { useAuth } from '@/lib/auth-context';
import { useFaultStore } from '@/lib/store';
import { villages, technicians } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Wrench,
  TrendingUp,
  Bell,
  ArrowRight,
  Sun,
  Zap,
  Battery,
  Activity,
} from 'lucide-react';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const { faults } = useFaultStore();

  const technicianData = technicians.find((t) => t.id === user?.id) || technicians[0];
  const myFaults = faults.filter((f) => f.assignedTechnicianId === (user?.id || 't1'));
  const pendingFaults = myFaults.filter((f) => f.status === 'pending');
  const inProgressFaults = myFaults.filter((f) => f.status === 'in-progress');
  const repairedFaults = myFaults.filter((f) => f.status === 'repaired');

  const assignedVillages = villages.filter((v) =>
    technicianData.assignedVillages.includes(v.id)
  );

  const criticalFaults = myFaults.filter(
    (f) => f.urgency === 'critical' && f.status !== 'repaired'
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'solar_panel':
        return Sun;
      case 'microgrid':
        return Zap;
      case 'battery':
        return Battery;
      default:
        return Activity;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-1">Welcome back, {technicianData.name}</h2>
        <p className="text-sm text-muted-foreground">
          You have {pendingFaults.length + inProgressFaults.length} active tasks
        </p>
      </div>

      {/* Critical Alerts */}
      {criticalFaults.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <Bell className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">Critical Alerts ({criticalFaults.length})</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Immediate attention required for these faults
            </p>
            <Link href="/technician/faults?urgency=critical">
              <Button variant="destructive" size="sm" className="mt-3">
                View Critical Faults
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingFaults.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressFaults.length}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{repairedFaults.length}</p>
                <p className="text-xs text-muted-foreground">Repaired</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{technicianData.completedJobs}</p>
                <p className="text-xs text-muted-foreground">Total Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Villages */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Assigned Villages
            </CardTitle>
            <Link href="/technician/map">
              <Button variant="ghost" size="sm" className="text-xs">
                View Map
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {assignedVillages.map((village) => {
            const villageFaults = myFaults.filter(
              (f) => f.villageId === village.id && f.status !== 'repaired'
            );
            return (
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
                {villageFaults.length > 0 && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    {villageFaults.length} active
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Active Faults */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              Active Faults
            </CardTitle>
            <Link href="/technician/faults">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {myFaults
            .filter((f) => f.status !== 'repaired')
            .slice(0, 3)
            .map((fault) => {
              const DeviceIcon = getDeviceIcon(fault.deviceType);
              return (
                <Link key={fault.id} href={`/technician/faults/${fault.id}`}>
                  <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="p-2 bg-card rounded-full">
                      <DeviceIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm capitalize">
                          {fault.deviceType.replace('_', ' ')}
                        </p>
                        <Badge variant="secondary" className={getUrgencyColor(fault.urgency)}>
                          {fault.urgency}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {fault.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {fault.villageName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          by {fault.reporterName}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          {myFaults.filter((f) => f.status !== 'repaired').length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No active faults. Great job!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
