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

  public async addPatientEntry(patientId: string, kind: "notes" | "medicines" | "prescriptions", value: string) {
    return this.request<any>(`/doctor/patients/${patientId}/entries`, {
      method: "POST",
      body: JSON.stringify({ kind, value }),
    });
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
}

export const api = new ApiClient();
