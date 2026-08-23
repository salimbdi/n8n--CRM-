import React, { useState } from 'react';
import {
  Webhook,
  Key,
  Globe,
  Send,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Bot,
  Terminal,
  Code,
  Download,
  Activity,
  FileCode,
  Play,
  Settings,
  HelpCircle,
  ArrowRightLeft,
} from 'lucide-react';
import { IntegrationSettings, WebhookLog, Doctor, ClinicService } from '../types';

interface N8nIntegrationViewProps {
  settings: IntegrationSettings;
  webhookLogs: WebhookLog[];
  doctors: Doctor[];
  services: ClinicService[];
  onUpdateSettings: (newSettings: Partial<IntegrationSettings>) => IntegrationSettings;
  onClearLogs: () => void;
  onSimulateRegisterPatient: (data: { name: string; phone: string; age?: number; gender?: 'ذكر' | 'أنثى'; notes?: string }) => any;
  onSimulateBookAppointment: (data: { patientPhone: string; patientName?: string; doctorId?: string; serviceId?: string; date: string; time: string; notes?: string }) => any;
  onSimulateConfirmAppointment: (data: { appointmentId?: string; patientPhone?: string }) => any;
}

export const N8nIntegrationView: React.FC<N8nIntegrationViewProps> = ({
  settings,
  webhookLogs,
  doctors,
  services,
  onUpdateSettings,
  onClearLogs,
  onSimulateRegisterPatient,
  onSimulateBookAppointment,
  onSimulateConfirmAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'simulator' | 'docs' | 'logs'>('simulator');

  // Form State for Settings
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [webhookUrl, setWebhookUrl] = useState(settings.outgoingWebhookUrl);
  const [enableOutgoing, setEnableOutgoing] = useState(settings.enableOutgoingWebhook);
  const [notifyNewPatient, setNotifyNewPatient] = useState(settings.notifyOnNewPatient);
  const [notifyNewBooking, setNotifyNewBooking] = useState(settings.notifyOnNewBooking);
  const [notifyStatusChange, setNotifyStatusChange] = useState(settings.notifyOnStatusChange);
  const [aiAutoConfirm, setAiAutoConfirm] = useState(settings.aiAutoConfirm);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for Simulator
  const [simMode, setSimMode] = useState<'register' | 'book' | 'confirm'>('register');
  const [simPatientName, setSimPatientName] = useState('علي عبد الرحمن المصعبي');
  const [simPatientPhone, setSimPatientPhone] = useState('0508899001');
  const [simPatientAge, setSimPatientAge] = useState(32);
  const [simPatientGender, setSimPatientGender] = useState<'ذكر' | 'أنثى'>('ذكر');
  const [simDoctorId, setSimDoctorId] = useState(doctors[0]?.id || '');
  const [simServiceId, setSimServiceId] = useState(services[0]?.id || '');
  const [simDate, setSimDate] = useState(new Date().toISOString().split('T')[0]);
  const [simTime, setSimTime] = useState('17:00');
  const [simNotes, setSimNotes] = useState('تم تحويل الطلب عبر مساعد الذكاء الاصطناعي نواتساب (n8n Workflow)');

  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Copy state
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [copiedN8nJson, setCopiedN8nJson] = useState(false);

  // Selected Log Inspect
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);

  const appHost = window.location.origin;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      apiKey,
      outgoingWebhookUrl: webhookUrl,
      enableOutgoingWebhook: enableOutgoing,
      notifyOnNewPatient: notifyNewPatient,
      notifyOnNewBooking: notifyNewBooking,
      notifyOnStatusChange: notifyStatusChange,
      aiAutoConfirm: aiAutoConfirm,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleGenerateKey = () => {
    const newKey = `clinic_live_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`;
    setApiKey(newKey);
  };

  const handleRunSimulator = () => {
    setIsSimulating(true);
    setSimResult(null);

    setTimeout(() => {
      let res;
      if (simMode === 'register') {
        res = onSimulateRegisterPatient({
          name: simPatientName,
          phone: simPatientPhone,
          age: simPatientAge,
          gender: simPatientGender,
          notes: simNotes,
        });
      } else if (simMode === 'book') {
        res = onSimulateBookAppointment({
          patientPhone: simPatientPhone,
          patientName: simPatientName,
          doctorId: simDoctorId,
          serviceId: simServiceId,
          date: simDate,
          time: simTime,
          notes: simNotes,
        });
      } else if (simMode === 'confirm') {
        res = onSimulateConfirmAppointment({
          patientPhone: simPatientPhone,
        });
      }
      setSimResult(res);
      setIsSimulating(false);
    }, 400);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (label === 'apiKey') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (label === 'n8nJson') {
      setCopiedN8nJson(true);
      setTimeout(() => setCopiedN8nJson(false), 2000);
    } else {
      setCopiedEndpoint(label);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    }
  };

  // Pre-configured importable n8n workflow JSON template
  const sampleN8nWorkflowJson = JSON.stringify(
    {
      name: 'Dental Clinic AI Agent - n8n Integration',
      nodes: [
        {
          parameters: {
            httpMethod: 'POST',
            path: 'clinic-webhook',
            options: {},
          },
          name: 'WhatsApp AI Webhook',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [100, 300],
        },
        {
          parameters: {
            method: 'POST',
            url: `${appHost}/api/n8n/patient-register`,
            sendHeaders: true,
            headerParameters: {
              parameters: [
                {
                  name: 'X-Clinic-API-Key',
                  value: apiKey,
                },
              ],
            },
            sendBody: true,
            specifyBody: 'json',
            jsonBody: '{\n  "name": "={{ $json.body.patient_name }}",\n  "phone": "={{ $json.body.patient_phone }}",\n  "age": 28,\n  "gender": "ذكر"\n}',
          },
          name: 'Register Patient Node',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4.2,
          position: [340, 300],
        },
        {
          parameters: {
            method: 'POST',
            url: `${appHost}/api/n8n/book-appointment`,
            sendHeaders: true,
            headerParameters: {
              parameters: [
                {
                  name: 'X-Clinic-API-Key',
                  value: apiKey,
                },
              ],
            },
            sendBody: true,
            specifyBody: 'json',
            jsonBody: '{\n  "patientPhone": "={{ $json.body.patient_phone }}",\n  "date": "={{ $json.body.preferred_date }}",\n  "time": "={{ $json.body.preferred_time }}"\n}',
          },
          name: 'Book Appointment Node',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4.2,
          position: [580, 300],
        },
      ],
      connections: {
        'WhatsApp AI Webhook': {
          main: [[{ node: 'Register Patient Node', type: 'main', index: 0 }]],
        },
        'Register Patient Node': {
          main: [[{ node: 'Book Appointment Node', type: 'main', index: 0 }]],
        },
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shadow-inner shrink-0">
              <Webhook className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">مركز ربط n8n والذكاء الاصطناعي</h3>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                  v2.4 API
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed max-w-2xl">
                ربط النظام بـ n8n للربط التلقائي: فتح الملفات الطبية، حجز المواعيد عبر الشات بوت/الواتساب، وتأكيد المواعيد تلقائياً.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-center">
            <button
              onClick={() => copyToClipboard(sampleN8nWorkflowJson, 'n8nJson')}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
            >
              {copiedN8nJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>نسخ قالب n8n Workflow JSON</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>محاكي وكيل n8n التفاعلي</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات Webhooks و API</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'docs'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>دليل الـ Endpoints وتوجيهات cURL</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>سجل النشاطات ({webhookLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive AI Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simulator Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Bot className="w-5 h-5 text-teal-600" />
                محاكي الإجراءات الآلية (n8n Agent Simulator)
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                اختبر استجابة خادم العيادة لإجراءات وكيل الذكاء الاصطناعي مباشرة دون الحاجة للخروج من الموقع
              </p>
            </div>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setSimMode('register')}
                className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                  simMode === 'register' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                1. فتح ملف مريض
              </button>

              <button
                type="button"
                onClick={() => setSimMode('book')}
                className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                  simMode === 'book' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                2. حجز موعد مع طبيب
              </button>

              <button
                type="button"
                onClick={() => setSimMode('confirm')}
                className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                  simMode === 'confirm' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                3. تأكيد الموعد
              </button>
            </div>

            {/* Dynamic Form per mode */}
            <div className="space-y-4 text-xs">
              {(simMode === 'register' || simMode === 'book') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">اسم المريض الكامل:</label>
                  <input
                    type="text"
                    value={simPatientName}
                    onChange={(e) => setSimPatientName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">رقم هاتف المريض (الواتساب):</label>
                <input
                  type="text"
                  dir="ltr"
                  value={simPatientPhone}
                  onChange={(e) => setSimPatientPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold text-left"
                />
              </div>

              {simMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">العمر:</label>
                    <input
                      type="number"
                      value={simPatientAge}
                      onChange={(e) => setSimPatientAge(parseInt(e.target.value) || 20)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">الجنس:</label>
                    <select
                      value={simPatientGender}
                      onChange={(e) => setSimPatientGender(e.target.value as 'ذكر' | 'أنثى')}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                    >
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>
              )}

              {simMode === 'book' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">الطبيب المطلوب:</label>
                      <select
                        value={simDoctorId}
                        onChange={(e) => setSimDoctorId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                      >
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">الخدمة المطلوب حجزها:</label>
                      <select
                        value={simServiceId}
                        onChange={(e) => setSimServiceId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.price} ر.س)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">تاريخ الموعد:</label>
                      <input
                        type="date"
                        value={simDate}
                        onChange={(e) => setSimDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">الوقت:</label>
                      <input
                        type="time"
                        value={simTime}
                        onChange={(e) => setSimTime(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ملاحظات الذكاء الاصطناعي (Agent Notes):</label>
                <input
                  type="text"
                  value={simNotes}
                  onChange={(e) => setSimNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                />
              </div>

              <button
                type="button"
                onClick={handleRunSimulator}
                disabled={isSimulating}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري تنفيذ الاستدعاء للـ API...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>تشغيل محاكاة n8n الآن (/api/n8n/...)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulator Response Preview */}
          <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg font-mono text-xs">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="font-bold text-teal-400 flex items-center gap-2 text-sm">
                  <Terminal className="w-4 h-4" />
                  نتيجة استجابة الـ Endpoint (API Response)
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  JSON Output
                </span>
              </div>

              {simResult ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-teal-900/50 text-emerald-400">
                    <div className="text-[10px] text-slate-500 mb-1">// Response Payload Status: 200 OK</div>
                    <pre className="overflow-x-auto text-[11px] leading-relaxed whitespace-pre-wrap">
                      {JSON.stringify(simResult, null, 2)}
                    </pre>
                  </div>

                  <div className="p-3 bg-teal-950/40 rounded-xl border border-teal-800/40 text-teal-300 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>تم تحديث قاعدة بيانات العيادة وإضافة السجل تلقائياً!</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <Sparkles className="w-10 h-10 text-slate-700 mx-auto" />
                  <p className="font-sans text-xs text-slate-400 font-bold">المحاكي جاهز للاختبار</p>
                  <p className="font-sans text-[11px] text-slate-500">اختر الإجراء من اليسار ثم انقر "تشغيل محاكاة n8n"</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-sans">
              <span>تاريخ الاستدعاء: {new Date().toLocaleTimeString('ar-SA')}</span>
              <span className="text-teal-400">x-clinic-api-key: {apiKey.substring(0, 14)}...</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Key className="w-5 h-5 text-teal-600" />
              مفاتيح الربط والعناوين البرمجية (Webhook Settings)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              تتيح لك هذه الإعدادات التحكم في إرسال الإشعارات واستقبال البيانات من وكيل n8n
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Outbound Webhook URL */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Globe className="w-4 h-4 text-teal-600" />
                رابط الـ Webhook الخاص بسير عمل n8n الخارجي (Outgoing Webhook URL):
              </label>
              <input
                type="url"
                dir="ltr"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://n8n.yourdomain.com/webhook/clinic-events"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-left focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                الرابط الذي يقوم خادم العيادة بإرسال إشعارات الأحداث إليه عندما يتم حجز أو تغيير موعد
              </p>
            </div>

            {/* API Key */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Key className="w-4 h-4 text-teal-600" />
                مفتاح الأمان (X-Clinic-API-Key):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  dir="ltr"
                  readOnly
                  value={apiKey}
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold text-left"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiKey, 'apiKey')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>نسخ المفتاح</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  className="px-3 py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  title="توليد مفتاح أمان جديد"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Checkboxes for Event Triggers */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="font-bold text-slate-800 text-sm block">أحداث الإشعارات التلقائية:</span>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableOutgoing}
                  onChange={(e) => setEnableOutgoing(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-700">تفعيل إرسال الأحداث إلى n8n تلقائياً (Enable Outgoing Webhook)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer mr-6">
                <input
                  type="checkbox"
                  checked={notifyNewPatient}
                  onChange={(e) => setNotifyNewPatient(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-slate-600">إشعار n8n عند تسجيل مريض جديد</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer mr-6">
                <input
                  type="checkbox"
                  checked={notifyNewBooking}
                  onChange={(e) => setNotifyNewBooking(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-slate-600">إشعار n8n عند إدراج موعد جديد</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer mr-6">
                <input
                  type="checkbox"
                  checked={notifyStatusChange}
                  onChange={(e) => setNotifyStatusChange(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-slate-600">إشعار n8n عند تعديل حالة الموعد (تأكيد / إكمال / إلغاء)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={aiAutoConfirm}
                  onChange={(e) => setAiAutoConfirm(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="font-bold text-teal-800">التأكيد التلقائي المباشر للمواعيد التي تحجزها الـ AI (Auto-Confirm AI Bookings)</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                تم حفظ الإعدادات بنجاح في قاعدة بيانات العيادة!
              </span>
            )}
            <button
              type="submit"
              className="mr-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: API Documentation */}
      {activeTab === 'docs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Code className="w-5 h-5 text-teal-600" />
              دليل النقاط البرمجية المتاحة (API Endpoints Documentation)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              استخدم هذه المسارات في عقود HTTP Request Inside n8n لاستلام المواعيد وإدارتها
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Endpoint: Pull All Services as Table/Array */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-teal-200/80 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-700 text-white font-mono px-2 py-0.5 rounded font-bold text-[11px]">GET</span>
                  <span className="font-mono font-bold text-slate-800">{appHost}/api/services</span>
                  <span className="bg-teal-100 text-teal-800 text-[10px] px-2 py-0.5 rounded-full font-bold">جدول مباشر (Table Array)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(`${appHost}/api/services`, 'urlServices')}
                    className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedEndpoint === 'urlServices' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ الرابط المباشر</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(`curl -X GET "${appHost}/api/services" -H "X-Clinic-API-Key: ${apiKey}"`, 'epServices')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedEndpoint === 'epServices' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>cURL</span>
                  </button>
                </div>
              </div>
              <p className="text-slate-600">
                <strong>الوصف:</strong> سحب كافة خدمات العيادة مباشرة بصيغة جدول نقي (JSON Array of Objects) ليتم استيرادها وسحبها فوراً في n8n أو Make أو جداول بيانات.
              </p>
              <div className="bg-slate-900 text-teal-300 p-2.5 rounded-xl font-mono text-[11px] overflow-x-auto">
                {`// صيغة الاستجابة كجدول:\n[ { "id": "srv-1", "name": "تنظيف وتلميع الأسنان", "category": "وقائي", "price": 250, "durationMinutes": 30, "description": "...", "isActive": true }, ... ]`}
              </div>
            </div>

            {/* Endpoint: Services CSV */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-700 text-white font-mono px-2 py-0.5 rounded font-bold text-[11px]">GET</span>
                  <span className="font-mono font-bold text-slate-800">{appHost}/api/services/csv</span>
                  <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-bold">CSV Sheet</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`${appHost}/api/services/csv`, 'urlCsv')}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedEndpoint === 'urlCsv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ رابط CSV</span>
                </button>
              </div>
              <p className="text-slate-600">
                <strong>الوصف:</strong> تصدير وسحب الخدمات كملف CSV نقي، متوافق مع جداول Google Sheets و Excel و n8n Spreadsheet Node.
              </p>
            </div>

            {/* Endpoint 1: Patient Register */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-700 text-white font-mono px-2 py-0.5 rounded font-bold text-[11px]">POST</span>
                  <span className="font-mono font-bold text-slate-800">{appHost}/api/n8n/patient-register</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X POST "${appHost}/api/n8n/patient-register" -H "Content-Type: application/json" -H "X-Clinic-API-Key: ${apiKey}" -d '{"name":"أحمد العتيبي","phone":"0501234567","age":30,"gender":"ذكر"}'`, 'ep1')}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedEndpoint === 'ep1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ أمر cURL</span>
                </button>
              </div>
              <p className="text-slate-600">
                <strong>الوصف:</strong> تسجيل وتأسيس ملف مريض جديد في النظام عبر الذكاء الاصطناعي.
              </p>
            </div>

            {/* Endpoint 2: Book Appointment */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-700 text-white font-mono px-2 py-0.5 rounded font-bold text-[11px]">POST</span>
                  <span className="font-mono font-bold text-slate-800">{appHost}/api/n8n/book-appointment</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X POST "${appHost}/api/n8n/book-appointment" -H "Content-Type: application/json" -H "X-Clinic-API-Key: ${apiKey}" -d '{"patientPhone":"0501234567","date":"2026-08-09","time":"17:00"}'`, 'ep2')}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedEndpoint === 'ep2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ أمر cURL</span>
                </button>
              </div>
              <p className="text-slate-600">
                <strong>الوصف:</strong> حجز موعد جديد لمريض برقم هاتفه والتاريخ والتوقيت المطلوب.
              </p>
            </div>

            {/* Endpoint 3: Confirm Appointment */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-700 text-white font-mono px-2 py-0.5 rounded font-bold text-[11px]">POST</span>
                  <span className="font-mono font-bold text-slate-800">{appHost}/api/n8n/confirm-appointment</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X POST "${appHost}/api/n8n/confirm-appointment" -H "Content-Type: application/json" -H "X-Clinic-API-Key: ${apiKey}" -d '{"patientPhone":"0501234567"}'`, 'ep3')}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedEndpoint === 'ep3' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ أمر cURL</span>
                </button>
              </div>
              <p className="text-slate-600">
                <strong>الوصف:</strong> تأكيد الموعد المحجوز آلياً بعد أخذ الموافقة من المريض.
              </p>
            </div>

            {/* Endpoint 4: Doctors table */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-sky-700 text-white font-mono px-2 py-0.5 rounded font-bold text-[11px]">GET</span>
                  <span className="font-mono font-bold text-slate-800">{appHost}/api/doctors</span>
                  <span className="bg-sky-100 text-sky-800 text-[10px] px-2 py-0.5 rounded-full font-bold">جدول الأطباء</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X GET "${appHost}/api/doctors" -H "X-Clinic-API-Key: ${apiKey}"`, 'epDoctors')}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedEndpoint === 'epDoctors' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ أمر cURL</span>
                </button>
              </div>
              <p className="text-slate-600">
                <strong>الوصف:</strong> استرجاع قائمة أطباء العيادة ومواعيد دوامهم وتخصصاتهم.
              </p>
            </div>

            {/* Endpoint 5: Available slots */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-sky-700 text-white font-mono px-2 py-0.5 rounded font-bold text-[11px]">GET</span>
                  <span className="font-mono font-bold text-slate-800">{appHost}/api/n8n/available-slots?date=YYYY-MM-DD</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X GET "${appHost}/api/n8n/available-slots?date=${new Date().toISOString().split('T')[0]}" -H "X-Clinic-API-Key: ${apiKey}"`, 'epSlots')}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedEndpoint === 'epSlots' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ أمر cURL</span>
                </button>
              </div>
              <p className="text-slate-600">
                <strong>الوصف:</strong> استعلام الشاغر من الأوقات المتاحة للحجز في تاريخ معين لمنع تضارب المواعيد.
              </p>
            </div>

            {/* Endpoint 6: Patients table */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-sky-700 text-white font-mono px-2 py-0.5 rounded font-bold text-[11px]">GET</span>
                  <span className="font-mono font-bold text-slate-800">{appHost}/api/patients</span>
                  <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold">جدول المرضى</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X GET "${appHost}/api/patients" -H "X-Clinic-API-Key: ${apiKey}"`, 'epPatients')}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedEndpoint === 'epPatients' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ أمر cURL</span>
                </button>
              </div>
              <p className="text-slate-600">
                <strong>الوصف:</strong> سحب جدول وسجلات المرضى بالكامل.
              </p>
            </div>

            {/* Endpoint 7: Appointments table */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-sky-700 text-white font-mono px-2 py-0.5 rounded font-bold text-[11px]">GET</span>
                  <span className="font-mono font-bold text-slate-800">{appHost}/api/appointments</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">جدول المواعيد</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X GET "${appHost}/api/appointments" -H "X-Clinic-API-Key: ${apiKey}"`, 'epAppointments')}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedEndpoint === 'epAppointments' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ أمر cURL</span>
                </button>
              </div>
              <p className="text-slate-600">
                <strong>الوصف:</strong> سحب جدول المواعيد المحجوزة، المؤكدة، والملغاة.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-base">سجل نشاط الـ Webhook المباشر</h4>
              <p className="text-xs text-slate-500">تتبع الطلبات الصادرة والواردة بين العيادة و n8n</p>
            </div>

            <button
              onClick={onClearLogs}
              className="text-xs text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 font-bold transition-colors cursor-pointer"
            >
              مسح السجل
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {webhookLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                لا توجد سجلات نشاط مسجلة حتى الآن
              </div>
            ) : (
              webhookLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.type === 'incoming' ? 'bg-teal-100 text-teal-800' : 'bg-cyan-100 text-cyan-800'
                      }`}>
                        {log.type === 'incoming' ? 'وارد (In)' : 'صادر (Out)'}
                      </span>
                      <strong className="text-slate-800 text-sm">{log.action}</strong>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        log.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </div>

                    <div className="text-slate-500 font-mono text-[11px] flex items-center gap-3">
                      <span>{log.endpoint}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleString('ar-SA')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    معاينة الحمولة
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white w-full max-w-xl rounded-2xl shadow-2xl p-6 font-mono text-xs space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-teal-400">{selectedLog.action}</span>
              <button onClick={() => setSelectedLog(null)} className="p-1 text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <div className="text-slate-400 mb-1">// Payload Data:</div>
              <pre className="bg-slate-950 p-3 rounded-xl overflow-x-auto text-slate-200">
                {JSON.stringify(selectedLog.payload, null, 2)}
              </pre>
            </div>

            <div>
              <div className="text-slate-400 mb-1">// Response Data:</div>
              <pre className="bg-slate-950 p-3 rounded-xl overflow-x-auto text-emerald-400">
                {JSON.stringify(selectedLog.response, null, 2)}
              </pre>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-sans text-xs font-bold"
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
