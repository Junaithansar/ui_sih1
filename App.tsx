import React, { useState, useEffect } from 'react';
import { Shield, Brain, Activity, Siren, Users, RefreshCw, Radio, FileText, LayoutDashboard, Share2 } from 'lucide-react';
import { RescueMember, MemberStatus, AIRiskAssessment } from './types';
import { MOCK_MEMBERS, THRESHOLDS, MAX_HISTORY_POINTS, MOCK_MISSION_HISTORY } from './constants';
import { MemberCard } from './components/MemberCard';
import { MissionHistory } from './components/MissionHistory';
import { analyzeTeamRisk } from './services/geminiService';

// Helper to generate realistic drift
const drift = (current: number, min: number, max: number, volatility: number) => {
  const change = (Math.random() - 0.5) * volatility;
  let next = current + change;
  return Math.max(min, Math.min(max, next));
};

const App: React.FC = () => {
  const [view, setView] = useState<'live' | 'history'>('live');

  const [team, setTeam] = useState<RescueMember[]>(() => {
    // Initial State
    return MOCK_MEMBERS.map(m => ({
      ...m,
      vitals: { heartRate: 75, spo2: 98, fatigueLevel: 10, bodyTemp: 36.5 },
      environment: { carbonMonoxide: 5, temperature: 28, smokeDensity: 0, isSafe: true },
      status: MemberStatus.SAFE,
      lastUpdate: Date.now(),
      history: Array(MAX_HISTORY_POINTS).fill({ time: '', heartRate: 75, gas: 5 })
    }));
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIRiskAssessment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [simulationActive, setSimulationActive] = useState(true);
  const [globalAlert, setGlobalAlert] = useState<string | null>(null);

  // Simulation Loop
  useEffect(() => {
    if (!simulationActive || view === 'history') return;

    const interval = setInterval(() => {
      setTeam(prevTeam => {
        return prevTeam.map(member => {
          // 1. Simulate environmental changes (Drift)
          // Introduce occasional "Hazards" based on random chance
          const hazardChance = Math.random();
          let gasSpike = 0;
          let tempSpike = 0;

          // Simulate specific member entering danger zone
          // Hazmat specialist (Junaith) often finds gas leaks first
          if (member.role === 'Hazmat Spec' && Math.random() > 0.95) gasSpike = 15; 

          const newCO = drift(member.environment.carbonMonoxide + gasSpike, 0, 200, 2);
          const newTemp = drift(member.environment.temperature + tempSpike, 20, 60, 0.5);

          // 2. Simulate Vitals based on Environment + Stress
          let heartRateTarget = 75;
          if (newCO > 30) heartRateTarget += 30; // Stress response
          if (newTemp > 40) heartRateTarget += 20; // Heat stress
          
          const newHR = drift(member.vitals.heartRate, 50, 200, 3 + (heartRateTarget - member.vitals.heartRate) * 0.1);
          
          // SpO2 drops if gas is high
          const spo2Target = newCO > 60 ? 85 : 98;
          const newSpo2 = drift(member.vitals.spo2, 70, 100, 1 + (spo2Target - member.vitals.spo2) * 0.1);

          // Fatigue increases over time, faster in bad conditions
          const fatigueRate = (newCO > 40 || newTemp > 40) ? 0.5 : 0.05;
          const newFatigue = Math.min(100, member.vitals.fatigueLevel + fatigueRate);

          // 3. Determine Status
          let status = MemberStatus.SAFE;
          if (newCO > THRESHOLDS.CO_PPM_CRITICAL || newHR > THRESHOLDS.HEART_RATE_CRITICAL || newSpo2 < THRESHOLDS.SPO2_CRITICAL) {
            status = MemberStatus.CRITICAL;
          } else if (newCO > THRESHOLDS.CO_PPM_WARNING || newHR > THRESHOLDS.HEART_RATE_HIGH || newSpo2 < THRESHOLDS.SPO2_LOW) {
            status = MemberStatus.CAUTION;
          }

          // 4. Update History
          const now = new Date();
          const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
          const newHistoryPoint = { time: timeString, heartRate: Math.round(newHR), gas: Math.round(newCO) };
          const updatedHistory = [...member.history.slice(1), newHistoryPoint];

          return {
            ...member,
            vitals: {
              heartRate: Math.round(newHR),
              spo2: Math.round(newSpo2),
              fatigueLevel: Math.round(newFatigue),
              bodyTemp: parseFloat(newTemp.toFixed(1))
            },
            environment: {
              carbonMonoxide: Math.round(newCO),
              temperature: Math.round(newTemp),
              smokeDensity: Math.round(newCO / 2),
              isSafe: status === MemberStatus.SAFE
            },
            status,
            lastUpdate: Date.now(),
            history: updatedHistory
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simulationActive, view]);

  // AI Analysis Handler
  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const assessment = await analyzeTeamRisk(team);
    setAiAnalysis(assessment);
    setIsAnalyzing(false);
  };

  const handleManualAlert = (id: string, msg: string) => {
    setGlobalAlert(`ALERT SENT TO ${id}: ${msg}`);
    setTimeout(() => setGlobalAlert(null), 5000);
  };

  const handleShareLink = () => {
    alert("SECURE LINK GENERATED:\n\nhttps://ndrf-sentinel.gov/ops/live/firebird-alpha\n\nLink copied to clipboard for Supervisor access.");
  };

  // Calculate Aggregates
  const criticalCount = team.filter(m => m.status === MemberStatus.CRITICAL).length;
  const cautionCount = team.filter(m => m.status === MemberStatus.CAUTION).length;
  const avgGas = Math.round(team.reduce((acc, m) => acc + m.environment.carbonMonoxide, 0) / team.length);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col xl:flex-row justify-between items-center mb-8 border-b border-slate-800 pb-6 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-orange-600 rounded-lg shadow-lg shadow-orange-900/50">
             <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">NDRF SENTINEL COMMAND</h1>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${view === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
              {view === 'live' ? 'LIVE TELEMETRY FEED' : 'MISSION ARCHIVES'} - TEAM ALPHA
            </p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end w-full md:w-auto">
           
           <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button 
              onClick={() => setView('live')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                view === 'live' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Live Monitor
            </button>
            <button 
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                view === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" /> Archives
            </button>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden md:block"></div>

          <div className="flex gap-2">
             <button 
                onClick={handleShareLink}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-indigo-300 font-semibold transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Secure Link</span>
              </button>

            {view === 'live' && (
              <>
                <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-center hidden md:block min-w-[100px]">
                  <span className="text-xs text-slate-500 block uppercase">Avg Gas</span>
                  <span className={`text-xl font-bold ${avgGas > 50 ? 'text-red-500' : 'text-slate-200'}`}>{avgGas} ppm</span>
                </div>
                <button 
                  onClick={() => setSimulationActive(!simulationActive)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                  title={simulationActive ? "Pause Simulation" : "Resume Simulation"}
                >
                  {simulationActive ? <Radio className="w-5 h-5 text-emerald-400 animate-pulse" /> : <RefreshCw className="w-5 h-5 text-slate-400" />}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* VIEW CONTENT */}
      {view === 'live' ? (
        <>
          {/* ALERT BANNER */}
          {(globalAlert || criticalCount > 0) && (
            <div className="mb-6 bg-red-950/50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <Siren className="w-8 h-8 text-red-500 animate-bounce" />
              <div>
                <h3 className="font-bold text-red-200">CRITICAL SITUATION DETECTED</h3>
                <p className="text-red-300/80 text-sm">
                  {globalAlert ? globalAlert : `${criticalCount} operative(s) in critical condition. Immediate supervisor intervention required.`}
                </p>
              </div>
            </div>
          )}

          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* MAIN GRID - SQUAD CARDS */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {team.map(member => (
                <MemberCard key={member.id} member={member} onAlert={handleManualAlert} />
              ))}
            </div>

            {/* SIDEBAR - AI & SUMMARY */}
            <div className="space-y-6">
              
              {/* AI ADVISOR PANEL */}
              <div className="bg-slate-900 rounded-xl border border-indigo-500/30 overflow-hidden shadow-lg shadow-indigo-900/20">
                <div className="bg-indigo-950/50 p-4 border-b border-indigo-900 flex justify-between items-center">
                  <h2 className="font-bold flex items-center gap-2 text-indigo-300">
                    <Brain className="w-5 h-5" /> Gemini Tactical AI
                  </h2>
                  <button 
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    className={`text-xs px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-all ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isAnalyzing ? 'ANALYZING...' : 'RUN SCAN'}
                  </button>
                </div>
                
                <div className="p-4 min-h-[200px]">
                  {aiAnalysis ? (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 uppercase">Risk Level</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold 
                            ${aiAnalysis.riskLevel === 'EXTREME' ? 'bg-red-600' : 
                              aiAnalysis.riskLevel === 'HIGH' ? 'bg-orange-600' :
                              aiAnalysis.riskLevel === 'MODERATE' ? 'bg-yellow-600' : 'bg-emerald-600'}`}>
                            {aiAnalysis.riskLevel}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-1">Situation Summary</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{aiAnalysis.summary}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Recommended Actions</h4>
                        <ul className="space-y-2">
                          {aiAnalysis.immediateActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-indigo-200 bg-indigo-950/30 p-2 rounded">
                              <span className="text-indigo-500 font-bold">›</span> {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 py-8">
                      <Activity className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm text-center">System operational.<br/>Run AI scan for tactical analysis.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* LEGEND / STATUS SUMMARY */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Squad Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded bg-emerald-950/30 border border-emerald-900/50">
                    <span className="text-sm text-emerald-400">Safe</span>
                    <span className="font-mono font-bold text-emerald-300">{team.length - cautionCount - criticalCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-amber-950/30 border border-amber-900/50">
                    <span className="text-sm text-amber-400">Caution</span>
                    <span className="font-mono font-bold text-amber-300">{cautionCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-red-950/30 border border-red-900/50">
                    <span className="text-sm text-red-400">Critical</span>
                    <span className="font-mono font-bold text-red-300">{criticalCount}</span>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </>
      ) : (
        <MissionHistory history={MOCK_MISSION_HISTORY} />
      )}
    </div>
  );
};

export default App;