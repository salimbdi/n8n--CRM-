import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { AppointmentsView } from './components/AppointmentsView';
import { VisitsView } from './components/VisitsView';
import { ServicesView } from './components/ServicesView';
import { DoctorsView } from './components/DoctorsView';
import { N8nIntegrationView } from './components/N8nIntegrationView';

import { PatientModal } from './components/Modals/PatientModal';
import { AppointmentModal } from './components/Modals/AppointmentModal';
import { VisitModal } from './components/Modals/VisitModal';
import { ServiceModal } from './components/Modals/ServiceModal';
import { DoctorModal } from './components/Modals/DoctorModal';

import { clinicStore } from './services/store';
import { Patient, Appointment, VisitLog, ClinicService, Doctor, AppointmentStatus } from './types';

export default function App() {
  // Subscribe to store updates
  const state = useSyncExternalStore(clinicStore.subscribe, clinicStore.getSnapshot, clinicStore.getSnapshot);

  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [preselectedPatientForBooking, setPreselectedPatientForBooking] = useState<string | undefined>(undefined);

  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<VisitLog | null>(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ClinicService | null>(null);

  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Handlers ---
  const handleSavePatient = (data: Omit<Patient, 'id' | 'code' | 'createdAt'>, id?: string) => {
    if (id) {
      clinicStore.updatePatient(id, data);
      showToast('تم تعديل ملف المريض بنجاح');
    } else {
      const p = clinicStore.addPatient(data);
      showToast(`تم فتح الملف الطبي للمريض ${p.name} (${p.code})`);
    }
  };

  const handleDeletePatient = (id: string) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف ملف المريض وكافة سجلاته؟')) {
      clinicStore.deletePatient(id);
      showToast('تم حذف ملف المريض من النظام');
    }
  };

  const handleSaveAppointment = (
    data: {
      patientId: string;
      doctorId: string;
      serviceId: string;
      date: string;
      time: string;
      status?: AppointmentStatus;
      notes?: string;
    },
    id?: string
  ) => {
    if (id) {
      clinicStore.updateAppointment(id, data);
      showToast('تم تعديل الموعد بنجاح');
    } else {
      const apt = clinicStore.addAppointment(data);
      showToast(`تم حجز الموعد بنجاح للمريض ${apt.patientName}`);
    }
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    clinicStore.updateAppointmentStatus(id, status);
    const statusArabic =
      status === 'confirmed' ? 'تأكيد' : status === 'completed' ? 'إكمال' : status === 'cancelled' ? 'إلغاء' : 'جدولة';
    showToast(`تم ${statusArabic} الموعد بنجاح`);
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('هل أنت تأكد من إلغاء وحذف الموعد؟')) {
      clinicStore.deleteAppointment(id);
      showToast('تم حذف الموعد من الجدول');
    }
  };

  const handleSaveVisit = (data: Omit<VisitLog, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      clinicStore.updateVisit(id, data);
      showToast('تم تعديل سجل الزيارة والعلاج');
    } else {
      const v = clinicStore.addVisit(data);
      showToast(`تم حفظ الزيارة العلاجية للمريض ${v.patientName}`);
    }
  };

  const handleDeleteVisit = (id: string) => {
    if (window.confirm('هل أنت تأكد من حذف هذا السجل الطبي؟')) {
      clinicStore.deleteVisit(id);
      showToast('تم حذف سجل الزيارة العلاجية');
    }
  };

  const handleSaveService = (data: Omit<ClinicService, 'id'>, id?: string) => {
    if (id) {
      clinicStore.updateService(id, data);
      showToast('تم تعديل الخدمة العلاجية');
    } else {
      clinicStore.addService(data);
      showToast('تم إضافة خدمة جديدة لقائمة الأسعار');
    }
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('هل أنت تأكد من حذف هذه الخدمة من القائمة؟')) {
      clinicStore.deleteService(id);
      showToast('تم حذف الخدمة من دليل الأسعار');
    }
  };

  const handleToggleServiceActive = (id: string, active: boolean) => {
    clinicStore.updateService(id, { isActive: active });
    showToast(active ? 'تم تفعيل الخدمة بالعيادة' : 'تم إيقاف مؤقت للخدمة');
  };

  const handleSaveDoctor = (data: Omit<Doctor, 'id'>, id?: string) => {
    if (id) {
      clinicStore.updateDoctor(id, data);
      showToast('تم تحديث بيانات الطبيب');
    } else {
      clinicStore.addDoctor(data);
      showToast('تم إضافة الطبيب للعيادة بنجاح');
    }
  };

  const handleDeleteDoctor = (id: string) => {
    if (window.confirm('هل أنت تأكد من حذف الطبيب من النظام؟')) {
      clinicStore.deleteDoctor(id);
      showToast('تم حذف الطبيب من القائمة');
    }
  };

  const handleToggleDoctorActive = (id: string, active: boolean) => {
    clinicStore.updateDoctor(id, { isActive: active });
    showToast(active ? 'تم تفعيل حساب الطبيب' : 'تم تعطيل حساب الطبيب مؤقتاً');
  };

  // Booking shortcut for a specific patient
  const handleBookForPatient = (patient: Patient) => {
    setPreselectedPatientForBooking(patient.id);
    setAppointmentToEdit(null);
    setAppointmentModalOpen(true);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = state.appointments.filter((a) => a.date === todayStr);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row dir-rtl font-sans antialiased text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-teal-300 font-bold text-xs px-4 py-3 rounded-2xl shadow-xl border border-teal-500/40 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        todayAppointmentsCount={todayAppointments.length}
        n8nStatus={!!state.settings.apiKey && state.settings.enableOutgoingWebhook}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onQuickBook={() => {
            setAppointmentToEdit(null);
            setPreselectedPatientForBooking(undefined);
            setAppointmentModalOpen(true);
          }}
          n8nStatus={state.settings.enableOutgoingWebhook}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              stats={state.stats}
              todayAppointments={todayAppointments}
              recentWebhookLogs={state.webhookLogs}
              onSelectTab={setCurrentTab}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              onOpenAddPatientModal={() => {
                setPatientToEdit(null);
                setPatientModalOpen(true);
              }}
              onOpenBookAppointmentModal={() => {
                setAppointmentToEdit(null);
                setPreselectedPatientForBooking(undefined);
                setAppointmentModalOpen(true);
              }}
              onOpenLogVisitModal={() => {
                setVisitToEdit(null);
                setVisitModalOpen(true);
              }}
            />
          )}

          {currentTab === 'patients' && (
            <PatientsView
              patients={state.patients}
              appointments={state.appointments}
              visits={state.visits}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddPatient={() => {
                setPatientToEdit(null);
                setPatientModalOpen(true);
              }}
              onEditPatient={(p) => {
                setPatientToEdit(p);
                setPatientModalOpen(true);
              }}
              onDeletePatient={handleDeletePatient}
              onBookForPatient={handleBookForPatient}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsView
              appointments={state.appointments}
              doctors={state.doctors}
              services={state.services}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onBookAppointment={() => {
                setAppointmentToEdit(null);
                setPreselectedPatientForBooking(undefined);
                setAppointmentModalOpen(true);
              }}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onEditAppointment={(apt) => {
                setAppointmentToEdit(apt);
                setAppointmentModalOpen(true);
              }}
              onDeleteAppointment={handleDeleteAppointment}
            />
          )}

          {currentTab === 'visits' && (
            <VisitsView
              visits={state.visits}
              patients={state.patients}
              doctors={state.doctors}
              services={state.services}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAddVisitModal={() => {
                setVisitToEdit(null);
                setVisitModalOpen(true);
              }}
              onEditVisit={(v) => {
                setVisitToEdit(v);
                setVisitModalOpen(true);
              }}
              onDeleteVisit={handleDeleteVisit}
            />
          )}

          {currentTab === 'services' && (
            <ServicesView
              services={state.services}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddService={() => {
                setServiceToEdit(null);
                setServiceModalOpen(true);
              }}
              onEditService={(s) => {
                setServiceToEdit(s);
                setServiceModalOpen(true);
              }}
              onDeleteService={handleDeleteService}
              onToggleActive={handleToggleServiceActive}
            />
          )}

          {currentTab === 'doctors' && (
            <DoctorsView
              doctors={state.doctors}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddDoctor={() => {
                setDoctorToEdit(null);
                setDoctorModalOpen(true);
              }}
              onEditDoctor={(d) => {
                setDoctorToEdit(d);
                setDoctorModalOpen(true);
              }}
              onDeleteDoctor={handleDeleteDoctor}
              onToggleDoctorActive={handleToggleDoctorActive}
            />
          )}

          {currentTab === 'n8n' && (
            <N8nIntegrationView
              settings={state.settings}
              webhookLogs={state.webhookLogs}
              doctors={state.doctors}
              services={state.services}
              onUpdateSettings={(newSet) => {
                const s = clinicStore.updateSettings(newSet);
                showToast('تم تحديث إعدادات n8n والـ Webhook بنجاح');
                return s;
              }}
              onClearLogs={() => {
                clinicStore.clearWebhookLogs();
                showToast('تم مسح سجل النشاطات');
              }}
              onSimulateRegisterPatient={(data) => clinicStore.aiRegisterPatient(data)}
              onSimulateBookAppointment={(data) => clinicStore.aiBookAppointment(data)}
              onSimulateConfirmAppointment={(data) => clinicStore.aiConfirmAppointment(data)}
            />
          )}
        </main>
      </div>

      {/* --- MODALS --- */}
      <PatientModal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        onSave={handleSavePatient}
        patientToEdit={patientToEdit}
      />

      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        onSave={handleSaveAppointment}
        appointmentToEdit={appointmentToEdit}
        patients={state.patients}
        doctors={state.doctors}
        services={state.services}
        preselectedPatientId={preselectedPatientForBooking}
      />

      <VisitModal
        isOpen={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        onSave={handleSaveVisit}
        visitToEdit={visitToEdit}
        patients={state.patients}
        doctors={state.doctors}
        services={state.services}
      />

      <ServiceModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        onSave={handleSaveService}
        serviceToEdit={serviceToEdit}
      />

      <DoctorModal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        onSave={handleSaveDoctor}
        doctorToEdit={doctorToEdit}
      />
    </div>
  );
}
