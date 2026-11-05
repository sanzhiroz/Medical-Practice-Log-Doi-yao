import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Building2, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck,
  Calendar,
  UserCheck
} from 'lucide-react';
import { ClinicalVisit, ReferralManifest } from '../types/medical';

interface OfficialDocumentsProps {
  visits: ClinicalVisit[];
  referrals: ReferralManifest[];
  language: 'TH' | 'EN';
}

type DocType = 'referral_form' | 'medical_cert' | 'triage_slip' | 'daily_census';

export const OfficialDocuments: React.FC<OfficialDocumentsProps> = ({
  visits,
  referrals,
  language,
}) => {
  const [activeDoc, setActiveDoc] = useState<DocType>('referral_form');
  const [selectedVisitId, setSelectedVisitId] = useState<string>(visits[0]?.id || '');
  const [selectedRefId, setSelectedRefId] = useState<string>(referrals[0]?.id || '');

  const visit = visits.find((v) => v.id === selectedVisitId) || visits[0];
  const ref = referrals.find((r) => r.id === selectedRefId) || referrals[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            เลือกแบบฟอร์มเอกสารราชการ:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'referral_form', label: 'ใบส่งต่อผู้ป่วย (Referral Manifest)' },
              { id: 'medical_cert', label: 'ใบรับรองแพทย์โหนดดอยยาว' },
              { id: 'triage_slip', label: 'ใบคัดกรองและบัตรคิว' },
              { id: 'daily_census', label: 'รายงานสถิติประจำวัน อบจ.' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDoc(tab.id as DocType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeDoc === tab.id
                    ? 'bg-[#0f2d6b] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeDoc === 'referral_form' && (
            <select
              value={selectedRefId}
              onChange={(e) => setSelectedRefId(e.target.value)}
              className="p-1.5 border border-slate-300 rounded text-xs bg-slate-50 font-mono"
            >
              {referrals.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.manifestNo} — {r.patientName}
                </option>
              ))}
            </select>
          )}

          {(activeDoc === 'medical_cert' || activeDoc === 'triage_slip') && (
            <select
              value={selectedVisitId}
              onChange={(e) => setSelectedVisitId(e.target.value)}
              className="p-1.5 border border-slate-300 rounded text-xs bg-slate-50"
            >
              {visits.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.queueNo} — {v.patient.firstName} {v.patient.lastName} (HN: {v.patient.hn})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-[#0284c7] hover:bg-[#006398] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์เอกสารราชการ (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Document Sheet */}
      <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-300 shadow-sm max-w-4xl mx-auto text-slate-900 font-sans print:border-none print:shadow-none print:p-0">
        
        {/* DOCUMENT 1: Standard Thai Referral Manifest Form */}
        {activeDoc === 'referral_form' && ref && (
          <div className="space-y-6 text-xs leading-relaxed">
            {/* Header with Thai Garuda / Provincial Emblem */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#001849] flex items-center justify-center text-white border-2 border-[#0284c7]">
                  <Building2 className="w-9 h-9 text-[#5bb8fe]" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-heading text-slate-900 uppercase">
                    องค์การบริหารส่วนจังหวัดเชียงใหม่ (อบจ. เชียงใหม่)
                  </h2>
                  <h3 className="text-sm font-semibold text-slate-700">
                    ศูนย์บริการการแพทย์ปฐมภูมิ โหนดดอยยาว (Node Doi Yao) • กองสาธารณสุข
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    โทรสารฉุกเฉิน: 053-892-114 • วิทยุสื่อสาร VHF: 155.775 MHz • พิกัด DY-CM-048
                  </p>
                </div>
              </div>

              <div className="text-right font-mono space-y-1">
                <div className="font-extrabold text-sm text-red-700">
                  แบบฟอร์มส่งต่อ อบจ.ชม. ๐๑
                </div>
                <div className="text-xs">
                  เลขที่นำส่ง: <strong>{ref.manifestNo}</strong>
                </div>
                <div className="text-[10px] text-slate-500">
                  เวลาส่งออก: {ref.dispatchedAt}
                </div>
              </div>
            </div>

            <div className="text-center py-1">
              <h1 className="text-base font-bold underline font-heading text-slate-900">
                ใบส่งต่อผู้ป่วยฉุกเฉินและเวชระเบียนนำส่ง (PATIENT TRANSFER MANIFEST)
              </h1>
              <span className="text-[11px] font-semibold text-red-600">
                [ ระดับความเร่งด่วน: {ref.triage} — {ref.transportType} ]
              </span>
            </div>

            {/* Section 1: Demographics */}
            <div className="border border-slate-300 rounded p-3 space-y-2 bg-slate-50/50">
              <div className="font-bold text-slate-800 text-[11px] uppercase border-b border-slate-200 pb-1">
                ๑. ข้อมูลทั่วไปผู้ป่วย (Patient Demographics)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>ชื่อ-สกุล: <strong>{ref.patientName}</strong></div>
                <div>อายุ: <strong>{ref.age} ปี</strong> (เพศ {ref.gender})</div>
                <div>เลขประจำตัวผู้ป่วย (HN): <strong>{ref.hn}</strong></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>หน่วยบริการต้นทาง: <strong>{ref.originNode}</strong></div>
                <div>โรงพยาบาลปลายทางรับส่งต่อ: <strong className="text-red-700">{ref.destinationHospital}</strong></div>
              </div>
            </div>

            {/* Section 2: Clinical Summary & Reason */}
            <div className="border border-slate-300 rounded p-3 space-y-2">
              <div className="font-bold text-slate-800 text-[11px] uppercase border-b border-slate-200 pb-1">
                ๒. ข้อบ่งชี้และเหตุผลความจำเป็นในการส่งต่อ (Clinical Indications)
              </div>
              <p className="font-medium text-slate-900 text-xs">
                {ref.reason}
              </p>
              <div>
                <strong>ยาและการรักษาฉุกเฉินที่ให้แล้ว ณ จุดเกิดเหตุ/โหนด:</strong>{' '}
                {ref.emergencyDrugsGiven.join(', ')}
              </div>
            </div>

            {/* Section 3: In-Transit Vitals */}
            <div className="border border-slate-300 rounded p-3 space-y-2 bg-slate-50/50">
              <div className="font-bold text-slate-800 text-[11px] uppercase border-b border-slate-200 pb-1">
                ๓. สัญญาณชีพและการเฝ้าระวังขณะเคลื่อนย้าย (Vital Signs on Transit)
              </div>
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-white p-1.5 border rounded">
                  <span className="text-[10px] text-slate-500 block">ความดันโลหิต</span>
                  <strong>{ref.vitalsOnTransit.bp}</strong>
                </div>
                <div className="bg-white p-1.5 border rounded">
                  <span className="text-[10px] text-slate-500 block">ชีพจร</span>
                  <strong>{ref.vitalsOnTransit.hr} bpm</strong>
                </div>
                <div className="bg-white p-1.5 border rounded">
                  <span className="text-[10px] text-slate-500 block">ออกซิเจน SpO2</span>
                  <strong className="text-blue-700">{ref.vitalsOnTransit.spo2}%</strong>
                </div>
                <div className="bg-white p-1.5 border rounded">
                  <span className="text-[10px] text-slate-500 block">ระดับความรู้สึกตัว</span>
                  <strong>{ref.vitalsOnTransit.gcs}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div><strong>การให้ออกซิเจน:</strong> {ref.vitalsOnTransit.o2Flow}</div>
                <div><strong>สารน้ำทางหลอดเลือดดำ:</strong> {ref.vitalsOnTransit.ivFluid}</div>
              </div>
            </div>

            {/* Section 4: Signatures */}
            <div className="grid grid-cols-2 gap-6 pt-6 text-center">
              <div className="space-y-4">
                <div className="h-10 border-b border-dashed border-slate-400 w-48 mx-auto"></div>
                <div>
                  <div className="font-bold">({ref.attendingParamedic})</div>
                  <div className="text-[11px] text-slate-500">หัวหน้าทีมกู้ชีพส่งต่อ โหนดดอยยาว</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-10 border-b border-dashed border-slate-400 w-48 mx-auto"></div>
                <div>
                  <div className="font-bold">({ref.handoverDoctor || 'แพทย์ผู้รับมอบเคส'})</div>
                  <div className="text-[11px] text-slate-500">แพทย์เวรห้องฉุกเฉิน รพ. ปลายทาง</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t text-[10px] text-slate-400 text-center flex items-center justify-between">
              <span>ระบบเวชระเบียนส่งต่อดิจิทัล • อบจ. เชียงใหม่ Health Link</span>
              <span>พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}</span>
            </div>
          </div>
        )}

        {/* DOCUMENT 2: Medical Certificate */}
        {activeDoc === 'medical_cert' && visit && (
          <div className="space-y-6 text-xs leading-relaxed">
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <div className="w-12 h-12 rounded-full bg-[#001849] mx-auto flex items-center justify-center text-white mb-2">
                <Building2 className="w-6 h-6 text-[#5bb8fe]" />
              </div>
              <h2 className="text-base font-bold font-heading text-slate-900">
                ใบรับรองการตรวจรักษาทางการแพทย์ (MEDICAL CERTIFICATE)
              </h2>
              <h3 className="text-xs text-slate-700">
                ศูนย์บริการการแพทย์ปฐมภูมิ โหนดดอยยาว • องค์การบริหารส่วนจังหวัดเชียงใหม่
              </h3>
            </div>

            <div className="text-right">
              วันที่ออกเอกสาร: <strong>{new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}</strong>
            </div>

            <div className="space-y-3 pt-2 text-justify">
              <p>
                ข้าพเจ้า <strong>{visit.attendingClinician.name}</strong> ใบอนุญาตประกอบวิชาชีพเวชกรรม/พยาบาล เลขที่ <strong>{visit.attendingClinician.license}</strong> ประจำศูนย์บริการสาธารณสุข โหนดดอยยาว อบจ.เชียงใหม่
              </p>
              <p>
                ได้ทำการตรวจรักษา <strong>{visit.patient.prefix} {visit.patient.firstName} {visit.patient.lastName}</strong> อายุ <strong>{visit.patient.age}</strong> ปี เลขประจำตัวประชาชน <strong>{visit.patient.cid}</strong> เลขประจำตัวผู้ป่วย (HN) <strong>{visit.patient.hn}</strong> อยู่บ้านเลขที่/หมู่บ้าน <strong>{visit.patient.village} {visit.patient.district}</strong>
              </p>
              <p>
                เมื่อวันที่ <strong>{new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}</strong> ด้วยอาการสำคัญ: <strong>{visit.chiefComplaint}</strong>
              </p>
              <p>
                การวินิจฉัยโรค: <strong>{visit.primaryDiagnosis.nameThai} ({visit.primaryDiagnosis.nameEn}) [ICD-10: {visit.primaryDiagnosis.code}]</strong>
              </p>
              <p>
                ความเห็นของผู้ตรวจรักษา: ผู้ป่วยได้รับการตรวจรักษาและจ่ายยาตามมาตรฐาน ควรหยุดพักผ่อนและหลีกเลี่ยงกิจกรรมหนัก เป็นเวลา <strong>2 วัน</strong> ตั้งแต่วันที่ {new Date().toLocaleDateString('th-TH')} ถึงวันที่ {new Date(Date.now() + 86400000).toLocaleDateString('th-TH')}
              </p>
            </div>

            <div className="pt-10 flex justify-end text-center">
              <div className="space-y-2 w-64">
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <div className="font-bold">({visit.attendingClinician.name})</div>
                <div className="text-[11px] text-slate-500">{visit.attendingClinician.role}</div>
                <div className="text-[10px] text-slate-400">ประทับตรา อบจ.เชียงใหม่ โหนดดอยยาว</div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT 3: Triage & Intake Slip */}
        {activeDoc === 'triage_slip' && visit && (
          <div className="max-w-md mx-auto border-2 border-dashed border-slate-400 p-6 rounded-lg text-center space-y-3 font-mono">
            <div className="border-b pb-2">
              <div className="font-bold text-sm text-[#001849]">อบจ. เชียงใหม่ • โหนดดอยยาว</div>
              <div className="text-[10px] text-slate-500">บัตรคิวและใบคัดกรองผู้ป่วยนอก (OPD Intake)</div>
            </div>

            <div className="py-2">
              <div className="text-4xl font-black text-slate-900 tracking-wider">
                {visit.queueNo}
              </div>
              <span className={`inline-block mt-1 px-3 py-0.5 rounded text-xs font-bold ${
                visit.triage === 'RED' ? 'bg-red-600 text-white' :
                visit.triage === 'YELLOW' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
              }`}>
                TRIAGE LEVEL: {visit.triage}
              </span>
            </div>

            <div className="text-left text-xs space-y-1 border-t border-b py-2 text-slate-800">
              <div>ชื่อ: <strong>{visit.patient.prefix} {visit.patient.firstName} {visit.patient.lastName}</strong></div>
              <div>HN: <strong>{visit.patient.hn}</strong> • VN: <strong>{visit.patient.vn}</strong></div>
              <div>สิทธิ: {visit.patient.coverageDetail}</div>
              <div>เวลามาถึง: {visit.arrivalTime}</div>
              <div className="text-red-700">
                BP: {visit.vitals.bpSystolic}/{visit.vitals.bpDiastolic} | PR: {visit.vitals.pulse} | SpO2: {visit.vitals.spo2}%
              </div>
            </div>

            <div className="flex justify-center py-2">
              <div className="p-2 border rounded bg-slate-50">
                <QrCode className="w-20 h-20 text-slate-800" />
              </div>
            </div>

            <div className="text-[10px] text-slate-400">
              กรุณารอเรียกคิวหน้าห้องตรวจ หรือสังเกตสัญญาณจอโทรทัศน์โหนดดอยยาว
            </div>
          </div>
        )}

        {/* DOCUMENT 4: Daily Census Report */}
        {activeDoc === 'daily_census' && (
          <div className="space-y-4 text-xs">
            <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold uppercase text-slate-900 font-heading">
                  รายงานสถิติบริการการแพทย์และสาธารณสุขประจำวัน
                </h2>
                <h3 className="text-xs text-slate-600">
                  ศูนย์บริการสาธารณสุข โหนดดอยยาว (DY-CM-048) • กองสาธารณสุข อบจ. เชียงใหม่
                </h3>
              </div>
              <div className="text-right font-mono text-[11px]">
                วันที่: {new Date().toLocaleDateString('th-TH', { dateStyle: 'medium' })}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 border rounded bg-slate-50">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">ผู้รับบริการทั้งหมด</span>
                <span className="text-2xl font-bold text-slate-900">{visits.length} ราย</span>
              </div>
              <div className="p-3 border rounded bg-red-50 text-red-800">
                <span className="text-[10px] block uppercase font-bold">เคสวิกฤต (Red)</span>
                <span className="text-2xl font-bold">{visits.filter(v => v.triage === 'RED').length} ราย</span>
              </div>
              <div className="p-3 border rounded bg-blue-50 text-blue-800">
                <span className="text-[10px] block uppercase font-bold">ส่งต่อไป รพ.ศูนย์</span>
                <span className="text-2xl font-bold">{referrals.length} ราย</span>
              </div>
              <div className="p-3 border rounded bg-emerald-50 text-emerald-800">
                <span className="text-[10px] block uppercase font-bold">ตรวจเสร็จสิ้นกลับบ้าน</span>
                <span className="text-2xl font-bold">{visits.filter(v => v.disposition === 'home').length} ราย</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-bold text-slate-900 mb-2">
                สรุปรายชื่อผู้ป่วยตรวจรักษาในรอบวัน
              </h4>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 font-semibold border-b">
                  <tr>
                    <th className="p-2">คิว / HN</th>
                    <th className="p-2">ชื่อผู้ป่วย</th>
                    <th className="p-2">การวินิจฉัย (ICD-10)</th>
                    <th className="p-2">ความดัน/SpO2</th>
                    <th className="p-2">ผลการรักษา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visits.map((v) => (
                    <tr key={v.id}>
                      <td className="p-2 font-mono">{v.queueNo} (HN: {v.patient.hn})</td>
                      <td className="p-2">{v.patient.firstName} {v.patient.lastName}</td>
                      <td className="p-2 font-mono">[{v.primaryDiagnosis.code}] {v.primaryDiagnosis.nameThai}</td>
                      <td className="p-2 font-mono">{v.vitals.bpSystolic}/{v.vitals.bpDiastolic} | {v.vitals.spo2}%</td>
                      <td className="p-2">{v.disposition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
