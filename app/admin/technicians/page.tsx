'use client';

import { useState } from 'react';
import { technicians, villages } from '@/lib/data';
import { useFaultStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Technician } from '@/lib/types';
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Zap,
  CheckCircle,
  AlertTriangle,
  Users,
} from 'lucide-react';

export default function TechniciansPage() {
  const { faults } = useFaultStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTechnicianFaults = (techId: string) => {
    return faults.filter((f) => f.assignedTechnicianId === techId);
  };

  const getTechnicianVillages = (techId: string) => {
    const tech = technicians.find((t) => t.id === techId);
    if (!tech) return [];
    return villages.filter((v) => tech.assignedVillages.includes(v.id));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Technicians</h1>
        <p className="text-muted-foreground">Manage and monitor technician assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{technicians.length}</p>
                <p className="text-xs text-muted-foreground">Total Technicians</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {technicians.reduce((sum, t) => sum + t.activeJobs, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {technicians.reduce((sum, t) => sum + t.completedJobs, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{villages.length}</p>
                <p className="text-xs text-muted-foreground">Villages Covered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search technicians..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Technician Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechnicians.map((tech) => {
          const techFaults = getTechnicianFaults(tech.id);
          const activeFaults = techFaults.filter((f) => f.status !== 'repaired').length;

          return (
            <Card
              key={tech.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTechnician(tech)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{tech.name}</p>
                      {activeFaults > 0 && (
                        <Badge className="bg-amber-100 text-amber-800">
                          {activeFaults} active
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="mb-2">
                      {tech.specialization}
                    </Badge>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{tech.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{tech.assignedVillages.length} villages</span>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-3 pt-3 border-t">
                      <div className="text-center">
                        <p className="font-bold text-lg">{tech.completedJobs}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg">{tech.activeJobs}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Technician Detail Dialog */}
      <Dialog open={!!selectedTechnician} onOpenChange={() => setSelectedTechnician(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Technician Details</DialogTitle>
          </DialogHeader>
          {selectedTechnician && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedTechnician.name}</p>
                  <Badge variant="outline">{selectedTechnician.specialization}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTechnician.phone}</span>
                  <Button size="sm" variant="outline" asChild className="ml-auto">
                    <a href={`tel:${selectedTechnician.phone}`}>Call</a>
                  </Button>
                </div>
                {selectedTechnician.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedTechnician.email}</span>
                  </div>
                )}
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Assigned Villages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {getTechnicianVillages(selectedTechnician.id).map((village) => (
                    <div
                      key={village.id}
                      className="flex items-center justify-between p-2 bg-secondary/30 rounded"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {selectedTechnician.completedJobs}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed Jobs</p>
                </div>
                <div className="text-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                    {selectedTechnician.activeJobs}
                  </p>
                  <p className="text-xs text-muted-foreground">Active Jobs</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
