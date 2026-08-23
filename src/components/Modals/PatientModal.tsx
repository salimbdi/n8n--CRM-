import React, { useState, useEffect } from 'react';
import { X, User, Phone, FileText, Activity } from 'lucide-react';
import { Patient } from '../../types';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Patient, 'id' | 'code' | 'createdAt'>, id?: string) => void;
  patientToEdit?: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patientToEdit,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر');
  const [medicalInput, setMedicalInput] = useState('');
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (patientToEdit) {
      setName(patientToEdit.name || '');
      setPhone(patientToEdit.phone || '');
      setAge(patientToEdit.age || 30);
      setGender(patientToEdit.gender || 'ذكر');
      setMedicalHistory(patientToEdit.medicalHistory || []);
      setNotes(patientToEdit.notes || '');
    } else {
      setName('');
      setPhone('');
      setAge(30);
      setGender('ذكر');
      setMedicalHistory([]);
      setNotes('');
    }
    setMedicalInput('');
  }, [patientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddMedicalCondition = () => {
    const trimmed = medicalInput.trim();
    if (trimmed && !medicalHistory.includes(trimmed)) {
      setMedicalHistory([...medicalHistory, trimmed]);
      setMedicalInput('');
    }
  };

  const handleRemoveMedicalCondition = (item: string) => {
    setMedicalHistory(medicalHistory.filter((m) => m !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onSave(
      {
        name: name.trim(),
        phone: phone.trim(),
        age: Number(age) || 25,
        gender,
        medicalHistory,
        notes: notes.trim(),
      },
      patientToEdit ? patientToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in duration-200">
        <div className="p-5 bg-teal-800 text-white flex items-center justify-between">
          <h3 className="font-bold text-base">
            {patientToEdit ? 'تعديل بيانات الملف الطبي' : 'فتح ملف مريض جديد'}
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
            <label className="block font-bold text-slate-700 mb-1">اسم المريض الثلاثي:*</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أحمد محمود العتيبي"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">رقم الجوال:*</label>
            <input
              type="text"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0501234567"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold text-left focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">العمر:</label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الجنس:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'ذكر' | 'أنثى')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
          </div>

          {/* Medical History Tags Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">التاريخ المرضي والحساسية:</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={medicalInput}
                onChange={(e) => setMedicalInput(e.target.value)}
                placeholder="مثال: ضغط الدم، حساسية بنسلين..."
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
              <button
                type="button"
                onClick={handleAddMedicalCondition}
                className="px-3 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900"
              >
                إضافة
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {medicalHistory.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5"
                >
                  {m}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicalCondition(m)}
                    className="text-amber-900 hover:text-rose-700 font-extrabold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ملاحظات الملف الطبي:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تفضيلات المريض، أية توصيات سابقة..."
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
              حفظ الملف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
