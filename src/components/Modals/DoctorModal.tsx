import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Doctor } from '../../types';

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Doctor, 'id'>, id?: string) => void;
  doctorToEdit?: Doctor | null;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  doctorToEdit,
}) => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('عيادة 1');
  const [workingDays, setWorkingDays] = useState<string[]>(['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']);
  const [isActive, setIsActive] = useState(true);

  const allDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  useEffect(() => {
    if (doctorToEdit) {
      setName(doctorToEdit.name || '');
      setSpecialization(doctorToEdit.specialization || '');
      setPhone(doctorToEdit.phone || '');
      setRoom(doctorToEdit.room || 'عيادة 1');
      setWorkingDays(doctorToEdit.workingDays || []);
      setIsActive(doctorToEdit.isActive !== false);
    } else {
      setName('');
      setSpecialization('أخصائي جراحة الأسنان وتجميل الابتسامة');
      setPhone('');
      setRoom('عيادة 1');
      setWorkingDays(['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']);
      setIsActive(true);
    }
  }, [doctorToEdit, isOpen]);

  if (!isOpen) return null;

  const handleDayToggle = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onSave(
      {
        name: name.trim(),
        specialization: specialization.trim() || 'طب وجراحة الأسنان',
        phone: phone.trim(),
        room: room.trim() || 'عيادة 1',
        workingDays,
        isActive,
      },
      doctorToEdit ? doctorToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in duration-200">
        <div className="p-5 bg-teal-800 text-white flex items-center justify-between">
          <h3 className="font-bold text-base">
            {doctorToEdit ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد للكادر الطبي'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-teal-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم الطبيب:*</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: د. عبد الله الشمري"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">التخصص الطبي:*</label>
            <input
              type="text"
              required
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="مثال: استشاري تقويم أسنان وعلاج عصب"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم التواصل:*</label>
              <input
                type="text"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0501112223"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold text-left"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم العيادة / الغرفة:</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="عيادة 1"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">أيام العمل بالعيادة:</label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {allDays.map((day) => {
                const isSelected = workingDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded"
            />
            <span className="font-bold text-slate-700">الطبيب نشط واستقبال المواعيد مفعل</span>
          </label>

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
              حفظ الطبيب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
