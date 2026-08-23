import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  DollarSign,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Webhook,
  Copy,
  Check,
  Code,
  FileSpreadsheet,
  ExternalLink,
} from 'lucide-react';
import { ClinicService } from '../types';

interface ServicesViewProps {
  services: ClinicService[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddService: () => void;
  onEditService: (srv: ClinicService) => void;
  onDeleteService: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  searchQuery,
  onSearchChange,
  onAddService,
  onEditService,
  onDeleteService,
  onToggleActive,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const filteredServices = services.filter((srv) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      srv.name.toLowerCase().includes(q) ||
      srv.description.toLowerCase().includes(q) ||
      srv.category.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'all' || srv.category === selectedCategory;

    return matchesQuery && matchesCat;
  });

  const appHost = typeof window !== 'undefined' ? window.location.origin : '';
  const servicesApiUrl = `${appHost}/api/services`;
  const servicesCsvUrl = `${appHost}/api/services/csv`;

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(label);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">دليل خدمات العيادة والأسعار ({services.length})</h3>
            <p className="text-xs text-slate-500">إدارة قائمة الإجراءات الطبية وأجور العلاج بالريال السعودي</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowApiModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-teal-300 px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Code className="w-4 h-4 text-teal-400" />
            <span>سحب الخدمات للـ Workflow (API)</span>
          </button>

          <button
            onClick={onAddService}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة خدمة علاجية جديدة</span>
          </button>
        </div>
      </div>

      {/* Quick API integration Banner for Workflow Pulling */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-4 rounded-2xl border border-teal-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Webhook className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>رابط سحب بيانات الخدمات المباشر (Workflow / n8n Table):</span>
              <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded text-[10px] font-mono">GET</span>
            </div>
            <code className="text-teal-300 text-[11px] font-mono select-all break-all">{servicesApiUrl}</code>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => copyText(servicesApiUrl, 'bannerJson')}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copiedUrl === 'bannerJson' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>نسخ رابط JSON الجدول</span>
          </button>

          <button
            onClick={() => copyText(servicesCsvUrl, 'bannerCsv')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copiedUrl === 'bannerCsv' ? <Check className="w-3.5 h-3.5" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
            <span>نسخ CSV</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          جميع الفئات
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">لم يتم العثور على خدمات مطابقة</p>
            <p className="text-xs text-slate-400 mt-1">تأكد من الفئة المختارة أو أضف خدمة جديدة</p>
          </div>
        ) : (
          filteredServices.map((srv) => (
            <div
              key={srv.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                srv.isActive ? 'border-slate-200 hover:border-teal-300' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg">
                    {srv.category}
                  </span>

                  <button
                    onClick={() => onToggleActive(srv.id, !srv.isActive)}
                    title={srv.isActive ? 'مفعلة بالعيادة (انقر للتعطيل)' : 'معطلة (انقر للتفعيل)'}
                    className="cursor-pointer"
                  >
                    {srv.isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-base">{srv.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{srv.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-lg font-extrabold text-teal-800">
                    {srv.price} <span className="text-xs font-semibold text-slate-500">ر.س</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>المدة التقريبية: {srv.durationMinutes} دقيقة</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditService(srv)}
                    title="تعديل الخدمة"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteService(srv.id)}
                    title="حذف الخدمة"
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* API Modal for Services */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 text-xs space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">واجهة سحب الخدمات برمجياً (Services API Hub)</h4>
                  <p className="text-[11px] text-slate-500">سحب جدول الخدمات بالكامل إلى n8n أو سير العمل الخاص بك</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Direct Table JSON */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white font-mono px-2 py-0.5 rounded font-bold text-[10px]">GET</span>
                    <span className="font-mono font-bold text-slate-800">{servicesApiUrl}</span>
                  </div>
                  <button
                    onClick={() => copyText(servicesApiUrl, 'modalJson')}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    {copiedUrl === 'modalJson' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ</span>
                  </button>
                </div>
                <p className="text-slate-600 text-[11px]">
                  يرجع مصفوفة جدولية جاهزة (Array of JSON items) يمكن ربطها مباشرة بعقدة <strong>HTTP Request</strong> في n8n.
                </p>
              </div>

              {/* Option 2: CSV Table Export */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white font-mono px-2 py-0.5 rounded font-bold text-[10px]">GET</span>
                    <span className="font-mono font-bold text-slate-800">{servicesCsvUrl}</span>
                  </div>
                  <button
                    onClick={() => copyText(servicesCsvUrl, 'modalCsv')}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    {copiedUrl === 'modalCsv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ</span>
                  </button>
                </div>
                <p className="text-slate-600 text-[11px]">
                  يرجع ملف CSV جدولي بترميز UTF-8 لدعم اللغة العربية في Google Sheets و Excel.
                </p>
              </div>

              {/* cURL snippet */}
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] space-y-1">
                <div className="text-slate-400 text-[10px] flex items-center justify-between">
                  <span>// أمر استدعاء cURL:</span>
                  <button
                    onClick={() => copyText(`curl -X GET "${servicesApiUrl}"`, 'curlCmd')}
                    className="text-teal-400 hover:text-teal-300 cursor-pointer font-sans"
                  >
                    {copiedUrl === 'curlCmd' ? 'تم النسخ!' : 'نسخ cURL'}
                  </button>
                </div>
                <div className="text-teal-300 break-all select-all">
                  curl -X GET "{servicesApiUrl}"
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
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
