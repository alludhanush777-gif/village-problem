'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useFaultStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import type { FaultReport } from '@/lib/types';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Sun,
  Zap,
  Battery,
  Activity,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Phone,
} from 'lucide-react';

export default function FaultsPage() {
  const { user } = useAuth();
  const { faults, updateFaultStatus } = useFaultStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterDevice, setFilterDevice] = useState<string>('all');

  const myFaults = faults.filter((f) => f.assignedTechnicianId === (user?.id || 't1'));

  const filteredFaults = myFaults.filter((fault) => {
    const matchesSearch =
      fault.villageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fault.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fault.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = filterUrgency === 'all' || fault.urgency === filterUrgency;
    const matchesDevice = filterDevice === 'all' || fault.deviceType === filterDevice;
    return matchesSearch && matchesUrgency && matchesDevice;
  });

  const pendingFaults = filteredFaults.filter((f) => f.status === 'pending');
  const inProgressFaults = filteredFaults.filter((f) => f.status === 'in-progress');
  const repairedFaults = filteredFaults.filter((f) => f.status === 'repaired');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Wrench className="h-4 w-4" />;
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusUpdate = (faultId: string, newStatus: FaultReport['status']) => {
    updateFaultStatus(faultId, newStatus);
  };

  const FaultCard = ({ fault }: { fault: FaultReport }) => {
    const DeviceIcon = getDeviceIcon(fault.deviceType);
    return (
      <Card className="hover:shadow-md transition-shadow">
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
                <Badge variant="secondary" className={getUrgencyColor(fault.urgency)}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {fault.urgency}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {fault.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {fault.villageName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(fault.createdAt)}
                </span>
              </div>

              {/* Reporter Info */}
              <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-2">
                <div className="text-sm">
                  <p className="text-muted-foreground">Reported by</p>
                  <p className="font-medium">{fault.reporterName}</p>
                </div>
                <a href={`tel:${fault.reporterPhone}`}>
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {fault.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(fault.id, 'in-progress')}
                    className="flex-1"
                  >
                    <Wrench className="h-4 w-4 mr-1" />
                    Start Repair
                  </Button>
                )}
                {fault.status === 'in-progress' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(fault.id, 'repaired')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Repaired
                  </Button>
                )}
                <Link href={`/technician/faults/${fault.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
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
          <p className="text-muted-foreground">No faults found</p>
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
    <div className="p-4 space-y-4 pb-8">
      <h2 className="text-lg font-semibold">Fault Management</h2>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by village, description..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="flex-1">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDevice} onValueChange={setFilterDevice}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="solar_panel">Solar Panel</SelectItem>
              <SelectItem value="microgrid">Microgrid</SelectItem>
              <SelectItem value="inverter">Inverter</SelectItem>
              <SelectItem value="battery">Battery</SelectItem>
              <SelectItem value="transformer">Transformer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
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
    </div>
  );
}
