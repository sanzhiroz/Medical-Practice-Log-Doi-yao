import * as XLSX from 'xlsx';
import { PracticeLogItem } from '../types/practiceLog';

export function exportPracticeLogsToExcel(
  logs: PracticeLogItem[],
  fileNamePrefix: string = 'Medical_Practice_Log_DoiYao'
) {
  // Format data for sheet 1: รายการปฏิบัติงานละเอียด
  const detailedData = logs.map((log, index) => {
    const hours = Math.floor(log.workMinutes / 60);
    const mins = log.workMinutes % 60;
    const durationStr = log.isLeave ? 'แพทย์ลา (0 ชม.)' : `${hours} ชม. ${mins > 0 ? `${mins} นาที` : ''}`;

    return {
      'ลำดับ': index + 1,
      'วันที่ปฏิบัติงาน': log.date,
      'ชื่อแพทย์': log.doctorName,
      'รพ.สต. ที่ไปปฏิบัติงาน': log.healthCenter,
      'ช่วงเวลาปฏิบัติงาน': log.timeShift,
      'สถานะการมาทำงาน': log.isLeave ? `แพทย์ลา (${log.leaveType || 'ลา'})` : 'มาปฏิบัติงาน',
      '4.1 โรคทั่วไปและยา (ราย)': log.generalOutpatientCases,
      '4.2 โรคเรื้อรัง NCD (ราย)': log.chronicDiseaseCases,
      '4.3 เยี่ยมบ้านติดเตียง (ราย)': log.homeVisitCases,
      '4.4 ใบรับรองแพทย์ (ราย)': log.medicalCertificateCases,
      '4.5 หัตถการพิเศษ (ราย)': log.specialProcedureCases,
      'ยอดรวมผู้รับบริการ (ราย)': log.totalPatients,
      'เวลาทำงาน (นาที)': log.workMinutes,
      'รวมเวลาทำงาน': durationStr,
      'ผู้รายงาน': `${log.reporterPrefix} ${log.reporterFirstName} ${log.reporterLastName}`.trim(),
      'ตำแหน่งผู้รายงาน': log.reporterPosition,
      'หมายเหตุ': log.notes || '',
    };
  });

  // Calculate summary stats for sheet 2: สรุปภาพรวมและสถิติ
  const totalWorkDays = logs.filter((l) => !l.isLeave).length;
  const totalLeaveDays = logs.filter((l) => l.isLeave).length;
  const totalMinutes = logs.reduce((acc, curr) => acc + (curr.workMinutes || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const totalWorkDaysEquivalent = (totalMinutes / (8 * 60)).toFixed(1); // 8-hr workday base

  const totalGeneral = logs.reduce((acc, curr) => acc + (curr.generalOutpatientCases || 0), 0);
  const totalChronic = logs.reduce((acc, curr) => acc + (curr.chronicDiseaseCases || 0), 0);
  const totalHomeVisit = logs.reduce((acc, curr) => acc + (curr.homeVisitCases || 0), 0);
  const totalMedCert = logs.reduce((acc, curr) => acc + (curr.medicalCertificateCases || 0), 0);
  const totalProcedure = logs.reduce((acc, curr) => acc + (curr.specialProcedureCases || 0), 0);
  const grandTotalPatients = logs.reduce((acc, curr) => acc + (curr.totalPatients || 0), 0);

  // Group by health center
  const centerSummary = [
    'รพ.สต.บ้านดอยยาว',
    'รพ.สต.บ้านแม่ผาแหน',
    'รพ.สต.บ้านป่าตาล',
    'รพ.สต.บ้านกอสะเรียม',
  ].map((center) => {
    const centerLogs = logs.filter((l) => l.healthCenter === center && !l.isLeave);
    const centerPatients = centerLogs.reduce((acc, curr) => acc + (curr.totalPatients || 0), 0);
    const centerMins = centerLogs.reduce((acc, curr) => acc + (curr.workMinutes || 0), 0);
    return {
      'หน่วยบริการ (รพ.สต.)': center,
      'จำนวนวันที่ไปออกตรวจ (วัน)': centerLogs.length,
      'ผู้รับบริการสะสม (ราย)': centerPatients,
      'ชั่วโมงทำงานรวม (ชม.)': (centerMins / 60).toFixed(1),
    };
  });

  const overallSummary = [
    { 'ตัวชี้วัด': 'ชื่อแพทย์ผู้ปฏิบัติงาน', 'ค่าสถิติ': 'นายแพทย์เกรียงยุทธ วรศีตกาลกุล' },
    { 'ตัวชี้วัด': 'สังกัด', 'ค่าสถิติ': 'องค์การบริหารส่วนจังหวัดเชียงใหม่ (อบจ. เชียงใหม่)' },
    { 'ตัวชี้วัด': 'เครือข่ายบริการ', 'ค่าสถิติ': 'Node ดอยยาว (รพ.สต. 4 แห่ง)' },
    { 'ตัวชี้วัด': 'จำนวนวันมาปฏิบัติงานจริง', 'ค่าสถิติ': `${totalWorkDays} วัน` },
    { 'ตัวชี้วัด': 'จำนวนวันลาของแพทย์', 'ค่าสถิติ': `${totalLeaveDays} วัน` },
    { 'ตัวชี้วัด': 'รวมเวลาทำงานทั้งหมด', 'ค่าสถิติ': `${totalHours} ชั่วโมง ${remainingMinutes} นาที (คิดเป็น ~${totalWorkDaysEquivalent} วันทำการฐาน 8 ชม.)` },
    { 'ตัวชี้วัด': 'ยอดรวมผู้รับบริการทั้งหมด', 'ค่าสถิติ': `${grandTotalPatients} ราย` },
    { 'ตัวชี้วัด': '4.1 ผู้ป่วยโรคทั่วไปและคำแนะนำยา', 'ค่าสถิติ': `${totalGeneral} ราย` },
    { 'ตัวชี้วัด': '4.2 ตรวจรักษาผู้ป่วยโรคเรื้อรัง NCD', 'ค่าสถิติ': `${totalChronic} ราย` },
    { 'ตัวชี้วัด': '4.3 เยี่ยมบ้านผู้ป่วยติดบ้าน/ติดเตียง', 'ค่าสถิติ': `${totalHomeVisit} ราย` },
    { 'ตัวชี้วัด': '4.4 ออกใบรับรองแพทย์', 'ค่าสถิติ': `${totalMedCert} ราย` },
    { 'ตัวชี้วัด': '4.5 หัตถการพิเศษ อื่นๆ', 'ค่าสถิติ': `${totalProcedure} ราย` },
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: รายการบันทึก
  const wsDetailed = XLSX.utils.json_to_sheet(detailedData);
  XLSX.utils.book_append_sheet(wb, wsDetailed, 'บันทึกการปฏิบัติงาน');

  // Sheet 2: สรุปสถิติภาพรวม
  const wsSummary = XLSX.utils.json_to_sheet(overallSummary);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'สรุปสถิติภาพรวม');

  // Sheet 3: แยกตาม รพ.สต.
  const wsCenter = XLSX.utils.json_to_sheet(centerSummary);
  XLSX.utils.book_append_sheet(wb, wsCenter, 'สถิติแยกตาม รพ.สต.');

  // Generate and download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${fileNamePrefix}_${dateStr}.xlsx`);
}
