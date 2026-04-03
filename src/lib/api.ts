export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface ApiError {
  detail: string;
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  // For dev bypass: set X-Dev-Role and X-Dev-Doctor-Id headers if localStorage has them
  private withDevAuth(): Record<string, string> {
    const h = { ...this.headers };
    const devRole = typeof window !== "undefined" ? window.localStorage.getItem("dev-role") : null;
    const devDoctorId = typeof window !== "undefined" ? window.localStorage.getItem("dev-doctor-id") : null;
    const devPatientId = typeof window !== "undefined" ? window.localStorage.getItem("dev-patient-id") : null;
    if (devRole) h["X-Dev-Role"] = devRole;
    if (devDoctorId) h["X-Dev-Doctor-Id"] = devDoctorId;
    if (devPatientId) h["X-Dev-Patient-Id"] = devPatientId;
    return h;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.withDevAuth(), ...options.headers },
    });
    if (!response.ok) {
      const err: ApiError = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(err.detail || `API error: ${response.status}`);
    }
    return response.json();
  }

  // Public endpoints
  async getMe() {
    return this.request<{ sub: string; role: string; doctor_id?: string }>("/me");
  }

  async bookAppointment(payload: {
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

  async createPatient(payload: {
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

  // Admin endpoints
  async listDoctors() {
    return this.request<any[]>("/admin/doctors");
  }

  async createDoctor(payload: {
    email: string;
    name: string;
    specialty?: string;
    bio?: string;
  }) {
    return this.request<any>("/admin/doctors", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateDoctor(doctorId: string, payload: {
    email: string;
    name: string;
    specialty?: string;
    bio?: string;
  }) {
    return this.request<any>(`/admin/doctors/${doctorId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async deleteDoctor(doctorId: string) {
    return this.request<void>(`/admin/doctors/${doctorId}`, { method: "DELETE" });
  }

  async listConsults(doctorId: string) {
    return this.request<any[]>(`/admin/doctors/${doctorId}/consults`);
  }

  async createConsult(doctorId: string, payload: { title: string; price_cents: number }) {
    return this.request<any>(`/admin/doctors/${doctorId}/consults`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateConsult(consultId: string, payload: { title: string; price_cents: number }) {
    return this.request<any>(`/admin/consults/${consultId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async deleteConsult(consultId: string) {
    return this.request<void>(`/admin/consults/${consultId}`, { method: "DELETE" });
  }

  async getRevenue(year?: number, month?: number) {
    const qs = new URLSearchParams({ year: String(year || ""), month: String(month || "") });
    return this.request<{ total_usd: number; year?: number; month?: number }>(`/admin/revenue?${qs}`);
  }

  // Doctor endpoints
  async listPatients() {
    return this.request<any[]>("/doctor/patients");
  }

  async addPatientEntry(patientId: string, kind: "notes" | "medicines" | "prescriptions", value: string) {
    return this.request<any>(`/doctor/patients/${patientId}/entries`, {
      method: "POST",
      body: JSON.stringify({ kind, value }),
    });
  }

  async listAppointments() {
    return this.request<any[]>("/doctor/appointments");
  }

  async setAppointmentStatus(appointmentId: string, status: "pending" | "accepted" | "rejected" | "completed") {
    return this.request<any>(`/doctor/appointments/${appointmentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async myConsults() {
    return this.request<any[]>("/doctor/consults");
  }

  async createAppointment(payload: {
    patient_id: string;
    consult_id: string;
    scheduled_at: string;
  }) {
    return this.request<any>("/doctor/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getChat(appointmentId: string) {
    return this.request<any[]>(`/doctor/appointments/${appointmentId}/chat`);
  }

  async sendChat(appointmentId: string, payload: { message: string; image_url?: string }) {
    return this.request<any>(`/doctor/appointments/${appointmentId}/chat`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiClient();
