import React from 'react';
import { MissionArchive, MissionOutcome } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Shield, Clock, Users, BarChart3, FileText, Calendar, Download } from 'lucide-react';

interface MissionHistoryProps {
  history: MissionArchive[];
}

export const MissionHistory: React.FC<MissionHistoryProps> = ({ history }) => {
  
  // Calculate Stats
  const totalOps = history.length;
  const successes = history.filter(m => m.outcome === 'SUCCESS').length;
  const failures = history.filter(m => m.outcome === 'FAILURE' || m.outcome === 'ABORTED').length;
  const partials = history.filter(m => m.outcome === 'PARTIAL_SUCCESS').length;
  const totalSaved = history.reduce((acc, m) => acc + m.civiliansSaved, 0);
  const successRate = Math.round((successes / totalOps) * 100);

  const getOutcomeColor = (outcome: MissionOutcome) => {
    switch (outcome) {
      case 'SUCCESS': return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30';
      case 'FAILURE': return 'text-red-400 border-red-500/50 bg-red-950/30';
      case 'ABORTED': return 'text-slate-400 border-slate-500/50 bg-slate-950/30';
      case 'PARTIAL_SUCCESS': return 'text-amber-400 border-amber-500/50 bg-amber-950/30';
      default: return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  const handleDownloadReport = (id: string, name: string) => {
    // Simulation
    alert(`Downloading Encrypted Mission Report for:\n${id} - ${name}\n\n[STATUS: COMPLETED]`);
  };

  const handleExportStats = () => {
    alert(`Exporting Monthly Analytics...\nGenerated CSV file.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Analytics Dashboard */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-200">Operation Analytics</h2>
        <button 
          onClick={handleExportStats}
          className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3 py-2 rounded-lg border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Missions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors shadow-lg">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Operations</h3>
          </div>
          <p className="text-4xl font-bold text-slate-100">{totalOps}</p>
          <div className="mt-2 text-xs text-slate-500 flex gap-2">
             <span className="text-emerald-400">{successes} Successful</span>
             <span>•</span>
             <span className="text-red-400">{failures} Flops</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-colors shadow-lg">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BarChart3 className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Success Rate</h3>
          </div>
          <p className="text-4xl font-bold text-slate-100">{successRate}%</p>
          <div className="w-full bg-slate-800 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${successRate}%` }}></div>
          </div>
        </div>

        {/* Civilians Saved */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-amber-500/50 transition-colors shadow-lg">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-amber-500/20 rounded-lg">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Lives Saved</h3>
          </div>
          <p className="text-4xl font-bold text-slate-100">{totalSaved}</p>
          <p className="mt-2 text-xs text-slate-500">Across {totalOps} critical missions</p>
        </div>
      </div>

      {/* Mission Dossier List */}
      <div>
        <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2 border-t border-slate-800 pt-8">
          <FileText className="w-5 h-5 text-indigo-400" /> Mission Archives
        </h2>
        
        <div className="space-y-4">
          {history.map((mission) => (
            <div 
              key={mission.id} 
              className={`border-l-4 rounded-r-xl p-6 bg-slate-900 border-slate-800 hover:bg-slate-800/50 transition-colors group ${getOutcomeColor(mission.outcome).replace('bg-', 'border-').split(' ')[1]}`}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                
                {/* Left: ID and Name */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getOutcomeColor(mission.outcome)}`}>
                      {mission.outcome.replace('_', ' ')}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{mission.codename}</h3>
                    <span className="text-xs text-slate-500 font-mono">{mission.id}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">{mission.reportSummary}</p>
                </div>

                {/* Middle: Details */}
                <div className="flex gap-6 text-sm text-slate-400">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase text-slate-500 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Date
                    </span>
                    {mission.date}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Duration
                    </span>
                    {mission.duration}
                  </div>
                   <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase text-slate-500 font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3" /> Saved
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">{mission.civiliansSaved}</span>
                  </div>
                </div>

                {/* Right: Score & Action */}
                <div className="flex flex-col items-end min-w-[120px] gap-3">
                   <div className="text-right">
                    <span className="text-xs uppercase text-slate-500 font-semibold">Efficiency</span>
                    <div className="text-2xl font-bold font-mono text-slate-200">
                        {mission.efficiencyScore}<span className="text-sm text-slate-500">/100</span>
                    </div>
                   </div>
                   <button 
                    onClick={() => handleDownloadReport(mission.id, mission.codename)}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-all"
                   >
                     <Download className="w-3 h-3" /> Report
                   </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};