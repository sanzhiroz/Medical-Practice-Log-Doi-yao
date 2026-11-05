import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Calendar, 
  Building2, 
  Clock, 
  Users, 
  FileSpreadsheet, 
  AlertCircle,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { PracticeLogItem, HealthCenter, HEALTH_CENTERS } from '../types/practiceLog';

interface PracticeLogTableProps {
  logs: PracticeLogItem[];
  onEdit: (log: PracticeLogItem) => void;
  onDelete: (logId: string) => void;
  onExportExcel: () => void;
}

export const PracticeLogTable: React.FC<PracticeLogTableProps> = ({
  logs,
  onEdit,
  onDelete,
  onExportExcel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WORK' | 'LEAVE'>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.date.includes(searchTerm) ||
      log.healthCenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      `${log.reporterFirstName} ${log.reporterLastName}`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCenter = selectedCenter === 'ALL' || log.healthCenter === selectedCenter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'WORK' && !log.isLeave) ||
      (statusFilter === 'LEAVE' && log.isLeave);

    return matchesSearch && matchesCenter && matchesStatus;
  });

  const totalPatientsSum = filteredLogs.reduce((acc, curr) => acc + (curr.totalPatients || 0), 0);
  const totalWorkDays = filteredLogs.filter((l) => !l.isLeave).length;
  const totalLeaveDays = filteredLogs.filter((l) => l.isLeave).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
      {/* Header and Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base font-heading">
              ประวัติการออกตรวจและบันทึกเวชปฏิบัติย้อนหลัง
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0F2D6B]">
              {filteredLogs.length} รายการ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            นายแพทย์เกรียงยุทธ วรศีตกาลกุล • เครือข่าย Node ดอยยาว อบจ. เชียงใหม่
          </p>
        </div>

        {/* Quick Excel Export button */}
        <button
          onClick={onExportExcel}
          className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>ส่งออกรายงาน Excel (.xlsx)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาวันที่, รพ.สต., ผู้รายงาน, หมายเหตุ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
          />
        </div>

        {/* Filter Center */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">รพ.สต.:</span>
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
            >
              <option value="ALL">ทุก รพ.สต. (ทั้งหมด)</option>
              {HEALTH_CENTERS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">สถานะ:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="WORK">มาปฏิบัติงาน</option>
              <option value="LEAVE">แพทย์ลา</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="bg-[#FAF8FF] px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-600">
          <span>
            วันปฏิบัติงานจริง: <strong className="text-blue-900 font-mono text-sm">{totalWorkDays}</strong> วัน
          </span>
          <span>•</span>
          <span>
            วันลาแพทย์: <strong className="text-amber-700 font-mono text-sm">{totalLeaveDays}</strong> วัน
          </span>
        </div>

        <div className="flex items-center gap-2 font-medium text-slate-700">
          <span>ผู้รับบริการสะสม:</span>
          <span className="text-base font-extrabold text-[#0284c7] font-mono">
            {totalPatientsSum}
          </span>
          <span>ราย</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#EAEDFF]/70 text-[#0F2D6B] uppercase text-[11px] font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">วันที่ปฏิบัติงาน</th>
              <th className="py-3 px-4">รพ.สต. ที่ไปปฏิบัติงาน</th>
              <th className="py-3 px-4">เวลาปฏิบัติงาน</th>
              <th className="py-3 px-3 text-center">๔.๑ ทั่วไป</th>
              <th className="py-3 px-3 text-center">๔.๒ NCD</th>
              <th className="py-3 px-3 text-center">๔.๓ เยี่ยมบ้าน</th>
              <th className="py-3 px-3 text-center">๔.๔ ใบรับรอง</th>
              <th className="py-3 px-3 text-center">๔.๕ หัตถการ</th>
              <th className="py-3 px-4 text-center font-bold text-blue-900">ยอดรวม (ราย)</th>
              <th className="py-3 px-4">ผู้รายงาน</th>
              <th className="py-3 px-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-500">ไม่พบข้อมูลบันทึกการปฏิบัติงาน</p>
                    <p className="text-xs">กรอกข้อมูลในฟอร์มด้านบนเพื่อเริ่มบันทึกการออกตรวจ</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const centerColors = {
                  'รพ.สต.บ้านดอยยาว': 'bg-blue-50 text-blue-800 border-blue-200',
                  'รพ.สต.บ้านแม่ผาแหน': 'bg-indigo-50 text-indigo-800 border-indigo-200',
                  'รพ.สต.บ้านป่าตาล': 'bg-teal-50 text-teal-800 border-teal-200',
                  'รพ.สต.บ้านกอสะเรียม': 'bg-purple-50 text-purple-800 border-purple-200',
                }[log.healthCenter] || 'bg-slate-100 text-slate-800 border-slate-200';

                return (
                  <tr 
                    key={log.id} 
                    className={`hover:bg-slate-50/80 transition ${
                      log.isLeave ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 font-mono text-sm">
                        {log.date}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.date).toLocaleDateString('th-TH', { weekday: 'short' })}
                      </span>
                    </td>

                    {/* Health Center */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${centerColors}`}>
                        {log.healthCenter}
                      </span>
                    </td>

                    {/* Time Shift */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.isLeave ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          แพทย์ลา ({log.leaveType || 'วันลา'})
                        </span>
                      ) : (
                        <div className="font-mono text-slate-800 font-medium">
                          {log.timeShift}
                        </div>
                      )}
                    </td>

                    {/* Metrics 4.1 - 4.5 */}
                    <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-700">
                      {log.isLeave ? '-' : log.generalOutpatientCases}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium text-emerald-800">
                      {log.isLeave ? '-' : log.chronicDiseaseCases}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium text-amber-800">
                      {log.isLeave ? '-' : log.homeVisitCases}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium text-indigo-800">
                      {log.isLeave ? '-' : log.medicalCertificateCases}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium text-rose-800">
                      {log.isLeave ? '-' : log.specialProcedureCases}
                    </td>

                    {/* Total Patients */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {log.isLeave ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <span className="font-extrabold text-blue-900 font-mono text-sm px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                          {log.totalPatients} ราย
                        </span>
                      )}
                    </td>

                    {/* Reporter */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 truncate max-w-[150px]">
                        {log.reporterPrefix} {log.reporterFirstName} {log.reporterLastName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {log.reporterPosition}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onEdit(log)}
                          title="แก้ไขข้อมูล"
                          className="p-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const conf = window.confirm(
                              `ต้องการลบรายการวันที่ ${log.date} ที่ ${log.healthCenter} ใช่หรือไม่?`
                            );
                            if (conf) onDelete(log.id);
                          }}
                          title="ลบข้อมูล"
                          className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
