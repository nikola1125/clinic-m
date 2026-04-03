"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";

export default function DoctorPatientDetailsPage({
  params,
}: {
  params: { patientId: string };
}) {
  const session = useClinicStore((s) => s.session);
  const patients = useClinicStore((s) => s.patients);
  const addPatientEntry = useClinicStore((s) => s.addPatientEntry);

  const doctorId = session?.role === "doctor" ? session.doctorId : null;

  const patient = useMemo(() => {
    const p = patients.find((x) => x.id === params.patientId) ?? null;
    if (!p) return null;
    if (p.doctorId !== doctorId) return null;
    return p;
  }, [patients, params.patientId, doctorId]);

  const [note, setNote] = useState("");
  const [medicine, setMedicine] = useState("");
  const [prescription, setPrescription] = useState("");

  const add = (kind: "notes" | "medicines" | "prescriptions", value: string) => {
    if (!patient) return;
    const v = value.trim();
    if (!v) return;
    addPatientEntry(patient.id, kind, v);
  };

  return (
    <AppShell
      title="Doctor"
      nav={[
        { label: "Dashboard", href: "/doctor" },
        { label: "Appointments", href: "/doctor/appointments" },
        { label: "Patients", href: "/doctor/patients" },
      ]}
    >
      <AutoSeed />
      <RequireRole role="doctor">
        {!patient ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-8">
            <div className="text-base font-semibold text-zinc-900">
              Patient not found
            </div>
            <div className="mt-4">
              <Link
                href="/doctor/patients"
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Back
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
              <div className="text-2xl font-semibold tracking-tight text-zinc-900">
                {patient.fullName}
              </div>
              <div className="mt-1 text-sm text-zinc-600">{patient.email}</div>
              {patient.phone ? (
                <div className="mt-1 text-sm text-zinc-600">{patient.phone}</div>
              ) : null}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="text-sm font-semibold text-zinc-900">Notes</div>
                <div className="mt-3 grid gap-2">
                  {patient.notes.length === 0 ? (
                    <div className="text-sm text-zinc-600">No notes yet.</div>
                  ) : (
                    patient.notes.map((n, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800"
                      >
                        {n}
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 grid gap-2">
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 px-3 text-sm"
                    placeholder="Add note"
                  />
                  <button
                    onClick={() => {
                      add("notes", note);
                      setNote("");
                    }}
                    className="h-10 rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    Add note
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="text-sm font-semibold text-zinc-900">Medicines</div>
                <div className="mt-3 grid gap-2">
                  {patient.medicines.length === 0 ? (
                    <div className="text-sm text-zinc-600">No medicines yet.</div>
                  ) : (
                    patient.medicines.map((n, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800"
                      >
                        {n}
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 grid gap-2">
                  <input
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 px-3 text-sm"
                    placeholder="Add medicine"
                  />
                  <button
                    onClick={() => {
                      add("medicines", medicine);
                      setMedicine("");
                    }}
                    className="h-10 rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    Add medicine
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="text-sm font-semibold text-zinc-900">
                  Prescriptions
                </div>
                <div className="mt-3 grid gap-2">
                  {patient.prescriptions.length === 0 ? (
                    <div className="text-sm text-zinc-600">No prescriptions yet.</div>
                  ) : (
                    patient.prescriptions.map((n, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800"
                      >
                        {n}
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 grid gap-2">
                  <input
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 px-3 text-sm"
                    placeholder="Add prescription"
                  />
                  <button
                    onClick={() => {
                      add("prescriptions", prescription);
                      setPrescription("");
                    }}
                    className="h-10 rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    Add prescription
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </RequireRole>
    </AppShell>
  );
}
