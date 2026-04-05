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

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const h = { ...this.headers };
    
    // Attempt to get token from sessionStorage (client-side only)
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("access_token");
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
      throw new Error(err.detail || `API error: ${response.status}`);
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
    return this.request<any>("/admin/doctors", {
      method: "POST",
      body: JSON.stringify(payload),
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
    return this.request<any>(`/admin/doctors/${doctorId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
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
