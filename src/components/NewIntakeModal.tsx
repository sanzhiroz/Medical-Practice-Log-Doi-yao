import React, { useState } from 'react';
import { 
  UserPlus, 
  X, 
  Activity, 
  MapPin, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { ClinicalVisit, Patient, TriageLevel, VitalSigns } from '../types/medical';

interface NewIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newVisit: ClinicalVisit) => void;
  language: 'TH' | 'EN';
  currentCount: number;
}

export const NewIntakeModal: React.FC<NewIntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  language,
  currentCount,
}) => {
  if (!isOpen) return null;

  const [prefix, setPrefix] = useState('นาย');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [village, setVillage] = useState('หมู่ 1 บ้านดอยยาว');
  const [cid, setCid] = useState('3-5099-00124-77-9');
  const [coverage, setCoverage] = useState<'UCS' | 'SSS' | 'CSMBS' | 'HIGHLAND_0'>('UCS');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [triage, setTriage] = useState<TriageLevel>('GREEN');

  // Vitals
  const [bpSys, setBpSys] = useState<number>(124);
  const [bpDia, setBpDia] = useState<number>(78);
  const [pulse, setPulse] = useState<number>(76);
  const [rr, setRr] = useState<number>(18);
  const [temp, setTemp] = useState<number>(36.7);
  const [spo2, setSpo2] = useState<number>(98);
  const [dtx, setDtx] = useState<number>(115);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const patientId = `pt-${Date.now()}`;
    const hnNumber = `67-00${4500 + currentCount}`;
    const queueCode = triage === 'RED' ? `EM-${100 + currentCount}` : triage === 'YELLOW' ? `A-0${20 + currentCount}` : `B-0${50 + currentCount}`;

    const newPatient: Patient = {
      id: patientId,
      hn: hnNumber,
      vn: `69-11-${String(currentCount + 1).padStart(2, '0')}`,
      cid: cid || '3-5099-00000-00-0',
      prefix: prefix,
      firstName: firstName,
      lastName: lastName,
      age: Number(age) || 30,
      gender: gender,
      dob: '1980-01-01',
      bloodGroup: 'O+',
      village: village,
      district: 'อ.แม่ริม จ.เชียงใหม่',
      coverage: coverage,
      coverageDetail:
        coverage === 'UCS'
          ? 'สิทธิบัตรทอง อบจ.เชียงใหม่ (รพ.สต.ดอยยาว)'
          : coverage === 'SSS'
          ? 'สิทธิประกันสังคม (รพ.นครพิงค์)'
          : coverage === 'CSMBS'
          ? 'สิทธิสวัสดิการข้าราชการส่วนท้องถิ่น'
          : 'สิทธิบุคคลพื้นที่สูง (รหัส 0/อบจ.)',
      drugAllergies: [],
      underlyingDiseases: [],
      emergencyContact: {
        name: 'ญาติผู้ป่วย',
        relation: 'ญาติ',
        phone: '081-000-0000',
      },
    };

    const newVisit: ClinicalVisit = {
      id: `vis-${Date.now()}`,
      patientId: patientId,
      patient: newPatient,
      triage: triage,
      queueNo: queueCode,
      arrivalTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      status: 'triage',
      chiefComplaint: chiefComplaint || 'มาตรวจสุขภาพทั่วไปตามนัด',
      hpi: 'มีอาการมา 1-2 วันก่อนมาพบแพทย์ที่โหนดดอยยาว',
      physicalExam: 'รอตรวจโดยแพทย์ประจำโหนด',
      vitals: {
        bpSystolic: Number(bpSys) || 120,
        bpDiastolic: Number(bpDia) || 80,
        pulse: Number(pulse) || 75,
        rr: Number(rr) || 18,
        temp: Number(temp) || 36.8,
        spo2: Number(spo2) || 98,
        painScore: 2,
        dtx: Number(dtx) || 110,
        recordedAt: 'เวลานี้',
        recordedBy: 'พว. กัลยา นวลฉวี (พยาบาลคัดกรอง)',
      },
      primaryDiagnosis: {
        code: 'J06.9',
        nameThai: 'การติดเชื้อทางเดินหายใจเฉียบพลัน',
        nameEn: 'Acute upper respiratory infection',
      },
      secondaryDiagnoses: [],
      doctorNotes: 'รอแพทย์สั่งการตรวจรักษา',
      prescriptions: [],
      attendingClinician: {
        name: 'นพ. วรปรัชญ์ ศรีสุวรรณ',
        license: 'ว. 51842',
        role: 'แพทย์เวชศาสตร์ครอบครัว โหนดดอยยาว',
      },
      disposition: 'home',
    };

    onSubmit(newVisit);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0f2d6b] flex items-center justify-center text-white">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-heading">
                ลงทะเบียนรับผู้ป่วยใหม่ & คัดกรองอาการ (Intake & Triage)
              </h3>
              <p className="text-xs text-slate-500">
                ศูนย์บริการสาธารณสุข โหนดดอยยาว • อบจ. เชียงใหม่
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Triage Selector */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              ระดับการคัดกรองความเร่งด่วน (Emergency Triage)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'RED', label: '1: วิกฤต (Red)', color: 'bg-red-600 text-white' },
                { id: 'YELLOW', label: '2: เร่งด่วน (Yellow)', color: 'bg-amber-500 text-white' },
                { id: 'GREEN', label: '3: ไม่รุนแรง (Green)', color: 'bg-emerald-600 text-white' },
                { id: 'WHITE', label: '4: ทั่วไป (White)', color: 'bg-slate-600 text-white' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setTriage(lvl.id as TriageLevel)}
                  className={`p-2 rounded-lg font-bold text-center transition cursor-pointer border ${
                    triage === lvl.id
                      ? `${lvl.color} ring-2 ring-offset-1 ring-slate-800`
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">คำนำหน้า</label>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md bg-white"
              >
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="น.ส.">น.ส.</option>
                <option value="ด.ช.">ด.ช.</option>
                <option value="ด.ญ.">ด.ญ.</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">ชื่อจริง</label>
              <input
                type="text"
                required
                placeholder="เช่น บัวผัน"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">นามสกุล</label>
              <input
                type="text"
                required
                placeholder="เช่น คำปวน"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">อายุ (ปี)</label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">หมู่บ้าน / ชุมชน</label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md bg-white"
              >
                <option value="หมู่ 1 บ้านดอยยาว">หมู่ 1 บ้านดอยยาว</option>
                <option value="หมู่ 2 บ้านห้วยทราย">หมู่ 2 บ้านห้วยทราย</option>
                <option value="หมู่ 3 บ้านผาแดง">หมู่ 3 บ้านผาแดง</option>
                <option value="หมู่ 4 บ้านแม่ข่อง">หมู่ 4 บ้านแม่ข่อง</option>
                <option value="หมู่ 5 บ้านปางควาย">หมู่ 5 บ้านปางควาย</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">สิทธิการรักษาพยาบาล</label>
              <select
                value={coverage}
                onChange={(e) => setCoverage(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-md bg-white"
              >
                <option value="UCS">บัตรทอง อบจ. เชียงใหม่ (UCS)</option>
                <option value="SSS">ประกันสังคม (รพ.นครพิงค์)</option>
                <option value="CSMBS">สวัสดิการข้าราชการ</option>
                <option value="HIGHLAND_0">สิทธิบุคคลพื้นที่สูง (รหัส 0)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">เลขบัตรประชาชน (13 หลัก)</label>
              <input
                type="text"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md font-mono"
              />
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">อาการสำคัญแรกรับ (Chief Complaint)</label>
            <input
              type="text"
              required
              placeholder="เช่น มีไข้สูง ไอ หอบเหนื่อย หรือ ถูกของมีคมบาด..."
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md"
            />
          </div>

          {/* Vitals */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 uppercase text-[11px] block flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#0284c7]" />
              สัญญาณชีพแรกรับ ณ จุดคัดกรอง
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 block">BP บน</label>
                <input
                  type="number"
                  value={bpSys}
                  onChange={(e) => setBpSys(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-center font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block">BP ล่าง</label>
                <input
                  type="number"
                  value={bpDia}
                  onChange={(e) => setBpDia(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-center font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block">Pulse</label>
                <input
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-center font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block">SpO2 (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-center font-mono text-blue-700 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-center font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block">DTX (mg/dL)</label>
                <input
                  type="number"
                  value={dtx}
                  onChange={(e) => setDtx(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-center font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0f2d6b] hover:bg-[#001849] text-white font-bold shadow-sm transition cursor-pointer"
            >
              ออกบัตรคิวและส่งเข้าห้องตรวจ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
