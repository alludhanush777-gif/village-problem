'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useFaultStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FaultReport } from '@/lib/types';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Sun,
  Zap,
  Battery,
  Activity,
  MapPin,
  Phone,
  Calendar,
} from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const { faults } = useFaultStore();
  const [selectedFault, setSelectedFault] = useState<FaultReport | null>(null);

  const myFaults = faults.filter((f) => f.reporterId === user?.id);
  const pendingFaults = myFaults.filter((f) => f.status === 'pending');
  const inProgressFaults = myFaults.filter((f) => f.status === 'in-progress');
  const repairedFaults = myFaults.filter((f) => f.status === 'repaired');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertTriangle className="h-4 w-4" />;
      case 'repaired':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const FaultCard = ({ fault }: { fault: FaultReport }) => {
    const DeviceIcon = getDeviceIcon(fault.deviceType);
    return (
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedFault(fault)}
      >
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DeviceIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-medium capitalize">{fault.deviceType.replace('_', ' ')}</p>
                <Badge variant="secondary" className={getStatusColor(fault.status)}>
                  {getStatusIcon(fault.status)}
                  <span className="ml-1 capitalize">{fault.status}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {fault.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {fault.villageName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(fault.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const FaultList = ({ faults }: { faults: FaultReport[] }) => {
    if (faults.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No fault reports in this category</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {faults.map((fault) => (
          <FaultCard key={fault.id} fault={fault} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Fault History</h2>
      <p className="text-sm text-muted-foreground">
        Track the status of your reported faults
      </p>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all" className="text-xs">
            All ({myFaults.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            Pending ({pendingFaults.length})
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-xs">
            In Progress ({inProgressFaults.length})
          </TabsTrigger>
          <TabsTrigger value="repaired" className="text-xs">
            Repaired ({repairedFaults.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <FaultList faults={myFaults} />
        </TabsContent>
        <TabsContent value="pending">
          <FaultList faults={pendingFaults} />
        </TabsContent>
        <TabsContent value="progress">
          <FaultList faults={inProgressFaults} />
        </TabsContent>
        <TabsContent value="repaired">
          <FaultList faults={repairedFaults} />
        </TabsContent>
      </Tabs>

      {/* Fault Detail Dialog */}
      <Dialog open={!!selectedFault} onOpenChange={() => setSelectedFault(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFault && (
                <>
                  {(() => {
                    const DeviceIcon = getDeviceIcon(selectedFault.deviceType);
                    return <DeviceIcon className="h-5 w-5 text-primary" />;
                  })()}
                  <span className="capitalize">{selectedFault?.deviceType.replace('_', ' ')} Fault</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedFault && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="secondary" className={getStatusColor(selectedFault.status)}>
                  {getStatusIcon(selectedFault.status)}
                  <span className="ml-1 capitalize">{selectedFault.status}</span>
                </Badge>
                <Badge variant="secondary" className={getUrgencyColor(selectedFault.urgency)}>
                  {selectedFault.urgency} priority
                </Badge>
              </div>

              {selectedFault.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedFault.imageUrl}
                  alt="Fault"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              <div className="space-y-2">
                <p className="font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{selectedFault.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Village</p>
                  <p className="font-medium">{selectedFault.villageName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reported</p>
                  <p className="font-medium">{formatDate(selectedFault.createdAt)}</p>
                </div>
              </div>

              {selectedFault.assignedTechnicianName && (
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Assigned Technician</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{selectedFault.assignedTechnicianName}</p>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`tel:${selectedFault.reporterPhone}`}>
                        <Phone className="mr-1 h-3 w-3" />
                        Call
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
