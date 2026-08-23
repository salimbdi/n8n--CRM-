import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Plus,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Filter,
  Bot,
  Search,
} from 'lucide-react';
import { Appointment, AppointmentStatus, Doctor, ClinicService } from '../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  services: ClinicService[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onBookAppointment: () => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onEditAppointment: (apt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  doctors,
  services,
  searchQuery,
  onSearchChange,
  onBookAppointment,
  onUpdateStatus,
  onEditAppointment,
  onDeleteAppointment,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredAppointments = appointments.filter((apt) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      apt.patientName.toLowerCase().includes(q) ||
      apt.patientPhone.includes(q) ||
      apt.doctorName.toLowerCase().includes(q) ||
      apt.serviceName.toLowerCase().includes(q);

    const matchesDoctor = selectedDoctorId === 'all' || apt.doctorId === selectedDoctorId;
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
    const matchesDate = !selectedDate || apt.date === selectedDate;

    return matchesQuery && matchesDoctor && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-teal-100 text-teal-800 border border-teal-300 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            مؤكد
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            مكتمل
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            ملغى
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            مجدول
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">جدول مواعيد العيادة ({filteredAppointments.length})</h3>
              <p className="text-xs text-slate-500">تصفية المواعيد حسب التاريخ، الطبيب وحالة الموعد</p>
            </div>
          </div>

          <button
            onClick={onBookAppointment}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>حجز موعد جديد</span>
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Doctor Filter */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">اختر الطبيب المعالج:</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            >
              <option value="all">كافة الأطباء</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.room})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">حالة الموعد:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            >
              <option value="all">جميع الحالات</option>
              <option value="scheduled">مجدول فقط</option>
              <option value="confirmed">مؤكد فقط</option>
              <option value="completed">مكتمل فقط</option>
              <option value="cancelled">ملغى فقط</option>
            </select>
          </div>

          {/* Date Picker Filter */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">تاريخ الموعد المحدد:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">لا توجد مواعيد مطابقة للفلتر المحدد</p>
            <p className="text-xs text-slate-400 mt-1">جرب تغيير التاريخ أو الطبيب أو مسح عبارة البحث</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Info side */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 text-teal-800 flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-sm font-extrabold">{apt.time}</span>
                    <span className="text-[10px] font-bold text-teal-600 mt-0.5">{apt.date}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-800 text-base">{apt.patientName}</h4>
                      {getStatusBadge(apt.status)}
                      {apt.bookingSource === 'n8n_ai' && (
                        <span className="bg-slate-900 text-teal-300 text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                          <Bot className="w-3 h-3 text-teal-400" />
                          حجز ذكي عبر n8n
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 font-medium flex items-center gap-3 flex-wrap pt-0.5">
                      <span>الخدمة: <strong className="text-slate-800">{apt.serviceName}</strong></span>
                      <span className="text-slate-300">•</span>
                      <span>الطبيب: <strong className="text-slate-800">{apt.doctorName}</strong></span>
                      <span className="text-slate-300">•</span>
                      <span>الهاتف: <span dir="ltr" className="font-mono text-slate-800">{apt.patientPhone}</span></span>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions side */}
                <div className="flex items-center gap-2 self-start md:self-center pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {apt.status === 'scheduled' && (
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'confirmed')}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      تأكيد الموعد
                    </button>
                  )}

                  {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      إكمال الزيارة
                    </button>
                  )}

                  {apt.status !== 'cancelled' && (
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'cancelled')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                  )}

                  <button
                    onClick={() => onEditAppointment(apt)}
                    title="تعديل تفاصيل الموعد"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteAppointment(apt.id)}
                    title="حذف الموعد"
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
