import type { Village, Technician, FaultReport, User } from './types';

// Telangana Districts and Villages
export const telanganaDistricts = [
  'Hyderabad',
  'Rangareddy',
  'Medchal-Malkajgiri',
  'Sangareddy',
  'Medak',
  'Siddipet',
  'Karimnagar',
  'Warangal Urban',
  'Warangal Rural',
  'Khammam',
  'Nalgonda',
  'Mahabubnagar',
  'Nizamabad',
  'Adilabad',
  'Mancherial',
];

export const villages: Village[] = [
  {
    id: 'v1',
    name: 'Shamirpet',
    district: 'Medchal-Malkajgiri',
    mandal: 'Shamirpet',
    coordinates: { lat: 17.6174, lng: 78.5712 },
    assignedTechnician: 't1',
  },
  {
    id: 'v2',
    name: 'Keesara',
    district: 'Medchal-Malkajgiri',
    mandal: 'Keesara',
    coordinates: { lat: 17.5182, lng: 78.6227 },
    assignedTechnician: 't1',
  },
  {
    id: 'v3',
    name: 'Ghatkesar',
    district: 'Medchal-Malkajgiri',
    mandal: 'Ghatkesar',
    coordinates: { lat: 17.4504, lng: 78.6820 },
    assignedTechnician: 't2',
  },
  {
    id: 'v4',
    name: 'Pochampally',
    district: 'Nalgonda',
    mandal: 'Pochampally',
    coordinates: { lat: 17.3456, lng: 78.8234 },
    assignedTechnician: 't2',
  },
  {
    id: 'v5',
    name: 'Mulugu',
    district: 'Siddipet',
    mandal: 'Mulugu',
    coordinates: { lat: 18.1936, lng: 79.9419 },
    assignedTechnician: 't3',
  },
  {
    id: 'v6',
    name: 'Gajwel',
    district: 'Siddipet',
    mandal: 'Gajwel',
    coordinates: { lat: 17.8553, lng: 78.6827 },
    assignedTechnician: 't3',
  },
  {
    id: 'v7',
    name: 'Huzurabad',
    district: 'Karimnagar',
    mandal: 'Huzurabad',
    coordinates: { lat: 18.1145, lng: 79.3993 },
    assignedTechnician: 't4',
  },
  {
    id: 'v8',
    name: 'Jammikunta',
    district: 'Karimnagar',
    mandal: 'Jammikunta',
    coordinates: { lat: 18.2835, lng: 79.4648 },
    assignedTechnician: 't4',
  },
  {
    id: 'v9',
    name: 'Parkal',
    district: 'Warangal Rural',
    mandal: 'Parkal',
    coordinates: { lat: 18.2197, lng: 79.6962 },
    assignedTechnician: 't5',
  },
  {
    id: 'v10',
    name: 'Narsampet',
    district: 'Warangal Rural',
    mandal: 'Narsampet',
    coordinates: { lat: 17.9309, lng: 79.8939 },
    assignedTechnician: 't5',
  },
  {
    id: 'v11',
    name: 'Bhadrachalam',
    district: 'Khammam',
    mandal: 'Bhadrachalam',
    coordinates: { lat: 17.6688, lng: 80.8936 },
    assignedTechnician: 't6',
  },
  {
    id: 'v12',
    name: 'Kothagudem',
    district: 'Khammam',
    mandal: 'Kothagudem',
    coordinates: { lat: 17.5563, lng: 80.6163 },
    assignedTechnician: 't6',
  },
];

export const technicians: Technician[] = [
  {
    id: 't1',
    name: 'Naveena Sandhi',
    phone: '+91 9847123456',
    email: 'naveena.sandhi@energy.gov.in',
    assignedVillages: ['v1', 'v2'],
    specialization: 'Solar Panels',
    activeJobs: 3,
    completedJobs: 45,
  },
  {
    id: 't2',
    name: 'Ravi Kumar Reddy',
    phone: '+91 9876543210',
    email: 'ravi.kumar@energy.gov.in',
    assignedVillages: ['v3', 'v4'],
    specialization: 'Microgrids',
    activeJobs: 2,
    completedJobs: 38,
  },
  {
    id: 't3',
    name: 'Venkat Naidu',
    phone: '+91 9988776655',
    email: 'venkat.naidu@energy.gov.in',
    assignedVillages: ['v5', 'v6'],
    specialization: 'Inverters',
    activeJobs: 4,
    completedJobs: 52,
  },
  {
    id: 't4',
    name: 'Srinivas Goud',
    phone: '+91 9123456789',
    email: 'srinivas.goud@energy.gov.in',
    assignedVillages: ['v7', 'v8'],
    specialization: 'Batteries',
    activeJobs: 1,
    completedJobs: 29,
  },
  {
    id: 't5',
    name: 'Prasad Rao',
    phone: '+91 9456789123',
    email: 'prasad.rao@energy.gov.in',
    assignedVillages: ['v9', 'v10'],
    specialization: 'Solar Panels',
    activeJobs: 5,
    completedJobs: 61,
  },
  {
    id: 't6',
    name: 'Lakshmi Devi',
    phone: '+91 9321654987',
    email: 'lakshmi.devi@energy.gov.in',
    assignedVillages: ['v11', 'v12'],
    specialization: 'Transformers',
    activeJobs: 2,
    completedJobs: 33,
  },
];

export const sampleUsers: User[] = [
  {
    id: 'u1',
    name: 'Jyothsna',
    phone: '+91 9876543210',
    email: 'jyothsna@gmail.com',
    role: 'reporter',
    village: 'v1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'u2',
    name: 'Ramesh',
    phone: '+91 9887766554',
    role: 'reporter',
    village: 'v3',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'u3',
    name: 'Suresh',
    phone: '+91 9776655443',
    role: 'reporter',
    village: 'v5',
    createdAt: new Date('2024-03-10'),
  },
];

export const sampleFaultReports: FaultReport[] = [
  {
    id: 'f1',
    reporterId: 'u1',
    reporterName: 'Jyothsna',
    reporterPhone: '+91 9876543210',
    villageId: 'v1',
    villageName: 'Shamirpet',
    deviceType: 'solar_panel',
    description: 'Solar panel not generating power since morning. Display shows zero output.',
    status: 'pending',
    urgency: 'high',
    assignedTechnicianId: 't1',
    assignedTechnicianName: 'Naveena Sandhi',
    coordinates: { lat: 17.6174, lng: 78.5712 },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'f2',
    reporterId: 'u2',
    reporterName: 'Ramesh',
    reporterPhone: '+91 9887766554',
    villageId: 'v3',
    villageName: 'Ghatkesar',
    deviceType: 'inverter',
    description: 'Inverter making unusual buzzing sound and overheating.',
    status: 'in-progress',
    urgency: 'critical',
    assignedTechnicianId: 't2',
    assignedTechnicianName: 'Ravi Kumar Reddy',
    coordinates: { lat: 17.4504, lng: 78.6820 },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'f3',
    reporterId: 'u3',
    reporterName: 'Suresh',
    reporterPhone: '+91 9776655443',
    villageId: 'v5',
    villageName: 'Mulugu',
    deviceType: 'battery',
    description: 'Battery not holding charge. Drains completely within 2 hours.',
    status: 'pending',
    urgency: 'medium',
    assignedTechnicianId: 't3',
    assignedTechnicianName: 'Venkat Naidu',
    coordinates: { lat: 18.1936, lng: 79.9419 },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'f4',
    reporterId: 'u1',
    reporterName: 'Jyothsna',
    reporterPhone: '+91 9876543210',
    villageId: 'v1',
    villageName: 'Shamirpet',
    deviceType: 'microgrid',
    description: 'Microgrid connection issue affecting entire village.',
    status: 'repaired',
    urgency: 'critical',
    assignedTechnicianId: 't1',
    assignedTechnicianName: 'Naveena Sandhi',
    coordinates: { lat: 17.6174, lng: 78.5712 },
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: 'f5',
    reporterId: 'u2',
    reporterName: 'Ramesh',
    reporterPhone: '+91 9887766554',
    villageId: 'v4',
    villageName: 'Pochampally',
    deviceType: 'transformer',
    description: 'Transformer tripping frequently during peak hours.',
    status: 'pending',
    urgency: 'high',
    assignedTechnicianId: 't2',
    assignedTechnicianName: 'Ravi Kumar Reddy',
    coordinates: { lat: 17.3456, lng: 78.8234 },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

export function getVillageById(id: string): Village | undefined {
  return villages.find((v) => v.id === id);
}

export function getTechnicianById(id: string): Technician | undefined {
  return technicians.find((t) => t.id === id);
}

export function getTechnicianByVillage(villageId: string): Technician | undefined {
  const village = getVillageById(villageId);
  if (village?.assignedTechnician) {
    return getTechnicianById(village.assignedTechnician);
  }
  return undefined;
}

export function getFaultsByTechnician(technicianId: string): FaultReport[] {
  return sampleFaultReports.filter((f) => f.assignedTechnicianId === technicianId);
}

export function getFaultsByReporter(reporterId: string): FaultReport[] {
  return sampleFaultReports.filter((f) => f.reporterId === reporterId);
}
