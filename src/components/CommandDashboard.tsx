import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Activity, 
  Ambulance, 
  Radio, 
  Thermometer, 
  Wind, 
  CheckCircle2, 
  UserPlus, 
  ArrowRight,
  TrendingUp,
  MapPin,
  HeartPulse,
  PhoneCall,
  ShieldAlert,
  ChevronRight,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { ClinicalVisit, ReferralManifest, TriageLevel } from '../types/medical';
import { HIGHLAND_WEATHER } from '../data/mockData';

interface CommandDashboardProps {
  visits: ClinicalVisit[];
  referrals: ReferralManifest[];
  language: 'TH' | 'EN';
  onSelectVisit: (visit: ClinicalVisit) => void;
  onSelectReferral: (referral: ReferralManifest) => void;
  onOpenNewIntake: () => void;
  onOpenEmergency: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const CommandDashboard: React.FC<CommandDashboardProps> = ({
  visits,
  referrals,
  language,
  onSelectVisit,
  onSelectReferral,
  onOpenNewIntake,
  onOpenEmergency,
  onNavigateToTab,
}) => {
  // Compute counts
  const totalVisits = visits.length;
  const redCount = visits.filter((v) => v.triage === 'RED').length;
  const yellowCount = visits.filter((v) => v.triage === 'YELLOW').length;
  const greenCount = visits.filter((v) => v.triage === 'GREEN').length;
  const whiteCount = visits.filter((v) => v.triage === 'WHITE').length;

  const inTransitReferrals = referrals.filter((r) => r.status === 'in_transit');
  const activeReferral = inTransitReferrals[0] || referrals[0];

  return (
    <div className="space-y-6">
      {/* Highland Node Emergency Notice / Environmental Telemetry Banner */}
      <div className="bg-gradient-to-r from-[#001849] via-[#0f2d6b] to-[#1e3a8a] text-white p-4 sm:p-5 rounded-xl border border-[#2a4482] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0284c7] text-white">
                NODE STATUS: OPERATIONAL
              </span>
              <span className="text-xs text-[#93ccff] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                อ.แม่ริม จ.เชียงใหม่ • พิกัดภูมิศาสตร์ 18.914°N, 98.782°E
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {language === 'TH'
                ? 'ศูนย์สั่งการบริการการแพทย์และสาธารณสุข โหนดดอยยาว'
                : 'Highland Medical Node Command Hub • Doi Yao'}
            </h2>
            <p className="text-xs sm:text-sm text-[#dae2fd]/90">
              {language === 'TH'
                ? 'เครือข่ายบริการสุขภาพปฐมภูมิ อบจ. เชียงใหม่ เชื่อมโยง รพ.นครพิงค์ และ รพ.มหาราชนครเชียงใหม่ (สวนดอก)'
                : 'Chiang Mai Provincial Administrative Organization Highland Health Link Network'}
            </p>
          </div>

          {/* Environmental Telemetry Sensors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#001236]/80 p-3 rounded-lg border border-[#2a4482]/80 text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#7bd0ff] uppercase tracking-wider">
                {language === 'TH' ? 'ระดับความสูง' : 'Elevation'}
              </span>
              <span className="font-bold text-white text-sm sm:text-base">
                1,120 <span className="text-[11px] font-normal text-slate-300">m ASL</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-[#7bd0ff] uppercase tracking-wider">
                {language === 'TH' ? 'อุณหภูมิดอย' : 'Highland Temp'}
              </span>
              <span className="font-bold text-sky-200 text-sm sm:text-base flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                {HIGHLAND_WEATHER.temperatureC}°C
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Wind className="w-3 h-3" />
                PM 2.5
              </span>
              <span className="font-bold text-amber-300 text-sm sm:text-base">
                {HIGHLAND_WEATHER.pm25}{' '}
                <span className="text-[10px] font-normal text-amber-200">µg/m³</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider">
                {language === 'TH' ? 'ตู้เย็นวัคซีน' : 'Cold Chain'}
              </span>
              <span className="font-bold text-emerald-300 text-sm sm:text-base flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                4.2°C (OK)
              </span>
            </div>
          </div>
        </div>

        {/* Respiratory Alert Bar if PM2.5 is moderate/high */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#dae2fd] gap-2">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-[10px] border border-amber-400/30">
              {language === 'TH' ? 'ข้อความเฝ้าระวัง' : 'CLINICAL NOTICE'}
            </span>
            <span>
              {language === 'TH'
                ? 'ค่าฝุ่น PM2.5 ปานกลาง แนะนำกลุ่มเสี่ยงโรคระบบทางเดินหายใจ (COPD/Asthma) ปฏิบัติตามแนวทางสวมหน้ากากอนามัย'
                : 'Moderate PM2.5 detected. Respiratory clinics activated for highland vulnerable populations.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('clinical')}
              className="text-[#93ccff] hover:text-white underline text-xs cursor-pointer flex items-center gap-1 font-medium"
            >
              {language === 'TH' ? 'เปิดคลินิกทางเดินหายใจ' : 'Open Respiratory Clinic'}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Triage Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Red: Resuscitation */}
        <div 
          onClick={() => onNavigateToTab('clinical')}
          className="bg-white p-4 rounded-xl border-l-4 border-l-red-600 border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wide flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              {language === 'TH' ? 'ระดับ 1 วิกฤต (Red)' : 'Level 1: Resuscitation'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
              Immediate
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] font-heading">
              {redCount}
            </div>
            <span className="text-xs text-red-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
              {language === 'TH' ? 'ดูเคสวิกฤต' : 'View cases'} →
            </span>
          </div>
          <p className="text-[11px] text-[#444650] mt-1">
            {language === 'TH' ? 'เคสฉุกเฉินถึงชีวิต / STEMI / Shock' : 'Immediate life-threat / CPR / Trauma'}
          </p>
        </div>

        {/* Yellow: Emergency */}
        <div 
          onClick={() => onNavigateToTab('clinical')}
          className="bg-white p-4 rounded-xl border-l-4 border-l-amber-500 border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
              {language === 'TH' ? 'ระดับ 2 เร่งด่วน (Yellow)' : 'Level 2: Emergency'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              &lt; 15 Min
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] font-heading">
              {yellowCount}
            </div>
            <span className="text-xs text-amber-700 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
              {language === 'TH' ? 'ดูคิวรอ' : 'View queue'} →
            </span>
          </div>
          <p className="text-[11px] text-[#444650] mt-1">
            {language === 'TH' ? 'หอบเหนื่อยรุนแรง / ปวดตารุนแรง' : 'Potentially life-threatening / Severe'}
          </p>
        </div>

        {/* Green: Urgent / Semi-Urgent */}
        <div 
          onClick={() => onNavigateToTab('clinical')}
          className="bg-white p-4 rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              {language === 'TH' ? 'ระดับ 3 ทั่วไป (Green)' : 'Level 3: Urgent'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              &lt; 30 Min
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] font-heading">
              {greenCount}
            </div>
            <span className="text-xs text-emerald-700 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
              {language === 'TH' ? 'เข้าตรวจ' : 'Review'} →
            </span>
          </div>
          <p className="text-[11px] text-[#444650] mt-1">
            {language === 'TH' ? 'NCD ตามนัด / บาดแผลไม่ลึก' : 'Non-life threatening / NCD follow-up'}
          </p>
        </div>

        {/* White / Routine */}
        <div 
          onClick={() => onNavigateToTab('clinical')}
          className="bg-white p-4 rounded-xl border-l-4 border-l-[#0284c7] border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#006398] uppercase tracking-wide">
              {language === 'TH' ? 'ระดับ 4-5 นัดรับยา (White)' : 'Level 4-5: Routine'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-[#006398] border border-sky-200">
              Routine
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] font-heading">
              {whiteCount || 1}
            </div>
            <span className="text-xs text-[#0284c7] font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
              {language === 'TH' ? 'คิวห้องยา' : 'Pharmacy'} →
            </span>
          </div>
          <p className="text-[11px] text-[#444650] mt-1">
            {language === 'TH' ? 'รับยาต่อเนื่อง / ใบรับรองแพทย์' : 'Prescription refill / Medical cert'}
          </p>
        </div>
      </div>

      {/* Main Grid: Active Referral In-Transit & Active Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Active Triage Queue Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#131b2e] text-base font-heading">
                  {language === 'TH' ? 'คิวผู้ป่วยตรวจรักษาและจุดคัดกรอง' : 'Live Patient Triage & Intake Queue'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#eaedff] text-[#0f2d6b]">
                  {visits.length} {language === 'TH' ? 'ราย' : 'patients'}
                </span>
              </div>
              <p className="text-xs text-[#444650]">
                {language === 'TH' 
                  ? 'เรียงตามระดับความรุนแรงของอาการและการมาถึง'
                  : 'Prioritized by triage severity level and intake arrival'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNewIntake}
                className="px-2.5 py-1.5 rounded-md bg-[#0284c7] hover:bg-[#006398] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'TH' ? 'รับผู้ป่วยใหม่' : 'New Intake'}</span>
              </button>
              <button
                onClick={() => onNavigateToTab('clinical')}
                className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer"
              >
                {language === 'TH' ? 'ดูเวชระเบียนทั้งหมด' : 'Full OPD'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#eaedff]/60 text-[#0f2d6b] uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">{language === 'TH' ? 'คิว / ระดับ' : 'Queue / Triage'}</th>
                  <th className="py-2.5 px-4">{language === 'TH' ? 'ผู้ป่วย / HN' : 'Patient / HN'}</th>
                  <th className="py-2.5 px-4">{language === 'TH' ? 'อาการสำคัญ (CC)' : 'Chief Complaint'}</th>
                  <th className="py-2.5 px-4">{language === 'TH' ? 'สัญญาณชีพ (Vitals)' : 'Vital Signs'}</th>
                  <th className="py-2.5 px-4">{language === 'TH' ? 'สถานะ' : 'Status'}</th>
                  <th className="py-2.5 px-4 text-right">{language === 'TH' ? 'การจัดการ' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visits.slice(0, 5).map((visit) => {
                  const triageBadge = {
                    RED: 'bg-red-600 text-white animate-pulse',
                    YELLOW: 'bg-amber-500 text-white',
                    GREEN: 'bg-emerald-600 text-white',
                    WHITE: 'bg-slate-500 text-white',
                  }[visit.triage];

                  const statusBadge = {
                    triage: { bg: 'bg-amber-50 text-amber-700 border-amber-200', textTh: 'รอคัดกรอง', textEn: 'Triage' },
                    doctor_exam: { bg: 'bg-sky-50 text-sky-700 border-sky-200', textTh: 'พบแพทย์', textEn: 'Doctor Exam' },
                    dispensing: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', textTh: 'รอรับยา', textEn: 'Dispensing' },
                    completed: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', textTh: 'เสร็จสิ้น', textEn: 'Completed' },
                    referred: { bg: 'bg-red-50 text-red-700 border-red-200', textTh: 'ส่งต่อไป รพ.ศูนย์', textEn: 'Referred' },
                    observing: { bg: 'bg-purple-50 text-purple-700 border-purple-200', textTh: 'สังเกตอาการ', textEn: 'Observing' },
                  }[visit.status];

                  return (
                    <tr 
                      key={visit.id} 
                      className="hover:bg-[#eaedff]/30 transition cursor-pointer"
                      onClick={() => onSelectVisit(visit)}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${triageBadge}`}>
                            {visit.triage[0]}
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            {visit.queueNo}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {visit.arrivalTime}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {visit.patient.prefix} {visit.patient.firstName} {visit.patient.lastName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          HN {visit.patient.hn} • {visit.patient.age} ปี ({visit.patient.village})
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-[220px]">
                        <p className="line-clamp-2 text-slate-700 text-[11px]" title={visit.chiefComplaint}>
                          {visit.chiefComplaint}
                        </p>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-[11px] font-medium text-slate-800">
                          BP: <span className={visit.vitals.bpSystolic >= 140 ? 'text-amber-700 font-bold' : ''}>
                            {visit.vitals.bpSystolic}/{visit.vitals.bpDiastolic}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                          <span>PR: {visit.vitals.pulse}</span>
                          <span className={visit.vitals.spo2 < 95 ? 'text-red-600 font-bold' : ''}>
                            SpO2: {visit.vitals.spo2}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusBadge.bg}`}>
                          {language === 'TH' ? statusBadge.textTh : statusBadge.textEn}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectVisit(visit);
                          }}
                          className="px-2.5 py-1 rounded bg-[#eaedff] text-[#0f2d6b] hover:bg-[#0f2d6b] hover:text-white transition font-medium text-[11px] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{language === 'TH' ? 'เปิดตรวจ' : 'Review'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Active Highland Referral & Emergency Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          {/* Highland Ambulance In-Transit Live Card */}
          {activeReferral && (
            <div className="bg-white rounded-xl border border-red-200 shadow-xs overflow-hidden">
              <div className="bg-gradient-to-r from-red-700 to-rose-800 text-white p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ambulance className="w-5 h-5 text-white animate-bounce" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider">
                      {language === 'TH' ? 'รถกู้ชีพส่งต่อฉุกเฉิน (กำลังเดินทาง)' : 'Emergency Referral In-Transit'}
                    </h4>
                    <span className="text-[10px] text-red-100 font-mono">
                      {activeReferral.manifestNo}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-white text-red-700 font-bold text-[10px] animate-pulse">
                  FAST TRACK
                </span>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">
                    {language === 'TH' ? 'ผู้ป่วย / อาการวิกฤต' : 'Patient / Critical Condition'}
                  </span>
                  <div className="font-bold text-slate-900 text-sm">
                    {activeReferral.patientName} ({activeReferral.age} ปี)
                  </div>
                  <p className="text-red-700 text-[11px] font-medium mt-0.5 line-clamp-2">
                    {activeReferral.reason}
                  </p>
                </div>

                {/* Simulated Transit Map Progress Bar */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      โหนดดอยยาว
                    </span>
                    <span className="font-bold text-red-600 font-mono">
                      ETA ~{activeReferral.etaMinutes} นาที
                    </span>
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      สวนดอก
                    </span>
                  </div>

                  {/* Route Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden relative">
                    <div 
                      className="bg-red-600 h-full rounded-full transition-all duration-1000 relative"
                      style={{ width: '62%' }}
                    >
                      <span className="absolute right-0 top-0 bottom-0 w-2 bg-white/80 animate-ping rounded-full"></span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>ทางหลวง 1096 แม่ริม-สะเมิง</span>
                    <span>มุ่งหน้าศูนย์หัวใจ มหาราช</span>
                  </div>
                </div>

                {/* Telemetry Stream */}
                <div className="bg-[#001236] text-white p-3 rounded-lg border border-slate-800 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[10px] text-[#7bd0ff]">
                    <span className="flex items-center gap-1">
                      <HeartPulse className="w-3 h-3 text-red-400 animate-pulse" />
                      TELEMETRY STREAM
                    </span>
                    <span className="text-emerald-400">LIVE FEED</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-black/40 p-1.5 rounded">
                      <span className="text-[9px] text-slate-400 block">HR</span>
                      <span className="text-sm font-bold text-red-400">
                        {activeReferral.vitalsOnTransit.hr}
                      </span>
                      <span className="text-[9px] text-slate-400">bpm</span>
                    </div>
                    <div className="bg-black/40 p-1.5 rounded">
                      <span className="text-[9px] text-slate-400 block">SpO2</span>
                      <span className="text-sm font-bold text-cyan-400">
                        {activeReferral.vitalsOnTransit.spo2}%
                      </span>
                      <span className="text-[9px] text-slate-400">NRB 10L</span>
                    </div>
                    <div className="bg-black/40 p-1.5 rounded">
                      <span className="text-[9px] text-slate-400 block">BP</span>
                      <span className="text-xs font-bold text-amber-300">
                        94/60
                      </span>
                      <span className="text-[9px] text-slate-400">on drip</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-300 truncate">
                    ยาฉุกเฉิน: {activeReferral.emergencyDrugsGiven.join(', ')}
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => onSelectReferral(activeReferral)}
                    className="flex-1 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-medium text-xs text-center transition cursor-pointer"
                  >
                    {language === 'TH' ? 'ดูใบส่งต่อผู้ป่วยฉบับเต็ม' : 'View Transfer Manifest'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Node Emergency Actions Panel */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#0f2d6b]" />
              {language === 'TH' ? 'ระบบประสานงานด่วนประจำโหนด' : 'Highland Node Fast Actions'}
            </h4>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={onOpenEmergency}
                className="w-full py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-red-600" />
                  <span>{language === 'TH' ? 'แจ้งเหตุวิกฤต 1669 / ศูนย์นเรนทร' : 'Dispatch EMS 1669 / Narenthorn'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateToTab('transfers')}
                className="w-full py-2 px-3 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#0f2d6b] border border-[#c5c6d2] text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Ambulance className="w-4 h-4 text-[#0284c7]" />
                  <span>{language === 'TH' ? 'สร้างใบส่งต่อผู้ป่วย (Referral)' : 'Create Referral Manifest'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateToTab('field')}
                className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'TH' ? 'เครือข่าย อสม. และผู้ป่วยติดเตียง' : 'อสม. Village Health & Home Ward'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateToTab('documents')}
                className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                  <span>{language === 'TH' ? 'พิมพ์ใบรับรองและรายงาน อบจ.' : 'Print Certificates & Reports'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
