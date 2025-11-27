export interface Vitals {
  heartRate: number; // bpm
  spo2: number; // percentage
  fatigueLevel: number; // 0-100%
  bodyTemp: number; // Celsius
}

export interface Environment {
  carbonMonoxide: number; // ppm
  temperature: number; // Celsius
  smokeDensity: number; // percentage
  isSafe: boolean;
}

export enum MemberStatus {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  CRITICAL = 'CRITICAL',
  OFFLINE = 'OFFLINE'
}

export interface RescueMember {
  id: string;
  name: string;
  role: string;
  vitals: Vitals;
  environment: Environment;
  status: MemberStatus;
  lastUpdate: number;
  history: {
    time: string;
    heartRate: number;
    gas: number;
  }[];
}

export interface AIRiskAssessment {
  summary: string;
  immediateActions: string[];
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
}

export type MissionOutcome = 'SUCCESS' | 'FAILURE' | 'PARTIAL_SUCCESS' | 'ABORTED';

export interface MissionArchive {
  id: string;
  codename: string;
  location: string;
  date: string;
  duration: string;
  outcome: MissionOutcome;
  teamLeader: string;
  casualties: number;
  civiliansSaved: number;
  reportSummary: string;
  efficiencyScore: number; // 0-100
}