import React from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Webhook,
  UserPlus,
  PlusCircle,
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ArrowUpLeft,
  ChevronLeft,
  Bot,
} from 'lucide-react';
import { Appointment, AppointmentStatus, QuickStats, WebhookLog } from '../types';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  stats: QuickStats;
  todayAppointments: Appointment[];
  recentWebhookLogs: WebhookLog[];
  onSelectTab: (tab: NavTab) => void;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onOpenAddPatientModal: () => void;
  onOpenBookAppointmentModal: () => void;
  onOpenLogVisitModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  todayAppointments,
  recentWebhookLogs,
  onSelectTab,
  onUpdateAppointmentStatus,
  onOpenAddPatientModal,
  onOpenBookAppointmentModal,
  onOpenLogVisitModal,
}) => {
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-xs px-2.5 py-1 rounded-full font-bold border border-teal-200">
            <CheckCircle className="w-3 h-3 text-teal-600" />
            مؤكد
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            مكتمل
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded-full font-bold border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            ملغى
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            مجدول
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-teal-300 transition-all">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">مواعيد اليوم</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{stats.todayAppointmentsCount}</span>
              <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                {stats.confirmedTodayCount} مؤكد
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">المواعيد المجدولة لليوم</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shadow-xs">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-teal-300 transition-all">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">إجمالي المرضى المسجلين</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{stats.totalPatientsCount}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                نشط
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">ملفات طبية محفوظة بالشفرة</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Today Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-teal-300 transition-all">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">إيرادات اليوم</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">{stats.todayRevenue}</span>
              <span className="text-xs font-semibold text-slate-500">ر.س</span>
            </div>
            <p className="text-[11px] text-teal-600 font-medium mt-1">
              إجمالي الشهر: {stats.monthlyRevenue} ر.س
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: n8n AI Events */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              أحداث n8n والذكاء الاصطناعي
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{stats.n8nEventsCount}</span>
              <span className="text-[10px] font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded-full border border-teal-700">
                Webhooks
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">عمليات التنسيق التلقائي</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center relative z-10">
            <Webhook className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. Quick Action Bar */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white rounded-2xl p-5 shadow-lg border border-teal-700/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-300" />
              الإجراءات السريعة بالعيادة
            </h3>
            <p className="text-xs text-teal-100 mt-1">
              تسجيل المرضى، حجز المواعيد، أو اختبار واستدعاء وكيل n8n الذكي بنقرة واحدة
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={onOpenAddPatientModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold border border-white/15 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-teal-300" />
              <span>إضافة مريض</span>
            </button>

            <button
              onClick={onOpenBookAppointmentModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>حجز موعد</span>
            </button>

            <button
              onClick={onOpenLogVisitModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold border border-white/15 transition-all cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-cyan-300" />
              <span>تسجيل زيارة</span>
            </button>

            <button
              onClick={() => onSelectTab('n8n')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-cyan-400/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>اختبار n8n</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments List (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                مواعيد اليوم والجدول الزمني
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                عرض المواعيد المجدولة وتحديث حالتها مباشرة
              </p>
            </div>
            <button
              onClick={() => onSelectTab('appointments')}
              className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>عرض كافة المواعيد</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">لا توجد مواعيد مجدولة لليوم</p>
              <p className="text-[11px] text-slate-400 mt-1">
                يمكنك حجز موعد جديد أو استخدام وكيل الذكاء الاصطناعي لحجز المواعيد آلياً
              </p>
              <button
                onClick={onOpenBookAppointmentModal}
                className="mt-3 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                + حجز موعد الآن
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-extrabold text-slate-800">{apt.time}</span>
                      <span className="text-[10px] text-slate-500 font-medium">اليوم</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-800 text-sm">{apt.patientName}</h4>
                        {getStatusBadge(apt.status)}
                        {apt.bookingSource === 'n8n_ai' && (
                          <span className="text-[10px] bg-slate-900 text-teal-300 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                            <Bot className="w-3 h-3 text-teal-400" />
                            n8n AI
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 font-medium mt-1 flex items-center gap-3 flex-wrap">
                        <span>الخدمة: <strong className="text-slate-700">{apt.serviceName}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span>الطبيب: <strong className="text-slate-700">{apt.doctorName}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span>الهاتف: <span dir="ltr" className="font-mono text-slate-700">{apt.patientPhone}</span></span>
                      </div>

                      {apt.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-1.5 sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {apt.status === 'scheduled' && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'confirmed')}
                        className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        تأكيد
                      </button>
                    )}

                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        إكمال
                      </button>
                    )}

                    {apt.status !== 'cancelled' && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                        className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live n8n AI Log Widget (1 Column) */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                  <Webhook className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">نشاط الذكاء الاصطناعي (n8n)</h3>
                  <p className="text-[10px] text-slate-400">سجل استدعاءات الـ Webhooks المباشرة</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            </div>

            <div className="space-y-2.5">
              {recentWebhookLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-300 text-[11px]">
                      {log.action}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        log.status === 'success'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {log.status === 'success' ? '200 OK' : 'FAILED'}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-0.5">
                    <span>{log.endpoint}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('n8n')}
            className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <span>فتح مركز المحاكي وإرشادات n8n</span>
            <ArrowUpLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
