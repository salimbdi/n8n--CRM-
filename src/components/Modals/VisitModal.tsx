import React, { useState, useEffect } from 'react';
import { X, Stethoscope, Pill, DollarSign } from 'lucide-react';
import { VisitLog, Patient, Doctor, ClinicService, PaymentStatus } from '../../types';
import { DentalChart } from '../DentalChart';

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<VisitLog, 'id' | 'createdAt'>, id?: string) => void;
  visitToEdit?: VisitLog | null;
  patients: Patient[];
  doctors: Doctor[];
  services: ClinicService[];
  preselectedPatientId?: string;
}

export const VisitModal: React.FC<VisitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  visitToEdit,
  patients,
  doctors,
  services,
  preselectedPatientId,
}) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [teethAffected, setTeethAffected] = useState<number[]>([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentDone, setTreatmentDone] = useState('');
  const [prescription, setPrescription] = useState('');
  const [totalCost, setTotalCost] = useState<number>(350);
  const [paidAmount, setPaidAmount] = useState<number>(350);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [nextVisitDate, setNextVisitDate] = useState('');

  useEffect(() => {
    if (visitToEdit) {
      setPatientId(visitToEdit.patientId || (patients[0]?.id || ''));
      setDoctorId(visitToEdit.doctorId || (doctors[0]?.id || ''));
      setDate(visitToEdit.date || new Date().toISOString().split('T')[0]);
      setTeethAffected(visitToEdit.teethAffected || []);
      setDiagnosis(visitToEdit.diagnosis || '');
      setTreatmentDone(visitToEdit.treatmentDone || '');
      setPrescription(visitToEdit.prescription || '');
      setTotalCost(visitToEdit.totalCost || 350);
      setPaidAmount(visitToEdit.paidAmount || 350);
      setPaymentStatus(visitToEdit.paymentStatus || 'paid');
      setNextVisitDate(visitToEdit.nextVisitDate || '');
    } else {
      setPatientId(preselectedPatientId || (patients[0]?.id || ''));
      setDoctorId(doctors[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setTeethAffected([14]);
      setDiagnosis('تسوس متوسط في أسطح الأسنان المحددة');
      setTreatmentDone('تنظيف وحشو ضرس تجميلية بـ Composite مع التلميع');
      setPrescription('غسول فم مطهر، ومسكن عند اللزوم');
      setTotalCost(350);
      setPaidAmount(350);
      setPaymentStatus('paid');
      setNextVisitDate('');
    }
  }, [visitToEdit, preselectedPatientId, isOpen, patients, doctors]);

  if (!isOpen) return null;

  const handleToggleTooth = (toothNumber: number) => {
    if (teethAffected.includes(toothNumber)) {
      setTeethAffected(teethAffected.filter((t) => t !== toothNumber));
    } else {
      setTeethAffected([...teethAffected, toothNumber]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !diagnosis.trim() || !treatmentDone.trim()) return;

    const patient = patients.find((p) => p.id === patientId);
    const doctor = doctors.find((d) => d.id === doctorId);

    onSave(
      {
        patientId,
        patientName: patient ? patient.name : 'مريض',
        doctorId,
        doctorName: doctor ? doctor.name : 'طبيب العيادة',
        date,
        teethAffected,
        serviceIds: [],
        serviceNames: [],
        diagnosis: diagnosis.trim(),
        treatmentDone: treatmentDone.trim(),
        prescription: prescription.trim(),
        totalCost: Number(totalCost) || 0,
        paidAmount: Number(paidAmount) || 0,
        paymentStatus,
        nextVisitDate: nextVisitDate || undefined,
      },
      visitToEdit ? visitToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in duration-200">
        <div className="p-5 bg-teal-800 text-white flex items-center justify-between">
          <h3 className="font-bold text-base">
            {visitToEdit ? 'تعديل سجل الزيارة الطبية' : 'تسجيل زيارة علاجية جديدة للعيادة'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-teal-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اختيار المريض:*</label>
              <select
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-teal-500"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

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
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">تاريخ الزيارة:*</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
            />
          </div>

          {/* Dental Tooth Chart Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              تحديد الأسنان الخاضعة للعلاج:
            </label>
            <DentalChart
              selectedTeeth={teethAffected}
              onToggleTooth={handleToggleTooth}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">التشخيص الطبي (Diagnosis):*</label>
            <textarea
              required
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="وصف حالة الأسنان واللثة والشكوى الأساسية..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">العلاج المنفذ الإجراء (Treatment Done):*</label>
            <textarea
              required
              rows={2}
              value={treatmentDone}
              onChange={(e) => setTreatmentDone(e.target.value)}
              placeholder="الإجراءات المتخذة في الجلسة بالتفصيل..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الوصفة الطبية والعقاقير (Prescription):</label>
            <input
              type="text"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="اسم العلاج والجرعات اليومية..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">التكلفة (ر.س):</label>
              <input
                type="number"
                min={0}
                value={totalCost}
                onChange={(e) => setTotalCost(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">المبلغ المدفوع (ر.س):</label>
              <input
                type="number"
                min={0}
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">حالة الدفع:</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              >
                <option value="paid">مسدد بالكامل</option>
                <option value="partial">دفعة جزئية</option>
                <option value="pending">مستحق لاحقاً</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الموعد الموصى به القادم (اختياري):</label>
            <input
              type="date"
              value={nextVisitDate}
              onChange={(e) => setNextVisitDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
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
              حفظ الزيارة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
