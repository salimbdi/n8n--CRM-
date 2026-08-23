import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  FileText,
  DollarSign,
  Calendar,
  User,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Pill,
} from 'lucide-react';
import { VisitLog, Patient, Doctor, ClinicService } from '../types';
import { DentalChart } from './DentalChart';

interface VisitsViewProps {
  visits: VisitLog[];
  patients: Patient[];
  doctors: Doctor[];
  services: ClinicService[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddVisitModal: () => void;
  onEditVisit: (visit: VisitLog) => void;
  onDeleteVisit: (id: string) => void;
}

export const VisitsView: React.FC<VisitsViewProps> = ({
  visits,
  patients,
  doctors,
  services,
  searchQuery,
  onSearchChange,
  onOpenAddVisitModal,
  onEditVisit,
  onDeleteVisit,
}) => {
  const [selectedVisit, setSelectedVisit] = useState<VisitLog | null>(null);

  const filteredVisits = visits.filter((v) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      v.patientName.toLowerCase().includes(q) ||
      v.doctorName.toLowerCase().includes(q) ||
      v.diagnosis.toLowerCase().includes(q) ||
      v.treatmentDone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">سجل زيارات المرضى والعلاجات (إجمالي: {visits.length})</h3>
            <p className="text-xs text-slate-500">تسجيل متابعات الأطباء، تشخيص الأسنان، والوصفات الطبية</p>
          </div>
        </div>

        <button
          onClick={onOpenAddVisitModal}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل زيارة علاجية جديدة</span>
        </button>
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredVisits.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">لا توجد زيارات علاجية مسجلة</p>
            <p className="text-xs text-slate-400 mt-1">اضغط على زر "تسجيل زيارة علاجية جديدة" لإضافة زيارة للمريض</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredVisits.map((v) => (
              <div
                key={v.id}
                className="p-5 hover:bg-slate-50/80 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {v.patientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{v.patientName}</h4>
                      <p className="text-xs text-slate-500">
                        الطبيب: <strong className="text-slate-700">{v.doctorName}</strong> • تاريخ الزيارة: <span className="font-mono">{v.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full font-bold">
                      {v.totalCost} ر.س ({v.paymentStatus === 'paid' ? 'مدفوع بالكامل' : 'جزئي'})
                    </span>

                    <button
                      onClick={() => setSelectedVisit(v)}
                      className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>تفاصيل التشخيص</span>
                    </button>

                    <button
                      onClick={() => onEditVisit(v)}
                      title="تعديل الزيارة"
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteVisit(v.id)}
                      title="حذف الزيارة"
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Visit Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">التشخيص الطبي:</span>
                    <p className="text-slate-800 font-medium">{v.diagnosis}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-bold block mb-1">العلاج المنفذ:</span>
                    <p className="text-slate-800 font-medium">{v.treatmentDone}</p>
                  </div>

                  {v.prescription && (
                    <div className="md:col-span-2 pt-2 border-t border-slate-200 flex items-start gap-2">
                      <Pill className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 font-bold">الوصفة الطبية: </span>
                        <span className="text-slate-700 italic">{v.prescription}</span>
                      </div>
                    </div>
                  )}

                  {v.teethAffected && v.teethAffected.length > 0 && (
                    <div className="md:col-span-2 flex items-center gap-2 pt-1">
                      <span className="text-slate-500 font-bold">الأسنان المعالجة:</span>
                      <div className="flex flex-wrap gap-1">
                        {v.teethAffected.map((t) => (
                          <span
                            key={t}
                            className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-mono font-bold text-[11px]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visit Detail Modal with Dental Chart Preview */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <div className="p-5 bg-teal-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">تفاصيل التقرير الطبي للزيارة</h3>
                <p className="text-xs text-teal-200">المريض: {selectedVisit.patientName} • الطبيب: {selectedVisit.doctorName}</p>
              </div>
              <button
                onClick={() => setSelectedVisit(null)}
                className="p-1.5 text-teal-200 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <DentalChart
                selectedTeeth={selectedVisit.teethAffected || []}
                onToggleTooth={() => {}}
                readOnly={true}
              />

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <p><strong>تاريخ الزيارة:</strong> {selectedVisit.date}</p>
                <p><strong>التشخيص:</strong> {selectedVisit.diagnosis}</p>
                <p><strong>الإجراء والعلاج المنفذ:</strong> {selectedVisit.treatmentDone}</p>
                <p><strong>الوصفة الطبية:</strong> {selectedVisit.prescription || 'لا توجد'}</p>
                <p><strong>التكلفة الإجمالية:</strong> {selectedVisit.totalCost} ر.س</p>
                {selectedVisit.nextVisitDate && (
                  <p><strong>الموعد القادم الموصى به:</strong> {selectedVisit.nextVisitDate}</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-100 text-right">
              <button
                onClick={() => setSelectedVisit(null)}
                className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
