import React, { useState } from 'react';
import { 
  Pill, 
  Thermometer, 
  AlertTriangle, 
  Plus, 
  Minus, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Search, 
  FileBox,
  BatteryCharging,
  RefreshCw
} from 'lucide-react';
import { InventoryItem } from '../types/medical';
import { INITIAL_INVENTORY } from '../data/mockData';

interface PharmacyInventoryHubProps {
  language: 'TH' | 'EN';
}

export const PharmacyInventoryHub: React.FC<PharmacyInventoryHubProps> = ({ language }) => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [fridgeTemp, setFridgeTemp] = useState<number>(4.2);

  const handleAdjustStock = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.genericName.toLowerCase().includes(search.toLowerCase()) ||
      item.tradeName.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = items.filter((i) => i.stock <= i.minThreshold).length;
  const isTempNormal = fridgeTemp >= 2.0 && fridgeTemp <= 8.0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Cold Chain Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cold Chain Vaccine Card (5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-xl border shadow-sm transition ${
          isTempNormal 
            ? 'bg-gradient-to-br from-[#001849] to-[#0f2d6b] text-white border-[#2a4482]'
            : 'bg-red-900 text-white border-red-500 animate-pulse'
        }`}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7bd0ff]">
              <Thermometer className="w-4 h-4 text-[#5bb8fe]" />
              {language === 'TH' ? 'ตู้เย็นชีววัตถุและวัคซีนโหนดดอยยาว' : 'Vaccine Cold-Chain Fridge'}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isTempNormal ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-red-600 text-white'
            }`}>
              {isTempNormal ? 'STANDARD 2°C - 8°C' : 'TEMPERATURE ALERT!'}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-4xl font-extrabold font-mono tracking-tight">
                {fridgeTemp.toFixed(1)} <span className="text-xl font-normal">°C</span>
              </div>
              <p className="text-xs text-[#dae2fd]/80 mt-1">
                {isTempNormal 
                  ? 'อุณหภูมิตามมาตรฐานความปลอดภัยของชีววัตถุและเซรุ่มแก้พิษงู'
                  : 'อุณหภูมิหลุดช่วงมาตรฐาน! ตรวจสอบระบบจ่ายไฟฉุกเฉินทันที'}
              </p>
            </div>

            {/* Test temperature toggle */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setFridgeTemp(4.2)}
                className="px-2 py-1 rounded text-[10px] bg-white/10 hover:bg-white/20 transition cursor-pointer text-slate-200"
              >
                รีเซ็ต 4.2°C (ปกติ)
              </button>
              <button
                onClick={() => setFridgeTemp(9.4)}
                className="px-2 py-1 rounded text-[10px] bg-amber-500/30 hover:bg-amber-500/50 transition cursor-pointer text-amber-200"
              >
                จำลองเตือน 9.4°C
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-[#dae2fd]">
            <div className="flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              <span>แบตเตอรี่สำรอง: 98% (Online)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>พลังงานแสงอาทิตย์ + ไฟฟ้า อบจ.</span>
            </div>
          </div>
        </div>

        {/* Pharmacy Census & Fast Metrics (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base font-heading">
                {language === 'TH' ? 'สถานะคลังยาและเวชภัณฑ์จำเป็นประจำโหนด' : 'Essential Highland Drug Dispensary'}
              </h3>
              {lowStockCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  {lowStockCount} รายการใกล้หมด
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'TH'
                ? 'สำรองยาฉุกเฉิน ยาโรคเรื้อรัง NCD ยาพ่นขยายหลอดลม และเซรุ่มแก้พิษงูสำหรับพื้นที่ภูเขาสูง'
                : 'Stocking emergency bronchodilators, antivenoms, chronic NCD meds for highland isolated nodes'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">ยาฉุกเฉิน & เซรุ่ม</span>
              <span className="text-xl font-bold text-red-700">100% พร้อม</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">ยา NCD เบาหวาน/ความดัน</span>
              <span className="text-xl font-bold text-blue-700">2,050 เม็ด</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">หลอดยาพ่น Salbutamol</span>
              <span className="text-xl font-bold text-emerald-700">84 หลอด</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">น้ำเกลือ NSS 1000ml</span>
              <span className="text-xl font-bold text-slate-800">52 ขวด</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drug List & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/50">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหายา, ชื่อการค้า, รหัสเวชภัณฑ์..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {['ALL', 'EMERGENCY', 'RESPIRATORY', 'NCD_CHRONIC', 'ANTIBIOTIC', 'SUPPLY'].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#0f2d6b] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#eaedff]/60 text-[#0f2d6b] uppercase text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">รหัส / ชื่อยาและเวชภัณฑ์</th>
                <th className="py-2.5 px-4">หมวดหมู่</th>
                <th className="py-2.5 px-4">คงคลังปัจจุบัน</th>
                <th className="py-2.5 px-4">เกณฑ์ขั้นต่ำ</th>
                <th className="py-2.5 px-4">รุ่นผลิต / วันหมดอายุ</th>
                <th className="py-2.5 px-4">การควบคุมอุณหภูมิ</th>
                <th className="py-2.5 px-4 text-right">ปรับยอดด่วน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isLow = item.stock <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.genericName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.tradeName} • [{item.code}]
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className={`font-mono text-sm font-extrabold ${isLow ? 'text-red-600' : 'text-slate-900'}`}>
                        {item.stock} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                      </div>
                      {isLow && (
                        <span className="text-[10px] text-red-600 font-semibold block">
                          ⚠ ต่ำกว่าเกณฑ์สำรอง
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      {item.minThreshold} {item.unit}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      <div>Lot: {item.batchNo}</div>
                      <div className="text-[10px] text-slate-400">Exp: {item.expireDate}</div>
                    </td>

                    <td className="py-3 px-4">
                      {item.tempControlled ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {item.idealTemp}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">อุณหภูมิห้อง (&lt;30°C)</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          title="จ่ายออก 1 หน่วย"
                          className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 5)}
                          title="รับเข้า 5 หน่วย"
                          className="w-7 h-7 rounded bg-[#0f2d6b] hover:bg-[#001849] text-white flex items-center justify-center font-bold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
