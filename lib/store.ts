import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FaultReport, MaintenanceLog } from './types';
import { sampleFaultReports } from './data';

interface FaultStore {
  faults: FaultReport[];
  maintenanceLogs: MaintenanceLog[];
  addFault: (fault: Omit<FaultReport, 'id' | 'createdAt' | 'updatedAt'>) => FaultReport;
  updateFaultStatus: (faultId: string, status: FaultReport['status']) => void;
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id' | 'createdAt'>) => void;
  getFaultsByTechnician: (technicianId: string) => FaultReport[];
  getFaultsByReporter: (reporterId: string) => FaultReport[];
  getFaultsByVillage: (villageId: string) => FaultReport[];
  getPendingFaults: () => FaultReport[];
  getInProgressFaults: () => FaultReport[];
  getRepairedFaults: () => FaultReport[];
}

export const useFaultStore = create<FaultStore>()(
  persist(
    (set, get) => ({
      faults: sampleFaultReports,
      maintenanceLogs: [],

      addFault: (faultData) => {
        const newFault: FaultReport = {
          ...faultData,
          id: `f${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          faults: [newFault, ...state.faults],
        }));
        return newFault;
      },

      updateFaultStatus: (faultId, status) => {
        set((state) => ({
          faults: state.faults.map((f) =>
            f.id === faultId ? { ...f, status, updatedAt: new Date() } : f
          ),
        }));
      },

      addMaintenanceLog: (logData) => {
        const newLog: MaintenanceLog = {
          ...logData,
          id: `ml${Date.now()}`,
          createdAt: new Date(),
        };
        set((state) => ({
          maintenanceLogs: [newLog, ...state.maintenanceLogs],
        }));
      },

      getFaultsByTechnician: (technicianId) => {
        return get().faults.filter((f) => f.assignedTechnicianId === technicianId);
      },

      getFaultsByReporter: (reporterId) => {
        return get().faults.filter((f) => f.reporterId === reporterId);
      },

      getFaultsByVillage: (villageId) => {
        return get().faults.filter((f) => f.villageId === villageId);
      },

      getPendingFaults: () => {
        return get().faults.filter((f) => f.status === 'pending');
      },

      getInProgressFaults: () => {
        return get().faults.filter((f) => f.status === 'in-progress');
      },

      getRepairedFaults: () => {
        return get().faults.filter((f) => f.status === 'repaired');
      },
    }),
    {
      name: 'fault-store',
    }
  )
);
