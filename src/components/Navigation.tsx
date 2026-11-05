import React from 'react';
import { 
  FileEdit, 
  BarChart3, 
  Stethoscope, 
  Ambulance, 
  Users, 
  Pill, 
  FileText,
  Building2
} from 'lucide-react';

export type TabType = 
  | 'practice_log' 
  | 'analytics' 
  | 'transfers' 
  | 'clinical' 
  | 'field' 
  | 'pharmacy' 
  | 'documents';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  language: 'TH' | 'EN';
  badgeCounts: {
    logCount: number;
    triageQueue: number;
    activeReferrals: number;
    lowStock: number;
  };
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  language,
  badgeCounts,
}) => {
  const navItems: Array<{
    id: TabType;
    labelTh: string;
    labelEn: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    {
      id: 'practice_log',
      labelTh: 'บันทึกการปฏิบัติงานของแพทย์',
      labelEn: 'Doctor Practice Log',
      icon: <FileEdit className="w-4 h-4" />,
      badge: badgeCounts.logCount,
      badgeColor: 'bg-[#38BDF8] text-[#001849] font-bold',
    },
    {
      id: 'analytics',
      labelTh: 'สรุปผล & สถิติรายเดือน/ปี',
      labelEn: 'Monthly/Yearly Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'transfers',
      labelTh: 'ระบบส่งต่อ & กู้ชีพ 1669',
      labelEn: 'Referral Manifest & EMS',
      icon: <Ambulance className="w-4 h-4" />,
      badge: badgeCounts.activeReferrals,
      badgeColor: 'bg-red-600 text-white animate-pulse',
    },
    {
      id: 'clinical',
      labelTh: 'ตรวจรักษา & เวชระเบียน (OPD)',
      labelEn: 'Clinical Log & OPD',
      icon: <Stethoscope className="w-4 h-4" />,
      badge: badgeCounts.triageQueue,
      badgeColor: 'bg-[#0284c7] text-white',
    },
    {
      id: 'field',
      labelTh: 'งานชุมชน & อสม. ดอยยาว',
      labelEn: 'Highland Field & Volunteers',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'pharmacy',
      labelTh: 'คลังยา & ตู้แช่วัคซีน (2-8°C)',
      labelEn: 'Pharmacy & Cold Chain',
      icon: <Pill className="w-4 h-4" />,
      badge: badgeCounts.lowStock > 0 ? badgeCounts.lowStock : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'documents',
      labelTh: 'ออกเอกสารราชการ & พิมพ์',
      labelEn: 'Official Documents & Print',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="bg-[#0f2d6b] text-white border-b border-[#2a4482] shadow-sm sticky top-[73px] z-30 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 sm:space-x-2 py-1 min-w-max">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-md text-xs sm:text-sm font-medium transition-all relative cursor-pointer ${
                isActive
                  ? 'bg-[#faf8ff] text-[#001849] font-bold shadow-[0_-2px_4px_rgba(0,0,0,0.1)] border-t-2 border-t-[#0284c7]'
                  : 'text-[#dae2fd]/85 hover:text-white hover:bg-[#1e3a8a]/60'
              }`}
            >
              <span className={isActive ? 'text-[#0284c7]' : 'text-[#7bd0ff]'}>
                {item.icon}
              </span>
              <span>{language === 'TH' ? item.labelTh : item.labelEn}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    item.badgeColor || 'bg-slate-700 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
