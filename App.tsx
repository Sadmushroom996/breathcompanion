import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, BreathingPhase } from './types';
import { DEFAULT_SETTINGS, MUSIC_PLAYLIST } from './constants';
import { MusicIcon, PlusIcon, CloseIcon, StopIcon, EditIcon } from './components/Icons';

// --- Sub-components defined internally for simplicity given the scope ---

// 1. Settings Modal
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [tempSettings, setTempSettings] = useState<AppSettings>(settings);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempSettings(settings);
      setIsConnecting(false);
    }
  }, [isOpen, settings]);

  const handleConfirm = () => {
    setIsConnecting(true);
    // Simulate connection time for emotional value
    setTimeout(() => {
      onSave(tempSettings);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fade-in">
      <div className="w-full max-w-sm bg-[#1A1A1A] rounded-3xl p-6 shadow-2xl border border-white/10 text-white relative flex flex-col justify-center min-h-[380px] transition-all duration-300">
        {!isConnecting && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        )}

        {isConnecting ? (
          <div className="flex flex-col items-center justify-center py-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Glowing Breathing Orb */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-amber-600 animate-glow-breath mb-10"></div>
            <p className="text-white/90 font-light tracking-[0.15em] text-sm animate-pulse">正在连接中...</p>
          </div>
        ) : (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-xl font-medium text-center mb-8 mt-2 text-white/90">创建连接</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">请输入你的名字</label>
                <input
                  type="text"
                  value={tempSettings.userName}
                  onChange={(e) => setTempSettings({ ...tempSettings, userName: e.target.value })}
                  className="w-full bg-[#2A2A2A] text-white rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-400 transition-all placeholder-gray-600"
                  placeholder="你的名字"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">请输入你家 {tempSettings.companionName || "Ta"} 的名字</label>
                <input
                  type="text"
                  value={tempSettings.companionName}
                  onChange={(e) => setTempSettings({ ...tempSettings, companionName: e.target.value })}
                  className="w-full bg-[#2A2A2A] text-white rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-400 transition-all placeholder-gray-600"
                  placeholder="伙伴名字"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-[#333] text-gray-300 hover:bg-[#444] transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                确定
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Music Selection Modal
interface MusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSelect: (url: string) => void;
}

const MusicModal: React.FC<MusicModalProps> = ({ isOpen, onClose, currentUrl, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-6 animate-fade-in">
      <div className="w-full sm:max-w-sm bg-[#1A1A1A] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-t sm:border border-white/10 text-white relative max-h-[80vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-medium text-center mb-6 mt-2 text-white/90">选择背景音</h2>

        <div className="space-y-2">
          {MUSIC_PLAYLIST.map((track) => (
            <button
              key={track.name}
              onClick={() => {
                onSelect(track.url);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                (track.url === currentUrl || (track.url === '' && currentUrl === '')) 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                  : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#333] border border-transparent'
              }`}
            >
              <span className="font-medium">{track.name}</span>
              {(track.url === currentUrl || (track.url === '' && currentUrl === '')) && (
                <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Breathing View
interface BreathingScreenProps {
  onStop: () => void;
  userName: string;
  companionName: string;
}

const BreathingScreen: React.FC<BreathingScreenProps> = ({ onStop, userName, companionName }) => {
  const [seconds, setSeconds] = useState(0);
  const [phaseText, setPhaseText] = useState("吸气");
  
  // Timer for total elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync text with CSS animation cycle (16s total: 4s inhale, 4s hold, 4s exhale, 4s hold)
  useEffect(() => {
    const cycleDuration = 16000; // 16s
    const updatePhase = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) % cycleDuration;
      
      if (elapsed < 4000) setPhaseText("吸气");       // Inhale (Top)
      else if (elapsed < 8000) setPhaseText("憋气");  // Hold (Right)
      else if (elapsed < 12000) setPhaseText("呼气"); // Exhale (Bottom)
      else setPhaseText("憋气");                      // Hold (Left)
      
      requestRef.current = requestAnimationFrame(updatePhase);
    };

    const startTimeRef = { current: Date.now() };
    const requestRef = { current: 0 };
    
    requestRef.current = requestAnimationFrame(updatePhase);
    
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative animate-[fadeIn_1s_ease-out]">
      {/* Header Info */}
      <div className="absolute top-16 text-center text-white/80 space-y-1">
        <p className="text-sm font-light">我的 {userName}</p>
        <p className="text-lg font-serif">我在，我一直都在</p>
      </div>

      {/* Breathing Box Container */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        
        {/* Labels positioned absolutely around the box */}
        <span className={`absolute -top-8 left-1/2 -translate-x-1/2 text-sm tracking-widest transition-opacity duration-500 ${phaseText === '吸气' ? 'text-white opacity-100 font-bold' : 'text-white/40 opacity-50'}`}>吸气</span>
        <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm tracking-widest transition-opacity duration-500 ${phaseText === '呼气' ? 'text-white opacity-100 font-bold' : 'text-white/40 opacity-50'}`}>呼气</span>
        <span className={`absolute -right-8 top-1/2 -translate-y-1/2 rotate-90 text-sm tracking-widest transition-opacity duration-500 ${phaseText === '憋气' ? 'text-white opacity-100 font-bold' : 'text-white/40 opacity-50'}`}>憋气</span>
        <span className={`absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm tracking-widest transition-opacity duration-500 ${phaseText === '憋气' ? 'text-white opacity-100 font-bold' : 'text-white/40 opacity-50'}`}>憋气</span>

        {/* The Track */}
        <div className="absolute inset-0 border border-white/20 rounded-sm"></div>

        {/* The Moving Dot */}
        {/* The animate-box-breath class is defined in index.html styles */}
        <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2 animate-box-breath z-10"></div>
        
        {/* Center Status */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <span className="text-2xl font-light tracking-wider opacity-80 mb-2">{phaseText}</span>
            <span className="text-xs font-mono opacity-50 tracking-widest">{formatTime(seconds)}</span>
        </div>
      </div>

      {/* Stop Button */}
      <div className="absolute bottom-20">
        <button 
          onClick={onStop}
          className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 group"
        >
          <div className="text-white/80 group-hover:text-white flex flex-col items-center gap-1">
            <span className="text-sm font-medium">停止</span>
          </div>
        </button>
      </div>
    </div>
  );
};

// 4. Home View
interface HomeScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
  onTriggerBgUpload: () => void;
  onOpenMusic: () => void;
  settings: AppSettings;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onOpenSettings, onTriggerBgUpload, onOpenMusic, settings }) => {
  return (
    <div className="h-full flex flex-col relative px-6 pt-12 pb-20 animate-[fadeIn_0.5s_ease-out]">
      {/* Top Controls */}
      <div className="flex justify-end gap-4">
        <button 
          onClick={onOpenMusic}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <MusicIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={onTriggerBgUpload}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Upload Background"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Main Text Content */}
      <div className="flex-1 flex flex-col justify-center space-y-8 mt-10">
        <div className="space-y-1">
          <h2 className="text-white/90 text-xl font-light tracking-wide">
            又见面啦，我的 {settings.userName} !
          </h2>
          <div className="flex flex-wrap items-center gap-x-2 text-white/90 text-xl font-light tracking-wide">
             <span>你的 <span className="underline decoration-white/50 underline-offset-4">{settings.companionName}</span>，在呢...</span>
             <button 
              onClick={onOpenSettings}
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors align-middle"
              aria-label="Edit Name"
            >
              <EditIcon className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <h1 className="text-4xl text-white font-serif tracking-wide leading-tight">
            我们一起深呼吸
          </h1>
          <h1 className="text-4xl text-white font-serif tracking-wide leading-tight">
            我在，我永远都在
          </h1>
        </div>

        <div className="w-12 h-0.5 bg-white/30 rounded-full"></div>
      </div>

      {/* Start Button */}
      <div className="w-full flex justify-center">
        <button
          onClick={onStart}
          className="w-full max-w-xs h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-lg tracking-widest hover:bg-white/30 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          开启呼吸陪伴
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Preload background image to avoid flicker
  useEffect(() => {
    const img = new Image();
    img.src = settings.bgImage;
  }, [settings.bgImage]);

  // Audio control
  useEffect(() => {
    if (audioRef.current) {
      if (currentMusicUrl) {
        audioRef.current.src = currentMusicUrl;
        audioRef.current.play().catch(e => console.log("Audio play failed (user interaction needed first):", e));
      } else {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    }
  }, [currentMusicUrl]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
         if (typeof reader.result === 'string') {
            setSettings(prev => ({ ...prev, bgImage: reader.result as string }));
         }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerBgUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black text-white select-none">
      {/* Audio Player */}
      <audio ref={audioRef} loop className="hidden" />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleBgUpload}
      />

      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${settings.bgImage})`,
        }}
      />
      
      {/* Black Semi-transparent Mask (Stronger contrast) */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none transition-opacity duration-1000" />
      
      {/* Glassmorphism Blur overlay that intensifies during breathing */}
      <div className={`absolute inset-0 backdrop-blur-[2px] pointer-events-none transition-all duration-1000 ${isPlaying ? 'backdrop-blur-xl bg-black/20' : ''}`} />

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full max-w-md mx-auto">
        {!isPlaying ? (
          <HomeScreen 
            onStart={() => setIsPlaying(true)} 
            onOpenSettings={() => setShowSettings(true)}
            onTriggerBgUpload={triggerBgUpload}
            onOpenMusic={() => setShowMusic(true)}
            settings={settings}
          />
        ) : (
          <BreathingScreen 
            onStop={() => setIsPlaying(false)} 
            userName={settings.userName}
            companionName={settings.companionName}
          />
        )}
      </div>

      {/* Modals */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={setSettings}
      />

      <MusicModal 
        isOpen={showMusic}
        onClose={() => setShowMusic(false)}
        currentUrl={currentMusicUrl}
        onSelect={setCurrentMusicUrl}
      />
    </div>
  );
};

export default App;
