export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
export type BookingSource = 'direct' | 'n8n_ai' | 'phone' | 'website';
export type Gender = 'ذكر' | 'أنثى';
export type PaymentStatus = 'paid' | 'partial' | 'pending';

export interface Patient {
  id: string;
  code: string; // e.g. PAT-1001
  name: string;
  phone: string;
  age: number;
  gender: Gender;
  medicalHistory: string[]; // e.g. ["ضغط الدم", "حساسية البنسلين"]
  notes?: string;
  createdAt: string;
  lastVisit?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  room: string;
  workingDays: string[];
  avatarColor?: string;
  isActive: boolean;
}

export interface ClinicService {
  id: string;
  name: string;
  category: 'فحص عام' | 'علاج عصب' | 'حشوات تجميلية' | 'تنظيف وتلميع' | 'جراحة وتثبيت' | 'تقويم أسنان' | 'تركيبات وتبييض';
  price: number;
  durationMinutes: number;
  description: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  bookingSource: BookingSource;
  notes?: string;
  createdAt: string;
}

export interface VisitLog {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  date: string; // YYYY-MM-DD
  teethAffected: number[]; // e.g. [11, 12, 46]
  serviceIds: string[];
  serviceNames: string[];
  diagnosis: string;
  treatmentDone: string;
  prescription?: string;
  totalCost: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  nextVisitDate?: string;
  notes?: string;
  createdAt: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  type: 'incoming' | 'outgoing';
  endpoint: string;
  action: string;
  status: 'success' | 'failed' | 'pending';
  payload: any;
  response: any;
}

export interface IntegrationSettings {
  apiKey: string;
  outgoingWebhookUrl: string;
  enableOutgoingWebhook: boolean;
  notifyOnNewPatient: boolean;
  notifyOnNewBooking: boolean;
  notifyOnStatusChange: boolean;
  aiAutoConfirm: boolean;
}

export interface QuickStats {
  todayAppointmentsCount: number;
  confirmedTodayCount: number;
  totalPatientsCount: number;
  totalServicesCount: number;
  todayRevenue: number;
  monthlyRevenue: number;
  n8nEventsCount: number;
}
