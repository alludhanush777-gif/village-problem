export type UserRole = 'reporter' | 'technician' | 'admin';

export type FaultStatus = 'pending' | 'in-progress' | 'repaired';

export type FaultUrgency = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  village?: string;
  assignedVillages?: string[];
  createdAt: Date;
}

export interface Village {
  id: string;
  name: string;
  district: string;
  mandal: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  assignedTechnician?: string;
}

export interface Device {
  id: string;
  type: 'solar_panel' | 'microgrid' | 'inverter' | 'battery' | 'transformer';
  villageId: string;
  installationDate: Date;
  status: 'active' | 'faulty' | 'maintenance';
}

export interface FaultReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterPhone: string;
  villageId: string;
  villageName: string;
  deviceType: Device['type'];
  description: string;
  imageUrl?: string;
  voiceNoteUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: FaultStatus;
  urgency: FaultUrgency;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceLog {
  id: string;
  faultReportId: string;
  technicianId: string;
  technicianName: string;
  notes: string;
  repairImages?: string[];
  partsReplaced?: string[];
  status: FaultStatus;
  createdAt: Date;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email?: string;
  assignedVillages: string[];
  specialization?: string;
  activeJobs: number;
  completedJobs: number;
}
