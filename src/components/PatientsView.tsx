import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  UserCheck,
  Calendar,
  Phone,
  FileText,
  AlertTriangle,
  Edit2,
  Trash2,
  Eye,
  Stethoscope,
  Clock,
  X,
  ChevronLeft,
} from 'lucide-react';
import { Patient, Appointment, VisitLog } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  appointments: Appointment[];
  visits: VisitLog[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onBookForPatient: (patient: Patient) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  appointments,
  visits,
  searchQuery,
  onSearchChange,
  onAddPatient,
  onEditPatient,
  onDeletePatient,
  onBookForPatient,
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.code.toLowerCase().includes(q) ||
      (p.notes && p.notes.toLowerCase().includes(q));

    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  const getPatientAppointments = (patientId: string) =>
    appointments.filter((a) => a.patientId === patientId);

  const getPatientVisits = (patientId: string) =>
    visits.filter((v) => v.patientId === patientId);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">سجلات المرضى (إجمالي: {patients.length})</h3>
            <p className="text-xs text-slate-500">إدارة الملفات الطبية وقاعدة البيانات</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Gender filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">جميع الفئات (الكل)</option>
            <option value="ذكر">ذكور فقط</option>
            <option value="أنثى">إناث فقط</option>
          </select>

          {/* Add Patient Button */}
          <button
            onClick={onAddPatient}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>فتح ملف مريض جديد</span>
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">لم يتم العثور على مرضى مطابقين</p>
            <p className="text-xs text-slate-400 mt-1">تأكد من عبارة البحث أو اضغط فتح ملف مريض جديد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-200">
                  <th className="p-4">كود المريض</th>
                  <th className="p-4">اسم المريض</th>
                  <th className="p-4">رقم الجوال</th>
                  <th className="p-4">العمر والجنس</th>
                  <th className="p-4">التاريخ المرضي</th>
                  <th className="p-4">آخر زيارة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-teal-700">{p.code}</td>

                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                      {p.notes && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{p.notes}</div>
                      )}
                    </td>

                    <td className="p-4 font-mono text-slate-700" dir="ltr">
                      {p.phone}
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-700">{p.age} سنة</span>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className="text-slate-600">{p.gender}</span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.medicalHistory && p.medicalHistory.length > 0 ? (
                          p.medicalHistory.map((med, idx) => (
                            <span
                              key={idx}
                              className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.5 rounded font-medium"
                            >
                              {med}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">سليم</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 font-medium">
                      {p.lastVisit || 'لم يزار العيادة بعد'}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedPatient(p)}
                          title="عرض الملف الكامل"
                          className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onBookForPatient(p)}
                          title="حجز موعد جديد"
                          className="p-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditPatient(p)}
                          title="تعديل المريض"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeletePatient(p.id)}
                          title="حذف الملف"
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Detail Profile Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-teal-800 to-cyan-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-extrabold text-lg">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {selectedPatient.name}
                    <span className="text-xs bg-teal-500/30 text-teal-200 px-2.5 py-0.5 rounded-full font-mono border border-teal-400/20">
                      {selectedPatient.code}
                    </span>
                  </h3>
                  <p className="text-xs text-teal-100 mt-0.5">
                    {selectedPatient.gender} • {selectedPatient.age} سنة • هاتف: <span dir="ltr" className="font-mono">{selectedPatient.phone}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 text-teal-200 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
              {/* Patient Basic Info Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">التاريخ المرضي والحساسية:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                      selectedPatient.medicalHistory.map((m, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">لا يوجد سجل لأمراض مزمنة</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block mb-1">ملاحظات الملف الطبي:</span>
                  <p className="text-slate-700 italic">{selectedPatient.notes || 'لا توجد ملاحظات إضافية'}</p>
                </div>
              </div>

              {/* Patient Appointments History */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  سجل المواعيد ({getPatientAppointments(selectedPatient.id).length})
                </h4>

                {getPatientAppointments(selectedPatient.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">لا توجد مواعيد مسجلة للمريض</p>
                ) : (
                  <div className="space-y-2">
                    {getPatientAppointments(selectedPatient.id).map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{apt.serviceName}</span>
                          <span className="text-slate-400 mx-2">•</span>
                          <span className="text-slate-600">{apt.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-600">{apt.date} - {apt.time}</span>
                          <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold">
                            {apt.status === 'confirmed' ? 'مؤكد' : apt.status === 'completed' ? 'مكتمل' : 'مجدول'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Patient Visit Logs */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  سجل الزيارات والعلاج الطبي ({getPatientVisits(selectedPatient.id).length})
                </h4>

                {getPatientVisits(selectedPatient.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">لا توجد زيارات علاجية سابقة</p>
                ) : (
                  <div className="space-y-3">
                    {getPatientVisits(selectedPatient.id).map((v) => (
                      <div
                        key={v.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-bold text-slate-800 text-sm">تاريخ الزيارة: {v.date}</span>
                          <span className="font-semibold text-teal-700">التكلفة: {v.totalCost} ر.س</span>
                        </div>
                        <p className="text-slate-700">
                          <strong>التشخيص:</strong> {v.diagnosis}
                        </p>
                        <p className="text-slate-700">
                          <strong>العلاج المنفذ:</strong> {v.treatmentDone}
                        </p>
                        {v.prescription && (
                          <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                            <strong>الوصفة الطبية:</strong> {v.prescription}
                          </p>
                        )}
                        {v.teethAffected && v.teethAffected.length > 0 && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <strong>الأسنان المتأثرة:</strong>
                            <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-mono font-bold">
                              #{v.teethAffected.join(', #')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                إغلاق
              </button>

              <button
                onClick={() => {
                  const p = selectedPatient;
                  setSelectedPatient(null);
                  onBookForPatient(p);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                + حجز موعد جديد للمريض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
