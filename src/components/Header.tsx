import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Activity, 
  Radio, 
  PhoneCall, 
  PlusCircle, 
  Globe2, 
  ShieldAlert, 
  MapPin, 
  CloudSun,
  Flame
} from 'lucide-react';
import { HIGHLAND_WEATHER } from '../data/mockData';

interface HeaderProps {
  language: 'TH' | 'EN';
  onToggleLanguage: () => void;
  onOpenNewIntake: () => void;
  onOpenEmergency: () => void;
  emergencyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenNewIntake,
  onOpenEmergency,
  emergencyCount,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString(language === 'TH' ? 'th-TH' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString(language === 'TH' ? 'th-TH' : 'en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: language === 'TH' ? 'numeric' : 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <header className="bg-[#001849] text-white border-b border-[#0f2d6b] shadow-md sticky top-0 z-40 select-none">
      {/* Topmost Institution Ribbon */}
      <div className="bg-[#001236] px-4 py-1 text-xs border-b border-[#0a2358]/50 flex flex-wrap items-center justify-between text-[#c5c6d2]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-medium text-[#7bd0ff]">
            <Building2 className="w-3.5 h-3.5 text-[#5bb8fe]" />
            {language === 'TH' 
              ? 'องค์การบริหารส่วนจังหวัดเชียงใหม่ (อบจ. เชียงใหม่) • กองสาธารณสุข'
              : 'Chiang Mai Provincial Administrative Organization • Dept of Public Health'}
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-[#b2c5ff]">
            <MapPin className="w-3 h-3 text-[#5bb8fe]" />
            {language === 'TH' 
              ? 'ศูนย์บริการการแพทย์ปฐมภูมิ โหนดดอยยาว (Node Doi Yao) รหัส DY-CM-048'
              : 'Decentralized Primary Care Medical Node Doi Yao • Code DY-CM-048'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0f2d6b]/80 border border-[#2a4482] text-[#dae2ff]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">HEALTHNET SYNCED</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-sky-200">
            <CloudSun className="w-3.5 h-3.5 text-amber-300" />
            <span>ดอยยาว 1,120 ม. • {HIGHLAND_WEATHER.temperatureC}°C</span>
          </div>

          <div className="hidden xl:flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>PM2.5: {HIGHLAND_WEATHER.pm25} µg/m³</span>
          </div>

          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1e3a8a] hover:bg-[#2563eb] transition-colors text-white font-medium text-xs cursor-pointer"
            title="Switch Language / เปลี่ยนภาษา"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{language === 'TH' ? 'EN' : 'TH'}</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Node Info */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#0284c7] via-[#0f2d6b] to-[#001849] p-0.5 border border-[#5bb8fe]/40 shadow-inner flex items-center justify-center">
            <div className="w-full h-full rounded-md bg-[#001849] flex items-center justify-center text-[#5bb8fe]">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-heading">
                {language === 'TH' ? 'บันทึกการปฏิบัติงานของแพทย์ Node ดอยยาว' : 'Medical Practice Log – Doi Yao'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#0284c7]/20 border border-[#0284c7] text-[#93ccff]">
                นายแพทย์เกรียงยุทธ วรศีตกาลกุล
              </span>
            </div>
            <p className="text-xs text-[#dae2fd]/80">
              {language === 'TH'
                ? 'ในสังกัด องค์การบริหารส่วนจังหวัดเชียงใหม่ (อบจ. เชียงใหม่) • ฐานข้อมูล Firebase: Medical Practice Log'
                : 'Under Chiang Mai Provincial Administrative Organization • Cloud Firebase: Medical Practice Log'}
            </p>
          </div>
        </div>

        {/* Right: Clock & Urgent Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Real-time Clock display */}
          <div className="hidden md:flex flex-col items-end pr-2 border-r border-[#0f2d6b]">
            <div className="font-mono text-sm font-semibold tracking-wider text-[#dae2ff]">
              {timeStr}
            </div>
            <div className="text-[11px] text-[#93ccff]">
              {dateStr}
            </div>
          </div>

          {/* Emergency 1669 Action Button */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-medium text-xs sm:text-sm shadow-lg shadow-red-900/30 transition-all border border-red-400/30 cursor-pointer animate-pulse"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="font-bold">
              {language === 'TH' ? 'กู้ชีพ 1669 / Sky Doctor' : 'EMS 1669 / Sky Doctor'}
            </span>
            {emergencyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-red-700 font-extrabold text-[11px]">
                {emergencyCount}
              </span>
            )}
          </button>

          {/* New Patient Intake Button */}
          <button
            onClick={onOpenNewIntake}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#0284c7] hover:bg-[#006398] text-white font-semibold text-xs sm:text-sm shadow-md transition-all border border-[#5bb8fe]/40 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'TH' ? '+ ลงทะเบียนรับใหม่' : '+ New Intake'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
