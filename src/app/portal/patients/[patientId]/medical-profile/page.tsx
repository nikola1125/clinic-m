"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  User, Pill, FileText, Stethoscope, ClipboardList, Plus,
  Save, Trash2, Loader2, AlertCircle, CheckCircle2, ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import {
  api,
  MedicalProfile, MedicalNote, Prescription, ActiveMedication, Diagnosis,
} from "@/lib/api";

type Tab = "profile" | "notes" | "prescriptions" | "medications" | "diagnoses";

const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "prescriptions", label: "Prescriptions", icon: ClipboardList },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "diagnoses", label: "Diagnoses", icon: Stethoscope },
];

const STATUS_COLOR: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  resolved: "bg-blue-100 text-blue-800",
  chronic: "bg-purple-100 text-purple-800",
  expired: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
  stopped: "bg-gray-100 text-gray-600",
};

export default function DoctorMedicalProfilePage() {
  const { patientId } = useParams<{ patientId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<Partial<MedicalProfile>>({});
  const [notes, setNotes] = useState<MedicalNote[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medications, setMedications] = useState<ActiveMedication[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = useCallback(async () => {
    api.setRole("doctor");
    setLoading(true);
    try {
      // Ensure patient is linked to this doctor so we can read/write their profile
      await api.linkPatient(patientId).catch(() => {});
      const [p, n, rx, meds, dx] = await Promise.all([
        api.getMedicalProfile(patientId).catch(() => ({})),
        api.getNotes(patientId).catch(() => []),
        api.getPrescriptions(patientId).catch(() => []),
        api.getMedications(patientId).catch(() => []),
        api.getDiagnoses(patientId).catch(() => []),
      ]);
      setProfile(p as Partial<MedicalProfile>);
      setNotes(n as MedicalNote[]);
      setPrescriptions(rx as Prescription[]);
      setMedications(meds as ActiveMedication[]);
      setDiagnoses(dx as Diagnosis[]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      api.setRole("doctor");
      const saved = await api.upsertMedicalProfile(patientId, profile);
      setProfile(saved);
      showToast("success", "Medical profile saved");
    } catch (e: any) {
      showToast("error", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/portal/patients/${patientId}`} className="p-2 rounded-lg hover:bg-foreground/5 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Medical Profile</h1>
            <p className="text-sm text-foreground/50">Full structured health record</p>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {toast.msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-foreground/5 p-1 rounded-xl overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id ? "bg-white shadow-sm text-foreground" : "text-foreground/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white border border-foreground/10 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of Birth">
                <input type="date" value={(profile.date_of_birth as string) ?? ""} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value || null })} className="input-field" />
              </Field>
              <Field label="Gender">
                <select value={profile.gender ?? ""} onChange={(e) => setProfile({ ...profile, gender: (e.target.value as any) || null })} className="input-field">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Blood Type">
                <input type="text" placeholder="e.g. A+" value={profile.blood_type ?? ""} onChange={(e) => setProfile({ ...profile, blood_type: e.target.value || null })} className="input-field" />
              </Field>
              <Field label="Height (cm)">
                <input type="number" placeholder="170" value={profile.height_cm ?? ""} onChange={(e) => setProfile({ ...profile, height_cm: e.target.value ? +e.target.value : null })} className="input-field" />
              </Field>
              <Field label="Weight (kg)">
                <input type="number" placeholder="70" value={profile.weight_kg ?? ""} onChange={(e) => setProfile({ ...profile, weight_kg: e.target.value ? +e.target.value : null })} className="input-field" />
              </Field>
            </div>

            <TagEditor
              label="Allergies"
              tags={(profile.allergies as string[]) ?? []}
              onChange={(tags) => setProfile({ ...profile, allergies: tags })}
              color="bg-red-50 text-red-700"
            />

            <TagEditor
              label="Chronic Conditions"
              tags={(profile.chronic_conditions as string[]) ?? []}
              onChange={(tags) => setProfile({ ...profile, chronic_conditions: tags })}
              color="bg-purple-50 text-purple-700"
            />

            <button
              onClick={saveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Profile
            </button>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <NoteForm patientId={patientId} onCreated={(n) => setNotes([n, ...notes])} showToast={showToast} />
            {notes.length === 0 ? (
              <EmptyState icon={FileText} message="No notes yet" />
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-white border border-foreground/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full capitalize">{note.category.replace("_", " ")}</span>
                    <div className="flex items-center gap-3">
                      {note.is_private && <span className="text-xs text-foreground/40">Private</span>}
                      <span className="text-xs text-foreground/40">{format(new Date(note.created_at), "PP")}</span>
                      <button onClick={async () => {
                        api.setRole("doctor");
                        await api.deleteNote(patientId, note.id);
                        setNotes(notes.filter((n) => n.id !== note.id));
                        showToast("success", "Note deleted");
                      }} className="text-foreground/30 hover:text-red-500 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80">{note.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === "prescriptions" && (
          <div className="space-y-4">
            <PrescriptionForm patientId={patientId} onCreated={(rx) => setPrescriptions([rx, ...prescriptions])} showToast={showToast} />
            {prescriptions.length === 0 ? (
              <EmptyState icon={ClipboardList} message="No prescriptions yet" />
            ) : (
              prescriptions.map((rx) => (
                <div key={rx.id} className="bg-white border border-foreground/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{rx.medication_name}</p>
                      <p className="text-xs text-foreground/50">{rx.dosage} · {rx.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLOR[rx.status]}`}>{rx.status}</span>
                      {rx.status === "active" && (
                        <button onClick={async () => {
                          api.setRole("doctor");
                          const updated = await api.updatePrescriptionStatus(patientId, rx.id, "cancelled");
                          setPrescriptions(prescriptions.map((r) => r.id === rx.id ? updated : r));
                        }} className="text-xs text-red-500 hover:underline">Cancel</button>
                      )}
                    </div>
                  </div>
                  {rx.instructions && <p className="text-xs text-foreground/60 italic">{rx.instructions}</p>}
                  <p className="text-xs text-foreground/40">Issued: {format(new Date(rx.issued_at), "PP")}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Medications Tab */}
        {activeTab === "medications" && (
          <div className="space-y-4">
            <MedicationForm patientId={patientId} onCreated={(m) => setMedications([m, ...medications])} showToast={showToast} />
            {medications.length === 0 ? (
              <EmptyState icon={Pill} message="No medications yet" />
            ) : (
              medications.map((med) => (
                <div key={med.id} className="bg-white border border-foreground/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{med.name}</p>
                      <p className="text-xs text-foreground/50">{med.dosage} · {med.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLOR[med.status]}`}>{med.status}</span>
                      {med.status === "active" && (
                        <button onClick={async () => {
                          api.setRole("doctor");
                          const updated = await api.updateMedicationStatus(patientId, med.id, "stopped");
                          setMedications(medications.map((m) => m.id === med.id ? updated : m));
                        }} className="text-xs text-red-500 hover:underline">Stop</button>
                      )}
                    </div>
                  </div>
                  {med.notes && <p className="text-xs text-foreground/60">{med.notes}</p>}
                  <p className="text-xs text-foreground/40">Started: {format(new Date(med.started_at), "PP")}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Diagnoses Tab */}
        {activeTab === "diagnoses" && (
          <div className="space-y-4">
            <DiagnosisForm patientId={patientId} onCreated={(d) => setDiagnoses([d, ...diagnoses])} showToast={showToast} />
            {diagnoses.length === 0 ? (
              <EmptyState icon={Stethoscope} message="No diagnoses yet" />
            ) : (
              diagnoses.map((dx) => (
                <div key={dx.id} className="bg-white border border-foreground/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-2 justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {dx.icd_code && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">{dx.icd_code}</span>}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLOR[dx.status]}`}>{dx.status}</span>
                        {dx.severity && <span className="px-2 py-0.5 text-xs rounded-full bg-orange-50 text-orange-700">{dx.severity}</span>}
                      </div>
                      <p className="mt-1 text-sm font-medium">{dx.description}</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/40">{format(new Date(dx.diagnosed_at), "PPP")}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
          background: white;
        }
        .input-field:focus { border-color: var(--primary, #3b82f6); }
      `}</style>
    </div>
  );
}

/* ── Sub-forms ────────────────────────────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground/60 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function TagEditor({ label, tags, onChange, color }: { label: string; tags: string[]; onChange: (t: string[]) => void; color: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v || tags.includes(v)) return;
    onChange([...tags, v]);
    setInput("");
  };
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-foreground/60 uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2 min-h-8">
        {tags.map((t) => (
          <span key={t} className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${color}`}>
            {t}
            <button onClick={() => onChange(tags.filter((x) => x !== t))} className="ml-0.5 opacity-60 hover:opacity-100">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder={`Add ${label.toLowerCase()}...`} className="input-field flex-1" />
        <button onClick={add} className="px-3 py-2 bg-foreground/10 rounded-lg text-sm hover:bg-foreground/20 transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function NoteForm({ patientId, onCreated, showToast }: { patientId: string; onCreated: (n: MedicalNote) => void; showToast: (t: "success" | "error", m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("general");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [saving, setSaving] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90">
      <Plus className="h-4 w-4" /> Add Note
    </button>
  );
  return (
    <div className="bg-white border border-primary/30 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
            <option value="general">General</option>
            <option value="observation">Observation</option>
            <option value="diagnosis">Diagnosis</option>
            <option value="follow_up">Follow Up</option>
          </select>
        </Field>
        <Field label="Visibility">
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
            <span className="text-sm text-foreground/70">Private (doctor-only)</span>
          </label>
        </Field>
      </div>
      <Field label="Content">
        <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Clinical note..." className="input-field resize-none" />
      </Field>
      <div className="flex gap-2">
        <button onClick={async () => {
          if (!content.trim()) return;
          setSaving(true);
          try {
            api.setRole("doctor");
            const n = await api.createNote(patientId, { category, content: content.trim(), is_private: isPrivate });
            onCreated(n);
            setContent(""); setOpen(false);
            showToast("success", "Note added");
          } catch (e: any) { showToast("error", e.message); } finally { setSaving(false); }
        }} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
        </button>
        <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-foreground/50 hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}

function PrescriptionForm({ patientId, onCreated, showToast }: { patientId: string; onCreated: (r: Prescription) => void; showToast: (t: "success" | "error", m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ medication_name: "", dosage: "", frequency: "", duration_days: "", refills_remaining: "0", instructions: "" });
  const [saving, setSaving] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90">
      <Plus className="h-4 w-4" /> Add Prescription
    </button>
  );
  return (
    <div className="bg-white border border-primary/30 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {(["medication_name", "dosage", "frequency"] as const).map((k) => (
          <Field key={k} label={k.replace("_", " ")}>
            <input type="text" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="input-field" />
          </Field>
        ))}
        <Field label="Duration (days)">
          <input type="number" value={f.duration_days} onChange={(e) => setF({ ...f, duration_days: e.target.value })} className="input-field" placeholder="Optional" />
        </Field>
        <Field label="Refills">
          <input type="number" value={f.refills_remaining} onChange={(e) => setF({ ...f, refills_remaining: e.target.value })} className="input-field" />
        </Field>
      </div>
      <Field label="Instructions">
        <textarea rows={2} value={f.instructions} onChange={(e) => setF({ ...f, instructions: e.target.value })} className="input-field resize-none" />
      </Field>
      <div className="flex gap-2">
        <button onClick={async () => {
          if (!f.medication_name.trim() || !f.dosage.trim() || !f.frequency.trim()) return;
          setSaving(true);
          try {
            api.setRole("doctor");
            const rx = await api.createPrescription(patientId, {
              medication_name: f.medication_name, dosage: f.dosage, frequency: f.frequency,
              duration_days: f.duration_days ? +f.duration_days : undefined,
              refills_remaining: +f.refills_remaining,
              instructions: f.instructions || undefined,
            });
            onCreated(rx); setOpen(false); showToast("success", "Prescription added");
          } catch (e: any) { showToast("error", e.message); } finally { setSaving(false); }
        }} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
        </button>
        <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-foreground/50 hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}

function MedicationForm({ patientId, onCreated, showToast }: { patientId: string; onCreated: (m: ActiveMedication) => void; showToast: (t: "success" | "error", m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", dosage: "", frequency: "", started_at: new Date().toISOString().slice(0, 10), notes: "" });
  const [saving, setSaving] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90">
      <Plus className="h-4 w-4" /> Add Medication
    </button>
  );
  return (
    <div className="bg-white border border-primary/30 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {(["name", "dosage", "frequency"] as const).map((k) => (
          <Field key={k} label={k}>
            <input type="text" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="input-field" />
          </Field>
        ))}
        <Field label="Started">
          <input type="date" value={f.started_at} onChange={(e) => setF({ ...f, started_at: e.target.value })} className="input-field" />
        </Field>
      </div>
      <Field label="Notes">
        <input type="text" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className="input-field" placeholder="Optional" />
      </Field>
      <div className="flex gap-2">
        <button onClick={async () => {
          if (!f.name.trim() || !f.dosage.trim() || !f.frequency.trim()) return;
          setSaving(true);
          try {
            api.setRole("doctor");
            const m = await api.createMedication(patientId, {
              name: f.name, dosage: f.dosage, frequency: f.frequency,
              started_at: new Date(f.started_at).toISOString(),
              notes: f.notes || undefined,
            });
            onCreated(m); setOpen(false); showToast("success", "Medication added");
          } catch (e: any) { showToast("error", e.message); } finally { setSaving(false); }
        }} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
        </button>
        <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-foreground/50 hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}

function DiagnosisForm({ patientId, onCreated, showToast }: { patientId: string; onCreated: (d: Diagnosis) => void; showToast: (t: "success" | "error", m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ icd_code: "", description: "", severity: "", status: "active" as "active" | "resolved" | "chronic" });
  const [saving, setSaving] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90">
      <Plus className="h-4 w-4" /> Add Diagnosis
    </button>
  );
  return (
    <div className="bg-white border border-primary/30 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="ICD Code (optional)">
          <input type="text" value={f.icd_code} onChange={(e) => setF({ ...f, icd_code: e.target.value })} className="input-field" placeholder="e.g. J45" />
        </Field>
        <Field label="Status">
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as any })} className="input-field">
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="chronic">Chronic</option>
          </select>
        </Field>
        <Field label="Severity (optional)">
          <select value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })} className="input-field">
            <option value="">None</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </Field>
      </div>
      <Field label="Description">
        <textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="input-field resize-none" />
      </Field>
      <div className="flex gap-2">
        <button onClick={async () => {
          if (!f.description.trim()) return;
          setSaving(true);
          try {
            api.setRole("doctor");
            const d = await api.createDiagnosis(patientId, {
              icd_code: f.icd_code || undefined,
              description: f.description,
              severity: (f.severity || undefined) as any,
              status: f.status,
            });
            onCreated(d); setOpen(false); showToast("success", "Diagnosis added");
          } catch (e: any) { showToast("error", e.message); } finally { setSaving(false); }
        }} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
        </button>
        <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-foreground/50 hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.FC<any>; message: string }) {
  return (
    <div className="text-center py-16 border border-dashed border-foreground/10 rounded-xl">
      <Icon className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
      <p className="text-sm text-foreground/40">{message}</p>
    </div>
  );
}
