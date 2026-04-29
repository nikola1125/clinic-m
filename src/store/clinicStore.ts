"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { uid } from "@/lib/ids";
import { api, setToken, clearToken, type RoleKey } from "@/lib/api";

export type Consult = {
  id: string;
  title: string;
  price: number;
};

export type Doctor = {
  id: string;
  name: string;
  email: string;
  username: string;
  specialty: string;
  bio: string;
  consults: Consult[];
};

export type AppointmentStatus = "pending" | "accepted" | "rejected" | "completed";

export type Appointment = {
  id: string;
  doctorId: string;
  patientId: string;
  consultId: string;
  scheduledAt: string;
  status: AppointmentStatus;
  price: number;
};

export type Patient = {
  id: string;
  doctorId: string;
  fullName: string;
  email: string;
  phone?: string;
  notes: string[];
  medicines: string[];
  prescriptions: string[];
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  appointmentId: string;
  sender: "doctor" | "patient";
  text?: string;
  imageDataUrl?: string;
  createdAt: string;
};

type AdminSession = { role: "admin" };
type DoctorSession = { role: "doctor"; doctorId: string };
type PatientSession = { role: "patient"; patientId: string };

type Session = AdminSession | DoctorSession | PatientSession | null;

// Helper to map API response to frontend types
const mapApiDoctor = (d: any): Doctor => ({
  id: d.id,
  name: d.name,
  email: d.email,
  username: d.username,
  specialty: d.specialty,
  bio: d.bio,
  consults: [], // will be fetched separately
});

const mapApiConsult = (c: any): Consult => ({
  id: c.id,
  title: c.title,
  price: c.price_cents / 100,
});

const mapApiPatient = (p: any): Patient => ({
  id: p.id,
  doctorId: p.doctor_id,
  fullName: p.full_name,
  email: p.email,
  phone: p.phone,
  notes: p.notes,
  medicines: p.medicines,
  prescriptions: p.prescriptions,
  createdAt: p.created_at,
});

const mapApiAppointment = (a: any): Appointment => ({
  id: a.id,
  doctorId: a.doctor_id,
  patientId: a.patient_id,
  consultId: a.consult_id,
  scheduledAt: a.scheduled_at,
  status: a.status,
  price: a.price_cents / 100,
});

const mapApiChatMessage = (m: any): ChatMessage => ({
  id: m.id,
  appointmentId: m.appointment_id,
  sender: m.sender,
  text: m.message,
  imageDataUrl: m.image_url,
  createdAt: m.created_at,
});

type ClinicState = {
  // Per-role sessions — independent of each other
  adminSession: AdminSession | null;
  doctorSession: DoctorSession | null;
  patientSession: PatientSession | null;

  /** Convenience: returns session for a given role */
  getSessionForRole: (role: RoleKey) => Session;

  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  chat: ChatMessage[];

  setSession: (session: Session) => void;
  logout: (role: RoleKey) => void;
  loginPatient: (email: string) => Promise<boolean>;

  seedIfEmpty: () => void;

  // API-backed actions
  refreshDoctors: () => Promise<void>;
  refreshDoctorConsults: (doctorId: string) => Promise<void>;
  refreshPatients: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  refreshChat: (appointmentId: string) => Promise<void>;

  addDoctor: (input: Omit<Doctor, "id" | "consults"> & { consults?: Consult[]; password?: string }) => Promise<void>;
  updateDoctor: (doctorId: string, patch: Partial<Omit<Doctor, "id" | "consults">> & { consults?: Consult[]; password?: string }) => Promise<void>;
  removeDoctor: (doctorId: string) => Promise<void>;

  addAppointment: (input: Omit<Appointment, "id">) => Promise<void>;
  setAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => Promise<void>;

  upsertPatient: (
    patient: Omit<
      Patient,
      "id" | "createdAt" | "notes" | "medicines" | "prescriptions"
    > & { id?: string }
  ) => Promise<string>;
  addPatientEntry: (
    patientId: string,
    kind: "notes" | "medicines" | "prescriptions",
    value: string
  ) => Promise<void>;

  addChatMessage: (msg: Omit<ChatMessage, "id" | "createdAt">) => Promise<void>;

  // Admin revenue
  getRevenue: (year?: number, month?: number) => Promise<{ total_usd: number; year?: number; month?: number }>;
};

const demoSeed = () => {
  const dr1: Doctor = {
    id: uid("doc"),
    name: "Dr. Lina Hassan",
    email: "lina@clinic.demo",
    username: "dr_lina",
    specialty: "Dermatology",
    bio: "Skin care, acne, eczema, and aesthetic dermatology.",
    consults: [
      { id: uid("c"), title: "Quick consult (10 min)", price: 15 },
      { id: uid("c"), title: "Standard consult (20 min)", price: 25 },
    ],
  };

  const patient1: Patient = {
    id: uid("pat"),
    doctorId: dr1.id,
    fullName: "Omar Ali",
    email: "omar.patient@demo",
    phone: "+20 100 000 0000",
    notes: ["Initial intake: mild acne"],
    medicines: [],
    prescriptions: [],
    createdAt: new Date().toISOString(),
  };

  const appt1: Appointment = {
    id: uid("apt"),
    doctorId: dr1.id,
    patientId: patient1.id,
    consultId: dr1.consults[1]!.id,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    status: "pending",
    price: dr1.consults[1]!.price,
  };

  return {
    doctors: [dr1],
    patients: [patient1],
    appointments: [appt1],
    chat: [] as ChatMessage[],
  };
};

export const useClinicStore = create<ClinicState>()(
  persist(
    (set, get) => ({
      adminSession: null,
      doctorSession: null,
      patientSession: null,
      doctors: [],
      patients: [],
      appointments: [],
      chat: [],

      getSessionForRole: (role: RoleKey): Session => {
        if (role === "admin") return get().adminSession;
        if (role === "doctor") return get().doctorSession;
        return get().patientSession;
      },

      setSession: (session) => {
        if (!session) return;
        if (session.role === "admin") set({ adminSession: session });
        else if (session.role === "doctor") set({ doctorSession: session });
        else if (session.role === "patient") set({ patientSession: session });
      },

      logout: (role: RoleKey) => {
        clearToken(role);
        if (role === "admin") set({ adminSession: null });
        else if (role === "doctor") set({ doctorSession: null });
        else if (role === "patient") set({ patientSession: null });
      },

      loginPatient: async (email: string) => {
        api.setRole("patient");
        await get().refreshPatients();
        const patients = get().patients;
        const patient = patients.find((p) => p.email === email);
        if (patient) {
          get().setSession({ role: "patient", patientId: patient.id });
          return true;
        }
        return false;
      },

      seedIfEmpty: () => {
        const { doctors } = get();
        if (doctors.length > 0) return;
      },

      // Refresh methods — api.setRole() must be called by the consumer before these
      refreshDoctors: async () => {
        try {
          const apiDocs = await api.listDoctors();
          const docs = apiDocs.map(mapApiDoctor);
          set({ doctors: docs });
        } catch (e) {
          console.error("Failed to refresh doctors", e);
        }
      },

      refreshDoctorConsults: async (doctorId: string) => {
        try {
          const apiConsults = await api.listConsults(doctorId);
          const consults = apiConsults.map(mapApiConsult);
          set((s) => ({
            doctors: s.doctors.map((d) =>
              d.id === doctorId ? { ...d, consults } : d
            ),
          }));
        } catch (e) {
          console.error("Failed to refresh consults", e);
        }
      },

      refreshPatients: async () => {
        try {
          // The consumer must call api.setRole() before this
          const ps = get().patientSession;
          let apiPatients;
          if (ps && api["_role"] === "patient") {
            apiPatients = await api.getMyPatientProfile();
          } else {
            apiPatients = await api.listPatients();
          }
          set({ patients: apiPatients.map(mapApiPatient) });
        } catch (e) {
          console.error("Failed to refresh patients", e);
        }
      },

      refreshAppointments: async () => {
        try {
          const ps = get().patientSession;
          let apiAppts;
          if (ps && api["_role"] === "patient") {
            apiAppts = await api.getMyAppointments();
          } else {
            apiAppts = await api.listAppointments();
          }
          set({ appointments: apiAppts.map(mapApiAppointment) });
        } catch (e) {
          console.error("Failed to refresh appointments", e);
        }
      },

      refreshChat: async (appointmentId: string) => {
        try {
          const apiMessages = await api.getChat(appointmentId);
          set({ chat: apiMessages.map(mapApiChatMessage) });
        } catch (e) {
          console.error("Failed to refresh chat", e);
        }
      },

      // CRUD actions
      addDoctor: async (input) => {
        api.setRole("admin");
        const d = await api.createDoctor({
          email: input.email,
          name: input.name,
          username: input.username,
          password: input.password,
          specialty: input.specialty,
          bio: input.bio,
        });
        if (input.consults) {
          for (const c of input.consults) {
            await api.createConsult(d.id, { title: c.title, price_cents: Math.round(c.price * 100) });
          }
        }
        await get().refreshDoctors();
        if (d.id) {
          await get().refreshDoctorConsults(d.id);
        }
      },

      updateDoctor: async (doctorId, patch) => {
        api.setRole("admin");
        await api.updateDoctor(doctorId, {
          email: patch.email ?? "",
          name: patch.name ?? "",
          username: patch.username,
          password: patch.password,
          specialty: patch.specialty ?? "",
          bio: patch.bio ?? "",
        });
        
        if (patch.consults) {
          const existingConsults = await api.listConsults(doctorId);
          const existingIds = new Set(existingConsults.map((c: any) => c.id));
          const newConsultsMap = new Map(patch.consults.map((c) => [c.id, c]));

          for (const nc of patch.consults) {
            if (existingIds.has(nc.id)) {
              await api.updateConsult(nc.id, { title: nc.title, price_cents: Math.round(nc.price * 100) });
            } else {
              await api.createConsult(doctorId, { title: nc.title, price_cents: Math.round(nc.price * 100) });
            }
          }
          for (const ec of existingConsults) {
            if (!newConsultsMap.has(ec.id)) {
              await api.deleteConsult(ec.id);
            }
          }
        }
        
        await get().refreshDoctors();
        await get().refreshDoctorConsults(doctorId);
      },

      removeDoctor: async (doctorId) => {
        api.setRole("admin");
        await api.deleteDoctor(doctorId);
        await get().refreshDoctors();
      },

      addAppointment: async (input) => {
        if (input.doctorId) {
          // Patient booking flow — doctorId is provided by the patient
          api.setRole("patient");
          await api.bookAppointment({
            doctor_id: input.doctorId,
            patient_id: input.patientId,
            consult_id: input.consultId,
            scheduled_at: input.scheduledAt,
          });
        } else {
          // Doctor creating an appointment for their patient
          api.setRole("doctor");
          await api.createAppointment({
            patient_id: input.patientId,
            consult_id: input.consultId,
            scheduled_at: input.scheduledAt,
          });
        }
        await get().refreshAppointments();
      },

      setAppointmentStatus: async (appointmentId, status) => {
        api.setRole("doctor");
        await api.setAppointmentStatus(appointmentId, status);
        await get().refreshAppointments();
      },

      upsertPatient: async (patient) => {
        const ds = get().doctorSession;
        if (!ds) {
          throw new Error("Only doctors can upsert patients");
        }
        api.setRole("doctor");
        const payload = {
          doctor_id: ds.doctorId,
          full_name: patient.fullName,
          email: patient.email,
          phone: patient.phone,
        };
        let id = patient.id;
        if (!id) {
          const created = await api.createPatient(payload);
          id = created.id;
          if (!id) throw new Error("Failed to create patient: no ID returned");
        }
        await get().refreshPatients();
        return id;
      },

      addPatientEntry: async (patientId, kind, value) => {
        api.setRole("doctor");
        await api.addPatientEntry(patientId, kind, value);
        await get().refreshPatients();
      },

      addChatMessage: async (msg) => {
        api.setRole("doctor");
        await api.sendChat(msg.appointmentId, {
          message: msg.text ?? "",
          image_url: msg.imageDataUrl,
        });
        await get().refreshChat(msg.appointmentId);
      },

      getRevenue: async (year?: number, month?: number) => {
        api.setRole("admin");
        return api.getRevenue(year, month);
      },
    }),
    {
      name: "clinic_sessions_v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        adminSession: s.adminSession,
        doctorSession: s.doctorSession,
        patientSession: s.patientSession,
      }),
    }
  )
);

export const DOCTOR_PASSWORD = "doctor123";
