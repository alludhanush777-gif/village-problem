'use client';

import { useFaultStore } from '@/lib/store';
import { TelanganaMap } from '@/components/telangana-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { villages, technicians, telanganaDistricts } from '@/lib/data';
import { MapPin, Users, AlertTriangle } from 'lucide-react';

export default function VillagesPage() {
  const { faults } = useFaultStore();

  const districtsWithStats = telanganaDistricts.map((district) => {
    const districtVillages = villages.filter((v) => v.district === district);
    const districtFaults = faults.filter((f) =>
      districtVillages.some((v) => v.id === f.villageId)
    );
    const activeFaults = districtFaults.filter((f) => f.status !== 'repaired').length;

    return {
      name: district,
      villageCount: districtVillages.length,
      faultCount: activeFaults,
    };
  }).filter((d) => d.villageCount > 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Villages & Locations</h1>
        <p className="text-muted-foreground">
          View and manage village assignments across Telangana
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{villages.length}</p>
                <p className="text-xs text-muted-foreground">Total Villages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-full">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{technicians.length}</p>
                <p className="text-xs text-muted-foreground">Technicians</p>
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
                  {faults.filter((f) => f.status !== 'repaired').length}
                </p>
                <p className="text-xs text-muted-foreground">Active Faults</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <TelanganaMap faults={faults} showTechnicians />

      {/* Districts Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Districts Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {districtsWithStats.map((district) => (
              <div
                key={district.name}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div>
                  <p className="font-medium">{district.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {district.villageCount} villages
                  </p>
                </div>
                {district.faultCount > 0 && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded text-xs font-medium">
                    {district.faultCount} faults
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
