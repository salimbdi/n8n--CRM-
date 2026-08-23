import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ClinicService } from '../../types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ClinicService, 'id'>, id?: string) => void;
  serviceToEdit?: ClinicService | null;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  serviceToEdit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClinicService['category']>('فحص عام');
  const [price, setPrice] = useState<number>(150);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name || '');
      setCategory(serviceToEdit.category || 'فحص عام');
      setPrice(serviceToEdit.price || 150);
      setDurationMinutes(serviceToEdit.durationMinutes || 30);
      setDescription(serviceToEdit.description || '');
      setIsActive(serviceToEdit.isActive !== false);
    } else {
      setName('');
      setCategory('فحص عام');
      setPrice(150);
      setDurationMinutes(30);
      setDescription('');
      setIsActive(true);
    }
  }, [serviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) return;

    onSave(
      {
        name: name.trim(),
        category,
        price: Number(price) || 100,
        durationMinutes: Number(durationMinutes) || 30,
        description: description.trim(),
        isActive,
      },
      serviceToEdit ? serviceToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in duration-200">
        <div className="p-5 bg-teal-800 text-white flex items-center justify-between">
          <h3 className="font-bold text-base">
            {serviceToEdit ? 'تعديل بيانات الخدمة العلاجية' : 'إضافة خدمة علاجية وسعر جديد'}
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
            <label className="block font-bold text-slate-700 mb-1">اسم الخدمة:*</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: تنظيف وتلميع الأسنان بالليزر"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الفئة العلاجية:*</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            >
              <option value="فحص عام">فحص عام</option>
              <option value="علاج عصب">علاج عصب</option>
              <option value="حشوات تجميلية">حشوات تجميلية</option>
              <option value="تنظيف وتلميع">تنظيف وتلميع</option>
              <option value="جراحة وتثبيت">جراحة وتثبيت</option>
              <option value="تقويم أسنان">تقويم أسنان</option>
              <option value="تركيبات وتبييض">تركيبات وتبييض</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">السعر (ر.س):*</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">المدة التقريبية (دقيقة):</label>
              <input
                type="number"
                min={5}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 30)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">وصف موجز للخدمة:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف الإجراء للتقارير والذكاء الاصطناعي..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded"
            />
            <span className="font-bold text-slate-700">الخدمة متاحة ونشطة بالعيادة</span>
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
              حفظ الخدمة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
