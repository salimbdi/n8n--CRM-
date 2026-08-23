import React from 'react';
import { UserCheck, Plus, Phone, DoorClosed, Calendar, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorsViewProps {
  doctors: Doctor[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddDoctor: () => void;
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (id: string) => void;
  onToggleDoctorActive: (id: string, active: boolean) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  searchQuery,
  onSearchChange,
  onAddDoctor,
  onEditDoctor,
  onDeleteDoctor,
  onToggleDoctorActive,
}) => {
  const filteredDoctors = doctors.filter((doc) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.specialization.toLowerCase().includes(q) ||
      doc.phone.includes(q) ||
      doc.room.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">الكادر الطبي والأطباء (إجمالي: {doctors.length})</h3>
            <p className="text-xs text-slate-500">بيانات أطباء الأسنان، التخصصات العالية، وأيام الدوام في العيادات</p>
          </div>
        </div>

        <button
          onClick={onAddDoctor}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طبيب جديد</span>
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">لم يتم العثور على أطباء مطابقتين للبحث</p>
            <p className="text-xs text-slate-400 mt-1">تأكد من عبارة البحث أو اضغط على إضافة طبيب جديد</p>
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                doc.isActive ? 'border-slate-200 hover:border-teal-300' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl text-white font-extrabold text-lg flex items-center justify-center shadow-xs ${
                        doc.avatarColor || 'bg-teal-600'
                      }`}
                    >
                      {doc.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{doc.name}</h4>
                      <p className="text-xs text-teal-700 font-semibold">{doc.specialization}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleDoctorActive(doc.id, !doc.isActive)}
                    title={doc.isActive ? 'طبيب نشط' : 'غير نشط'}
                    className="cursor-pointer"
                  >
                    {doc.isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">العيادة المخصصة:</span>
                    <span className="font-bold text-slate-800">{doc.room}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">رقم التواصل:</span>
                    <span dir="ltr" className="font-mono font-bold text-slate-800">{doc.phone}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block mb-1">أيام العمل بالعيادة:</span>
                    <div className="flex flex-wrap gap-1">
                      {doc.workingDays.map((day, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-[10px] text-teal-800">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => onEditDoctor(doc)}
                  title="تعديل بيانات الطبيب"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteDoctor(doc.id)}
                  title="حذف الطبيب"
                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
