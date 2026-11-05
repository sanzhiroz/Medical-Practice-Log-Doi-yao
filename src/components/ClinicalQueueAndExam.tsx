import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Stethoscope, 
  Heart, 
  Activity, 
  AlertCircle, 
  FileText, 
  Pill, 
  Send, 
  Printer, 
  Save, 
  UserCheck, 
  Plus, 
  Trash2, 
  Clock, 
  Check, 
  MapPin, 
  ShieldAlert,
  ChevronRight,
  Eye,
  CheckCircle2,
  Ambulance,
  Edit3
} from 'lucide-react';
import { ClinicalVisit, Patient, PrescriptionItem, TriageLevel, VitalSigns } from '../types/medical';

interface ClinicalQueueAndExamProps {
  visits: ClinicalVisit[];
  selectedVisit: ClinicalVisit | null;
  onSelectVisit: (visit: ClinicalVisit) => void;
  onUpdateVisit: (updated: ClinicalVisit) => void;
  onOpenNewIntake: () => void;
  onInitiateReferral: (visit: ClinicalVisit) => void;
  language: 'TH' | 'EN';
}

const COMMON_ICD10 = [
  { code: 'J44.1', nameThai: 'โรคปอดอุดกั้นเรื้อรังกำเริบเฉียบพลัน (COPD Exacerbation)', nameEn: 'COPD with acute exacerbation' },
  { code: 'I10', nameThai: 'ความดันโลหิตสูงปฐมภูมิ (Essential Hypertension)', nameEn: 'Essential hypertension' },
  { code: 'E11.9', nameThai: 'เบาหวานชนิดที่ 2 ไม่มีภาวะแทรกซ้อน (Type 2 Diabetes)', nameEn: 'Type 2 diabetes mellitus' },
  { code: 'I21.9', nameThai: 'กล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน (Acute Myocardial Infarction / STEMI)', nameEn: 'Acute myocardial infarction' },
  { code: 'J06.9', nameThai: 'การติดเชื้อทางเดินหายใจส่วนบนเฉียบพลัน (URI/หวัด)', nameEn: 'Acute upper respiratory infection' },
  { code: 'A09.9', nameThai: 'กระเพาะอาหารและลำไส้อักเสบเฉียบพลัน (Gastroenteritis)', nameEn: 'Gastroenteritis and colitis' },
  { code: 'T15.0', nameThai: 'สิ่งแปลกปลอมในกระจกตา (Corneal foreign body/abrasion)', nameEn: 'Foreign body in cornea' },
  { code: 'L50.0', nameThai: 'ลมพิษจากภูมิแพ้ (Allergic Urticaria)', nameEn: 'Allergic urticaria' },
  { code: 'M54.5', nameThai: 'ปวดหลังส่วนล่างเฉียบพลัน (Low Back Pain / Lumbago)', nameEn: 'Low back pain' },
  { code: 'S06.0', nameThai: 'การกระทบกระแทกทางสมองจากอุบัติเหตุ (Concussion/TBI)', nameEn: 'Concussion' },
  { code: 'T63.0', nameThai: 'พิษจากงูกัด (Snake venom poisoning)', nameEn: 'Toxic effect of snake venom' },
];

export const ClinicalQueueAndExam: React.FC<ClinicalQueueAndExamProps> = ({
  visits,
  selectedVisit,
  onSelectVisit,
  onUpdateVisit,
  onOpenNewIntake,
  onInitiateReferral,
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [triageFilter, setTriageFilter] = useState<'ALL' | TriageLevel>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active visit form state
  const current = selectedVisit || visits[0];
  const [editNotes, setEditNotes] = useState(current?.doctorNotes || '');
  const [editChiefComplaint, setEditChiefComplaint] = useState(current?.chiefComplaint || '');
  const [editHpi, setEditHpi] = useState(current?.hpi || '');
  const [editExam, setEditExam] = useState(current?.physicalExam || '');
  const [selectedIcd, setSelectedIcd] = useState(current?.primaryDiagnosis?.code || 'J44.1');
  const [editDisposition, setEditDisposition] = useState(current?.disposition || 'home');
  const [editVitals, setEditVitals] = useState<VitalSigns>(
    current?.vitals || {
      bpSystolic: 120,
      bpDiastolic: 80,
      pulse: 75,
      rr: 18,
      temp: 36.8,
      spo2: 98,
      painScore: 0,
      dtx: 110,
      recordedAt: '10:00 น.',
      recordedBy: 'พว. กัลยา นวลฉวี',
    }
  );
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(current?.prescriptions || []);

  // Sync state when selectedVisit changes
  React.useEffect(() => {
    if (selectedVisit) {
      setEditNotes(selectedVisit.doctorNotes);
      setEditChiefComplaint(selectedVisit.chiefComplaint);
      setEditHpi(selectedVisit.hpi);
      setEditExam(selectedVisit.physicalExam);
      setSelectedIcd(selectedVisit.primaryDiagnosis?.code || 'J44.1');
      setEditDisposition(selectedVisit.disposition);
      setEditVitals(selectedVisit.vitals);
      setPrescriptions(selectedVisit.prescriptions);
      setIsEditing(false);
    }
  }, [selectedVisit]);

  // Filter visits
  const filteredVisits = visits.filter((v) => {
    const matchesSearch =
      v.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.patient.hn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.queueNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.patient.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTriage = triageFilter === 'ALL' || v.triage === triageFilter;
    return matchesSearch && matchesTriage;
  });

  const handleSaveEncounter = () => {
    if (!current) return;
    const foundIcd = COMMON_ICD10.find((i) => i.code === selectedIcd) || {
      code: selectedIcd,
      nameThai: 'การวินิจฉัยโรคทางคลินิก',
      nameEn: 'Clinical Diagnosis',
    };

    const updated: ClinicalVisit = {
      ...current,
      chiefComplaint: editChiefComplaint,
      hpi: editHpi,
      physicalExam: editExam,
      doctorNotes: editNotes,
      primaryDiagnosis: foundIcd,
      disposition: editDisposition,
      vitals: editVitals,
      prescriptions: prescriptions,
      status: editDisposition === 'refer_supercenter' ? 'referred' : 'completed',
    };

    onUpdateVisit(updated);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddMedication = () => {
    const newRx: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      name: 'Paracetamol 500mg',
      genericName: 'Paracetamol',
      strength: '500 mg',
      dosage: '1 เม็ด',
      frequency: 'ทุก 4-6 ชั่วโมง เมื่อมีอาการปวดหรือมีไข้',
      route: 'Oral',
      quantity: 20,
      unit: 'เม็ด',
      instructions: 'รับประทานเมื่อปวดหรือมีไข้',
    };
    setPrescriptions([...prescriptions, newRx]);
  };

  const handleRemoveMedication = (id: string) => {
    setPrescriptions(prescriptions.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Search and Triage Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              language === 'TH'
                ? 'ค้นหาชื่อผู้ป่วย, เลข HN, เลขคิว, หมู่บ้าน...'
                : 'Search patient name, HN, queue, village...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:bg-white transition"
          />
        </div>

        {/* Triage filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {language === 'TH' ? 'ระดับคัดกรอง:' : 'Triage:'}
          </span>
          {(['ALL', 'RED', 'YELLOW', 'GREEN', 'WHITE'] as const).map((lvl) => {
            const isActive = triageFilter === lvl;
            const colors = {
              ALL: isActive ? 'bg-[#0f2d6b] text-white' : 'bg-slate-100 text-slate-700',
              RED: isActive ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 border-red-200',
              YELLOW: isActive ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 border-amber-200',
              GREEN: isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
              WHITE: isActive ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-700 border-slate-200',
            }[lvl];

            return (
              <button
                key={lvl}
                onClick={() => setTriageFilter(lvl)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition border cursor-pointer ${colors}`}
              >
                {lvl}
              </button>
            );
          })}

          <button
            onClick={onOpenNewIntake}
            className="ml-auto px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#006398] text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'TH' ? 'รับผู้ป่วยใหม่' : 'New Intake'}</span>
          </button>
        </div>
      </div>

      {/* Main Workstation 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (4 cols): Queue list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-slate-700 tracking-wider">
                {language === 'TH' ? 'รายการคิวรอตรวจ (OPD Queue)' : 'Waiting Encounters'}
              </span>
              <span className="text-xs font-mono font-semibold bg-[#eaedff] text-[#0f2d6b] px-2 py-0.5 rounded-full">
                {filteredVisits.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
              {filteredVisits.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  {language === 'TH' ? 'ไม่พบข้อมูลคิวผู้ป่วย' : 'No patients found'}
                </div>
              ) : (
                filteredVisits.map((v) => {
                  const isSelected = current?.id === v.id;
                  const triageColor = {
                    RED: 'border-l-red-600 bg-red-50/20',
                    YELLOW: 'border-l-amber-500 bg-amber-50/20',
                    GREEN: 'border-l-emerald-500 bg-emerald-50/20',
                    WHITE: 'border-l-slate-400 bg-slate-50/20',
                  }[v.triage];

                  return (
                    <div
                      key={v.id}
                      onClick={() => onSelectVisit(v)}
                      className={`p-3.5 border-l-4 transition cursor-pointer hover:bg-slate-50 ${triageColor} ${
                        isSelected ? 'bg-[#eaedff]/60 border-l-[#0284c7] ring-1 ring-[#0284c7]/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              v.triage === 'RED'
                                ? 'bg-red-600 animate-pulse'
                                : v.triage === 'YELLOW'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          ></span>
                          <span>{v.queueNo}</span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            ({v.arrivalTime})
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {v.status}
                        </span>
                      </div>

                      <div className="mt-1 font-semibold text-slate-900 text-xs sm:text-sm">
                        {v.patient.prefix} {v.patient.firstName} {v.patient.lastName}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between mt-0.5">
                        <span className="font-mono">HN {v.patient.hn}</span>
                        <span>{v.patient.age} ปี • {v.patient.village}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-1 italic">
                        "{v.chiefComplaint}"
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-700">
                        <span>BP: {v.vitals.bpSystolic}/{v.vitals.bpDiastolic}</span>
                        <span>PR: {v.vitals.pulse}</span>
                        <span className={v.vitals.spo2 < 95 ? 'text-red-600 font-bold' : ''}>
                          SpO2: {v.vitals.spo2}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right (8 cols): Detailed Clinical Chart & Examination */}
        {current && (
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {/* Header: Patient Profile Card */}
            <div className="bg-gradient-to-r from-[#001849] via-[#0f2d6b] to-[#1e3a8a] text-white p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#0284c7] text-white text-[10px] font-bold">
                      {current.queueNo}
                    </span>
                    <span className="text-xs text-[#93ccff] font-mono">
                      VN: {current.patient.vn} • HN: {current.patient.hn}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      current.triage === 'RED' ? 'bg-red-600 text-white animate-pulse' :
                      current.triage === 'YELLOW' ? 'bg-amber-500 text-white' :
                      'bg-emerald-600 text-white'
                    }`}>
                      TRIAGE {current.triage}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-heading mt-1">
                    {current.patient.prefix} {current.patient.firstName} {current.patient.lastName}
                    <span className="text-xs font-normal text-[#dae2fd] ml-2">
                      ({current.patient.age} ปี • เพศ {current.patient.gender === 'M' ? 'ชาย' : 'หญิง'} • หมู่โลหิต {current.patient.bloodGroup})
                    </span>
                  </h3>

                  <div className="text-xs text-[#dae2fd]/85 mt-1 flex flex-wrap items-center gap-3">
                    <span>บัตรประชาชน: {current.patient.cid}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#38bdf8]" />
                      {current.patient.village} {current.patient.district}
                    </span>
                  </div>
                </div>

                {/* Right: Coverage and Emergency buttons */}
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="px-2.5 py-1 rounded bg-[#001236]/80 border border-[#2a4482] text-right text-xs">
                    <span className="text-[10px] text-[#7bd0ff] block">สิทธิการรักษาพยาบาล</span>
                    <span className="font-semibold text-white">{current.patient.coverageDetail}</span>
                  </div>

                  {current.disposition === 'refer_supercenter' || current.triage === 'RED' ? (
                    <button
                      onClick={() => onInitiateReferral(current)}
                      className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer animate-pulse"
                    >
                      <Ambulance className="w-4 h-4" />
                      <span>{language === 'TH' ? 'ส่งต่อ รพ.ศูนย์ (Referral)' : 'Initiate Referral'}</span>
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Drug Allergies & Underlying Conditions Warning Badges */}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
                {current.patient.drugAllergies && current.patient.drugAllergies.length > 0 ? (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/80 border border-red-500 text-red-200 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="font-bold">แพ้ยา:</span>
                    <span>{current.patient.drugAllergies.join(', ')}</span>
                  </div>
                ) : (
                  <div className="px-2 py-0.5 rounded bg-white/10 text-emerald-300 text-[11px]">
                    ✓ ปฏิเสธประวัติแพ้ยา
                  </div>
                )}

                {current.patient.underlyingDiseases && current.patient.underlyingDiseases.length > 0 && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-700 text-slate-200">
                    <span className="text-sky-300 font-semibold">โรคประจำตัว:</span>
                    <span>{current.patient.underlyingDiseases.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="bg-[#eaedff]/40 p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0f2d6b] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#0284c7]" />
                  {language === 'TH' ? 'สัญญาณชีพแรกรับ (Intake Vital Signs)' : 'Encounter Vital Signs'}
                </span>
                <span className="text-[11px] text-slate-500">
                  บันทึกโดย: {current.vitals.recordedBy} ({current.vitals.recordedAt})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {/* BP */}
                <div className={`p-2.5 rounded-lg border text-center ${
                  editVitals.bpSystolic >= 140 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">BP (mmHg)</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {editVitals.bpSystolic}/{editVitals.bpDiastolic}
                  </div>
                  <span className={`text-[9px] font-semibold ${
                    editVitals.bpSystolic >= 140 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    {editVitals.bpSystolic >= 140 ? 'Stage 2 HT' : 'Normal'}
                  </span>
                </div>

                {/* Pulse */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Pulse (bpm)</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">{editVitals.pulse}</div>
                  <span className="text-[9px] text-slate-400">Regular</span>
                </div>

                {/* RR */}
                <div className={`p-2.5 rounded-lg border text-center ${
                  editVitals.rr > 22 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">RR (/min)</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">{editVitals.rr}</div>
                  <span className="text-[9px] text-slate-400">{editVitals.rr > 22 ? 'Tachypnea' : 'Normal'}</span>
                </div>

                {/* SpO2 */}
                <div className={`p-2.5 rounded-lg border text-center ${
                  editVitals.spo2 < 95 ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">SpO2 (%)</span>
                  <div className={`font-mono font-bold text-sm ${
                    editVitals.spo2 < 95 ? 'text-red-700 font-extrabold' : 'text-slate-900'
                  }`}>
                    {editVitals.spo2}%
                  </div>
                  <span className={`text-[9px] font-semibold ${
                    editVitals.spo2 < 95 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {editVitals.spo2 < 95 ? 'Hypoxia' : 'Adequate'}
                  </span>
                </div>

                {/* Temp */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Temp (°C)</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">{editVitals.temp}</div>
                  <span className="text-[9px] text-slate-400">Afebrile</span>
                </div>

                {/* Pain */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Pain (0-10)</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">{editVitals.painScore} / 10</div>
                  <span className="text-[9px] text-slate-400">VAS Score</span>
                </div>

                {/* DTX */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">DTX (mg/dL)</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">{editVitals.dtx || '-'}</div>
                  <span className="text-[9px] text-slate-400">Random Blood Glucose</span>
                </div>
              </div>
            </div>

            {/* Clinical Encounter Fields */}
            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[500px]">
              {/* Chief Complaint */}
              <div>
                <label className="font-bold text-slate-900 uppercase text-[11px] block mb-1">
                  {language === 'TH' ? 'อาการสำคัญ (Chief Complaint)' : 'Chief Complaint (CC)'}
                </label>
                <textarea
                  rows={2}
                  value={editChiefComplaint}
                  onChange={(e) => setEditChiefComplaint(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  placeholder="บันทึกอาการสำคัญ..."
                />
              </div>

              {/* HPI & Physical Exam Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 uppercase text-[11px] block mb-1">
                    {language === 'TH' ? 'ประวัติปัจจุบัน (History of Present Illness)' : 'History of Present Illness (HPI)'}
                  </label>
                  <textarea
                    rows={3}
                    value={editHpi}
                    onChange={(e) => setEditHpi(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                    placeholder="ประวัติการเจ็บป่วย..."
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 uppercase text-[11px] block mb-1">
                    {language === 'TH' ? 'การตรวจร่างกาย (Physical Examination)' : 'Physical Examination (PE)'}
                  </label>
                  <textarea
                    rows={3}
                    value={editExam}
                    onChange={(e) => setEditExam(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                    placeholder="ผลการตรวจร่างกาย..."
                  />
                </div>
              </div>

              {/* ICD-10 Primary Diagnosis */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0284c7]" />
                    {language === 'TH' ? 'การวินิจฉัยโรคหลัก (Primary ICD-10 Diagnosis)' : 'Primary ICD-10 Code'}
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">มาตรฐาน สปสช./กระทรวงสาธารณสุข</span>
                </div>

                <select
                  value={selectedIcd}
                  onChange={(e) => setSelectedIcd(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                >
                  {COMMON_ICD10.map((item) => (
                    <option key={item.code} value={item.code}>
                      [{item.code}] {item.nameThai} — {item.nameEn}
                    </option>
                  ))}
                </select>

                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-[#0f2d6b]">วินิจฉัย:</span>{' '}
                  {COMMON_ICD10.find((i) => i.code === selectedIcd)?.nameThai} (
                  {COMMON_ICD10.find((i) => i.code === selectedIcd)?.nameEn})
                </div>
              </div>

              {/* Doctor / Clinician Clinical Orders & Notes */}
              <div>
                <label className="font-bold text-slate-900 uppercase text-[11px] block mb-1">
                  {language === 'TH' ? 'แผนการรักษาและคำสั่งแพทย์ (Plan & Orders)' : 'Doctor Notes & Orders'}
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  placeholder="คำสั่งการรักษา ข้อปฏิบัติ..."
                />
              </div>

              {/* Prescription Items (Medications) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-600" />
                    {language === 'TH' ? 'รายการยาและเวชภัณฑ์ (Prescription Orders)' : 'Prescriptions'}
                  </label>
                  <button
                    onClick={handleAddMedication}
                    className="text-[#0284c7] hover:text-[#006398] text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ เพิ่มรายการยา</span>
                  </button>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200 overflow-hidden">
                  {prescriptions.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      {language === 'TH' ? 'ไม่มีรายการสั่งยาในเคสนี้' : 'No medications ordered'}
                    </div>
                  ) : (
                    prescriptions.map((rx, idx) => (
                      <div key={rx.id} className="p-3 flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{idx + 1}. {rx.name}</span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-mono">
                              {rx.route}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px]">
                            {rx.dosage} • {rx.frequency} ({rx.instructions})
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-800">
                            {rx.quantity} {rx.unit}
                          </span>
                          <button
                            onClick={() => handleRemoveMedication(rx.id)}
                            className="text-slate-400 hover:text-red-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Disposition Selector */}
              <div className="bg-[#eaedff]/30 p-3.5 rounded-lg border border-[#c5c6d2] space-y-2">
                <label className="font-bold text-slate-900 uppercase text-[11px] block">
                  {language === 'TH' ? 'ผลการประเมินและการจำหน่าย (Disposition)' : 'Disposition'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'home', labelTh: 'กลับบ้าน (Discharge)', labelEn: 'Home' },
                    { id: 'observe', labelTh: 'สังเกตอาการที่โหนด', labelEn: 'Observe' },
                    { id: 'refer_supercenter', labelTh: 'ส่งต่อ รพ.ศูนย์ (Refer)', labelEn: 'Refer' },
                    { id: 'scheduled_followup', labelTh: 'นัดตรวจซ้ำ (Follow-up)', labelEn: 'Follow-up' },
                  ].map((disp) => (
                    <button
                      key={disp.id}
                      type="button"
                      onClick={() => setEditDisposition(disp.id as any)}
                      className={`p-2 rounded-lg text-xs font-semibold text-center transition border cursor-pointer ${
                        editDisposition === disp.id
                          ? disp.id === 'refer_supercenter'
                            ? 'bg-red-600 text-white border-red-700 shadow-xs'
                            : 'bg-[#0f2d6b] text-white border-[#0f2d6b] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {language === 'TH' ? disp.labelTh : disp.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attending Clinician Digital Sign-off Banner */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#0284c7]" />
                  <span>
                    ผู้บันทึก: <strong className="text-slate-900">{current.attendingClinician.name}</strong> ({current.attendingClinician.license})
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  โหนดดอยยาว อบจ. เชียงใหม่
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 mt-auto">
              <div>
                {saveSuccess && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {language === 'TH' ? 'บันทึกเวชระเบียนเรียบร้อย' : 'Encounter saved successfully'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editDisposition === 'refer_supercenter' && (
                  <button
                    onClick={() => onInitiateReferral(current)}
                    className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Ambulance className="w-4 h-4" />
                    <span>{language === 'TH' ? 'เปิดใบส่งต่อผู้ป่วย (Manifest)' : 'Generate Manifest'}</span>
                  </button>
                )}

                <button
                  onClick={handleSaveEncounter}
                  className="px-4 py-2 rounded-lg bg-[#0f2d6b] hover:bg-[#001849] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'TH' ? 'บันทึกการตรวจรักษา' : 'Save Encounter'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
