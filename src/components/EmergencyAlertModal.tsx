import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  PhoneCall, 
  Ambulance, 
  Radio, 
  HeartPulse, 
  CheckCircle2, 
  MapPin,
  Flame,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ClinicalVisit, ReferralManifest } from '../types/medical';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  visits: ClinicalVisit[];
  onDispatchReferral: (newRef: ReferralManifest) => void;
  language: 'TH' | 'EN';
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  isOpen,
  onClose,
  visits,
  onDispatchReferral,
  language,
}) => {
  if (!isOpen) return null;

  const [selectedPatient, setSelectedPatient] = useState<string>(visits[0]?.id || 'unknown');
  const [destination, setDestination] = useState<string>(
    'รพ.มหาราชนครเชียงใหม่ (สวนดอก) - Northern Heart & Trauma Center'
  );
  const [transportType, setTransportType] = useState<'EMS_4WD' | 'BLS_AMBULANCE' | 'SKY_DOCTOR_HELICOPTER'>('EMS_4WD');
  const [emergencyReason, setEmergencyReason] = useState(
    'ภาวะวิกฤตเฉียบพลัน ต้องการการรักษาขั้นสูง (Fast Track Emergent Intervention)'
  );
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  const matchedVisit = visits.find((v) => v.id === selectedPatient);

  const handleDispatch = () => {
    const manifestNo = `REF-DY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRef: ReferralManifest = {
      id: `ref-${Date.now()}`,
      manifestNo: manifestNo,
      patientId: matchedVisit?.patientId || 'unknown',
      patientName: matchedVisit
        ? `${matchedVisit.patient.prefix} ${matchedVisit.patient.firstName} ${matchedVisit.patient.lastName}`
        : 'ผู้ป่วยฉุกเฉินวิกฤต (ไม่ทราบชื่อ)',
      hn: matchedVisit?.patient.hn || 'HN-EMERGENCY',
      age: matchedVisit?.patient.age || 50,
      gender: matchedVisit?.patient.gender === 'M' ? 'ชาย' : 'หญิง',
      triage: 'RED',
      originNode: 'ศูนย์บริการสาธารณสุข โหนดดอยยาว (อบจ.เชียงใหม่)',
      destinationHospital: destination,
      reason: emergencyReason,
      transportType: transportType,
      dispatchedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      etaMinutes: transportType === 'SKY_DOCTOR_HELICOPTER' ? 14 : 32,
      status: 'in_transit',
      attendingParamedic: 'จนท. สหรัฐ เชียงใหม่กู้ชีพ (EMT-Intermediate)',
      vitalsOnTransit: {
        bp: matchedVisit ? `${matchedVisit.vitals.bpSystolic}/${matchedVisit.vitals.bpDiastolic} mmHg` : '90/60 mmHg',
        hr: matchedVisit?.vitals.pulse || 110,
        spo2: matchedVisit?.vitals.spo2 || 92,
        gcs: 'E4V4M6',
        o2Flow: 'Non-rebreather mask 10 LPM',
        ivFluid: 'NSS 1000 ml KVO',
      },
      emergencyDrugsGiven: ['Oxygen High Flow', 'Adrenaline/Dopamine ready', 'NSS 1000ml'],
      telemetryActive: true,
    };

    setIsDispatched(true);
    setTimeout(() => {
      onDispatchReferral(newRef);
      setIsDispatched(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border-4 border-red-600 relative overflow-hidden">
        {/* Top Warning Strip */}
        <div className="bg-red-600 text-white -mx-6 -mt-6 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-white animate-bounce" />
            <div>
              <h3 className="font-extrabold text-base tracking-wide uppercase font-heading">
                ศูนย์กู้ชีพ 1669 & SKY DOCTOR HELICOPTER
              </h3>
              <p className="text-xs text-red-100 font-mono">
                อบจ. เชียงใหม่ • ศูนย์ประสานการแพทย์ฉุกเฉินดอยยาว (DY-EM-01)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded bg-red-700 hover:bg-red-800 text-white text-xs cursor-pointer"
              title="Toggle Alert Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 cursor-pointer p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-4 text-xs pt-1">
          {/* Quick Direct Hotline Call Bar */}
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-900">
              <PhoneCall className="w-5 h-5 text-red-600 animate-pulse" />
              <div>
                <span className="font-bold text-sm block">สายด่วนนเรนทร 1669 (เชียงใหม่)</span>
                <span className="text-[11px] text-red-700">คู่สายสำรองโหนดดอยยาว: 053-892-114</span>
              </div>
            </div>
            <a
              href="tel:1669"
              className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              โทรออกทันที
            </a>
          </div>

          {/* Select Case */}
          <div>
            <label className="font-bold text-slate-900 uppercase block mb-1">
              เลือกผู้ป่วยที่ต้องการนำส่งฉุกเฉิน (Select Critical Patient)
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-xs font-semibold"
            >
              {visits.map((v) => (
                <option key={v.id} value={v.id}>
                  [{v.triage}] {v.queueNo} — {v.patient.firstName} {v.patient.lastName} (HN: {v.patient.hn}) — {v.chiefComplaint.slice(0, 45)}...
                </option>
              ))}
              <option value="unknown">[RED] ผู้ป่วยอุบัติเหตุ/หมดสติฉุกเฉิน (ไม่ทราบชื่อ)</option>
            </select>
          </div>

          {/* Transport Mode */}
          <div>
            <label className="font-bold text-slate-900 uppercase block mb-1">
              ยานพาหนะลำเลียงผู้ป่วยลงเขา
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'EMS_4WD', name: 'รถ 4WD กู้ชีพดอยยาว', desc: 'ลงเขาแม่ริม (~32 นาที)' },
                { id: 'SKY_DOCTOR_HELICOPTER', name: 'Sky Doctor ฮ. กู้ชีพ', desc: 'เฮลิคอปเตอร์ สพฉ. (~14 นาที)' },
                { id: 'BLS_AMBULANCE', name: 'รถพยาบาลมาตรฐาน BLS', desc: 'ทางหลวง 1096 (~38 นาที)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTransportType(m.id as any)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                    transportType === m.id
                      ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">{m.name}</div>
                  <div className="text-[10px] text-slate-500">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Destination Supercenter */}
          <div>
            <label className="font-bold text-slate-900 uppercase block mb-1">
              โรงพยาบาลศูนย์ปลายทางรับผู้ป่วย
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs font-medium"
            >
              <option value="รพ.มหาราชนครเชียงใหม่ (สวนดอก) - Northern Heart & Trauma Center">
                รพ.มหาราชนครเชียงใหม่ (สวนดอก) - ศูนย์หัวใจและอุบัติเหตุภาคเหนือ
              </option>
              <option value="รพ.นครพิงค์ (ศูนย์ความเป็นเลิศทางการแพทย์ประจำจังหวัดเชียงใหม่)">
                รพ.นครพิงค์ (โรงพยาบาลศูนย์ประจำจังหวัดเชียงใหม่)
              </option>
              <option value="รพ.สันทราย (โรงพยาบาลแม่ข่ายโซนกลาง)">
                รพ.สันทราย (โรงพยาบาลแม่ข่ายโซนกลาง)
              </option>
              <option value="รพ.แม่ริม (โรงพยาบาลชุมชนต้นสังกัดพื้นที่)">
                รพ.แม่ริม (โรงพยาบาลชุมชนต้นสังกัดพื้นที่)
              </option>
            </select>
          </div>

          {/* Clinical Reason */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              อาการวิกฤตและเหตุผลความจำเป็นเร่งด่วน
            </label>
            <textarea
              rows={2}
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          {/* Radio Channel Banner */}
          <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Radio className="w-3.5 h-3.5" />
              RADIO FREQ: 155.775 MHz (อบจ.เชียงใหม่ กู้ชีพ)
            </span>
            <span className="text-sky-300">GPS TELEMETRY ON</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleDispatch}
              disabled={isDispatched}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              <Ambulance className="w-4 h-4 text-white" />
              <span>{isDispatched ? 'กำลังปล่อยทีมกู้ชีพ...' : 'ปล่อยทีมกู้ชีพ & เปิดสัญญาณ Fast Track'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
