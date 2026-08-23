import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  ClipboardList,
  UserCheck,
  Webhook,
  Smile,
  Sparkles,
  ChevronLeft,
  X,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'visits'
  | 'services'
  | 'doctors'
  | 'n8n';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  todayAppointmentsCount: number;
  n8nStatus: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  todayAppointmentsCount,
  n8nStatus,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'الرئيسية',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'patients' as NavTab,
      label: 'ملفات المرضى',
      icon: Users,
      badge: null,
    },
    {
      id: 'appointments' as NavTab,
      label: 'إدارة المواعيد',
      icon: Calendar,
      badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : null,
      badgeBg: 'bg-teal-500 text-white',
    },
    {
      id: 'visits' as NavTab,
      label: 'سجل الزيارات والعلاج',
      icon: Stethoscope,
      badge: null,
    },
    {
      id: 'services' as NavTab,
      label: 'الخدمات والأسعار',
      icon: ClipboardList,
      badge: null,
    },
    {
      id: 'doctors' as NavTab,
      label: 'الأطباء والطاقم',
      icon: UserCheck,
      badge: null,
    },
    {
      id: 'n8n' as NavTab,
      label: 'ربط n8n والذكاء الاصطناعي',
      icon: Webhook,
      badge: 'مفعل',
      badgeBg: n8nStatus ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-300' : 'bg-slate-200 text-slate-600',
      isSpecial: true,
    },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 right-0 bottom-0 z-50 w-72 bg-[#1B3B3B] text-slate-100 flex flex-col justify-between border-l border-[#2D5A5A] shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Clinic Brand & Logo */}
          <div className="p-5 border-b border-[#2D5A5A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#4FD1C5] flex items-center justify-center text-white shadow-lg">
                <Smile className="w-6 h-6 text-[#1B3B3B]" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-1.5">
                  عيادة الابتسامة
                  <span className="inline-block w-2 h-2 rounded-full bg-[#4FD1C5] animate-pulse"></span>
                </h1>
                <p className="text-xs text-[#4FD1C5] font-medium">نظام الإدارة الذكي & n8n AI</p>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-300 hover:text-white p-1 rounded-lg hover:bg-[#2D5A5A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            <div className="px-3 py-1 text-[11px] font-bold text-[#8BA7A7] uppercase tracking-wider">
              القائمة الرئيسية
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#2D5A5A] text-white shadow-md font-semibold'
                      : 'text-slate-200 hover:bg-[#2D5A5A]/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#4FD1C5]' : 'bg-transparent'}`} />
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#4FD1C5]' : item.isSpecial ? 'text-[#4FD1C5]' : 'text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        item.badgeBg || 'bg-[#152E2E] text-[#4FD1C5]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner for n8n AI Agent */}
        <div className="p-4 border border-[#2D5A5A] bg-[#152E2E] m-3 rounded-2xl">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#4FD1C5]/20 border border-[#4FD1C5]/30 flex items-center justify-center text-[#4FD1C5]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">وكيل n8n الذكي</div>
              <div className="text-[10px] text-[#4FD1C5] font-medium">الربط التلقائي شغال</div>
            </div>
          </div>
          <p className="text-[11px] text-[#8BA7A7] leading-relaxed">
            يستقبل الوكيل المواعيد ويسجل أورنيك المرضى تلقائياً.
          </p>
          <button
            onClick={() => handleTabClick('n8n')}
            className="mt-2.5 w-full py-1.5 px-3 bg-[#2D5A5A] hover:bg-[#2D5A5A]/80 text-[#4FD1C5] rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>اختبار وإعدادات Webhook</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
