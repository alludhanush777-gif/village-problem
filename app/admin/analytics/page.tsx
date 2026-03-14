'use client';

import { useFaultStore } from '@/lib/store';
import { villages, technicians } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sun,
  Zap,
  Battery,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { faults } = useFaultStore();

  const pendingFaults = faults.filter((f) => f.status === 'pending');
  const inProgressFaults = faults.filter((f) => f.status === 'in-progress');
  const repairedFaults = faults.filter((f) => f.status === 'repaired');

  const deviceStats = [
    {
      type: 'solar_panel',
      label: 'Solar Panels',
      icon: Sun,
      total: faults.filter((f) => f.deviceType === 'solar_panel').length,
      pending: faults.filter((f) => f.deviceType === 'solar_panel' && f.status === 'pending').length,
      repaired: faults.filter((f) => f.deviceType === 'solar_panel' && f.status === 'repaired').length,
    },
    {
      type: 'microgrid',
      label: 'Microgrids',
      icon: Zap,
      total: faults.filter((f) => f.deviceType === 'microgrid').length,
      pending: faults.filter((f) => f.deviceType === 'microgrid' && f.status === 'pending').length,
      repaired: faults.filter((f) => f.deviceType === 'microgrid' && f.status === 'repaired').length,
    },
    {
      type: 'inverter',
      label: 'Inverters',
      icon: Activity,
      total: faults.filter((f) => f.deviceType === 'inverter').length,
      pending: faults.filter((f) => f.deviceType === 'inverter' && f.status === 'pending').length,
      repaired: faults.filter((f) => f.deviceType === 'inverter' && f.status === 'repaired').length,
    },
    {
      type: 'battery',
      label: 'Batteries',
      icon: Battery,
      total: faults.filter((f) => f.deviceType === 'battery').length,
      pending: faults.filter((f) => f.deviceType === 'battery' && f.status === 'pending').length,
      repaired: faults.filter((f) => f.deviceType === 'battery' && f.status === 'repaired').length,
    },
    {
      type: 'transformer',
      label: 'Transformers',
      icon: Zap,
      total: faults.filter((f) => f.deviceType === 'transformer').length,
      pending: faults.filter((f) => f.deviceType === 'transformer' && f.status === 'pending').length,
      repaired: faults.filter((f) => f.deviceType === 'transformer' && f.status === 'repaired').length,
    },
  ];

  const urgencyStats = [
    {
      level: 'critical',
      label: 'Critical',
      count: faults.filter((f) => f.urgency === 'critical').length,
      active: faults.filter((f) => f.urgency === 'critical' && f.status !== 'repaired').length,
      color: 'bg-red-500',
    },
    {
      level: 'high',
      label: 'High',
      count: faults.filter((f) => f.urgency === 'high').length,
      active: faults.filter((f) => f.urgency === 'high' && f.status !== 'repaired').length,
      color: 'bg-orange-500',
    },
    {
      level: 'medium',
      label: 'Medium',
      count: faults.filter((f) => f.urgency === 'medium').length,
      active: faults.filter((f) => f.urgency === 'medium' && f.status !== 'repaired').length,
      color: 'bg-yellow-500',
    },
    {
      level: 'low',
      label: 'Low',
      count: faults.filter((f) => f.urgency === 'low').length,
      active: faults.filter((f) => f.urgency === 'low' && f.status !== 'repaired').length,
      color: 'bg-green-500',
    },
  ];

  const villageStats = villages.map((village) => {
    const villageFaults = faults.filter((f) => f.villageId === village.id);
    return {
      ...village,
      totalFaults: villageFaults.length,
      activeFaults: villageFaults.filter((f) => f.status !== 'repaired').length,
      repairedFaults: villageFaults.filter((f) => f.status === 'repaired').length,
    };
  }).sort((a, b) => b.activeFaults - a.activeFaults);

  const technicianStats = technicians.map((tech) => {
    const techFaults = faults.filter((f) => f.assignedTechnicianId === tech.id);
    return {
      ...tech,
      totalAssigned: techFaults.length,
      completed: techFaults.filter((f) => f.status === 'repaired').length,
      active: techFaults.filter((f) => f.status !== 'repaired').length,
      completionRate:
        techFaults.length > 0
          ? Math.round((techFaults.filter((f) => f.status === 'repaired').length / techFaults.length) * 100)
          : 0,
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  const totalRepairRate = faults.length > 0 ? Math.round((repairedFaults.length / faults.length) * 100) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">System performance and fault statistics</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Faults</p>
                <p className="text-2xl font-bold">{faults.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Repair Rate</p>
                <p className="text-2xl font-bold">{totalRepairRate}%</p>
              </div>
              {totalRepairRate >= 50 ? (
                <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Issues</p>
                <p className="text-2xl font-bold">{pendingFaults.length + inProgressFaults.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{repairedFaults.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="urgency">Urgency</TabsTrigger>
          <TabsTrigger value="villages">Villages</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
        </TabsList>

        {/* Device Stats */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Faults by Device Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deviceStats.map((stat) => {
                const Icon = stat.icon;
                const percentage = faults.length > 0 ? Math.round((stat.total / faults.length) * 100) : 0;
                return (
                  <div key={stat.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{stat.total} total</Badge>
                        <Badge className="bg-amber-100 text-amber-800">{stat.pending} pending</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Urgency Stats */}
        <TabsContent value="urgency">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Faults by Urgency Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {urgencyStats.map((stat) => {
                const percentage = faults.length > 0 ? Math.round((stat.count / faults.length) * 100) : 0;
                return (
                  <div key={stat.level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${stat.color}`} />
                        <span className="font-medium capitalize">{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                        <Badge variant="secondary">{stat.count} total</Badge>
                        {stat.active > 0 && (
                          <Badge className="bg-amber-100 text-amber-800">{stat.active} active</Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color} rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Village Stats */}
        <TabsContent value="villages">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Faults by Village</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {villageStats.slice(0, 8).map((village) => (
                <div
                  key={village.id}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{village.name}</p>
                      <p className="text-xs text-muted-foreground">{village.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {village.activeFaults > 0 && (
                      <Badge className="bg-amber-100 text-amber-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {village.activeFaults}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {village.repairedFaults}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technician Stats */}
        <TabsContent value="technicians">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Technician Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {technicianStats.map((tech) => (
                <div key={tech.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">{tech.specialization}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">{tech.completionRate}%</span>
                      <Badge variant="secondary">{tech.completed}/{tech.totalAssigned}</Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${tech.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
