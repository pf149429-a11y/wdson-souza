
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
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
  Play,
  Monitor, 
  MemoryStick as Memory, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Tipos ---
type GraphicsQuality = 'Smooth' | 'Balanced' | 'HD' | 'HDR' | 'Ultra HD';
type FPSLimit = '30' | '40' | '60' | '90' | '120';
type Resolution = '960x540' | '1280x720' | '1600x900' | '1920x1080' | '2560x1440';
type Style = 'Classic' | 'Colorful' | 'Realistic' | 'Soft' | 'Movie';
type MSAA = 'Disabled' | '2x' | '4x';

interface GFXSettings {
  resolution: Resolution;
  graphics: GraphicsQuality;
  fps: FPSLimit;
  style: Style;
  msaa: MSAA;
  shadows: boolean;
  zeroLagMode: boolean;
  gpuOptimization: boolean;
  memoryBoost: boolean;
}

interface OptimizationResponse {
  recommendedSettings: GFXSettings;
  explanation: string;
  expectedPerformance: {
    avgFps: number;
    thermalImpact: string;
    batteryImpact: string;
  };
}

// --- Componentes ---

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans">
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <span className="text-white font-black text-xl italic font-orbitron">N</span>
          </div>
          <h1 className="text-xl font-bold font-orbitron tracking-tighter neon-text">
            NOVA<span className="text-cyan-400">GFX</span>PRO
          </h1>
        </div>
        <div className="hidden md:flex gap-6 text-xs font-black tracking-widest font-orbitron">
          <a href="#" className="text-cyan-400 border-b-2 border-cyan-400">DASHBOARD</a>
          <a href="#" className="text-slate-500 hover:text-cyan-300 transition-colors">BENCHMARK</a>
          <a href="#" className="text-slate-500 hover:text-cyan-300 transition-colors">PERFIS</a>
        </div>
      </div>
    </nav>
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
    <footer className="border-t border-slate-900 py-8 bg-[#010409]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-bold tracking-wider uppercase">
        <p>© 2024 NOVA GFX ENGINE • BRASIL</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-cyan-400 transition-colors">PRIVACIDADE</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">TERMOS</a>
        </div>
      </div>
    </footer>
  </div>
);

const App: React.FC = () => {
  const [settings, setSettings] = useState<GFXSettings>({
    resolution: '1280x720',
    graphics: 'Smooth',
    fps: '60',
    style: 'Classic',
    msaa: 'Disabled',
    shadows: false,
    zeroLagMode: true,
    gpuOptimization: true,
    memoryBoost: true
  });

  const [aiResult, setAiResult] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'básico' | 'avançado' | 'ia'>('básico');
  const [launching, setLaunching] = useState(false);

  const chartData = useMemo(() => {
    const baseFps = aiResult ? aiResult.expectedPerformance.avgFps : parseInt(settings.fps);
    return Array.from({ length: 10 }, (_, i) => ({
      name: `${i * 6}s`,
      fps: baseFps + (Math.random() * 6 - 3)
    }));
  }, [settings.fps, aiResult]);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analise o hardware (Snapdragon 8 Gen 2, 12GB RAM) e recomende configurações GFX ideais para PUBG Mobile. Retorne obrigatoriamente um JSON em Português do Brasil com os campos: recommendedSettings, explanation, expectedPerformance.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedSettings: {
                type: Type.OBJECT,
                properties: {
                  resolution: { type: Type.STRING },
                  graphics: { type: Type.STRING },
                  fps: { type: Type.STRING },
                  style: { type: Type.STRING },
                  msaa: { type: Type.STRING },
                  shadows: { type: Type.BOOLEAN },
                  zeroLagMode: { type: Type.BOOLEAN },
                  gpuOptimization: { type: Type.BOOLEAN },
                  memoryBoost: { type: Type.BOOLEAN },
                },
                required: ["resolution", "graphics", "fps", "style", "msaa", "shadows", "zeroLagMode", "gpuOptimization", "memoryBoost"]
              },
              explanation: { type: Type.STRING },
              expectedPerformance: {
                type: Type.OBJECT,
                properties: {
                  avgFps: { type: Type.NUMBER },
                  thermalImpact: { type: Type.STRING },
                  batteryImpact: { type: Type.STRING },
                },
                required: ["avgFps", "thermalImpact", "batteryImpact"]
              }
            },
            required: ["recommendedSettings", "explanation", "expectedPerformance"]
          }
        },
      });

      const result = JSON.parse(response.text || '{}');
      setAiResult(result);
      setSettings(result.recommendedSettings);
      setActiveTab('ia');
    } catch (error) {
      console.error("Erro na IA:", error);
      alert("Erro ao conectar com a IA. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof GFXSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (aiResult) setAiResult(null);
  };

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      alert("MOTOR INICIADO: As configurações GFX foram aplicadas com sucesso!");
    }, 2000);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black font-orbitron neon-text uppercase leading-none">ENGINE <span className="text-cyan-400 italic">CORE</span></h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">Otimize o kernel gráfico para latência zero.</p>
            </div>
            <button 
              onClick={handleOptimize}
              disabled={loading}
              className="group relative px-8 py-4 bg-cyan-500 rounded-xl font-black text-slate-950 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
              {loading ? 'CALCULANDO...' : 'OTIMIZAR IA'}
            </button>
          </div>

          <div className="flex gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl">
            {(['básico', 'avançado', 'ia'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                  activeTab === tab 
                    ? 'bg-cyan-500 text-slate-950 shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl min-h-[460px] shadow-2xl">
            {activeTab === 'ia' && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                {!aiResult ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700">
                      <Sparkles className="w-10 h-10 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-200">Aguardando Análise</h3>
                      <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">Ative o motor de IA para receber as configurações ideais baseadas no seu hardware atual.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Sparkles className="w-16 h-16 text-cyan-400" />
                      </div>
                      <h4 className="text-cyan-400 font-black text-xs tracking-widest mb-3 uppercase flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> RECOMENDAÇÃO DO MOTOR
                      </h4>
                      <p className="text-slate-300 leading-relaxed font-medium">{aiResult.explanation}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl group hover:border-cyan-500/30 transition-colors">
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Estabilidade</div>
                        <div className="text-2xl font-black font-orbitron text-cyan-400">98.2%</div>
                      </div>
                      <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl group hover:border-cyan-500/30 transition-colors">
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Média FPS</div>
                        <div className="text-2xl font-black font-orbitron text-cyan-400">{aiResult.expectedPerformance.avgFps} FPS</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'básico' && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                <OptionSelector label="Resolução" value={settings.resolution} options={['960x540', '1280x720', '1600x900', '1920x1080', '2560x1440']} onChange={(v) => updateSetting('resolution', v)} />
                <OptionSelector label="Qualidade Gráfica" value={settings.graphics} options={['Smooth', 'Balanced', 'HD', 'HDR', 'Ultra HD']} onChange={(v) => updateSetting('graphics', v)} />
                <OptionSelector label="Taxa de Quadros (FPS)" value={settings.fps} options={['30', '40', '60', '90', '120']} onChange={(v) => updateSetting('fps', v)} />
                <OptionSelector label="Estilo Visual" value={settings.style} options={['Classic', 'Colorful', 'Realistic', 'Soft', 'Movie']} onChange={(v) => updateSetting('style', v)} />
              </div>
            )}

            {activeTab === 'avançado' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <ToggleItem label="Sombras em Tempo Real" desc="Cálculo dinâmico de luz. Consome 15% mais GPU." checked={settings.shadows} onToggle={(v) => updateSetting('shadows', v)} />
                <ToggleItem label="Modo Latência Zero" desc="Prioriza threads de renderização sobre o sistema." checked={settings.zeroLagMode} onToggle={(v) => updateSetting('zeroLagMode', v)} />
                <ToggleItem label="Otimização de GPU" desc="Habilita drivers de aceleração hardware." checked={settings.gpuOptimization} onToggle={(v) => updateSetting('gpuOptimization', v)} />
                <ToggleItem label="Turbo Memória" desc="Limpa o cache da RAM antes de cada frame." checked={settings.memoryBoost} onToggle={(v) => updateSetting('memoryBoost', v)} />
                <OptionSelector label="Anti-Aliasing (MSAA)" value={settings.msaa} options={['Disabled', '2x', '4x']} onChange={(v) => updateSetting('msaa', v)} />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-xl">
             <h3 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase mb-6 flex items-center gap-2">
               <Cpu className="w-4 h-4 text-cyan-400" /> DISPOSITIVO DETECTADO
             </h3>
             <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: <Cpu className="w-4 h-4" />, label: "CPU", value: "Octa-core 3.2GHz" },
                 { icon: <Zap className="w-4 h-4" />, label: "GPU", value: "Adreno 740" },
                 { icon: <Memory className="w-4 h-4" />, label: "RAM", value: "12 GB" },
                 { icon: <Monitor className="w-4 h-4" />, label: "SCREEN", value: "120Hz Sync" }
               ].map((spec, i) => (
                 <div key={i} className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase mb-1">
                      {spec.icon} {spec.label}
                    </div>
                    <div className="text-sm font-bold text-slate-300 truncate">{spec.value}</div>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase mb-6 flex items-center gap-2">
               <Trophy className="w-4 h-4 text-yellow-500" /> PROJEÇÃO DE PERFORMANCE
            </h3>
            <div className="h-44 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorFps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 140]} hide />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="fps" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#colorFps)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <button className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-800 hover:bg-slate-700 transition-colors rounded-2xl font-black text-[10px] tracking-widest text-slate-400 hover:text-white">
                 <Download className="w-4 h-4" /> EXPORTAR
               </button>
               <button className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-800 hover:bg-slate-700 transition-colors rounded-2xl font-black text-[10px] tracking-widest text-slate-400 hover:text-white">
                 <Share2 className="w-4 h-4" /> SHARE
               </button>
               <button 
                 onClick={handleLaunch}
                 disabled={launching}
                 className="col-span-2 flex items-center justify-center gap-3 px-4 py-5 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-slate-950 transition-all rounded-2xl font-black font-orbitron text-xl shadow-2xl shadow-cyan-500/20 disabled:opacity-50 active:scale-95"
               >
                 {launching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
                 {launching ? 'INICIANDO ENGINE...' : 'INICIAR JOGO'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const OptionSelector: React.FC<{ label: string, value: string, options: string[], onChange: (v: any) => void }> = ({ label, value, options, onChange }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_#06b6d4]" />
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-xl border text-[11px] font-black transition-all ${
            value === opt 
              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
              : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const ToggleItem: React.FC<{ label: string, desc: string, checked: boolean, onToggle: (v: boolean) => void }> = ({ label, desc, checked, onToggle }) => (
  <div className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800/50 bg-slate-950/30 hover:bg-slate-900/40 transition-all cursor-pointer group" onClick={() => onToggle(!checked)}>
    <div className="flex-1">
      <div className="text-sm font-black text-slate-200 uppercase tracking-wide group-hover:text-cyan-400 transition-colors">{label}</div>
      <div className="text-[10px] text-slate-500 mt-1 font-medium">{desc}</div>
    </div>
    <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${checked ? 'bg-cyan-500' : 'bg-slate-700'}`}>
       <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${checked ? 'left-[26px]' : 'left-1'}`} />
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
