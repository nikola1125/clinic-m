"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole } from "@/components/RequireRole";
import { uid } from "@/lib/ids";
import { useClinicStore, type Consult, type Doctor } from "@/store/clinicStore";
import { Edit2, Trash2, Plus, X, Save, Stethoscope, Mail, Activity, AlignLeft, Key, UserCheck } from "lucide-react";

function DoctorCard({
  doctor,
  onEdit,
  onDelete,
}: {
  doctor: Doctor;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="glass rounded-4xl p-6 shadow-premium transition-all hover:shadow-lg">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 overflow-hidden">
            <img src={`https://i.pravatar.cc/150?u=${doctor.id}`} alt={doctor.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">
              {doctor.name}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-primary">
              <Activity className="h-4 w-4" /> {doctor.specialty}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-foreground/50">
              <Mail className="h-4 w-4" /> {doctor.email}
            </div>
            <div className="mt-4 text-sm text-foreground/70 leading-relaxed max-w-2xl">{doctor.bio}</div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={onEdit}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-white px-4 py-2 text-xs font-bold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5"
          >
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {doctor.consults.length > 0 && (
        <div className="mt-6 pt-6 border-t border-foreground/5">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-3">
            Available Consultations
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {doctor.consults.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-2xl bg-white p-4 border border-foreground/5 shadow-sm"
              >
                <div className="text-sm font-bold text-foreground truncate pr-2">{c.title}</div>
                <div className="text-sm font-bold text-primary shrink-0 bg-primary/10 px-3 py-1 rounded-full">
                  ${c.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDoctorsPage() {
  const doctors = useClinicStore((s) => s.doctors);
  const addDoctor = useClinicStore((s) => s.addDoctor);
  const updateDoctor = useClinicStore((s) => s.updateDoctor);
  const removeDoctor = useClinicStore((s) => s.removeDoctor);

  const [mode, setMode] = useState<
    | { type: "create" }
    | { type: "edit"; doctorId: string }
    | null
  >(null);

  const editingDoctor = useMemo(() => {
    if (mode?.type !== "edit") return null;
    return doctors.find((d) => d.id === mode.doctorId) ?? null;
  }, [doctors, mode]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    specialty: "",
    bio: "",
  });

  const [consults, setConsults] = useState<Consult[]>([
    { id: uid("c"), title: "Standard consult (20 min)", price: 20 },
  ]);

  const startCreate = () => {
    setForm({ name: "", email: "", username: "", password: "", specialty: "", bio: "" });
    setConsults([{ id: uid("c"), title: "Standard consult (20 min)", price: 20 }]);
    setMode({ type: "create" });
  };

  const startEdit = (doctor: Doctor) => {
    setForm({
      name: doctor.name,
      email: doctor.email,
      username: doctor.username || "",
      password: "", // Don't show existing password
      specialty: doctor.specialty,
      bio: doctor.bio,
    });
    setConsults(doctor.consults.map((c) => ({ ...c })));
    setMode({ type: "edit", doctorId: doctor.id });
  };

  const save = () => {
    if (!form.name || !form.email || !form.username) return;
    if (mode?.type === "create" && !form.password) return;

    if (mode?.type === "create") {
      addDoctor({
        ...form,
        consults,
      });
    }

    if (mode?.type === "edit") {
      updateDoctor(mode.doctorId, { ...form, consults });
    }

    setMode(null);
  };

  return (
    <AppShell
      title="Admin Dashboard"
      nav={[
        { label: "Overview", href: "/hq-command" },
        { label: "Doctors", href: "/hq-command/doctors" },
        { label: "Revenue", href: "/hq-command/revenue" },
      ]}
    >
      <AutoSeed />
      <RequireRole role="admin">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              Manage Doctors
            </div>
            <div className="mt-1 text-sm text-foreground/50">
              Add new specialists, update profiles, and configure consultation pricing.
            </div>
          </div>
          {!mode && (
            <button
              onClick={startCreate}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-105 active:scale-100 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add Doctor
            </button>
          )}
        </div>

        {mode ? (
          <div className="mb-8 glass rounded-4xl p-6 sm:p-8 shadow-premium border-2 border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl font-bold text-foreground">
                {mode.type === "create" ? "Add New Specialist" : "Edit Specialist Profile"}
              </div>
              <button
                onClick={() => setMode(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-foreground/50 mb-2">Full Name</label>
                <div className="relative">
                  <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-2xl border-none bg-white p-4 pl-12 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
                    placeholder="Dr. John Doe"
                    autoComplete="off"
                  />
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-foreground/50 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-2xl border-none bg-white p-4 pl-12 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
                    placeholder="doctor@clinic.com"
                    autoComplete="off"
                  />
                </div>
              </div>
              
              <div className="lg:col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-foreground/50 mb-2">Specialty</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                  <input
                    value={form.specialty}
                    onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                    className="w-full rounded-2xl border-none bg-white p-4 pl-12 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
                    placeholder="Cardiology, General Practice..."
                    autoComplete="off"
                  />
                </div>
              </div>
              
                <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wide text-foreground/50 mb-2">Professional Biography</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-foreground/30" />
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    className="w-full min-h-[120px] rounded-2xl border-none bg-white p-4 pl-12 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all resize-y"
                    placeholder="Enter professional background, achievements, etc."
                  />
                </div>
              </div>
            </div>

            {/* Account Credentials Section */}
            <div className="mt-8 pt-8 border-t-2 border-dashed border-foreground/10">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-primary rounded-full"></div>
                <h3 className="text-lg font-bold text-foreground">Account Credentials</h3>
                <span className="text-xs font-medium text-foreground/40 bg-foreground/5 px-2 py-1 rounded-md uppercase tracking-wider">Internal Use Only</span>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-foreground/50 mb-2">Login Username</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                    <input
                      value={form.username}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                      className="w-full rounded-2xl border-none bg-white p-4 pl-12 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
                      placeholder="e.g. dr_smith"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-foreground/40 italic">This is what the doctor will use to log in to the portal.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-foreground/50 mb-2">
                    {mode.type === "edit" ? "Reset Password" : "Login Password"}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                    <input
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      type="password"
                      className="w-full rounded-2xl border-none bg-white p-4 pl-12 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
                      placeholder={mode.type === "edit" ? "Leave blank to keep current" : "Set a secure password"}
                      required={mode.type === "create"}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-foreground/5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-foreground">
                  Consultation Types & Pricing
                </div>
                <button
                  onClick={() =>
                    setConsults((cs) => [
                      ...cs,
                      { id: uid("c"), title: "", price: 0 },
                    ])
                  }
                  className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add Service
                </button>
              </div>

              <div className="grid gap-3">
                {consults.map((c, idx) => (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row gap-3 rounded-2xl bg-white p-3 border border-foreground/5 shadow-sm items-start sm:items-center"
                  >
                    <input
                      value={c.title}
                      onChange={(e) =>
                        setConsults((cs) =>
                          cs.map((x) =>
                            x.id === c.id ? { ...x, title: e.target.value } : x
                          )
                        )
                      }
                      placeholder="e.g. Standard consult (20 min)"
                      className="flex-1 w-full rounded-xl border-none bg-foreground/5 p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                    <div className="flex gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 font-bold">$</span>
                        <input
                          value={c.price}
                          onChange={(e) =>
                            setConsults((cs) =>
                              cs.map((x) =>
                                x.id === c.id
                                  ? {
                                      ...x,
                                      price: Number(e.target.value || 0),
                                    }
                                  : x
                              )
                            )
                          }
                          type="number"
                          min={0}
                          className="w-full rounded-xl border-none bg-foreground/5 p-3 pl-7 text-sm focus:ring-2 focus:ring-primary outline-none font-bold"
                        />
                      </div>
                      <button
                        onClick={() =>
                          setConsults((cs) => cs.filter((x) => x.id !== c.id))
                        }
                        className="flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0"
                        aria-label={`Remove consult ${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={save}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-100"
              >
                <Save className="h-4 w-4" /> Save Profile
              </button>
              <button
                onClick={() => {
                  setMode(null);
                  if (editingDoctor) startEdit(editingDoctor);
                }}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-2xl bg-white border border-foreground/10 px-8 py-4 text-sm font-bold text-foreground transition-all hover:bg-foreground/5"
              >
                Reset Changes
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 mt-6">
          {doctors.map((d) => (
            <DoctorCard
              key={d.id}
              doctor={d}
              onEdit={() => startEdit(d)}
              onDelete={() => removeDoctor(d.id)}
            />
          ))}
          {doctors.length === 0 && !mode && (
             <div className="glass rounded-4xl p-12 text-center shadow-premium">
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5 mb-4 text-primary text-opacity-50">
                 <Stethoscope className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-bold text-foreground">No doctors found</h3>
               <p className="mt-2 text-foreground/50 max-w-sm mx-auto">
                 Get started by adding your first medical specialist to the platform.
               </p>
               <button
                 onClick={startCreate}
                 className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-105 active:scale-100 mx-auto"
               >
                 <Plus className="h-4 w-4" />
                 Add First Doctor
               </button>
             </div>
          )}
        </div>
      </RequireRole>
    </AppShell>
  );
}
