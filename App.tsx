
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout 
} from './components/Layout';
import { 
  DeviceSpecs 
} from './components/DeviceSpecs';
import { 
  GFXSettings, 
  HardwareProfile, 
  OptimizationResponse,
  Resolution,
  GraphicsQuality,
  FPSLimit,
  Style,
  MSAA
} from './types';
import { 
  Settings, 
  Cpu, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Sparkles,
  Download,
  Share2,
  Play
} from 'lucide-react';
import { getAIOptimization } from './services/gemini';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_SETTINGS: GFXSettings = {
  resolution: '1280x720',
  graphics: 'Smooth',
  fps: '60',
  style: 'Classic',
  msaa: 'Disabled',
  shadows: false,
  zeroLagMode: true,
  gpuOptimization: true,
  memoryBoost: true
};

const INITIAL_PROFILE: HardwareProfile = {
  cpu: 'Octa-core 3.2GHz',
  gpu: 'Adreno 730 / RTX 30 Series Mobile',
  ram: '12 GB',
  os: 'Android 14 / Windows 11',
  refreshRate: 120
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<GFXSettings>(INITIAL_SETTINGS);
  const [profile, setProfile] = useState<HardwareProfile>(INITIAL_PROFILE);
  const [aiResult, setAiResult] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'básico' | 'avançado' | 'ia'>('básico');

  // Performance simulation data
  const chartData = [
    { name: '0s', fps: 0 },
    { name: '10s', fps: aiResult ? aiResult.expectedPerformance.avgFps * 0.95 : settings.fps === '60' ? 58 : 28 },
    { name: '20s', fps: aiResult ? aiResult.expectedPerformance.avgFps : settings.fps === '60' ? 60 : 30 },
    { name: '30s', fps: aiResult ? aiResult.expectedPerformance.avgFps * 1.05 : settings.fps === '60' ? 59 : 29 },
    { name: '40s', fps: aiResult ? aiResult.expectedPerformance.avgFps : settings.fps === '60' ? 60 : 30 },
    { name: '50s', fps: aiResult ? aiResult.expectedPerformance.avgFps * 0.98 : settings.fps === '60' ? 58 : 28 },
    { name: '60s', fps: aiResult ? aiResult.expectedPerformance.avgFps : settings.fps === '60' ? 60 : 30 },
  ];

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const result = await getAIOptimization(profile);
      setAiResult(result);
      setSettings(result.recommendedSettings);
      setActiveTab('ia');
    } catch (error) {
      console.error("Optimization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = <K extends keyof GFXSettings>(key: K, value: GFXSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setAiResult(null); // Limpa o resultado da IA se as configurações forem ajustadas manualmente
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black font-orbitron neon-text">LAB <span className="text-cyan-400">GFX</span></h2>
              <p className="text-slate-400 text-sm">Configure seu motor para o máximo desempenho.</p>
            </div>
            <button 
              onClick={handleOptimize}
              disabled={loading}
              className="group relative px-6 py-3 bg-cyan-500 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              )}
              {loading ? 'ANALISANDO...' : 'OTIMIZAR COM IA'}
            </button>
          </div>

          <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {(['básico', 'avançado', 'ia'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs uppercase transition-all ${
                  activeTab === tab 
                    ? 'bg-slate-800 text-cyan-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 min-h-[400px]">
            {activeTab === 'básico' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <SettingRow 
                  label="Resolução" 
                  value={settings.resolution}
                  options={['960x540', '1280x720', '1600x900', '1920x1080', '2560x1440']}
                  onChange={(v) => updateSetting('resolution', v as Resolution)}
                />
                <SettingRow 
                  label="Qualidade Gráfica" 
                  value={settings.graphics}
                  options={['Smooth', 'Balanced', 'HD', 'HDR', 'Ultra HD']}
                  onChange={(v) => updateSetting('graphics', v as GraphicsQuality)}
                />
                <SettingRow 
                  label="Limite de FPS" 
                  value={settings.fps}
                  options={['30', '40', '60', '90', '120']}
                  onChange={(v) => updateSetting('fps', v as FPSLimit)}
                />
                <SettingRow 
                  label="Estilo de Cor" 
                  value={settings.style}
                  options={['Classic', 'Colorful', 'Realistic', 'Soft', 'Movie']}
                  onChange={(v) => updateSetting('style', v as Style)}
                />
              </div>
            )}

            {activeTab === 'avançado' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <ToggleRow 
                  label="Sombras de Hardware" 
                  description="Renderização de luz realista. Desativar economiza 15% da GPU."
                  value={settings.shadows}
                  onChange={(v) => updateSetting('shadows', v)}
                />
                <ToggleRow 
                  label="Modo Sem Lag" 
                  description="Otimiza arquivos de config e bloqueia processos em segundo plano."
                  value={settings.zeroLagMode}
                  onChange={(v) => updateSetting('zeroLagMode', v)}
                />
                <ToggleRow 
                  label="Aceleração de GPU" 
                  description="Habilita caminhos de renderização Vulkan/OpenGL otimizados."
                  value={settings.gpuOptimization}
                  onChange={(v) => updateSetting('gpuOptimization', v)}
                />
                <ToggleRow 
                  label="Acelerar Memória" 
                  description="Limpa o cache da RAM antes de iniciar o jogo."
                  value={settings.memoryBoost}
                  onChange={(v) => updateSetting('memoryBoost', v)}
                />
                <SettingRow 
                  label="Anti-Aliasing (MSAA)" 
                  value={settings.msaa}
                  options={['Disabled', '2x', '4x']}
                  onChange={(v) => updateSetting('msaa', v as MSAA)}
                />
              </div>
            )}

            {activeTab === 'ia' && (
              <div className="animate-in zoom-in-95 duration-300">
                {!aiResult ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Sparkles className="w-12 h-12 text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Sem recomendação da IA</h3>
                    <p className="text-slate-500 max-w-sm">Use o botão "Otimizar com IA" para gerar um perfil personalizado para o seu hardware.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                      <h4 className="text-cyan-400 font-bold mb-1 flex items-center gap-2 italic">
                        <Sparkles className="w-4 h-4" /> RECOMENDAÇÃO DO MOTOR
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{aiResult.explanation}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                        <div className="text-xs text-slate-500 mb-1">ESTABILIDADE</div>
                        <div className="text-xl font-black font-orbitron text-cyan-400">98.4%</div>
                      </div>
                      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                        <div className="text-xs text-slate-500 mb-1">ALVO DE FPS</div>
                        <div className="text-xl font-black font-orbitron text-cyan-400">{aiResult.expectedPerformance.avgFps} FPS</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                          <Flame className={`w-5 h-5 ${aiResult.expectedPerformance.thermalImpact === 'Low' ? 'text-green-400' : 'text-orange-400'}`} />
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase">Carga Térmica</div>
                            <div className="text-xs font-bold">{aiResult.expectedPerformance.thermalImpact}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                          <Trophy className="w-5 h-5 text-yellow-400" />
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase">Impacto na Bateria</div>
                            <div className="text-xs font-bold">{aiResult.expectedPerformance.batteryImpact}</div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Status */}
        <div className="lg:col-span-5 space-y-6">
          <DeviceSpecs profile={profile} />

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold font-orbitron flex items-center gap-2 mb-6 uppercase">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Desempenho Previsto
            </h2>
            
            <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorFps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 140]} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#22d3ee' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="fps" 
                    stroke="#06b6d4" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorFps)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">Status do Motor</span>
              </div>
              <span className="text-sm font-bold text-green-400">PRONTO</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl font-bold text-sm">
                 <Download className="w-4 h-4" /> EXPORTAR
               </button>
               <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl font-bold text-sm">
                 <Share2 className="w-4 h-4" /> COMPARTILHAR
               </button>
               <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors rounded-xl font-black font-orbitron text-lg shadow-xl shadow-cyan-500/10">
                 <Play className="w-5 h-5 fill-current" /> INICIAR JOGO
               </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper Components
interface SettingRowProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const SettingRow: React.FC<SettingRowProps> = ({ label, value, options, onChange }) => (
  <div className="space-y-3">
    <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            value === opt 
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
              : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (val: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 hover:bg-slate-800/20 transition-colors">
    <div className="flex-1">
      <div className="text-sm font-bold text-slate-200">{label}</div>
      <div className="text-xs text-slate-500 mt-0.5">{description}</div>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        value ? 'bg-cyan-500' : 'bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default App;
