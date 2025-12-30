
import React from 'react';
import { Cpu, Monitor, MemoryStick as Memory, Zap } from 'lucide-react';
import { HardwareProfile } from '../types';

interface DeviceSpecsProps {
  profile: HardwareProfile;
}

export const DeviceSpecs: React.FC<DeviceSpecsProps> = ({ profile }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold font-orbitron flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          ESPECIFICAÇÕES
        </h2>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">
          DETECTADO
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-3 text-slate-400 text-xs mb-1">
            <Cpu className="w-3 h-3" /> PROCESSADOR
          </div>
          <div className="font-semibold text-sm truncate">{profile.cpu}</div>
        </div>
        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-3 text-slate-400 text-xs mb-1">
            <Zap className="w-3 h-3" /> GPU
          </div>
          <div className="font-semibold text-sm truncate">{profile.gpu}</div>
        </div>
        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-3 text-slate-400 text-xs mb-1">
            <Memory className="w-3 h-3" /> RAM
          </div>
          <div className="font-semibold text-sm">{profile.ram}</div>
        </div>
        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-3 text-slate-400 text-xs mb-1">
            <Monitor className="w-3 h-3" /> TELA
          </div>
          <div className="font-semibold text-sm">{profile.refreshRate}Hz Sync</div>
        </div>
      </div>
    </div>
  );
};
