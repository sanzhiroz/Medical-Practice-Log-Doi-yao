import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Users, 
  FileSpreadsheet, 
  Building2, 
  Stethoscope, 
  HeartPulse, 
  Home, 
  Award, 
  FileText,
  AlertTriangle,
  TrendingUp,
  Download
} from 'lucide-react';
import { PracticeLogItem, HEALTH_CENTERS, HealthCenter } from '../types/practiceLog';
import { exportPracticeLogsToExcel } from '../utils/excelExport';

interface PracticeLogAnalyticsProps {
  logs: PracticeLogItem[];
}

export const PracticeLogAnalytics: React.FC<PracticeLogAnalyticsProps> = ({ logs }) => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  // Extract unique years from logs
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    logs.forEach((l) => {
      if (l.date) years.add(l.date.slice(0, 4));
    });
    return Array.from(years).sort().reverse();
  }, [logs]);

  // Filter logs by year and month
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (!log.date) return false;
      const logYear = log.date.slice(0, 4);
      const logMonth = log.date.slice(5, 7);

      const matchesYear = selectedYear === 'ALL' || logYear === selectedYear;
      const matchesMonth = selectedMonth === 'ALL' || logMonth === selectedMonth;
      return matchesYear && matchesMonth;
    });
  }, [logs, selectedYear, selectedMonth]);

  // Calculate High-level metrics
  const totalWorkDays = filteredLogs.filter((l) => !l.isLeave).length;
  const totalLeaveDays = filteredLogs.filter((l) => l.isLeave).length;
  
  const totalMinutes = filteredLogs.reduce((acc, curr) => acc + (curr.workMinutes || 0), 0);
  // Convert minutes into Days (8h/day standard), Hours, and Minutes
  const totalHoursAll = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const standardWorkDays = Math.floor(totalHoursAll / 8);
  const standardRemainingHours = totalHoursAll % 8;

  const totalPatients = filteredLogs.reduce((acc, curr) => acc + (curr.totalPatients || 0), 0);
  const totalGeneral = filteredLogs.reduce((acc, curr) => acc + (curr.generalOutpatientCases || 0), 0);
  const totalChronic = filteredLogs.reduce((acc, curr) => acc + (curr.chronicDiseaseCases || 0), 0);
  const totalHomeVisit = filteredLogs.reduce((acc, curr) => acc + (curr.homeVisitCases || 0), 0);
  const totalMedCert = filteredLogs.reduce((acc, curr) => acc + (curr.medicalCertificateCases || 0), 0);
  const totalSpecial = filteredLogs.reduce((acc, curr) => acc + (curr.specialProcedureCases || 0), 0);

  // Per health center metrics
  const centerStats = useMemo(() => {
    return HEALTH_CENTERS.map((center) => {
      const centerLogs = filteredLogs.filter((l) => l.healthCenter === center && !l.isLeave);
      const patients = centerLogs.reduce((acc, curr) => acc + (curr.totalPatients || 0), 0);
      const mins = centerLogs.reduce((acc, curr) => acc + (curr.workMinutes || 0), 0);
      return {
        center,
        days: centerLogs.length,
        patients,
        hours: (mins / 60).toFixed(1),
        general: centerLogs.reduce((acc, curr) => acc + (curr.generalOutpatientCases || 0), 0),
        chronic: centerLogs.reduce((acc, curr) => acc + (curr.chronicDiseaseCases || 0), 0),
        homeVisit: centerLogs.reduce((acc, curr) => acc + (curr.homeVisitCases || 0), 0),
      };
    });
  }, [filteredLogs]);

  // Max patients for visual bar scaling
  const maxCenterPatients = Math.max(...centerStats.map((c) => c.patients), 1);

  const months = [
    { num: '01', name: 'มกราคม' },
    { num: '02', name: 'กุมภาพันธ์' },
    { num: '03', name: 'มีนาคม' },
    { num: '04', name: 'เมษายน' },
    { num: '05', name: 'พฤษภาคม' },
    { num: '06', name: 'มิถุนายน' },
    { num: '07', name: 'กรกฎาคม' },
    { num: '08', name: 'สิงหาคม' },
    { num: '09', name: 'กันยายน' },
    { num: '10', name: 'ตุลาคม' },
    { num: '11', name: 'พฤศจิกายน' },
    { num: '12', name: 'ธันวาคม' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter and Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E0F2FE] text-[#0F2D6B]">
              Node Doi Yao Analytics
            </span>
            <span className="text-xs text-slate-500">
              สังกัด องค์การบริหารส่วนจังหวัดเชียงใหม่
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
            สรุปผล & สถิติการปฏิบัติงานของแพทย์ รายเดือน / รายปี
          </h2>
          <p className="text-xs text-slate-500">
            นายแพทย์เกรียงยุทธ วรศีตกาลกุล • เครือข่าย รพ.สต. 4 แห่ง
          </p>
        </div>

        {/* Period Selector & Excel Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Year */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-700">ปี:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="ALL">ทุกปี (ทั้งหมด)</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>ปี {parseInt(yr) + 543} ({yr})</option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-700">เดือน:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="ALL">ทุกเดือน (ทั้งปี)</option>
              {months.map((m) => (
                <option key={m.num} value={m.num}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Export button */}
          <button
            onClick={() => exportPracticeLogsToExcel(filteredLogs)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด Excel</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Actual Working Days */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-[#0F2D6B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">
              จำนวนวันปฏิบัติงานจริง
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0F2D6B]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <div className="text-3xl font-extrabold text-[#0F2D6B] font-mono">
              {totalWorkDays}
            </div>
            <span className="text-sm font-semibold text-slate-500">วัน</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ออกตรวจใน รพ.สต. เครือข่ายดอยยาว
          </p>
        </div>

        {/* Metric 2: Total Working Time (Days, Hours, Minutes) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-[#0284c7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">
              รวมเวลาทำงานทั้งหมด
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#0284c7]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
              {standardWorkDays > 0 ? `${standardWorkDays} วัน ` : ''}
              {standardRemainingHours} ชม. {remainingMins > 0 ? `${remainingMins} นาที` : ''}
            </div>
            <div className="text-[11px] font-semibold text-[#0284c7] font-mono">
              รวม {totalHoursAll} ชั่วโมง {remainingMins} นาที ({totalMinutes} นาที)
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            (คิดเป็นฐาน 8 ชั่วโมงต่อวันทำงาน)
          </p>
        </div>

        {/* Metric 3: Doctor Leave Days */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">
              สรุปจำนวนวันลาของแพทย์
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <div className="text-3xl font-extrabold text-amber-700 font-mono">
              {totalLeaveDays}
            </div>
            <span className="text-sm font-semibold text-slate-500">วัน</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            วันลาพักผ่อน / ป่วย / กิจ / ประชุม
          </p>
        </div>

        {/* Metric 4: Total Patients Served */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">
              ยอดรวมผู้รับบริการสะสม
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <div className="text-3xl font-extrabold text-emerald-800 font-mono">
              {totalPatients}
            </div>
            <span className="text-sm font-semibold text-slate-500">ราย</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            รวมทุกหมวด ๔.๑ – ๔.๕ ในรอบระยะเวลา
          </p>
        </div>
      </div>

      {/* Grid: Health Center Breakdown & Service Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): Statistics by Health Center (4 รพ.สต.) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0F2D6B]" />
              <h3 className="font-bold text-slate-900 text-base font-heading">
                สถิติแยกตามหน่วยบริการ (รพ.สต. แต่ละแห่งใน Node ดอยยาว)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">4 หน่วยบริการ</span>
          </div>

          <div className="space-y-4">
            {centerStats.map((item) => {
              const percentage = Math.round((item.patients / maxCenterPatients) * 100);

              return (
                <div key={item.center} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-sm text-slate-900">
                      {item.center}
                    </span>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span>ออกตรวจ: <strong className="text-slate-900 font-mono">{item.days}</strong> วัน</span>
                      <span>•</span>
                      <span>รวมเวลา: <strong className="text-slate-900 font-mono">{item.hours}</strong> ชม.</span>
                      <span>•</span>
                      <span className="text-blue-900 font-bold font-mono text-sm">
                        {item.patients} ราย
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#0284c7] to-[#0F2D6B] h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>๔.๑ ทั่วไป: {item.general} ราย</span>
                    <span>๔.๒ NCD: {item.chronic} ราย</span>
                    <span>๔.๓ เยี่ยมบ้าน: {item.homeVisit} ราย</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (5 cols): Service Outputs (4.1 - 4.5 Breakdown) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#0284c7]" />
                <h3 className="font-bold text-slate-900 text-base font-heading">
                  สรุปผลงานตามประเภทบริการ (๔.๑ – ๔.๕)
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              {/* 4.1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">๔.๑ ตรวจรักษาโรคทั่วไป</span>
                    <span className="text-[10px] text-slate-500">ตรวจวินิจฉัยและแนะนำการใช้ยา</span>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-blue-900 text-base">
                  {totalGeneral} <span className="text-xs font-normal text-slate-500">ราย</span>
                </span>
              </div>

              {/* 4.2 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">๔.๒ ตรวจโรคเรื้อรัง (NCD)</span>
                    <span className="text-[10px] text-slate-500">เบาหวาน ความดัน ไต หอบหืด</span>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-emerald-900 text-base">
                  {totalChronic} <span className="text-xs font-normal text-slate-500">ราย</span>
                </span>
              </div>

              {/* 4.3 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">๔.๓ เยี่ยมบ้านติดบ้าน/ติดเตียง</span>
                    <span className="text-[10px] text-slate-500">Home Ward ผู้สูงอายุและผู้ป่วยระยะท้าย</span>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-amber-900 text-base">
                  {totalHomeVisit} <span className="text-xs font-normal text-slate-500">ราย</span>
                </span>
              </div>

              {/* 4.4 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-700 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">๔.๔ ออกใบรับรองแพทย์</span>
                    <span className="text-[10px] text-slate-500">รับรองการเจ็บป่วยและตรวจสุขภาพ</span>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-indigo-900 text-base">
                  {totalMedCert} <span className="text-xs font-normal text-slate-500">ราย</span>
                </span>
              </div>

              {/* 4.5 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-rose-700 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">๔.๕ หัตถการพิเศษ อื่นๆ</span>
                    <span className="text-[10px] text-slate-500">เย็บแผล ล้างแผล ผ่าฝี ฉีดวัคซีน</span>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-rose-900 text-base">
                  {totalSpecial} <span className="text-xs font-normal text-slate-500">ราย</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>ฐานข้อมูลคลาวด์: Firebase Firestore</span>
            <span className="font-bold text-slate-900">Project: Medical Practice Log</span>
          </div>
        </div>

      </div>
    </div>
  );
};
