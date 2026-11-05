export type TriageLevel = 'RED' | 'YELLOW' | 'GREEN' | 'WHITE';

export interface VitalSigns {
  bpSystolic: number;
  bpDiastolic: number;
  pulse: number;
  rr: number; // respiratory rate /min
  temp: number; // celsius
  spo2: number; // percentage %
  painScore: number; // 0 - 10
  dtx?: number; // blood glucose mg/dL
  recordedAt: string;
  recordedBy: string;
}

export interface Patient {
  id: string;
  hn: string; // Hospital Number e.g. 67-003892
  vn: string; // Visit Number e.g. 69-02-14
  cid: string; // Thai National ID 13-digit
  prefix: string; // นาย, นาง, นางสาว, etc.
  firstName: string;
  lastName: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  dob: string;
  bloodGroup: 'A+' | 'B+' | 'AB+' | 'O+' | 'A-' | 'B-' | 'AB-' | 'O-';
  village: string; // e.g. หมู่ 1 บ้านดอยยาว
  district: string; // อำเภอแม่ริม จังหวัดเชียงใหม่
  coverage: 'UCS' | 'SSS' | 'CSMBS' | 'HIGHLAND_0'; // บัตรทอง, ประกันสังคม, ข้าราชการ, สิทธิบุคคลพื้นที่สูง
  coverageDetail: string;
  drugAllergies: string[];
  underlyingDiseases: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface PrescriptionItem {
  id: string;
  name: string;
  genericName: string;
  strength: string;
  dosage: string;
  frequency: string;
  route: 'Oral' | 'Inhalation' | 'IV' | 'IM' | 'Topical';
  quantity: number;
  unit: string;
  instructions: string;
}

export interface ClinicalVisit {
  id: string;
  patientId: string;
  patient: Patient;
  triage: TriageLevel;
  queueNo: string;
  arrivalTime: string;
  status: 'triage' | 'doctor_exam' | 'dispensing' | 'completed' | 'referred' | 'observing';
  chiefComplaint: string;
  hpi: string; // History of Present Illness
  physicalExam: string;
  vitals: VitalSigns;
  primaryDiagnosis: {
    code: string; // ICD-10
    nameThai: string;
    nameEn: string;
  };
  secondaryDiagnoses: Array<{
    code: string;
    nameThai: string;
    nameEn: string;
  }>;
  doctorNotes: string;
  prescriptions: PrescriptionItem[];
  attendingClinician: {
    name: string;
    license: string;
    role: string;
  };
  disposition: 'home' | 'observe' | 'refer_supercenter' | 'scheduled_followup';
}

export interface ReferralManifest {
  id: string;
  manifestNo: string;
  patientId: string;
  patientName: string;
  hn: string;
  age: number;
  gender: string;
  triage: TriageLevel;
  originNode: string;
  destinationHospital: string;
  reason: string;
  transportType: 'EMS_4WD' | 'BLS_AMBULANCE' | 'SKY_DOCTOR_HELICOPTER';
  dispatchedAt: string;
  etaMinutes: number;
  status: 'dispatched' | 'in_transit' | 'arrived' | 'completed';
  attendingParamedic: string;
  vitalsOnTransit: {
    bp: string;
    hr: number;
    spo2: number;
    gcs: string; // Glasgow Coma Scale E4V5M6
    o2Flow: string;
    ivFluid: string;
  };
  emergencyDrugsGiven: string[];
  handoverDoctor?: string;
  telemetryActive: boolean;
}

export interface FieldHealthRecord {
  id: string;
  patientName: string;
  villageMoo: string;
  volunteerName: string; // อสม.
  visitDate: string;
  mobilityStatus: 'mobile' | 'homebound' | 'bedridden';
  bp: string;
  bloodSugar: number;
  adherenceRate: number; // percentage
  concerns: string;
  needsSupplies: string[];
  followupDate: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  genericName: string;
  tradeName: string;
  category: 'EMERGENCY' | 'NCD_CHRONIC' | 'ANTIBIOTIC' | 'RESPIRATORY' | 'SUPPLY';
  stock: number;
  minThreshold: number;
  unit: string;
  batchNo: string;
  expireDate: string;
  tempControlled: boolean;
  idealTemp?: string;
  currentTemp?: number;
}
