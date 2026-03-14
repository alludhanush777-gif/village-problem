'use client';

import { useAuth } from '@/lib/auth-context';
import { useFaultStore } from '@/lib/store';
import { TelanganaMap } from '@/components/telangana-map';

export default function MapPage() {
  const { user } = useAuth();
  const { faults } = useFaultStore();

  const myFaults = faults.filter((f) => f.assignedTechnicianId === (user?.id || 't1'));

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Village Map</h2>
      <p className="text-sm text-muted-foreground">
        View fault locations across your assigned villages
      </p>

      <TelanganaMap faults={myFaults} showTechnicians />
    </div>
  );
}
