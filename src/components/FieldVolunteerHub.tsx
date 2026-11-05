import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Heart, 
  Activity, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  RefreshCw, 
  Home, 
  AlertTriangle,
  FileCheck,
  Search,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { FieldHealthRecord } from '../types/medical';
import { INITIAL_FIELD_RECORDS } from '../data/mockData';

interface FieldVolunteerHubProps {
  language: 'TH' | 'EN';
}

export const FieldVolunteerHub: React.FC<FieldVolunteerHubProps> = ({ language }) => {
  const [records, setRecords] = useState<FieldHealthRecord[]>(INITIAL_FIELD_RECORDS);
  const [selectedVillage, setSelectedVillage] = useState<string>('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New field form
  const [newPatientName, setNewPatientName] = useState('');
  const [newVillage, setNewVillage] = useState('หมู่ 1 บ้านดอยยาว');
  const [newVolunteer, setNewVolunteer] = useState('อสม. นวลจันทร์ อินทวงศ์');
  const [newBp, setNewBp] = useState('130/80 mmHg');
  const [newSugar, setNewSugar] = useState(120);
  const [newMobility, setNewMobility] = useState<'mobile' | 'homebound' | 'bedridden'>('homebound');
  const [newConcerns, setNewConcerns] = useState('');

  const villages = [
    { name: 'หมู่ 1 บ้านดอยยาว', households: 284, bedridden: 6, volunteers: 18 },
    { name: 'หมู่ 2 บ้านห้วยทราย', households: 192, bedridden: 4, volunteers: 12 },
    { name: 'หมู่ 3 บ้านผาแดง', households: 145, bedridden: 5, volunteers: 10 },
    { name: 'หมู่ 4 บ้านแม่ข่อง', households: 210, bedridden: 3, volunteers: 14 },
    { name: 'หมู่ 5 บ้านปางควาย', households: 168, bedridden: 4, volunteers: 11 },
  ];

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 3000);
    }, 1200);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newRecord: FieldHealthRecord = {
      id: `fld-${Date.now()}`,
      patientName: newPatientName,
      villageMoo: newVillage,
      volunteerName: newVolunteer,
      visitDate: 'วันนี้',
      mobilityStatus: newMobility,
      bp: newBp,
      bloodSugar: Number(newSugar) || 120,
      adherenceRate: 90,
      concerns: newConcerns || 'ติดตามสุขภาพทั่วไปตามนัดหมาย',
      needsSupplies: ['ยาโรคเรื้อรังต่อเนื่อง'],
      followupDate: 'อีก 14 วัน',
    };

    setRecords([newRecord, ...records]);
    setShowAddModal(false);
    setNewPatientName('');
    setNewConcerns('');
  };

  const filteredRecords = records.filter(
    (r) => selectedVillage === 'ALL' || r.villageMoo === selectedVillage
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#001849] via-[#0f2d6b] to-[#0284c7] text-white p-4 sm:p-5 rounded-xl border border-[#2a4482] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] tracking-wide">
              FIELD HEALTH & อสม. NETWORK
            </span>
            <span className="text-xs text-[#93ccff]">
              Chiang Mai Highland Home Ward Care
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading mt-1">
            {language === 'TH'
              ? 'ระบบรายงานสุขภาพชุมชนและเครือข่าย อสม. โหนดดอยยาว'
              : 'Highland Field Care & Village Health Volunteer Network'}
          </h2>
          <p className="text-xs text-[#dae2fd]/90 mt-0.5">
            {language === 'TH'
              ? 'ดูแลผู้ป่วยติดเตียง ผู้สูงอายุ และกลุ่มเปราะบางใน 5 หมู่บ้านบนพื้นที่สูงรอบดอยยาว'
              : 'Monitoring bedridden, elderly, and vulnerable chronic patients across highland village clusters'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>
              {isSyncing
                ? 'กำลังเชื่อมฐานข้อมูล อบจ....'
                : syncDone
                ? '✓ ซิงก์ข้อมูลสำเร็จ'
                : 'ซิงก์ข้อมูลภาคสนาม (Sync)'}
            </span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-white text-[#0f2d6b] hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'TH' ? '+ บันทึกการเยี่ยมบ้าน' : '+ New Visit Log'}</span>
          </button>
        </div>
      </div>

      {/* Village Cluster Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {villages.map((v) => {
          const isSelected = selectedVillage === v.name;
          return (
            <div
              key={v.name}
              onClick={() => setSelectedVillage(isSelected ? 'ALL' : v.name)}
              className={`p-3.5 rounded-xl border transition cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-[#eaedff] border-[#0284c7] ring-2 ring-[#0284c7]/40'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 truncate">
                  {v.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                <div>ครัวเรือน: <strong>{v.households}</strong> หลัง</div>
                <div className="text-red-700 font-medium">
                  ผู้ป่วยติดเตียง: <strong>{v.bedridden}</strong> ราย
                </div>
                <div>อสม. ดูแล: <strong>{v.volunteers}</strong> คน</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Field Visit Records List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm font-heading">
              {language === 'TH'
                ? 'บันทึกการเยี่ยมบ้านและดูแลผู้ป่วยติดเตียง (Home Ward Visits)'
                : 'Home Ward & Field Visit Logs'}
            </h3>
            {selectedVillage !== 'ALL' && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#0284c7] text-white">
                {selectedVillage}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            แสดง {filteredRecords.length} รายการ
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRecords.map((item) => {
            const mobilityBadge = {
              bedridden: { label: 'ติดเตียง (Bedridden)', class: 'bg-red-100 text-red-800' },
              homebound: { label: 'ติดบ้าน (Homebound)', class: 'bg-amber-100 text-amber-800' },
              mobile: { label: 'ติดสังคม (Mobile)', class: 'bg-emerald-100 text-emerald-800' },
            }[item.mobilityStatus];

            return (
              <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.patientName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${mobilityBadge.class}`}>
                        {mobilityBadge.label}
                      </span>
                    </div>
                    <span className="text-slate-500 flex items-center gap-1 mt-0.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#0284c7]" />
                      {item.villageMoo} • วันที่เยี่ยม: {item.visitDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 rounded bg-[#eaedff] text-[#0f2d6b] font-mono font-medium text-xs">
                      BP: {item.bp} | น้ำตาล: {item.bloodSugar} mg/dL
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    บันทึกโดย: {item.volunteerName}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {item.concerns}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-slate-700">เวชภัณฑ์ที่ขอรับเพิ่ม:</span>
                    {item.needsSupplies.map((sup, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">
                        {sup}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-600">
                    กำหนดติดตามถัดไป: <strong>{item.followupDate}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Visit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base font-heading">
                บันทึกการเยี่ยมบ้านผู้ป่วยโดย อสม.
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อผู้ป่วยและอายุ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นาย สมศรี ใจแก้ว (อายุ 78 ปี)"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">หมู่บ้าน</label>
                  <select
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  >
                    {villages.map((v) => (
                      <option key={v.name} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">สถานะการเคลื่อนไหว</label>
                  <select
                    value={newMobility}
                    onChange={(e) => setNewMobility(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  >
                    <option value="bedridden">ติดเตียง (Bedridden)</option>
                    <option value="homebound">ติดบ้าน (Homebound)</option>
                    <option value="mobile">ติดสังคม (Mobile)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ความดันโลหิต (BP)</label>
                  <input
                    type="text"
                    value={newBp}
                    onChange={(e) => setNewBp(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ค่าน้ำตาลปลายนิ้ว (DTX mg/dL)</label>
                  <input
                    type="number"
                    value={newSugar}
                    onChange={(e) => setNewSugar(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">อสม. ผู้รับผิดชอบ</label>
                <input
                  type="text"
                  value={newVolunteer}
                  onChange={(e) => setNewVolunteer(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">อาการสำคัญและการดูแลที่ให้</label>
                <textarea
                  rows={3}
                  value={newConcerns}
                  onChange={(e) => setNewConcerns(e.target.value)}
                  placeholder="เช่น พลิกตัว วัดสัญญาณชีพ แนะนำเรื่องอาหารลดเค็ม..."
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0f2d6b] text-white font-bold hover:bg-[#001849] cursor-pointer"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
