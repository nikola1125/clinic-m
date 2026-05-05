export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface ApiError {
  detail: string;
}

// ── Registry types (mirror backend app/schemas.py) ──────────────────────────

export interface TrainingItem {
  degree: string;
  institution: string;
  year: number;
}

export interface PublicationItem {
  title: string;
  journal: string;
  year: number;
}



export interface TestimonialItem {
  quote: string;
  patient: string;
  detail: string;
}

export interface DoctorListItem {
  id: string;
  slug: string;
  name: string;
  portrait_url: string | null;
  specialty: string;
  hospital: string;
  country: string;
  languages: string[];
  license_authority: string;
  years_experience: number;
  avg_response_minutes: number;
  bio: string;
}

export interface DoctorDetail extends DoctorListItem {
  license_number: string;
  training: TrainingItem[];
  affiliations: string[];
  publications: PublicationItem[];
  cases: string[];
  testimonials: TestimonialItem[];
}

export interface DoctorsPage {
  total: number;
  items: DoctorListItem[];
}

/** GET /meet/context/{id} — role is derived from JWT + appointment, not ?role= */
export interface MeetContextResponse {
  role: "doctor" | "patient";
  appointment: {
    id: string;
    doctor_id: string;
    patient_id: string;
    consult_id: string;
    scheduled_at: string;
    status: string;
    price_cents: number;
  };
  doctor_name: string;
  patient_full_name: string;
  meeting: MeetingRecord | null;
}

export interface MeetingRecord {
  id: string;
  appointment_id: string;
  status: "waiting" | "active" | "ended";
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  doctor_joined_at: string | null;
  patient_joined_at: string | null;
  recording_url: string | null;
}

export interface MedicalProfile {
  id: string;
  patient_id: string;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  blood_type: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  allergies: unknown[];
  chronic_conditions: unknown[];
  emergency_contact: Record<string, unknown>;
  insurance_info: Record<string, unknown>;
  updated_at: string;
  updated_by_doctor_id: string | null;
}

export interface MedicalNote {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string | null;
  category: string;
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string | null;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration_days: number | null;
  refills_remaining: number;
  instructions: string | null;
  status: "active" | "expired" | "cancelled";
  issued_at: string;
  expires_at: string | null;
}

export interface ActiveMedication {
  id: string;
  patient_id: string;
  doctor_id: string;
  name: string;
  dosage: string;
  frequency: string;
  started_at: string;
  ends_at: string | null;
  status: "active" | "stopped";
  notes: string | null;
}

export interface Diagnosis {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string | null;
  icd_code: string | null;
  description: string;
  severity: "mild" | "moderate" | "severe" | null;
  status: "active" | "resolved" | "chronic";
  diagnosed_at: string;
}

export interface PatientDocument {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  title: string;
  file_url: string;
  file_type: string;
  category: "lab" | "imaging" | "report" | "prescription" | "other";
  uploaded_by: "doctor" | "patient";
  uploaded_at: string;
}

export interface AvailabilitySlot {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_min: number;
  is_active: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  related_entity_id: string | null;
  related_entity_type: string | null;
  created_at: string;
}

// ── Per-role token helpers ──────────────────────────────────────────────
export type RoleKey = "admin" | "doctor" | "patient";

const TOKEN_KEYS: Record<RoleKey, string> = {
  admin: "clinic_admin_token",
  doctor: "clinic_doctor_token",
  patient: "clinic_patient_token",
};

export function setToken(role: RoleKey, token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEYS[role], token);
}

export function getToken(role: RoleKey): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEYS[role]);
}

export function clearToken(role: RoleKey) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEYS[role]);
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  public _role: RoleKey | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  /** Set which role's token to use for subsequent API calls */
  setRole(role: RoleKey) {
    this._role = role;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const h = { ...this.headers };
    if (typeof window !== "undefined" && this._role) {
      const token = getToken(this._role);
      if (token) {
        h["Authorization"] = `Bearer ${token}`;
      }
    }
    return h;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const authHeaders = await this.getAuthHeaders();
    const response = await fetch(url, {
      cache: "no-store",
      ...options,
      headers: { ...authHeaders, ...options.headers },
    });

    if (!response.ok) {
      const err: ApiError = await response.json().catch(() => ({ detail: response.statusText }));
      const detail = Array.isArray(err.detail)
        ? err.detail.map((e: any) => e.msg ?? JSON.stringify(e)).join(", ")
        : err.detail || `API error: ${response.status}`;
      throw new Error(detail);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }

  // Public endpoints
  public async login(payload: any) {
    return this.request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async register(payload: any) {
    return this.request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async getMe() {
    return this.request<{ id: string; email: string; role: string; doctor_id?: string; patient_id?: string }>("/auth/me");
  }

  public async bookAppointment(payload: {
    doctor_id: string;
    patient_id: string;
    consult_id: string;
    scheduled_at: string;
  }) {
    return this.request<any>("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async createPatient(payload: {
    doctor_id: string;
    full_name: string;
    email: string;
    phone?: string;
  }) {
    return this.request<any>("/patients", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async listDoctors() {
    return this.request<any[]>("/doctors");
  }

  public async createDoctor(payload: {
    email: string;
    name: string;
    username?: string;
    password?: string;
    specialty?: string;
    bio?: string;
  }) {
    const body: Record<string, unknown> = { ...payload };
    if (!body.password || (body.password as string).length < 8) delete body.password;
    if (!body.username) delete body.username;
    return this.request<any>("/admin/doctors", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public async updateDoctor(doctorId: string, payload: {
    email: string;
    name: string;
    username?: string;
    password?: string;
    specialty?: string;
    bio?: string;
  }) {
    const body: Record<string, unknown> = { ...payload };
    if (!body.password || (body.password as string).length < 8) delete body.password;
    if (!body.username) delete body.username;
    return this.request<any>(`/admin/doctors/${doctorId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  public async deleteDoctor(doctorId: string) {
    return this.request<void>(`/admin/doctors/${doctorId}`, { method: "DELETE" });
  }

  public async listConsults(doctorId: string) {
    return this.request<any[]>(`/doctors/${doctorId}/consults`);
  }

  public async createConsult(doctorId: string, payload: { title: string; price_cents: number }) {
    return this.request<any>(`/admin/doctors/${doctorId}/consults`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async updateConsult(consultId: string, payload: { title: string; price_cents: number }) {
    return this.request<any>(`/admin/consults/${consultId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  public async deleteConsult(consultId: string) {
    return this.request<void>(`/admin/consults/${consultId}`, { method: "DELETE" });
  }

  public async getRevenue(year?: number, month?: number) {
    const qs = new URLSearchParams({ year: String(year || ""), month: String(month || "") });
    return this.request<{ total_usd: number; year?: number; month?: number }>(`/admin/revenue?${qs}`);
  }

  public async getMyPatientProfile() {
    return this.request<any[]>("/patient/me");
  }

  public async getMyAppointments() {
    return this.request<any[]>("/patient/appointments");
  }

  public async listPatients() {
    return this.request<any[]>("/doctor/patients");
  }

  public async listAppointments() {
    return this.request<any[]>("/doctor/appointments");
  }

  public async setAppointmentStatus(appointmentId: string, status: "pending" | "accepted" | "rejected" | "completed") {
    return this.request<any>(`/doctor/appointments/${appointmentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  public async myConsults() {
    return this.request<any[]>("/doctor/consults");
  }

  public async getTurnCredentials() {
    return this.request<{
      username: string;
      password: string;
      ttl: number;
      uris: string[];
      realm?: string;
    }>("/turn-credentials");
  }

  /** Resolve your role (doctor vs patient) for this appointment using your JWT. */
  public async getMeetContext(appointmentId: string) {
    return this.request<MeetContextResponse>(
      `/meet/context/${encodeURIComponent(appointmentId)}`
    );
  }

  // ── Public registry ──────────────────────────────────────────────────────
  public async getDoctors(params: {
    q?: string;
    specialty?: string;
    language?: string;
    country?: string;
    sort?: "name" | "years_experience" | "avg_response_minutes";
    page?: number;
    limit?: number;
  } = {}) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    }
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return this.request<DoctorsPage>(`/registry/doctors${suffix}`);
  }

  public async getDoctor(slug: string) {
    return this.request<DoctorDetail>(`/registry/doctors/${encodeURIComponent(slug)}`);
  }

  public async createAppointment(payload: {
    patient_id: string;
    consult_id: string;
    scheduled_at: string;
  }) {
    return this.request<any>("/doctor/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async getChat(appointmentId: string) {
    return this.request<any[]>(`/doctor/appointments/${appointmentId}/chat`);
  }

  public async sendChat(appointmentId: string, payload: { message: string; image_url?: string }) {
    return this.request<any>(`/doctor/appointments/${appointmentId}/chat`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // ── Meeting join/end ─────────────────────────────────────────────────────
  public async joinMeeting(appointmentId: string) {
    return this.request<MeetingRecord>(`/meet/${encodeURIComponent(appointmentId)}/join`, { method: "POST" });
  }

  public async endMeeting(appointmentId: string) {
    return this.request<MeetingRecord>(`/meet/${encodeURIComponent(appointmentId)}/end`, { method: "POST" });
  }

  // ── Doctor: Medical records ───────────────────────────────────────────────
  public async getMedicalProfile(patientId: string) {
    return this.request<MedicalProfile>(`/doctor/patients/${patientId}/medical-profile`);
  }

  public async upsertMedicalProfile(patientId: string, payload: Partial<MedicalProfile>) {
    return this.request<MedicalProfile>(`/doctor/patients/${patientId}/medical-profile`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  public async getNotes(patientId: string) {
    return this.request<MedicalNote[]>(`/doctor/patients/${patientId}/notes`);
  }

  public async createNote(patientId: string, payload: { category: string; content: string; is_private?: boolean; appointment_id?: string }) {
    return this.request<MedicalNote>(`/doctor/patients/${patientId}/notes`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async updateNote(patientId: string, noteId: string, payload: Partial<MedicalNote>) {
    return this.request<MedicalNote>(`/doctor/patients/${patientId}/notes/${noteId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async deleteNote(patientId: string, noteId: string) {
    return this.request<void>(`/doctor/patients/${patientId}/notes/${noteId}`, { method: "DELETE" });
  }

  public async getPrescriptions(patientId: string) {
    return this.request<Prescription[]>(`/doctor/patients/${patientId}/prescriptions`);
  }

  public async createPrescription(patientId: string, payload: Partial<Prescription>) {
    return this.request<Prescription>(`/doctor/patients/${patientId}/prescriptions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async updatePrescriptionStatus(patientId: string, rxId: string, status: "active" | "expired" | "cancelled") {
    return this.request<Prescription>(`/doctor/patients/${patientId}/prescriptions/${rxId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  public async getMedications(patientId: string) {
    return this.request<ActiveMedication[]>(`/doctor/patients/${patientId}/medications`);
  }

  public async createMedication(patientId: string, payload: Partial<ActiveMedication>) {
    return this.request<ActiveMedication>(`/doctor/patients/${patientId}/medications`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async updateMedicationStatus(patientId: string, medId: string, status: "active" | "stopped") {
    return this.request<ActiveMedication>(`/doctor/patients/${patientId}/medications/${medId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  public async getDiagnoses(patientId: string) {
    return this.request<Diagnosis[]>(`/doctor/patients/${patientId}/diagnoses`);
  }

  public async createDiagnosis(patientId: string, payload: Partial<Diagnosis>) {
    return this.request<Diagnosis>(`/doctor/patients/${patientId}/diagnoses`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async getDocuments(patientId: string) {
    return this.request<PatientDocument[]>(`/doctor/patients/${patientId}/documents`);
  }

  public async createDocument(patientId: string, payload: { title: string; file_url: string; file_type: string; category: string }) {
    return this.request<PatientDocument>(`/doctor/patients/${patientId}/documents`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async getTimeline(patientId: string) {
    return this.request<Array<{ type: string; date: string; data: unknown }>>(`/doctor/patients/${patientId}/timeline`);
  }

  public async getAvailability() {
    return this.request<AvailabilitySlot[]>(`/doctor/availability`);
  }

  public async getDoctorAvailability(doctorId: string) {
    return this.request<AvailabilitySlot[]>(`/doctors/${doctorId}/availability`);
  }

  public async upsertAvailability(slots: Array<{ day_of_week: number; start_time: string; end_time: string; slot_duration_min?: number; is_active?: boolean }>) {
    return this.request<AvailabilitySlot[]>(`/doctor/availability`, {
      method: "PUT",
      body: JSON.stringify(slots),
    });
  }

  public async startMeetingDoctor(appointmentId: string) {
    return this.request<MeetingRecord>(`/doctor/meetings/${appointmentId}/start`, { method: "POST" });
  }

  public async linkPatient(patientId: string) {
    return this.request<any>(`/doctor/patients/${patientId}/link`, { method: "POST" });
  }

  public async unlinkPatient(patientId: string) {
    return this.request<void>(`/doctor/patients/${patientId}/link`, { method: "DELETE" });
  }

  // ── Patient: Medical records ──────────────────────────────────────────────
  public async getMyMedicalProfile() {
    return this.request<MedicalProfile>(`/patient/medical-profile`);
  }

  public async getMyNotes() {
    return this.request<MedicalNote[]>(`/patient/notes`);
  }

  public async getMyPrescriptions() {
    return this.request<Prescription[]>(`/patient/prescriptions`);
  }

  public async getMyMedications() {
    return this.request<ActiveMedication[]>(`/patient/medications`);
  }

  public async getMyDiagnoses() {
    return this.request<Diagnosis[]>(`/patient/diagnoses`);
  }

  public async getMyDocuments() {
    return this.request<PatientDocument[]>(`/patient/documents`);
  }

  public async uploadMyDocument(payload: { title: string; file_url: string; file_type: string; category: string }) {
    return this.request<PatientDocument>(`/patient/documents`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async getMyNotifications() {
    return this.request<Notification[]>(`/patient/notifications`);
  }

  public async markNotificationRead(notificationId: string) {
    return this.request<Notification>(`/patient/notifications/${notificationId}/read`, { method: "PATCH" });
  }

  public async getPatientChat(appointmentId: string) {
    return this.request<any[]>(`/patient/appointments/${appointmentId}/chat`);
  }

  public async sendPatientChat(appointmentId: string, payload: { message: string; image_url?: string }) {
    return this.request<any>(`/patient/appointments/${appointmentId}/chat`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiClient();
