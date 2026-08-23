import React from 'react';
import { Menu, Plus, Calendar as CalendarIcon, Search, Webhook, CheckCircle2 } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenMobileMenu: () => void;
  onQuickBook: () => void;
  n8nStatus: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'لوحة التحكم والملخص العام',
    subtitle: 'نظرة عامة على مواعيد اليوم، الإحصائيات، ونشاط وكيل الذكاء الاصطناعي',
  },
  patients: {
    title: 'إدارة ملفات المرضى',
    subtitle: 'عرض السجلات الطبية، بيانات التواصل، والتاريخ المرضي للعيادة',
  },
  appointments: {
    title: 'جدول المواعيد والحجوزات',
    subtitle: 'متابعة المواعيد المحجوزة، التأكيدات، وتغيير حالات المواعيد',
  },
  visits: {
    title: 'سجل الزيارات والعلاج الطبي',
    subtitle: 'تسجيل زيارات المريض، اختيار الأسنان المتأثرة، والوصفات الطبية',
  },
  services: {
    title: 'قائمة الخدمات والأسعار',
    subtitle: 'إدارة أجور العلاج وتفاصيل خدمات الأسنان المقدمة',
  },
  doctors: {
    title: 'الأطباء والكادر الطبي',
    subtitle: 'قائمة الأطباء، التخصصات، وأيام العمل في العيادات',
  },
  n8n: {
    title: 'مركز ربط n8n والذكاء الاصطناعي',
    subtitle: 'إعدادات الـ Webhooks، مفاتيح API، والمحاكي التفاعلي للاختبار',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onQuickBook,
  n8nStatus,
  searchQuery,
  onSearchChange,
}) => {
  const info = tabTitles[currentTab] || {
    title: 'نظام إدارة العيادة',
    subtitle: 'إدارة متكاملة لعيادة الأسنان',
  };

  // Arabic formatted date
  const today = new Date().toLocaleDateString('ar-SA-u-ca-gregory', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8 py-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left/Title side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="القائمة"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {info.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{info.subtitle}</p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-60 min-w-[180px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="بحث عن مريض، موعد، هاتف..."
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

          {/* Today Date Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-600 font-medium border border-slate-200">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>{today}</span>
          </div>

          {/* n8n Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${
              n8nStatus
                ? 'bg-teal-50 text-teal-800 border-teal-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title={n8nStatus ? 'وكيل n8n جاهز ويستقبل الـ Webhooks' : 'إعدادات n8n بحاجة لتكوين'}
          >
            <Webhook className={`w-3.5 h-3.5 ${n8nStatus ? 'text-teal-600' : 'text-amber-600'}`} />
            <span className="hidden sm:inline">n8n:</span>
            <span className="flex items-center gap-1">
              {n8nStatus ? 'متصل' : 'غير مكتمل'}
              {n8nStatus && <CheckCircle2 className="w-3 h-3 text-teal-600" />}
            </span>
          </div>

          {/* Quick Book Button */}
          <button
            onClick={onQuickBook}
            className="flex items-center gap-1.5 bg-[#1B3B3B] hover:bg-[#2D5A5A] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#4FD1C5]" />
            <span>حجز موعد جديد</span>
          </button>
        </div>
      </div>
    </header>
  );
};
