'use client';

import { useState } from 'react';
import { villages, technicians, telanganaDistricts } from '@/lib/data';
import type { Village, FaultReport } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, AlertTriangle, User, Zap } from 'lucide-react';

interface TelanganaMapProps {
  faults?: FaultReport[];
  onVillageSelect?: (village: Village) => void;
  showTechnicians?: boolean;
}

export function TelanganaMap({ faults = [], onVillageSelect, showTechnicians = false }: TelanganaMapProps) {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const getVillageFaultCount = (villageId: string) => {
    return faults.filter((f) => f.villageId === villageId && f.status !== 'repaired').length;
  };

  const getMarkerColor = (villageId: string) => {
    const activeFaults = faults.filter(
      (f) => f.villageId === villageId && f.status !== 'repaired'
    );
    const criticalCount = activeFaults.filter((f) => f.urgency === 'critical').length;
    const highCount = activeFaults.filter((f) => f.urgency === 'high').length;

    if (criticalCount > 0) return 'bg-red-500';
    if (highCount > 0) return 'bg-orange-500';
    if (activeFaults.length > 0) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const handleVillageClick = (village: Village) => {
    setSelectedVillage(village);
    onVillageSelect?.(village);
  };

  const filteredVillages = selectedDistrict
    ? villages.filter((v) => v.district === selectedDistrict)
    : villages;

  const getTechnicianForVillage = (villageId: string) => {
    const village = villages.find((v) => v.id === villageId);
    if (village?.assignedTechnician) {
      return technicians.find((t) => t.id === village.assignedTechnician);
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* District Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDistrict === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDistrict(null)}
        >
          All Districts
        </Button>
        {telanganaDistricts.slice(0, 6).map((district) => (
          <Button
            key={district}
            variant={selectedDistrict === district ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDistrict(district)}
          >
            {district}
          </Button>
        ))}
      </div>

      {/* Map Container */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-0">
          {/* Simplified Map View - Interactive Village Grid */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 p-4 min-h-[400px]">
            {/* Map Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Telangana Village Map
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  No Issues
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  Critical
                </span>
              </div>
            </div>

            {/* Village Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredVillages.map((village) => {
                const faultCount = getVillageFaultCount(village.id);
                const isSelected = selectedVillage?.id === village.id;
                const technician = getTechnicianForVillage(village.id);

                return (
                  <button
                    key={village.id}
                    onClick={() => handleVillageClick(village)}
                    className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
                    }`}
                  >
                    {/* Status Indicator */}
                    <div
                      className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getMarkerColor(
                        village.id
                      )} ${faultCount > 0 ? 'animate-pulse' : ''}`}
                    />

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{village.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {village.mandal}
                        </p>
                      </div>
                    </div>

                    {faultCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {faultCount} {faultCount === 1 ? 'fault' : 'faults'}
                      </Badge>
                    )}

                    {showTechnicians && technician && (
                      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {technician.name.split(' ')[0]}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Village Details */}
      {selectedVillage && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{selectedVillage.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedVillage.mandal}, {selectedVillage.district}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={getMarkerColor(selectedVillage.id).replace('bg-', 'bg-opacity-20 text-')}
              >
                {getVillageFaultCount(selectedVillage.id)} active faults
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-muted-foreground">Coordinates</p>
                <p className="font-medium font-mono text-xs">
                  {selectedVillage.coordinates.lat.toFixed(4)},{' '}
                  {selectedVillage.coordinates.lng.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">District</p>
                <p className="font-medium">{selectedVillage.district}</p>
              </div>
            </div>

            {/* Assigned Technician */}
            {selectedVillage.assignedTechnician && (
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-2">Assigned Technician</p>
                {(() => {
                  const tech = technicians.find(
                    (t) => t.id === selectedVillage.assignedTechnician
                  );
                  if (!tech) return null;
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tech.name}</p>
                          <p className="text-xs text-muted-foreground">{tech.specialization}</p>
                        </div>
                      </div>
                      <a href={`tel:${tech.phone}`}>
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      </a>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Village Faults */}
            {faults.filter((f) => f.villageId === selectedVillage.id && f.status !== 'repaired')
              .length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Active Faults</p>
                <div className="space-y-2">
                  {faults
                    .filter((f) => f.villageId === selectedVillage.id && f.status !== 'repaired')
                    .slice(0, 3)
                    .map((fault) => (
                      <div
                        key={fault.id}
                        className="flex items-center justify-between p-2 bg-secondary/30 rounded"
                      >
                        <div>
                          <p className="text-sm capitalize">{fault.deviceType.replace('_', ' ')}</p>
                          <p className="text-xs text-muted-foreground">{fault.reporterName}</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            fault.urgency === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : fault.urgency === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-amber-100 text-amber-800'
                          }
                        >
                          {fault.urgency}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
