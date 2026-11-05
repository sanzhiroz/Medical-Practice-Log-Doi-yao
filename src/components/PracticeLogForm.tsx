import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Building2, 
  Clock, 
  Activity, 
  Save, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  UserCheck, 
  FileText,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  Home,
  Award,
  Sparkles
} from 'lucide-react';
import { 
  PracticeLogItem, 
  HealthCenter, 
  TimeShift, 
  HEALTH_CENTERS, 
  TIME_SHIFTS, 
  calculateShiftMinutes 
} from '../types/practiceLog';

interface PracticeLogFormProps {
  initialLog?: PracticeLogItem | null;
  onSave: (log: PracticeLogItem) => Promise<void>;
  onDelete?: (logId: string) => Promise<void>;
  onCancelEdit?: () => void;
  isSaving: boolean;
}

export const PracticeLogForm: React.FC<PracticeLogFormProps> = ({
  initialLog,
  onSave,
  onDelete,
  onCancelEdit,
  isSaving,
}) => {
  const isEditing = Boolean(initialLog);

  // Form states
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [doctorName, setDoctorName] = useState<string>(
    'นายแพทย์เกรียงยุทธ วรศีตกาลกุล'
  );
  const [healthCenter, setHealthCenter] = useState<HealthCenter>(
    'รพ.สต.บ้านดอยยาว'
  );
  const [timeShift, setTimeShift] = useState<TimeShift>(
    '08.30 – 16.30 น.'
  );
  const [leaveType, setLeaveType] = useState<string>('ลาพักผ่อน');

  // Work metrics (จำนวนราย)
  const [generalCases, setGeneralCases] = useState<number>(0);
  const [chronicCases, setChronicCases] = useState<number>(0);
  const [homeVisitCases, setHomeVisitCases] = useState<number>(0);
  const [medCertCases, setMedCertCases] = useState<number>(0);
  const [specialProcedureCases, setSpecialProcedureCases] = useState<number>(0);

  // Reporter info
  const [reporterPrefix, setReporterPrefix] = useState<string>('พว.');
  const [reporterFirstName, setReporterFirstName] = useState<string>('กัลยา');
  const [reporterLastName, setReporterLastName] = useState<string>('นวลฉวี');
  const [reporterPosition, setReporterPosition] = useState<string>(
    'พยาบาลวิชาชีพชำนาญการ'
  );

  const [notes, setNotes] = useState<string>('');

  // Auto-calculated total patients
  const isLeave = timeShift === 'แพทย์ลา';
  const totalPatients = isLeave
    ? 0
    : Number(generalCases || 0) +
      Number(chronicCases || 0) +
      Number(homeVisitCases || 0) +
      Number(medCertCases || 0) +
      Number(specialProcedureCases || 0);

  // Sync when initialLog changes (for editing)
  useEffect(() => {
    if (initialLog) {
      setDate(initialLog.date);
      setDoctorName(initialLog.doctorName);
      setHealthCenter(initialLog.healthCenter);
      setTimeShift(initialLog.timeShift);
      setLeaveType(initialLog.leaveType || 'ลาพักผ่อน');
      setGeneralCases(initialLog.generalOutpatientCases);
      setChronicCases(initialLog.chronicDiseaseCases);
      setHomeVisitCases(initialLog.homeVisitCases);
      setMedCertCases(initialLog.medicalCertificateCases);
      setSpecialProcedureCases(initialLog.specialProcedureCases);
      setReporterPrefix(initialLog.reporterPrefix || 'พว.');
      setReporterFirstName(initialLog.reporterFirstName || '');
      setReporterLastName(initialLog.reporterLastName || '');
      setReporterPosition(initialLog.reporterPosition || '');
      setNotes(initialLog.notes || '');
    } else {
      // Default reset
      setDate(new Date().toISOString().slice(0, 10));
      setGeneralCases(0);
      setChronicCases(0);
      setHomeVisitCases(0);
      setMedCertCases(0);
      setSpecialProcedureCases(0);
      setNotes('');
    }
  }, [initialLog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const workMinutes = calculateShiftMinutes(timeShift);

    const logToSave: PracticeLogItem = {
      id: initialLog?.id || `log-${Date.now()}`,
      date,
      doctorName,
      healthCenter,
      timeShift,
      workMinutes,
      isLeave,
      leaveType: isLeave ? leaveType : undefined,
      generalOutpatientCases: isLeave ? 0 : Number(generalCases || 0),
      chronicDiseaseCases: isLeave ? 0 : Number(chronicCases || 0),
      homeVisitCases: isLeave ? 0 : Number(homeVisitCases || 0),
      medicalCertificateCases: isLeave ? 0 : Number(medCertCases || 0),
      specialProcedureCases: isLeave ? 0 : Number(specialProcedureCases || 0),
      totalPatients: isLeave ? 0 : totalPatients,
      reporterPrefix,
      reporterFirstName,
      reporterLastName,
      reporterPosition,
      notes,
      createdAt: initialLog?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(logToSave);

    if (!isEditing) {
      // Clear numbers for next quick input
      setGeneralCases(0);
      setChronicCases(0);
      setHomeVisitCases(0);
      setMedCertCases(0);
      setSpecialProcedureCases(0);
      setNotes('');
    }
  };

  const handleDelete = async () => {
    if (!initialLog || !onDelete) return;
    const confirmDelete = window.confirm(
      `คุณต้องการลบข้อมูลการปฏิบัติงานวันที่ ${initialLog.date} (${initialLog.healthCenter}) ใช่หรือไม่?`
    );
    if (confirmDelete) {
      await onDelete(initialLog.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Form Card Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F2D6B] flex items-center justify-center text-[#38BDF8] shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0F2D6B] font-heading">
              {isEditing ? 'แก้ไขข้อมูลการปฏิบัติงานของแพทย์' : 'แบบฟอร์มบันทึกข้อมูลการปฏิบัติงาน (Data Entry Form)'}
            </h2>
            <p className="text-[11px] text-slate-500">
              บันทึกการออกตรวจประจำวัน ณ รพ.สต. เครือข่าย Node ดอยยาว • อบจ.เชียงใหม่
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              โหมดแก้ไข: วันที่ {initialLog?.date} ({initialLog?.healthCenter})
            </span>
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-500 font-mono">
            * ช่องที่มีเครื่องหมายดอกจันต้องกรอก
          </span>
        )}
      </div>

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6 text-xs text-slate-800">
        
        {/* Section 1: General Duty Information */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <span className="font-bold text-sm text-[#0F2D6B] uppercase font-heading flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0284c7]" />
              ๑. ข้อมูลการออกปฏิบัติงานทั่วไป (General Practice Information)
            </span>
            <span className="text-[11px] text-slate-500">กรอกข้อมูลให้ครบถ้วน</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Date Picker */}
            <div>
              <label className="font-bold text-slate-900 block mb-1">
                1. วันที่มาปฏิบัติงาน <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-medium focus:bg-white focus:ring-2 focus:ring-[#0284c7] focus:outline-none cursor-pointer"
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">เลือกวันที่จากปฏิทินในเครื่อง</span>
            </div>

            {/* 2. Doctor Name */}
            <div>
              <label className="font-bold text-slate-900 block mb-1">
                2. ชื่อแพทย์ผู้ปฏิบัติงาน <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-blue-700 block mt-0.5 font-medium">
                แพทย์เวชศาสตร์ครอบครัว ประจำ Node ดอยยาว
              </span>
            </div>

            {/* 3. Sub-district Health Hospital (รพ.สต.) */}
            <div>
              <label className="font-bold text-slate-900 block mb-1">
                3. รพ.สต. ที่ไปปฏิบัติงาน <span className="text-red-600">*</span>
              </label>
              <select
                value={healthCenter}
                onChange={(e) => setHealthCenter(e.target.value as HealthCenter)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-[#0284c7] focus:outline-none cursor-pointer"
              >
                {HEALTH_CENTERS.map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 block mt-0.5">ในเครือข่าย 4 แห่งของ Node ดอยยาว</span>
            </div>

            {/* 4. Time Shift */}
            <div>
              <label className="font-bold text-slate-900 block mb-1">
                4. เวลาที่มาปฏิบัติงาน <span className="text-red-600">*</span>
              </label>
              <select
                value={timeShift}
                onChange={(e) => setTimeShift(e.target.value as TimeShift)}
                className={`w-full p-2.5 border rounded-lg font-bold focus:ring-2 focus:outline-none cursor-pointer ${
                  isLeave
                    ? 'bg-amber-50 border-amber-400 text-amber-900 focus:ring-amber-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:ring-[#0284c7]'
                }`}
              >
                {TIME_SHIFTS.map((item) => (
                  <option key={item.shift} value={item.shift}>
                    {item.label}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {isLeave ? 'แพทย์ลา (ไม่ต้องบันทึกยอดตรวจ)' : 'ช่วงเวลาตามระเบียบกำหนด'}
              </span>
            </div>
          </div>

          {/* Conditional Leave Details if 'แพทย์ลา' */}
          {isLeave && (
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold block">แพทย์อยู่ในสถานะ "ลา" ในวันนี้</span>
                  <span className="text-[11px] text-amber-800">
                    ระบบจะบันทึกเป็นวันลา และคำนวณในสถิติการลาประจำเดือน/ปี
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-semibold text-amber-900 shrink-0">ประเภทการลา:</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="p-1.5 bg-white border border-amber-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="ลาพักผ่อน">ลาพักผ่อน</option>
                  <option value="ลาป่วย">ลาป่วย</option>
                  <option value="ลากิจส่วนตัว">ลากิจส่วนตัว</option>
                  <option value="ลาประชุม/อบรมวิชาการ">ลาประชุม/อบรมวิชาการ</option>
                  <option value="ไปราชการอื่น">ไปราชการอื่น</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Clinical Output Metrics (4.1 - 4.5) */}
        {!isLeave && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-sm text-[#0F2D6B] uppercase font-heading flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#0284c7]" />
                ๒. รายงานการปฏิบัติงาน (กรอกตัวเลขหน่วยเป็น "ราย")
              </span>
              
              {/* Live Auto-Calculated Total Badge */}
              <div className="flex items-center gap-2 bg-[#E0F2FE] border border-[#38BDF8] px-3 py-1 rounded-full text-[#0F2D6B] shadow-xs">
                <Sparkles className="w-4 h-4 text-[#0284c7]" />
                <span className="font-bold text-xs">ยอดรวมผู้รับบริการทั้งหมด:</span>
                <span className="text-base font-extrabold text-[#0284c7] font-mono">
                  {totalPatients}
                </span>
                <span className="text-xs font-semibold">ราย</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* 4.1 General OPD */}
              <div className="bg-[#FAF8FF] p-3.5 rounded-xl border border-slate-200 hover:border-[#38BDF8] transition space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <Stethoscope className="w-4 h-4 text-[#0284c7] shrink-0" />
                    <span>๔.๑ ตรวจรักษาโรคทั่วไป</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    ตรวจวินิจฉัย รักษาโรคเบื้องต้น แก่ผู้ป่วยโรคทั่วไป และให้คำแนะนำการใช้ยา
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={generalCases}
                      onChange={(e) => setGeneralCases(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-center font-mono text-base font-extrabold text-blue-950 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                    />
                    <span className="font-semibold text-slate-600">ราย</span>
                  </div>
                </div>
              </div>

              {/* 4.2 Chronic NCD */}
              <div className="bg-[#FAF8FF] p-3.5 rounded-xl border border-slate-200 hover:border-[#38BDF8] transition space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <HeartPulse className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>๔.๒ ตรวจโรคเรื้อรัง (NCD)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    ตรวจรักษาผู้ป่วยโรคเรื้อรัง และนัดหมายเพื่อติดตามผลการรักษาต่อเนื่อง
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={chronicCases}
                      onChange={(e) => setChronicCases(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-center font-mono text-base font-extrabold text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="font-semibold text-slate-600">ราย</span>
                  </div>
                </div>
              </div>

              {/* 4.3 Home Visits */}
              <div className="bg-[#FAF8FF] p-3.5 rounded-xl border border-slate-200 hover:border-[#38BDF8] transition space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <Home className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>๔.๓ เยี่ยมบ้านติดเตียง</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    งานอื่นๆ ได้แก่ เยี่ยมบ้านผู้ป่วยติดบ้าน/ติดเตียง และผู้สูงอายุ
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={homeVisitCases}
                      onChange={(e) => setHomeVisitCases(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-center font-mono text-base font-extrabold text-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="font-semibold text-slate-600">ราย</span>
                  </div>
                </div>
              </div>

              {/* 4.4 Medical Certificates */}
              <div className="bg-[#FAF8FF] p-3.5 rounded-xl border border-slate-200 hover:border-[#38BDF8] transition space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>๔.๔ ออกใบรับรองแพทย์</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    ออกใบรับรองแพทย์ตรวจสุขภาพ สมัครงาน ใบรับรองความพิการ ฯลฯ
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={medCertCases}
                      onChange={(e) => setMedCertCases(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-center font-mono text-base font-extrabold text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="font-semibold text-slate-600">ราย</span>
                  </div>
                </div>
              </div>

              {/* 4.5 Special Procedures */}
              <div className="bg-[#FAF8FF] p-3.5 rounded-xl border border-slate-200 hover:border-[#38BDF8] transition space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <Award className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>๔.๕ หัตถการพิเศษ อื่นๆ</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    เย็บแผล ล้างแผล ใส่สายสวน ถอดเล็บ ผ่าฝี ฉีดวัคซีนเฉพาะ
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={specialProcedureCases}
                      onChange={(e) => setSpecialProcedureCases(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-center font-mono text-base font-extrabold text-rose-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <span className="font-semibold text-slate-600">ราย</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Reporter Information & Notes */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <span className="font-bold text-sm text-[#0F2D6B] uppercase font-heading flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#0284c7]" />
              ๓. ข้อมูลผู้รายงานและข้อสังเกตเพิ่มเติม (Reporter & Clinical Remarks)
            </span>
            <span className="text-[11px] text-slate-500">ข้อมูลผู้ลงบันทึกในระบบ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">คำนำหน้าชื่อ</label>
              <input
                type="text"
                value={reporterPrefix}
                onChange={(e) => setReporterPrefix(e.target.value)}
                placeholder="เช่น พว. / นาง / นาย"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">ชื่อ</label>
              <input
                type="text"
                required
                value={reporterFirstName}
                onChange={(e) => setReporterFirstName(e.target.value)}
                placeholder="ชื่อจริงผู้รายงาน"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">นามสกุล</label>
              <input
                type="text"
                required
                value={reporterLastName}
                onChange={(e) => setReporterLastName(e.target.value)}
                placeholder="นามสกุล"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">ตำแหน่ง</label>
              <input
                type="text"
                required
                value={reporterPosition}
                onChange={(e) => setReporterPosition(e.target.value)}
                placeholder="เช่น พยาบาลวิชาชีพชำนาญการ"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              หมายเหตุ / บันทึกผลการตรวจรักษาและกิจกรรมพิเศษในพื้นที่
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุกิจกรรมพิเศษ เคสส่งต่อ หรือข้อสังเกตในการให้บริการ ณ รพ.สต...."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 4: Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>เชื่อมโยงและบันทึกฐานข้อมูลระบบสุขภาพดิจิทัล อบจ. เชียงใหม่ (Firebase)</span>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && (
              <>
                {onDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="px-3.5 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>ลบข้อมูลรายการนี้</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onCancelEdit}
                  disabled={isSaving}
                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
              </>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer disabled:opacity-50 ${
                isEditing
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#0F2D6B] hover:bg-[#001849] text-white'
              }`}
            >
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>
                {isSaving
                  ? 'กำลังบันทึกลงระบบ...'
                  : isEditing
                  ? 'บันทึกการแก้ไขข้อมูล'
                  : 'เพิ่มข้อมูล / บันทึกข้อมูล'}
              </span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
