'use client';

import { useAuth } from '@/lib/auth-context';
import { useFaultStore } from '@/lib/store';
import { getVillageById, getTechnicianByVillage } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  Phone,
  MapPin,
  Sun,
  Zap,
  Battery,
  Activity,
} from 'lucide-react';

export default function ReporterHome() {
  const { user } = useAuth();
  const { faults } = useFaultStore();

  const village = user?.village ? getVillageById(user.village) : null;
  const technician = user?.village ? getTechnicianByVillage(user.village) : null;
  const myFaults = faults.filter((f) => f.reporterId === user?.id);
  const pendingFaults = myFaults.filter((f) => f.status === 'pending').length;
  const inProgressFaults = myFaults.filter((f) => f.status === 'in-progress').length;
  const repairedFaults = myFaults.filter((f) => f.status === 'repaired').length;

  const recentFaults = myFaults.slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'repaired':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
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
        <h2 className="text-lg font-semibold mb-1">Hello, {user?.name}!</h2>
        <p className="text-sm text-muted-foreground">
          Report energy faults quickly to get them fixed
        </p>
        <Link href="/reporter/report">
          <Button className="mt-3 w-full" size="lg">
            <Camera className="mr-2 h-5 w-5" />
            Report New Fault
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-3 px-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full w-fit mx-auto mb-2">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-bold">{pendingFaults}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 pb-3 px-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-2">
              <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold">{inProgressFaults}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4 pb-3 px-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold">{repairedFaults}</p>
            <p className="text-xs text-muted-foreground">Repaired</p>
          </CardContent>
        </Card>
      </div>

      {/* Village & Technician Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Your Village
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {village ? (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{village.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {village.mandal}, {village.district}
                  </p>
                </div>
              </div>
              {technician && (
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Assigned Technician</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{technician.name}</p>
                      <p className="text-xs text-muted-foreground">{technician.specialization}</p>
                    </div>
                    <a href={`tel:${technician.phone}`}>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Phone className="h-3 w-3" />
                        Call
                      </Button>
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{technician.phone}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No village assigned</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Faults */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Reports</CardTitle>
            <Link href="/reporter/history">
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentFaults.length > 0 ? (
            recentFaults.map((fault) => {
              const DeviceIcon = getDeviceIcon(fault.deviceType);
              return (
                <div
                  key={fault.id}
                  className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg"
                >
                  <div className="p-2 bg-card rounded-full">
                    <DeviceIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm capitalize">
                        {fault.deviceType.replace('_', ' ')}
                      </p>
                      <Badge variant="secondary" className={getStatusColor(fault.status)}>
                        {fault.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{fault.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(fault.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No fault reports yet. Report your first fault to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/reporter/camera">
          <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardContent className="pt-4 pb-4 flex flex-col items-center">
              <Camera className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-medium">Capture Photo</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reporter/report">
          <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardContent className="pt-4 pb-4 flex flex-col items-center">
              <AlertTriangle className="h-8 w-8 text-accent mb-2" />
              <p className="text-sm font-medium">Report Fault</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
