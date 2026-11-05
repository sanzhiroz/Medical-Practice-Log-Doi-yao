export type HealthCenter = 
  | 'รพ.สต.บ้านดอยยาว'
  | 'รพ.สต.บ้านแม่ผาแหน'
  | 'รพ.สต.บ้านป่าตาล'
  | 'รพ.สต.บ้านกอสะเรียม';

export type TimeShift = 
  | '08.30 – 12.00 น.'
  | '09.00 – 12.00 น.'
  | '08.30 – 16.30 น.'
  | '09.00 – 16.00 น.'
  | '08.30 – 15.00 น.'
  | '09.00 – 15.00 น.'
  | 'แพทย์ลา';

export interface PracticeLogItem {
  id: string;
  date: string; // YYYY-MM-DD
  doctorName: string; // นายแพทย์เกรียงยุทธ วรศีตกาลกุล
  healthCenter: HealthCenter;
  timeShift: TimeShift;
  workMinutes: number; // working duration in minutes
  isLeave: boolean;
  leaveType?: string; // e.g. ลาพักผ่อน, ลาป่วย, ลากิจ, อบรมวิชาการ

  // Work metrics (จำนวนราย)
  generalOutpatientCases: number; // 4.1 ตรวจวินิจฉัย รักษาโรคเบื้องต้น แก่ผู้ป่วยโรคทั่วไป และให้คำแนะนำการใช้ยา
  chronicDiseaseCases: number; // 4.2 ตรวจรักษาผู้ป่วยโรคเรื้อรัง และนัดหมายเพื่อติดตามผลการรักษาต่อเนื่อง
  homeVisitCases: number; // 4.3 งานอื่นๆ ได้แก่ เยี่ยมบ้านผู้ป่วยติดบ้าน/ติดเตียง
  medicalCertificateCases: number; // 4.4 ออกใบรับรองแพทย์
  specialProcedureCases: number; // 4.5 หัตถการพิเศษ อื่นๆ
  totalPatients: number; // ผลรวมอัตโนมัติ

  // Reporter information
  reporterPrefix: string;
  reporterFirstName: string;
  reporterLastName: string;
  reporterPosition: string;

  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const HEALTH_CENTERS: HealthCenter[] = [
  'รพ.สต.บ้านดอยยาว',
  'รพ.สต.บ้านแม่ผาแหน',
  'รพ.สต.บ้านป่าตาล',
  'รพ.สต.บ้านกอสะเรียม',
];

export const TIME_SHIFTS: Array<{ shift: TimeShift; minutes: number; isLeave: boolean; label: string }> = [
  { shift: '08.30 – 12.00 น.', minutes: 210, isLeave: false, label: '08.30 – 12.00 น. (3 ชม. 30 นาที)' },
  { shift: '09.00 – 12.00 น.', minutes: 180, isLeave: false, label: '09.00 – 12.00 น. (3 ชม.)' },
  { shift: '08.30 – 16.30 น.', minutes: 480, isLeave: false, label: '08.30 – 16.30 น. (8 ชม.)' },
  { shift: '09.00 – 16.00 น.', minutes: 420, isLeave: false, label: '09.00 – 16.00 น. (7 ชม.)' },
  { shift: '08.30 – 15.00 น.', minutes: 390, isLeave: false, label: '08.30 – 15.00 น. (6 ชม. 30 นาที)' },
  { shift: '09.00 – 15.00 น.', minutes: 360, isLeave: false, label: '09.00 – 15.00 น. (6 ชม.)' },
  { shift: 'แพทย์ลา', minutes: 0, isLeave: true, label: 'แพทย์ลา (Doctor on leave)' },
];

export function calculateShiftMinutes(shift: TimeShift): number {
  const found = TIME_SHIFTS.find((s) => s.shift === shift);
  return found ? found.minutes : 0;
}
