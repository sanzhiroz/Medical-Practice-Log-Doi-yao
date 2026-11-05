import React, { useState } from 'react';
import { 
  Ambulance, 
  MapPin, 
  Radio, 
  PhoneCall, 
  Clock, 
  HeartPulse, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Printer, 
  ChevronRight, 
  ShieldAlert,
  Send,
  AlertTriangle,
  ArrowRight,
  Navigation as NavigationIcon
} from 'lucide-react';
import { ReferralManifest, TriageLevel } from '../types/medical';

interface TransferManifestHubProps {
  referrals: ReferralManifest[];
  selectedReferral: ReferralManifest | null;
  onSelectReferral: (referral: ReferralManifest) => void;
  onUpdateReferral: (updated: ReferralManifest) => void;
  onCreateNewManifest: () => void;
  onPrintManifest: (referral: ReferralManifest) => void;
  language: 'TH' | 'EN';
}

export const TransferManifestHub: React.FC<TransferManifestHubProps> = ({
  referrals,
  selectedReferral,
  onSelectReferral,
  onUpdateReferral,
  onCreateNewManifest,
  onPrintManifest,
  language,
}) => {
  const current = selectedReferral || referrals[0];

  const handleAdvanceStatus = (manifest: ReferralManifest) => {
    let nextStatus: ReferralManifest['status'] = 'in_transit';
    let nextEta = manifest.etaMinutes;

    if (manifest.status === 'dispatched') {
      nextStatus = 'in_transit';
      nextEta = 30;
    } else if (manifest.status === 'in_transit') {
      nextStatus = 'arrived';
      nextEta = 0;
    } else if (manifest.status === 'arrived') {
      nextStatus = 'completed';
    }

    onUpdateReferral({
      ...manifest,
      status: nextStatus,
      etaMinutes: nextEta,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#001849] via-[#0f2d6b] to-[#006398] text-white p-4 sm:p-5 rounded-xl border border-[#2a4482] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] tracking-wide animate-pulse">
              1669 REFERRAL NETWORK
            </span>
            <span className="text-xs text-[#93ccff] font-medium">
              Chiang Mai Health Link • Highland Emergency Gateway
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading mt-1">
            {language === 'TH'
              ? 'ระบบส่งต่อผู้ป่วยฉุกเฉินและเวชระเบียนนำส่ง (Transfer Manifest)'
              : 'Decentralized Emergency Transfer & Referral Network'}
          </h2>
          <p className="text-xs text-[#dae2fd]/90 mt-0.5">
            {language === 'TH'
              ? 'เชื่อมโยงโหนดดอยยาว สู่อภิมหาโรงพยาบาล รพ.มหาราชนครเชียงใหม่ (สวนดอก) และ รพ.นครพิงค์'
              : 'Direct clinical telemetry & transfer synchronization to regional tertiary supercenters'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateNewManifest}
            className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'TH' ? '+ ออกใบส่งต่อใหม่' : '+ New Transfer Manifest'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): List of manifests */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-slate-700 tracking-wider">
                {language === 'TH' ? 'รายการส่งต่อผู้ป่วยวันนี้' : 'Active Referral Manifests'}
              </span>
              <span className="text-xs font-mono font-semibold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                {referrals.length} {language === 'TH' ? 'เคส' : 'cases'}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto">
              {referrals.map((ref) => {
                const isSelected = current?.id === ref.id;
                const statusMeta = {
                  dispatched: { labelTh: 'ปล่อยรถแล้ว', labelEn: 'Dispatched', badge: 'bg-amber-100 text-amber-800' },
                  in_transit: { labelTh: 'กำลังนำส่งบนเขา', labelEn: 'In Transit', badge: 'bg-blue-100 text-blue-800 animate-pulse' },
                  arrived: { labelTh: 'ถึง รพ. ปลายทาง', labelEn: 'Arrived', badge: 'bg-indigo-100 text-indigo-800' },
                  completed: { labelTh: 'ส่งมอบเคสเรียบร้อย', labelEn: 'Completed', badge: 'bg-emerald-100 text-emerald-800' },
                }[ref.status];

                return (
                  <div
                    key={ref.id}
                    onClick={() => onSelectReferral(ref)}
                    className={`p-4 transition cursor-pointer hover:bg-slate-50 ${
                      isSelected ? 'bg-[#eaedff]/60 border-l-4 border-l-red-600 ring-1 ring-red-400/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          ref.triage === 'RED' ? 'bg-red-600 animate-ping' : 'bg-amber-500'
                        }`}></span>
                        <span className="font-mono font-bold text-slate-900">{ref.manifestNo}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusMeta.badge}`}>
                        {language === 'TH' ? statusMeta.labelTh : statusMeta.labelEn}
                      </span>
                    </div>

                    <div className="mt-1.5 font-bold text-slate-900 text-sm">
                      {ref.patientName} ({ref.age} ปี)
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      HN {ref.hn} • {ref.transportType}
                    </div>

                    <p className="text-[11px] text-red-700 font-medium line-clamp-2 mt-1">
                      {ref.reason}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="truncate max-w-[200px] flex items-center gap-1 font-medium text-slate-800">
                        <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                        {ref.destinationHospital}
                      </span>
                      {ref.status === 'in_transit' && (
                        <span className="text-red-600 font-bold font-mono">
                          ETA ~{ref.etaMinutes} นาที
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Manifest Detail, Telemetry & Print */}
        {current && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {/* Manifest Header */}
            <div className="bg-[#0f2d6b] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-xs font-bold">
                    {current.manifestNo}
                  </span>
                  <span className="text-xs text-[#93ccff]">
                    {current.dispatchedAt}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#0f2d6b]">
                    {current.transportType}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading text-white mt-1">
                  {current.patientName} (อายุ {current.age} ปี • เพศ {current.gender})
                </h3>
                <span className="text-xs text-[#dae2fd]">
                  HN: {current.hn} • ต้นทาง: {current.originNode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPrintManifest(current)}
                  className="px-3 py-1.5 rounded-md bg-white text-[#0f2d6b] hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === 'TH' ? 'พิมพ์ใบส่งต่อ' : 'Print Form'}</span>
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[600px]">
              {/* Destination Hospital & Reason Box */}
              <div className="bg-red-50/70 p-3.5 rounded-lg border border-red-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900 uppercase text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    โรงพยาบาลปลายทางรับส่งต่อ
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                    FAST TRACK ACTIVE
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {current.destinationHospital}
                </div>
                <div>
                  <span className="font-bold text-red-800 text-[11px] block">เหตุผลและความจำเป็นในการส่งต่อ:</span>
                  <p className="text-slate-800 text-xs mt-0.5">
                    {current.reason}
                  </p>
                </div>
              </div>

              {/* Transit Route Progress */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1">
                    <NavigationIcon className="w-3.5 h-3.5 text-blue-600" />
                    เส้นทางและสถานะการเคลื่อนย้ายผู้ป่วย
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-700">
                    {current.status === 'in_transit' ? `ETA ~${current.etaMinutes} นาที` : current.status}
                  </span>
                </div>

                {/* Stepper */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className={`p-2 rounded font-bold ${
                    current.status !== 'dispatched' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-600 text-white'
                  }`}>
                    1. ปล่อยรถโหนด
                  </div>
                  <div className={`p-2 rounded font-bold ${
                    current.status === 'in_transit' ? 'bg-blue-600 text-white animate-pulse' :
                    current.status === 'arrived' || current.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                  }`}>
                    2. กำลังลงเขา (1096)
                  </div>
                  <div className={`p-2 rounded font-bold ${
                    current.status === 'arrived' ? 'bg-indigo-600 text-white' :
                    current.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                  }`}>
                    3. ถึงห้องฉุกเฉิน
                  </div>
                  <div className={`p-2 rounded font-bold ${
                    current.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    4. ส่งมอบสมบูรณ์
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleAdvanceStatus(current)}
                    className="px-3 py-1.5 rounded bg-[#0f2d6b] hover:bg-[#001849] text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>{language === 'TH' ? 'อัปเดตสถานะถัดไป' : 'Advance Status'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* In-Transit Vital Signs & Telemetry */}
              <div className="bg-[#001236] text-white p-4 rounded-lg border border-slate-800 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-[#7bd0ff]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
                    LIVE AMBULANCE TELEMETRY
                  </span>
                  <span className="text-[10px] text-emerald-400">CONNECTIVITY: 5G/RADIO DUAL</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-black/50 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block">BLOOD PRESSURE</span>
                    <span className="font-bold text-amber-300 text-xs sm:text-sm">{current.vitalsOnTransit.bp}</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block">HEART RATE</span>
                    <span className="font-bold text-red-400 text-sm sm:text-base">{current.vitalsOnTransit.hr} bpm</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block">SpO2 SAT</span>
                    <span className="font-bold text-cyan-400 text-sm sm:text-base">{current.vitalsOnTransit.spo2}%</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block">GCS SCORE</span>
                    <span className="font-bold text-emerald-300 text-xs sm:text-sm">{current.vitalsOnTransit.gcs}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                  <div><strong>ออกซิเจน:</strong> {current.vitalsOnTransit.o2Flow}</div>
                  <div><strong>สารน้ำทางหลอดเลือดดำ (IV):</strong> {current.vitalsOnTransit.ivFluid}</div>
                  <div><strong>ยาฉุกเฉินที่ให้แล้ว:</strong> {current.emergencyDrugsGiven.join(', ')}</div>
                </div>
              </div>

              {/* Transfer Personnel & Radio Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">หัวหน้าทีมกู้ชีพนำส่ง:</span>
                  <span className="font-bold text-slate-900">{current.attendingParamedic}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">แพทย์ผู้รับมอบ ณ ปลายทาง:</span>
                  <span className="font-bold text-slate-900">{current.handoverDoctor || 'รอประสานงาน'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 mt-auto">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>วิทยุสื่อสารฉุกเฉิน: ช่อง VHF 155.775 MHz (อบจ.เชียงใหม่ กู้ชีพ)</span>
              </div>

              <button
                onClick={() => onPrintManifest(current)}
                className="px-4 py-2 rounded-lg bg-[#0284c7] hover:bg-[#006398] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'TH' ? 'พิมพ์เอกสารส่งต่อราชการ' : 'Print Official Manifest'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
