import React, { useState, useEffect, useRef } from 'react';
import { 
  Stethoscope, 
  BarChart3, 
  FileEdit, 
  Download, 
  CheckCircle2, 
  FileSpreadsheet, 
  Building2,
  Ambulance,
  FileText
} from 'lucide-react';

import { PracticeLogForm } from './components/PracticeLogForm';
import { PracticeLogTable } from './components/PracticeLogTable';
import { PracticeLogAnalytics } from './components/PracticeLogAnalytics';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import { TransferManifestHub } from './components/TransferManifestHub';
import { OfficialDocuments } from './components/OfficialDocuments';

import { PracticeLogItem } from './types/practiceLog';
import { practiceLogService } from './services/practiceLogService';
import { exportPracticeLogsToExcel } from './utils/excelExport';
import { INITIAL_REFERRALS, INITIAL_VISITS } from './data/mockData';
import { ReferralManifest, ClinicalVisit } from './types/medical';
import { testConnection } from './firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'practice_log' | 'analytics' | 'referrals' | 'documents'>('practice_log');

  // Medical Practice Logs state (synchronized with Firebase Firestore)
  const [practiceLogs, setPracticeLogs] = useState<PracticeLogItem[]>([]);
  const [editingLog, setEditingLog] = useState<PracticeLogItem | null>(null);
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Other records (Referrals and Documents)
  const [referrals, setReferrals] = useState<ReferralManifest[]>(INITIAL_REFERRALS);
  const [selectedReferral, setSelectedReferral] = useState<ReferralManifest | null>(INITIAL_REFERRALS[0]);
  const [visits] = useState<ClinicalVisit[]>(INITIAL_VISITS);

  const formRef = useRef<HTMLDivElement>(null);

  // Initialize and subscribe to Firebase Firestore
  useEffect(() => {
    testConnection();

    const unsubscribe = practiceLogService.subscribeToLogs(
      (logs) => {
        setPracticeLogs(logs);
      },
      (error) => {
        console.warn('Realtime subscription notice:', error);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Practice Log Handlers
  const handleSavePracticeLog = async (log: PracticeLogItem) => {
    setIsSavingLog(true);
    try {
      if (editingLog) {
        await practiceLogService.updateLog(log);
        setToast({
          id: String(Date.now()),
          type: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ',
          message: `อัปเดตบันทึกการปฏิบัติงานวันที่ ${log.date} (${log.healthCenter}) เรียบร้อยแล้ว`,
        });
        setEditingLog(null);
      } else {
        await practiceLogService.saveLog(log);
        setToast({
          id: String(Date.now()),
          type: 'success',
          title: 'บันทึกข้อมูลเรียบร้อย',
          message: `บันทึกการปฏิบัติงานวันที่ ${log.date} (${log.healthCenter}) ลงฐานข้อมูล Firebase สำเร็จ`,
        });
      }
    } catch (err: any) {
      console.error(err);
      setToast({
        id: String(Date.now()),
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการบันทึก',
        message: err.message || 'ไม่สามารถบันทึกข้อมูลลงฐานข้อมูลได้',
      });
    } finally {
      setIsSavingLog(false);
    }
  };

  const handleDeletePracticeLog = async (logId: string) => {
    try {
      await practiceLogService.deleteLog(logId);
      if (editingLog?.id === logId) {
        setEditingLog(null);
      }
      setToast({
        id: String(Date.now()),
        type: 'info',
        title: 'ลบข้อมูลเรียบร้อย',
        message: 'ลบรายการบันทึกการปฏิบัติงานออกจากระบบแล้ว',
      });
    } catch (err: any) {
      console.error(err);
      setToast({
        id: String(Date.now()),
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        message: err.message || 'ไม่สามารถลบข้อมูลได้',
      });
    }
  };

  const handleStartEdit = (log: PracticeLogItem) => {
    setEditingLog(log);
    setActiveTab('practice_log');
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingLog(null);
  };

  const handleExportExcel = () => {
    exportPracticeLogsToExcel(practiceLogs, 'บันทึกการปฏิบัติงานของแพทย์_Nodeดอยยาว');
    setToast({
      id: String(Date.now()),
      type: 'success',
      title: 'ส่งออกรายงาน Excel สำเร็จ',
      message: 'ดาวน์โหลดไฟล์สรุปผลการปฏิบัติงานของแพทย์ (.xlsx) เรียบร้อยแล้ว',
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans">
      
      {/* Clean Main Content Viewport without any separate top bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-20 space-y-6">

        {/* System Header & Navigation Bar */}
        <div className="bg-gradient-to-r from-[#001849] via-[#0F2D6B] to-[#1E3A8A] text-white p-5 rounded-2xl border border-[#0f2d6b] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0284c7] p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-[#001849] rounded-[10px] flex items-center justify-center text-[#38BDF8]">
                <Stethoscope className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#7bd0ff]">
                  Node Doi Yao Network
                </span>
                <span className="text-xs text-[#dae2fd]/85">
                  ในสังกัด องค์การบริหารส่วนจังหวัดเชียงใหม่
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight mt-0.5">
                บันทึกการปฏิบัติงานของแพทย์ Node ดอยยาว
              </h1>
              <p className="text-xs text-[#dae2fd]/90">
                Medical Practice Log – Doi Yao • แพทย์ผู้ปฏิบัติงาน: <strong>นายแพทย์เกรียงยุทธ วรศีตกาลกุล</strong>
              </p>
            </div>
          </div>

          {/* Right: Switcher Tabs & Excel Download */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#001236]/80 p-1 rounded-xl border border-[#2a4482] flex items-center gap-1">
              <button
                onClick={() => setActiveTab('practice_log')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'practice_log'
                    ? 'bg-[#38BDF8] text-[#001849] shadow-xs'
                    : 'text-[#dae2fd] hover:text-white hover:bg-white/10'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>บันทึกข้อมูล & ประวัติ</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#001849]/20 text-[#001849]">
                  {practiceLogs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-[#38BDF8] text-[#001849] shadow-xs'
                    : 'text-[#dae2fd] hover:text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>สรุปผล & สถิติรายเดือน/ปี</span>
              </button>

              <button
                onClick={() => setActiveTab('referrals')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'referrals'
                    ? 'bg-[#38BDF8] text-[#001849] font-bold shadow-xs'
                    : 'text-[#dae2fd]/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Ambulance className="w-3.5 h-3.5" />
                <span>ระบบส่งต่อ</span>
              </button>

              <button
                onClick={() => setActiveTab('documents')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'documents'
                    ? 'bg-[#38BDF8] text-[#001849] font-bold shadow-xs'
                    : 'text-[#dae2fd]/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>พิมพ์เอกสาร</span>
              </button>
            </div>

            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ดาวน์โหลด Excel</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Doctor Practice Log (Data Entry Form + History Table) */}
        {activeTab === 'practice_log' && (
          <div className="space-y-6">
            <div ref={formRef}>
              <PracticeLogForm
                initialLog={editingLog}
                onSave={handleSavePracticeLog}
                onDelete={handleDeletePracticeLog}
                onCancelEdit={handleCancelEdit}
                isSaving={isSavingLog}
              />
            </div>

            <PracticeLogTable
              logs={practiceLogs}
              onEdit={handleStartEdit}
              onDelete={handleDeletePracticeLog}
              onExportExcel={handleExportExcel}
            />
          </div>
        )}

        {/* TAB 2: Monthly / Yearly Analytics & Excel Reports */}
        {activeTab === 'analytics' && (
          <PracticeLogAnalytics logs={practiceLogs} />
        )}

        {/* TAB 3: Emergency Transfer & Referral Hub */}
        {activeTab === 'referrals' && (
          <TransferManifestHub
            referrals={referrals}
            selectedReferral={selectedReferral}
            onSelectReferral={setSelectedReferral}
            onUpdateReferral={(updated) => {
              setReferrals(referrals.map((r) => (r.id === updated.id ? updated : r)));
              setSelectedReferral(updated);
            }}
            onCreateNewManifest={() => {
              const manifestNo = `REF-DY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
              const newRef: ReferralManifest = {
                id: `ref-${Date.now()}`,
                manifestNo,
                patientId: 'pt-new',
                patientName: 'ผู้ป่วยฉุกเฉินส่งต่อ (Node Doi Yao)',
                hn: '67-005999',
                age: 60,
                gender: 'ชาย',
                triage: 'YELLOW',
                originNode: 'ศูนย์บริการสาธารณสุข โหนดดอยยาว (อบจ.เชียงใหม่)',
                destinationHospital: 'รพ.นครพิงค์ (ศูนย์ความเป็นเลิศทางการแพทย์ประจำจังหวัด)',
                reason: 'ส่งต่อรับการตรวจรักษาเฉพาะทางเพิ่มเติม',
                transportType: 'BLS_AMBULANCE',
                dispatchedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
                etaMinutes: 30,
                status: 'in_transit',
                attendingParamedic: 'จนท. สหรัฐ เชียงใหม่กู้ชีพ',
                vitalsOnTransit: {
                  bp: '130/80 mmHg',
                  hr: 80,
                  spo2: 98,
                  gcs: 'E4V5M6',
                  o2Flow: 'O2 Cannula 3 LPM',
                  ivFluid: 'NSS 1000 ml KVO',
                },
                emergencyDrugsGiven: ['NSS 1000ml'],
                telemetryActive: true,
              };
              setReferrals([newRef, ...referrals]);
              setSelectedReferral(newRef);
            }}
            onPrintManifest={(manifest) => {
              setSelectedReferral(manifest);
              setActiveTab('documents');
            }}
            language="TH"
          />
        )}

        {/* TAB 4: Official Documents & Print Layout */}
        {activeTab === 'documents' && (
          <OfficialDocuments
            visits={visits}
            referrals={referrals}
            language="TH"
          />
        )}

      </main>

      {/* Floating Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Official Clean Footer */}
      <footer className="bg-[#001236] text-[#c5c6d2] border-t border-[#0f2d6b] py-4 px-6 text-xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div>
          <span className="font-semibold text-white">
            บันทึกการปฏิบัติงานของแพทย์ Node ดอยยาว (Medical Practice Log – Doi Yao)
          </span>
          <span className="text-[11px] text-[#93ccff] block">
            ในสังกัด องค์การบริหารส่วนจังหวัดเชียงใหม่ • ฐานข้อมูล Firebase: Medical Practice Log
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#dae2fd]">
          <span>แพทย์: นายแพทย์เกรียงยุทธ วรศีตกาลกุล</span>
          <span>•</span>
          <span>รพ.สต. 4 แห่ง (ดอยยาว, แม่ผาแหน, ป่าตาล, กอสะเรียม)</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Firebase Synced
          </span>
        </div>
      </footer>
    </div>
  );
}
