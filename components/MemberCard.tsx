import React from 'react';
import { RescueMember, MemberStatus } from '../types';
import { THRESHOLDS } from '../constants';
import { LiveChart } from './LiveChart';
import { Activity, Wind, AlertTriangle, Battery, Thermometer } from 'lucide-react';

interface MemberCardProps {
  member: RescueMember;
  onAlert: (id: string, message: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onAlert }) => {
  
  // Helper to determine color based on status
  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case MemberStatus.SAFE: return 'border-emerald-500/50 bg-emerald-950/20';
      case MemberStatus.CAUTION: return 'border-amber-500/50 bg-amber-950/20';
      case MemberStatus.CRITICAL: return 'border-red-600 bg-red-950/40 animate-pulse-slow'; // Custom animation class if needed
      default: return 'border-gray-700 bg-gray-800';
    }
  };

  const getValueColor = (val: number, warn: number, crit: number, inverse = false) => {
    if (inverse) {
      if (val < crit) return 'text-red-500 font-bold';
      if (val < warn) return 'text-amber-500';
      return 'text-emerald-400';
    }
    if (val > crit) return 'text-red-500 font-bold';
    if (val > warn) return 'text-amber-500';
    return 'text-emerald-400';
  };

  return (
    <div className={`relative rounded-xl border-l-4 p-4 shadow-lg transition-all duration-300 bg-slate-900 ${getStatusColor(member.status)}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            {member.status === MemberStatus.CRITICAL && <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />}
            {member.name}
          </h3>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{member.role} | {member.id}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          member.status === MemberStatus.CRITICAL ? 'bg-red-600 text-white' : 
          member.status === MemberStatus.CAUTION ? 'bg-amber-600 text-black' : 
          'bg-emerald-600 text-white'
        }`}>
          {member.status}
        </span>
      </div>

      {/* Grid Layout for Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        
        {/* VITALS SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Activity className="w-4 h-4" /> HR
            </div>
            <span className={`text-xl font-mono ${getValueColor(member.vitals.heartRate, THRESHOLDS.HEART_RATE_HIGH, THRESHOLDS.HEART_RATE_CRITICAL)}`}>
              {member.vitals.heartRate} <span className="text-xs text-slate-500">bpm</span>
            </span>
          </div>
          
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Thermometer className="w-4 h-4" /> SpO2
            </div>
             <span className={`text-xl font-mono ${getValueColor(member.vitals.spo2, THRESHOLDS.SPO2_LOW, THRESHOLDS.SPO2_CRITICAL, true)}`}>
              {member.vitals.spo2}%
            </span>
          </div>

          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Battery className="w-4 h-4" /> Fatigue
            </div>
             <span className={`text-xl font-mono ${getValueColor(member.vitals.fatigueLevel, 60, 85)}`}>
              {member.vitals.fatigueLevel}%
            </span>
          </div>
        </div>

        {/* ENVIRONMENT SECTION */}
        <div className="space-y-3 pl-4 border-l border-slate-700">
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Wind className="w-4 h-4" /> CO Gas
            </div>
            <span className={`text-xl font-mono ${getValueColor(member.environment.carbonMonoxide, THRESHOLDS.CO_PPM_WARNING, THRESHOLDS.CO_PPM_CRITICAL)}`}>
              {member.environment.carbonMonoxide} <span className="text-xs text-slate-500">ppm</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Thermometer className="w-4 h-4" /> Env Temp
            </div>
            <span className={`text-xl font-mono ${getValueColor(member.environment.temperature, 40, 50)}`}>
              {member.environment.temperature}°C
            </span>
          </div>
        </div>
      </div>

      {/* Mini Charts */}
      <div className="grid grid-cols-2 gap-4 mt-2 opacity-70 hover:opacity-100 transition-opacity">
        <div>
           <p className="text-[10px] text-slate-500 mb-1">Heart Rate Trend</p>
           <LiveChart data={member.history} type="heartRate" color="#ef4444" />
        </div>
        <div>
           <p className="text-[10px] text-slate-500 mb-1">Gas Exp. Trend</p>
           <LiveChart data={member.history} type="gas" color="#f59e0b" />
        </div>
      </div>

      {member.status === MemberStatus.CRITICAL && (
        <button 
          onClick={() => onAlert(member.id, "Emergency Extraction Protocol Initiated")}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded animate-pulse"
        >
          INITIATE EXTRACTION
        </button>
      )}
    </div>
  );
};
