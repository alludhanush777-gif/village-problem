'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useFaultStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Sun,
  Zap,
  Battery,
  Activity,
  Wrench,
  Camera,
  FileText,
  User,
} from 'lucide-react';

export default function FaultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { faults, updateFaultStatus, addMaintenanceLog } = useFaultStore();
  const [repairNotes, setRepairNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resolvedParams = use(params);

  const fault = faults.find((f) => f.id === resolvedParams.id);

  if (!fault) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Fault not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

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

  const DeviceIcon = getDeviceIcon(fault.deviceType);

  const handleStartRepair = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    updateFaultStatus(fault.id, 'in-progress');
    setIsSubmitting(false);
  };

  const handleCompleteRepair = async () => {
    if (!repairNotes.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    
    addMaintenanceLog({
      faultReportId: fault.id,
      technicianId: fault.assignedTechnicianId || '',
      technicianName: fault.assignedTechnicianName || '',
      notes: repairNotes,
      status: 'repaired',
    });
    
    updateFaultStatus(fault.id, 'repaired');
    setIsSubmitting(false);
    router.push('/technician/faults');
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Fault Details</h2>
          <p className="text-xs text-muted-foreground">ID: {fault.id}</p>
        </div>
      </div>

      {/* Status & Urgency */}
      <div className="flex gap-2">
        <Badge variant="secondary" className={getStatusColor(fault.status)}>
          {fault.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
          {fault.status === 'in-progress' && <Wrench className="h-3 w-3 mr-1" />}
          {fault.status === 'repaired' && <CheckCircle className="h-3 w-3 mr-1" />}
          <span className="capitalize">{fault.status}</span>
        </Badge>
        <Badge variant="secondary" className={getUrgencyColor(fault.urgency)}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          {fault.urgency} priority
        </Badge>
      </div>

      {/* Device Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DeviceIcon className="h-4 w-4 text-primary" />
            Device Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Device Type</p>
              <p className="font-medium capitalize">{fault.deviceType.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Village</p>
              <p className="font-medium">{fault.villageName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reported On</p>
              <p className="font-medium text-sm">{formatDate(fault.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="font-medium text-sm">{formatDate(fault.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fault Image */}
      {fault.imageUrl && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              Fault Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fault.imageUrl}
              alt="Fault"
              className="w-full h-48 object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Description */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{fault.description}</p>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{fault.villageName}</p>
          {fault.coordinates && (
            <p className="text-sm text-muted-foreground font-mono">
              {fault.coordinates.lat.toFixed(4)}, {fault.coordinates.lng.toFixed(4)}
            </p>
          )}
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <a
              href={`https://www.google.com/maps?q=${fault.coordinates?.lat},${fault.coordinates?.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Maps
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Reporter Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Reporter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{fault.reporterName}</p>
              <p className="text-sm text-muted-foreground">{fault.reporterPhone}</p>
            </div>
            <a href={`tel:${fault.reporterPhone}`}>
              <Button size="sm">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Repair Actions */}
      {fault.status !== 'repaired' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              Repair Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fault.status === 'pending' && (
              <Button
                className="w-full"
                onClick={handleStartRepair}
                disabled={isSubmitting}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Start Repair Work
              </Button>
            )}

            {fault.status === 'in-progress' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="notes">Repair Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Describe the repair work done, parts replaced, etc."
                    rows={4}
                    value={repairNotes}
                    onChange={(e) => setRepairNotes(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleCompleteRepair}
                  disabled={isSubmitting || !repairNotes.trim()}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Repaired
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Repair Complete Message */}
      {fault.status === 'repaired' && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Repair Completed</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              This fault has been marked as repaired on {formatDate(fault.updatedAt)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
