"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  User, Pill, FileText, Stethoscope, Activity,
  AlertCircle, Heart, Shield, Phone, ClipboardList,
  ChevronRight, Loader2,
} from "lucide-react";
import { api, MedicalProfile, MedicalNote, Prescription, ActiveMedication, Diagnosis } from "@/lib/api";

type Tab = "profile" | "notes" | "prescriptions" | "medications" | "diagnoses";

const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "prescriptions", label: "Prescriptions", icon: ClipboardList },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "diagnoses", label: "Diagnoses", icon: Stethoscope },
];

const SEVERITY_COLOR: Record<string, string> = {
  mild: "bg-yellow-100 text-yellow-800",
  moderate: "bg-orange-100 text-orange-800",
  severe: "bg-red-100 text-red-800",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  resolved: "bg-blue-100 text-blue-800",
  chronic: "bg-purple-100 text-purple-800",
  expired: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
  stopped: "bg-gray-100 text-gray-600",
};

export default function PatientMedicalRecordPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [notes, setNotes] = useState<MedicalNote[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medications, setMedications] = useState<ActiveMedication[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.setRole("patient");
    Promise.all([
      api.getMyMedicalProfile().catch(() => null),
      api.getMyNotes().catch(() => []),
      api.getMyPrescriptions().catch(() => []),
      api.getMyMedications().catch(() => []),
      api.getMyDiagnoses().catch(() => []),
    ]).then(([p, n, rx, meds, dx]) => {
      setProfile(p);
      setNotes(n as MedicalNote[]);
      setPrescriptions(rx as Prescription[]);
      setMedications(meds as ActiveMedication[]);
      setDiagnoses(dx as Diagnosis[]);
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

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
        <div>
          <h1 className="text-2xl font-bold">My Medical Record</h1>
          <p className="text-sm text-foreground/50 mt-1">Your health data managed by your care team</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-foreground/5 p-1 rounded-xl overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id
                  ? "bg-white shadow-sm text-foreground"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            {!profile ? (
              <EmptyState icon={User} message="No medical profile on file yet" />
            ) : (
              <>
                <SectionCard title="Basic Information" icon={User}>
                  <dl className="grid grid-cols-2 gap-4">
                    <InfoItem label="Date of Birth" value={profile.date_of_birth ? format(new Date(profile.date_of_birth), "PPP") : "—"} />
                    <InfoItem label="Gender" value={profile.gender ?? "—"} capitalize />
                    <InfoItem label="Blood Type" value={profile.blood_type ?? "—"} />
                    <InfoItem label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : "—"} />
                    <InfoItem label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : "—"} />
                  </dl>
                </SectionCard>

                <SectionCard title="Allergies" icon={AlertCircle}>
                  {profile.allergies.length === 0 ? (
                    <p className="text-sm text-foreground/40">No allergies recorded</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(profile.allergies as string[]).map((a, i) => (
                        <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-200">{a}</span>
                      ))}
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Chronic Conditions" icon={Heart}>
                  {profile.chronic_conditions.length === 0 ? (
                    <p className="text-sm text-foreground/40">No chronic conditions recorded</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(profile.chronic_conditions as string[]).map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">{c}</span>
                      ))}
                    </div>
                  )}
                </SectionCard>

                {Object.keys(profile.emergency_contact).length > 0 && (
                  <SectionCard title="Emergency Contact" icon={Phone}>
                    <dl className="grid grid-cols-2 gap-4">
                      {Object.entries(profile.emergency_contact).map(([k, v]) => (
                        <InfoItem key={k} label={k} value={String(v)} />
                      ))}
                    </dl>
                  </SectionCard>
                )}

                {Object.keys(profile.insurance_info).length > 0 && (
                  <SectionCard title="Insurance" icon={Shield}>
                    <dl className="grid grid-cols-2 gap-4">
                      {Object.entries(profile.insurance_info).map(([k, v]) => (
                        <InfoItem key={k} label={k} value={String(v)} />
                      ))}
                    </dl>
                  </SectionCard>
                )}
              </>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-3">
            {notes.length === 0 ? (
              <EmptyState icon={FileText} message="No notes from your care team yet" />
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-white border border-foreground/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full capitalize">{note.category.replace("_", " ")}</span>
                    <span className="text-xs text-foreground/40">{format(new Date(note.created_at), "PPP")}</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{note.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === "prescriptions" && (
          <div className="space-y-3">
            {prescriptions.length === 0 ? (
              <EmptyState icon={ClipboardList} message="No prescriptions on file" />
            ) : (
              prescriptions.map((rx) => (
                <div key={rx.id} className="bg-white border border-foreground/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{rx.medication_name}</p>
                      <p className="text-xs text-foreground/50">{rx.dosage} · {rx.frequency}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLOR[rx.status] ?? "bg-gray-100 text-gray-600"}`}>{rx.status}</span>
                  </div>
                  {rx.instructions && <p className="text-xs text-foreground/60 italic">{rx.instructions}</p>}
                  <div className="flex items-center gap-4 text-xs text-foreground/40">
                    <span>Issued: {format(new Date(rx.issued_at), "PP")}</span>
                    {rx.expires_at && <span>Expires: {format(new Date(rx.expires_at), "PP")}</span>}
                    {rx.refills_remaining > 0 && <span>Refills: {rx.refills_remaining}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Medications Tab */}
        {activeTab === "medications" && (
          <div className="space-y-3">
            {medications.length === 0 ? (
              <EmptyState icon={Pill} message="No active medications recorded" />
            ) : (
              medications.map((med) => (
                <div key={med.id} className="bg-white border border-foreground/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{med.name}</p>
                      <p className="text-xs text-foreground/50">{med.dosage} · {med.frequency}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLOR[med.status] ?? "bg-gray-100 text-gray-600"}`}>{med.status}</span>
                  </div>
                  {med.notes && <p className="text-xs text-foreground/60">{med.notes}</p>}
                  <p className="text-xs text-foreground/40">Started: {format(new Date(med.started_at), "PP")}{med.ends_at ? ` · Ends: ${format(new Date(med.ends_at), "PP")}` : ""}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Diagnoses Tab */}
        {activeTab === "diagnoses" && (
          <div className="space-y-3">
            {diagnoses.length === 0 ? (
              <EmptyState icon={Stethoscope} message="No diagnoses recorded" />
            ) : (
              diagnoses.map((dx) => (
                <div key={dx.id} className="bg-white border border-foreground/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {dx.icd_code && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">{dx.icd_code}</span>}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLOR[dx.status] ?? "bg-gray-100 text-gray-600"}`}>{dx.status}</span>
                        {dx.severity && <span className={`px-2 py-0.5 text-xs rounded-full ${SEVERITY_COLOR[dx.severity] ?? ""}`}>{dx.severity}</span>}
                      </div>
                      <p className="mt-1.5 text-sm font-medium">{dx.description}</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/40">{format(new Date(dx.diagnosed_at), "PPP")}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.FC<any>; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-foreground/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoItem({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-foreground/40 uppercase tracking-wide">{label}</dt>
      <dd className={`text-sm font-medium mt-0.5 ${capitalize ? "capitalize" : ""}`}>{value}</dd>
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
