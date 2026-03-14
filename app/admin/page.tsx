'use client';

import { useFaultStore } from '@/lib/store';
import { villages, technicians, telanganaDistricts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  TrendingUp,
  Wrench,
  Sun,
  Zap,
  Battery,
  Activity,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const { faults } = useFaultStore();

  const pendingFaults = faults.filter((f) => f.status === 'pending');
  const inProgressFaults = faults.filter((f) => f.status === 'in-progress');
  const repairedFaults = faults.filter((f) => f.status === 'repaired');
  const criticalFaults = faults.filter((f) => f.urgency === 'critical' && f.status !== 'repaired');

  const deviceStats = [
    {
      type: 'solar_panel',
      label: 'Solar Panels',
      icon: Sun,
      count: faults.filter((f) => f.deviceType === 'solar_panel').length,
    },
    {
      type: 'microgrid',
      label: 'Microgrids',
      icon: Zap,
      count: faults.filter((f) => f.deviceType === 'microgrid').length,
    },
    {
      type: 'inverter',
      label: 'Inverters',
      icon: Activity,
      count: faults.filter((f) => f.deviceType === 'inverter').length,
    },
    {
      type: 'battery',
      label: 'Batteries',
      icon: Battery,
      count: faults.filter((f) => f.deviceType === 'battery').length,
    },
  ];

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

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the Telangana Renewable Energy System
        </p>
      </div>

      {/* Critical Alerts */}
      {criticalFaults.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
                <span className="font-semibold">
                  {criticalFaults.length} Critical Faults Require Attention
                </span>
              </div>
              <Link href="/admin/analytics">
                <Badge variant="destructive">View All</Badge>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingFaults.length}</p>
                <p className="text-xs text-muted-foreground">Pending Faults</p>
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
                <p className="text-2xl font-bold">{faults.length}</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{villages.length}</p>
                <p className="text-sm text-muted-foreground">Villages Covered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-full">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold">{technicians.length}</p>
                <p className="text-sm text-muted-foreground">Active Technicians</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{telanganaDistricts.length}</p>
                <p className="text-sm text-muted-foreground">Districts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Faults by Device Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deviceStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.type}
                  className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
                >
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.count}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Technician Overview */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Faults */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Faults</CardTitle>
              <Link href="/admin/analytics">
                <Badge variant="outline" className="gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {faults.slice(0, 4).map((fault) => (
              <div
                key={fault.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm capitalize">
                    {fault.deviceType.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fault.villageName} - {fault.reporterName}
                  </p>
                </div>
                <Badge variant="secondary" className={getUrgencyColor(fault.urgency)}>
                  {fault.urgency}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Technicians Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Technician Performance</CardTitle>
              <Link href="/admin/technicians">
                <Badge variant="outline" className="gap-1">
                  Manage <ArrowRight className="h-3 w-3" />
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {technicians.slice(0, 4).map((tech) => (
              <div
                key={tech.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.specialization}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{tech.completedJobs}</p>
                  <p className="text-xs text-muted-foreground">completed</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
