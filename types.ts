
export type GraphicsQuality = 'Smooth' | 'Balanced' | 'HD' | 'HDR' | 'Ultra HD';
export type FPSLimit = '30' | '40' | '60' | '90' | '120';
export type Resolution = '960x540' | '1280x720' | '1600x900' | '1920x1080' | '2560x1440';
export type Style = 'Classic' | 'Colorful' | 'Realistic' | 'Soft' | 'Movie';
export type MSAA = 'Disabled' | '2x' | '4x';

export interface GFXSettings {
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

export interface HardwareProfile {
  cpu: string;
  gpu: string;
  ram: string;
  os: string;
  refreshRate: number;
}

export interface OptimizationResponse {
  recommendedSettings: GFXSettings;
  explanation: string;
  expectedPerformance: {
    avgFps: number;
    thermalImpact: 'Low' | 'Medium' | 'High';
    batteryImpact: 'Efficient' | 'Normal' | 'Heavy';
  };
}
