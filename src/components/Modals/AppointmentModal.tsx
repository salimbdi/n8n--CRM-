import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Stethoscope, Plus } from 'lucide-react';
import { Appointment, Patient, Doctor, ClinicService, AppointmentStatus } from '../../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    patientId: string;
    doctorId: string;
    serviceId: string;
    date: string;
    time: string;
    status?: AppointmentStatus;
    notes?: string;
  }, id?: string) => void;
  appointmentToEdit?: Appointment | null;
  patients: Patient[];
  doctors: Doctor[];
  services: ClinicService[];
  preselectedPatientId?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  appointmentToEdit,
  patients,
  doctors,
  services,
  preselectedPatientId,
}) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('16:00');
  const [status, setStatus] = useState<AppointmentStatus>('scheduled');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (appointmentToEdit) {
      setPatientId(appointmentToEdit.patientId || (patients[0]?.id || ''));
      setDoctorId(appointmentToEdit.doctorId || (doctors[0]?.id || ''));
      setServiceId(appointmentToEdit.serviceId || (services[0]?.id || ''));
      setDate(appointmentToEdit.date || new Date().toISOString().split('T')[0]);
      setTime(appointmentToEdit.time || '16:00');
      setStatus(appointmentToEdit.status || 'scheduled');
      setNotes(appointmentToEdit.notes || '');
    } else {
      setPatientId(preselectedPatientId || (patients[0]?.id || ''));
      setDoctorId(doctors[0]?.id || '');
      setServiceId(services[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('16:00');
      setStatus('scheduled');
      setNotes('');
    }
  }, [appointmentToEdit, preselectedPatientId, isOpen, patients, doctors, services]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !serviceId || !date || !time) return;

    onSave(
      {
        patientId,
        doctorId,
        serviceId,
        date,
        time,
        status,
        notes: notes.trim(),
      },
      appointmentToEdit ? appointmentToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in duration-200">
        <div className="p-5 bg-teal-800 text-white flex items-center justify-between">
          <h3 className="font-bold text-base">
            {appointmentToEdit ? 'تعديل بيانات الموعد' : 'حجز موعد عيادة جديد'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-teal-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          <div>
            <label className="block font-bold text-slate-700 mb-1">المريض المعني:*</label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-teal-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code}) - {p.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الطبيب المعالج:*</label>
              <select
                required
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.room})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الخدمة المطلوب تقديمها:*</label>
              <select
                required
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.price} ر.س)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">تاريخ الموعد:*</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">التوقيت:*</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">حالة الموعد:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            >
              <option value="scheduled">مجدول</option>
              <option value="confirmed">مؤكد</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغى</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ملاحظات وشكوى المريض:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: يشتكي من ألم في الضرس العلوي الأيمن..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-xs"
            >
              تأكيد الحجز
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
