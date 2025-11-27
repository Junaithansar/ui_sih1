import { MissionArchive } from './types';

// Thresholds for alerts
export const THRESHOLDS = {
  HEART_RATE_HIGH: 140,
  HEART_RATE_CRITICAL: 170,
  SPO2_LOW: 92,
  SPO2_CRITICAL: 88,
  CO_PPM_WARNING: 50,
  CO_PPM_CRITICAL: 100,
  FATIGUE_WARNING: 75,
  TEMP_HIGH: 45, // Environment temp
};

export const MOCK_MEMBERS = [
  { id: 'NDRF-01', name: 'Mohan', role: 'Squad Leader' },
  { id: 'NDRF-02', name: 'Mari', role: 'Medic' },
  { id: 'NDRF-03', name: 'Junaith', role: 'Hazmat Spec' },
  { id: 'NDRF-04', name: 'Dakshin', role: 'Breacher' },
  { id: 'NDRF-05', name: 'Nithiin', role: 'Comms' },
  { id: 'NDRF-06', name: 'Kiruba Sree', role: 'Drone Pilot' },
];

export const MAX_HISTORY_POINTS = 20;

export const MOCK_MISSION_HISTORY: MissionArchive[] = [
  {
    id: 'OP-2023-001',
    codename: 'Operation Crimson Tide',
    location: 'Industrial Zone 4',
    date: '2023-11-15',
    duration: '4h 20m',
    outcome: 'SUCCESS',
    teamLeader: 'Mohan',
    casualties: 0,
    civiliansSaved: 12,
    reportSummary: 'Successful extraction of factory workers during chemical leak. Zero casualties.',
    efficiencyScore: 98
  },
  {
    id: 'OP-2023-014',
    codename: 'Operation Silent Echo',
    location: 'North Ridge Tunnel',
    date: '2023-12-02',
    duration: '1h 45m',
    outcome: 'ABORTED',
    teamLeader: 'Mohan',
    casualties: 0,
    civiliansSaved: 0,
    reportSummary: 'Mission aborted due to severe seismic instability. Team pulled back safely.',
    efficiencyScore: 50
  },
  {
    id: 'OP-2024-003',
    codename: 'Operation Firebird',
    location: 'Downtown Highrise',
    date: '2024-01-10',
    duration: '6h 10m',
    outcome: 'PARTIAL_SUCCESS',
    teamLeader: 'Mohan',
    casualties: 1,
    civiliansSaved: 45,
    reportSummary: 'Major structural fire. 45 saved, 1 casualty due to smoke inhalation. Team exhaustion high.',
    efficiencyScore: 78
  },
  {
    id: 'OP-2024-008',
    codename: 'Operation Deep Dive',
    location: 'Flood Zone B',
    date: '2024-02-28',
    duration: '8h 00m',
    outcome: 'FAILURE',
    teamLeader: 'Dakshin',
    casualties: 3,
    civiliansSaved: 2,
    reportSummary: 'Equipment failure led to inability to reach trapped victims before water levels peaked.',
    efficiencyScore: 35
  },
  {
    id: 'OP-2024-012',
    codename: 'Operation Iron Shield',
    location: 'Metro Station 5',
    date: '2024-03-15',
    duration: '3h 30m',
    outcome: 'SUCCESS',
    teamLeader: 'Mohan',
    casualties: 0,
    civiliansSaved: 150,
    reportSummary: 'Crowd control and evacuation during gas scare. executed perfectly.',
    efficiencyScore: 100
  },
  {
    id: 'OP-2024-015',
    codename: 'Operation Nightfall',
    location: 'Old Quarry',
    date: '2024-04-01',
    duration: '5h 15m',
    outcome: 'SUCCESS',
    teamLeader: 'Junaith',
    casualties: 0,
    civiliansSaved: 4,
    reportSummary: 'Extraction of hikers from ravine. Drone support (Kiruba Sree) was crucial.',
    efficiencyScore: 95
  }
];