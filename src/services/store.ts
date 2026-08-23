import {
  Patient,
  Doctor,
  ClinicService,
  Appointment,
  VisitLog,
  IntegrationSettings,
  WebhookLog,
  QuickStats,
  AppointmentStatus,
  BookingSource,
} from '../types';
import {
  initialPatients,
  initialDoctors,
  initialServices,
  initialAppointments,
  initialVisits,
  initialSettings,
  initialWebhookLogs,
} from '../data/initialData';

const STORAGE_KEYS = {
  PATIENTS: 'clinic_patients_v1',
  DOCTORS: 'clinic_doctors_v1',
  SERVICES: 'clinic_services_v1',
  APPOINTMENTS: 'clinic_appointments_v1',
  VISITS: 'clinic_visits_v1',
  SETTINGS: 'clinic_settings_v1',
  LOGS: 'clinic_webhook_logs_v1',
};

// Helper for local storage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return fallback;
    }
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export interface ClinicStoreSnapshot {
  patients: Patient[];
  doctors: Doctor[];
  services: ClinicService[];
  appointments: Appointment[];
  visits: VisitLog[];
  settings: IntegrationSettings;
  webhookLogs: WebhookLog[];
  stats: QuickStats;
}

class ClinicStore {
  private patients: Patient[];
  private doctors: Doctor[];
  private services: ClinicService[];
  private appointments: Appointment[];
  private visits: VisitLog[];
  private settings: IntegrationSettings;
  private logs: WebhookLog[];
  private listeners: (() => void)[] = [];
  private cachedSnapshot: ClinicStoreSnapshot | null = null;
  private cachedStats: QuickStats | null = null;

  constructor() {
    this.patients = loadFromStorage<Patient[]>(STORAGE_KEYS.PATIENTS, initialPatients);
    this.doctors = loadFromStorage<Doctor[]>(STORAGE_KEYS.DOCTORS, initialDoctors);
    this.services = loadFromStorage<ClinicService[]>(STORAGE_KEYS.SERVICES, initialServices);
    this.appointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    this.visits = loadFromStorage<VisitLog[]>(STORAGE_KEYS.VISITS, initialVisits);
    this.settings = loadFromStorage<IntegrationSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
    this.logs = loadFromStorage<WebhookLog[]>(STORAGE_KEYS.LOGS, initialWebhookLogs);
  }

  // Subscribe to changes
  public subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  public getSnapshot = (): ClinicStoreSnapshot => {
    if (!this.cachedSnapshot) {
      this.cachedSnapshot = {
        patients: this.getPatients(),
        doctors: this.getDoctors(),
        services: this.getServices(),
        appointments: this.getAppointments(),
        visits: this.getVisits(),
        settings: this.getSettings(),
        webhookLogs: this.getWebhookLogs(),
        stats: this.getQuickStats(),
      };
    }
    return this.cachedSnapshot;
  };

  private notify() {
    this.cachedSnapshot = null;
    this.cachedStats = null;
    this.listeners.forEach((l) => l());
  }

  // === PATIENTS CRUD ===
  public getPatients(): Patient[] {
    return this.patients;
  }

  public getPatientById(id: string): Patient | undefined {
    return this.patients.find((p) => p.id === id || p.code === id);
  }

  public getPatientByPhone(phone: string): Patient | undefined {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return this.patients.find((p) => p.phone.replace(/[^0-9]/g, '') === cleanPhone);
  }

  public addPatient(patientData: Omit<Patient, 'id' | 'code' | 'createdAt'>): Patient {
    const nextNum = 1000 + this.patients.length + 1;
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      code: `PAT-${nextNum}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.patients = [newPatient, ...this.patients];
    saveToStorage(STORAGE_KEYS.PATIENTS, this.patients);

    // Trigger webhook if enabled
    if (this.settings.enableOutgoingWebhook && this.settings.notifyOnNewPatient) {
      this.triggerOutgoingWebhook('patient_registered', {
        patientId: newPatient.id,
        code: newPatient.code,
        name: newPatient.name,
        phone: newPatient.phone,
      });
    }

    this.notify();
    return newPatient;
  }

  public updatePatient(id: string, updates: Partial<Patient>): Patient | undefined {
    let updated: Patient | undefined;
    this.patients = this.patients.map((p) => {
      if (p.id === id) {
        updated = { ...p, ...updates };
        return updated;
      }
      return p;
    });

    if (updated) {
      saveToStorage(STORAGE_KEYS.PATIENTS, this.patients);
      this.notify();
    }
    return updated;
  }

  public deletePatient(id: string): boolean {
    const initialLen = this.patients.length;
    this.patients = this.patients.filter((p) => p.id !== id);
    if (this.patients.length !== initialLen) {
      saveToStorage(STORAGE_KEYS.PATIENTS, this.patients);
      this.notify();
      return true;
    }
    return false;
  }

  // === DOCTORS CRUD ===
  public getDoctors(): Doctor[] {
    return this.doctors;
  }

  public addDoctor(doctorData: Omit<Doctor, 'id'>): Doctor {
    const colors = ['bg-teal-600', 'bg-cyan-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-sky-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newDoctor: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
      avatarColor: doctorData.avatarColor || randomColor,
    };

    this.doctors = [...this.doctors, newDoctor];
    saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);
    this.notify();
    return newDoctor;
  }

  public updateDoctor(id: string, updates: Partial<Doctor>): Doctor | undefined {
    let updated: Doctor | undefined;
    this.doctors = this.doctors.map((d) => {
      if (d.id === id) {
        updated = { ...d, ...updates };
        return updated;
      }
      return d;
    });

    if (updated) {
      saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);
      this.notify();
    }
    return updated;
  }

  public deleteDoctor(id: string): boolean {
    const initialLen = this.doctors.length;
    this.doctors = this.doctors.filter((d) => d.id !== id);
    if (this.doctors.length !== initialLen) {
      saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);
      this.notify();
      return true;
    }
    return false;
  }

  // === SERVICES CRUD ===
  public getServices(): ClinicService[] {
    return this.services;
  }

  public addService(serviceData: Omit<ClinicService, 'id'>): ClinicService {
    const newService: ClinicService = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };

    this.services = [...this.services, newService];
    saveToStorage(STORAGE_KEYS.SERVICES, this.services);
    this.notify();
    return newService;
  }

  public updateService(id: string, updates: Partial<ClinicService>): ClinicService | undefined {
    let updated: ClinicService | undefined;
    this.services = this.services.map((s) => {
      if (s.id === id) {
        updated = { ...s, ...updates };
        return updated;
      }
      return s;
    });

    if (updated) {
      saveToStorage(STORAGE_KEYS.SERVICES, this.services);
      this.notify();
    }
    return updated;
  }

  public deleteService(id: string): boolean {
    const initialLen = this.services.length;
    this.services = this.services.filter((s) => s.id !== id);
    if (this.services.length !== initialLen) {
      saveToStorage(STORAGE_KEYS.SERVICES, this.services);
      this.notify();
      return true;
    }
    return false;
  }

  // === APPOINTMENTS CRUD & WORKFLOW ===
  public getAppointments(): Appointment[] {
    return this.appointments;
  }

  public addAppointment(data: {
    patientId: string;
    doctorId: string;
    serviceId: string;
    date: string;
    time: string;
    status?: AppointmentStatus;
    bookingSource?: BookingSource;
    notes?: string;
  }): Appointment {
    const patient = this.getPatientById(data.patientId);
    const doctor = this.doctors.find((d) => d.id === data.doctorId);
    const service = this.services.find((s) => s.id === data.serviceId);

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: data.patientId,
      patientName: patient ? patient.name : 'مريض جديد',
      patientPhone: patient ? patient.phone : '',
      doctorId: data.doctorId,
      doctorName: doctor ? doctor.name : 'طبيب العيادة',
      serviceId: data.serviceId,
      serviceName: service ? service.name : 'كشف واستشارة',
      date: data.date,
      time: data.time,
      status: data.status || 'scheduled',
      bookingSource: data.bookingSource || 'direct',
      notes: data.notes || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.appointments = [newAppointment, ...this.appointments];
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, this.appointments);

    // Trigger Outbound Webhook
    if (this.settings.enableOutgoingWebhook && this.settings.notifyOnNewBooking) {
      this.triggerOutgoingWebhook('appointment_created', {
        appointmentId: newAppointment.id,
        patientName: newAppointment.patientName,
        patientPhone: newAppointment.patientPhone,
        doctorName: newAppointment.doctorName,
        serviceName: newAppointment.serviceName,
        date: newAppointment.date,
        time: newAppointment.time,
        bookingSource: newAppointment.bookingSource,
      });
    }

    this.notify();
    return newAppointment;
  }

  public updateAppointmentStatus(id: string, status: AppointmentStatus): Appointment | undefined {
    let updated: Appointment | undefined;
    this.appointments = this.appointments.map((a) => {
      if (a.id === id) {
        updated = { ...a, status };
        return updated;
      }
      return a;
    });

    if (updated) {
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, this.appointments);

      // Trigger Outbound Webhook
      if (this.settings.enableOutgoingWebhook && this.settings.notifyOnStatusChange) {
        this.triggerOutgoingWebhook('appointment_status_changed', {
          appointmentId: updated.id,
          patientName: updated.patientName,
          patientPhone: updated.patientPhone,
          newStatus: status,
          date: updated.date,
          time: updated.time,
        });
      }

      this.notify();
    }
    return updated;
  }

  public updateAppointment(id: string, updates: Partial<Appointment>): Appointment | undefined {
    let updated: Appointment | undefined;
    this.appointments = this.appointments.map((a) => {
      if (a.id === id) {
        // Sync names if IDs changed
        let pName = a.patientName;
        let pPhone = a.patientPhone;
        let dName = a.doctorName;
        let sName = a.serviceName;

        if (updates.patientId) {
          const p = this.getPatientById(updates.patientId);
          if (p) {
            pName = p.name;
            pPhone = p.phone;
          }
        }
        if (updates.doctorId) {
          const d = this.doctors.find((doc) => doc.id === updates.doctorId);
          if (d) dName = d.name;
        }
        if (updates.serviceId) {
          const s = this.services.find((srv) => srv.id === updates.serviceId);
          if (s) sName = s.name;
        }

        updated = {
          ...a,
          ...updates,
          patientName: pName,
          patientPhone: pPhone,
          doctorName: dName,
          serviceName: sName,
        };
        return updated;
      }
      return a;
    });

    if (updated) {
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, this.appointments);
      this.notify();
    }
    return updated;
  }

  public deleteAppointment(id: string): boolean {
    const initialLen = this.appointments.length;
    this.appointments = this.appointments.filter((a) => a.id !== id);
    if (this.appointments.length !== initialLen) {
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, this.appointments);
      this.notify();
      return true;
    }
    return false;
  }

  // === VISITS CRUD ===
  public getVisits(): VisitLog[] {
    return this.visits;
  }

  public addVisit(visitData: Omit<VisitLog, 'id' | 'createdAt'>): VisitLog {
    const patient = this.getPatientById(visitData.patientId);
    const doctor = this.doctors.find((d) => d.id === visitData.doctorId);

    const newVisit: VisitLog = {
      ...visitData,
      id: `vst-${Date.now()}`,
      patientName: patient ? patient.name : visitData.patientName,
      doctorName: doctor ? doctor.name : visitData.doctorName,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.visits = [newVisit, ...this.visits];
    saveToStorage(STORAGE_KEYS.VISITS, this.visits);

    // Update patient's lastVisit
    if (patient) {
      this.updatePatient(patient.id, { lastVisit: visitData.date });
    }

    this.notify();
    return newVisit;
  }

  public updateVisit(id: string, updates: Partial<VisitLog>): VisitLog | undefined {
    let updated: VisitLog | undefined;
    this.visits = this.visits.map((v) => {
      if (v.id === id) {
        updated = { ...v, ...updates };
        return updated;
      }
      return v;
    });

    if (updated) {
      saveToStorage(STORAGE_KEYS.VISITS, this.visits);
      this.notify();
    }
    return updated;
  }

  public deleteVisit(id: string): boolean {
    const initialLen = this.visits.length;
    this.visits = this.visits.filter((v) => v.id !== id);
    if (this.visits.length !== initialLen) {
      saveToStorage(STORAGE_KEYS.VISITS, this.visits);
      this.notify();
      return true;
    }
    return false;
  }

  // === INTEGRATION SETTINGS & LOGS ===
  public getSettings(): IntegrationSettings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<IntegrationSettings>): IntegrationSettings {
    this.settings = { ...this.settings, ...newSettings };
    saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
    this.notify();
    return { ...this.settings };
  }

  public getWebhookLogs(): WebhookLog[] {
    return this.logs;
  }

  public addWebhookLog(log: Omit<WebhookLog, 'id' | 'timestamp'>): WebhookLog {
    const newLog: WebhookLog = {
      ...log,
      id: `whlog-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    // keep last 50 logs max
    this.logs = [newLog, ...this.logs.slice(0, 49)];
    saveToStorage(STORAGE_KEYS.LOGS, this.logs);
    this.notify();
    return newLog;
  }

  public clearWebhookLogs(): void {
    this.logs = [];
    saveToStorage(STORAGE_KEYS.LOGS, this.logs);
    this.notify();
  }

  // Helper to trigger outbound webhook call to n8n
  private async triggerOutgoingWebhook(event: string, data: any) {
    if (!this.settings.outgoingWebhookUrl) return;

    const payload = {
      event,
      timestamp: new Date().toISOString(),
      apiKey: this.settings.apiKey,
      data,
    };

    const logEntry = this.addWebhookLog({
      type: 'outgoing',
      endpoint: this.settings.outgoingWebhookUrl,
      action: `إرسال حدث إلى n8n: ${event}`,
      status: 'pending',
      payload,
      response: null,
    });

    try {
      // Perform fetch if valid URL
      const response = await fetch(this.settings.outgoingWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Clinic-API-Key': this.settings.apiKey,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json().catch(() => ({ status: response.status, text: response.statusText }));

      this.logs = this.logs.map((l) =>
        l.id === logEntry.id
          ? {
              ...l,
              status: response.ok ? 'success' : 'failed',
              response: resData,
            }
          : l
      );
      saveToStorage(STORAGE_KEYS.LOGS, this.logs);
      this.notify();
    } catch (err: any) {
      console.warn('Outgoing Webhook call failed:', err);
      this.logs = this.logs.map((l) =>
        l.id === logEntry.id
          ? {
              ...l,
              status: 'failed',
              response: { error: err.message || 'شبكة غير متاحة أو عنوان n8n غير متاح' },
            }
          : l
      );
      saveToStorage(STORAGE_KEYS.LOGS, this.logs);
      this.notify();
    }
  }

  // === AI / N8N SIMULATION / API ACTIONS ===
  public aiRegisterPatient(payload: { name: string; phone: string; age?: number; gender?: 'ذكر' | 'أنثى'; notes?: string }) {
    // Check if patient exists
    let existing = this.getPatientByPhone(payload.phone);
    if (existing) {
      this.addWebhookLog({
        type: 'incoming',
        endpoint: '/api/n8n/patient-register',
        action: 'تسجيل مريض - السجل موجود مسبقا',
        status: 'success',
        payload,
        response: { success: true, patientId: existing.id, code: existing.code, isExisting: true, message: 'المريض مسجل سابقاً' },
      });
      return { success: true, patient: existing, isExisting: true };
    }

    const newPatient = this.addPatient({
      name: payload.name,
      phone: payload.phone,
      age: payload.age || 30,
      gender: payload.gender || 'ذكر',
      medicalHistory: ['تم التسجيل عبر الذكاء الاصطناعي'],
      notes: payload.notes || 'مسجل تلقائياً عبر وكيل الذكاء الاصطناعي (n8n)',
    });

    this.addWebhookLog({
      type: 'incoming',
      endpoint: '/api/n8n/patient-register',
      action: 'تسجيل مريض جديد بواسطة وكيل n8n',
      status: 'success',
      payload,
      response: {
        success: true,
        patientId: newPatient.id,
        code: newPatient.code,
        message: 'تم فتح الملف الطبي بنجاح عبر الذكاء الاصطناعي',
      },
    });

    return { success: true, patient: newPatient, isExisting: false };
  }

  public aiBookAppointment(payload: {
    patientPhone: string;
    patientName?: string;
    doctorId?: string;
    serviceId?: string;
    date: string;
    time: string;
    notes?: string;
  }) {
    // 1. Find or create patient
    let patient = this.getPatientByPhone(payload.patientPhone);
    if (!patient) {
      const regResult = this.aiRegisterPatient({
        name: payload.patientName || 'مريض - واتساب',
        phone: payload.patientPhone,
        notes: 'تم الإنشاء تلقائياً أثناء حجز الموعد عبر n8n',
      });
      patient = regResult.patient;
    }

    // 2. Select default doctor/service if not provided
    const docId = payload.doctorId || this.doctors[0]?.id || 'doc-1';
    const srvId = payload.serviceId || this.services[0]?.id || 'srv-1';

    const status: AppointmentStatus = this.settings.aiAutoConfirm ? 'confirmed' : 'scheduled';

    const appointment = this.addAppointment({
      patientId: patient.id,
      doctorId: docId,
      serviceId: srvId,
      date: payload.date,
      time: payload.time,
      status,
      bookingSource: 'n8n_ai',
      notes: payload.notes || 'حجز آلي عبر n8n AI Agent',
    });

    this.addWebhookLog({
      type: 'incoming',
      endpoint: '/api/n8n/book-appointment',
      action: 'حجز موعد جديد عبر وكيل n8n',
      status: 'success',
      payload,
      response: {
        success: true,
        appointmentId: appointment.id,
        status: appointment.status,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        date: appointment.date,
        time: appointment.time,
        message: 'تم حجز الموعد بنجاح في النظام',
      },
    });

    return { success: true, appointment };
  }

  public aiConfirmAppointment(payload: { appointmentId?: string; patientPhone?: string; date?: string }) {
    let target: Appointment | undefined;

    if (payload.appointmentId) {
      target = this.appointments.find((a) => a.id === payload.appointmentId);
    } else if (payload.patientPhone) {
      const patient = this.getPatientByPhone(payload.patientPhone);
      if (patient) {
        target = this.appointments.find(
          (a) => a.patientId === patient.id && (a.status === 'scheduled' || a.status === 'confirmed')
        );
      }
    }

    if (!target) {
      this.addWebhookLog({
        type: 'incoming',
        endpoint: '/api/n8n/confirm-appointment',
        action: 'تأكيد موعد - لم يتم العثور على الموعد',
        status: 'failed',
        payload,
        response: { success: false, message: 'لم يتم العثور على موعد معلق للبيانات المدخلة' },
      });
      return { success: false, message: 'الموعد غير موجود' };
    }

    const updated = this.updateAppointmentStatus(target.id, 'confirmed');

    this.addWebhookLog({
      type: 'incoming',
      endpoint: '/api/n8n/confirm-appointment',
      action: 'تأكيد الموعد عبر n8n AI',
      status: 'success',
      payload,
      response: {
        success: true,
        appointmentId: target.id,
        status: 'confirmed',
        message: `تم تأكيد الموعد للمريض ${target.patientName}`,
      },
    });

    return { success: true, appointment: updated };
  }

  // Get Summary Statistics
  public getQuickStats(): QuickStats {
    if (!this.cachedStats) {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayAppointments = this.appointments.filter((a) => a.date === todayStr);
      const confirmedToday = todayAppointments.filter((a) => a.status === 'confirmed' || a.status === 'completed');

      const todayVisits = this.visits.filter((v) => v.date === todayStr);
      const todayRev = todayVisits.reduce((acc, v) => acc + (v.paidAmount || 0), 0);

      const monthlyRev = this.visits.reduce((acc, v) => acc + (v.paidAmount || 0), 0);

      this.cachedStats = {
        todayAppointmentsCount: todayAppointments.length,
        confirmedTodayCount: confirmedToday.length,
        totalPatientsCount: this.patients.length,
        totalServicesCount: this.services.length,
        todayRevenue: todayRev,
        monthlyRevenue: monthlyRev,
        n8nEventsCount: this.logs.length,
      };
    }
    return this.cachedStats;
  }
}

export const clinicStore = new ClinicStore();
