"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AutoSeed } from "@/components/RequireRole";
import { formatDateTime } from "@/lib/format";
import { useClinicStore } from "@/store/clinicStore";

export default function MeetingPage({
  params,
}: {
  params: { appointmentId: string };
}) {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "doctor" | "patient") ?? "patient";

  const doctors = useClinicStore((s) => s.doctors);
  const patients = useClinicStore((s) => s.patients);
  const appointments = useClinicStore((s) => s.appointments);
  const chat = useClinicStore((s) => s.chat);
  const addChatMessage = useClinicStore((s) => s.addChatMessage);

  const appt = appointments.find((a) => a.id === params.appointmentId) ?? null;

  const doctor = useMemo(() => {
    if (!appt) return null;
    return doctors.find((d) => d.id === appt.doctorId) ?? null;
  }, [appt, doctors]);

  const patient = useMemo(() => {
    if (!appt) return null;
    return patients.find((p) => p.id === appt.patientId) ?? null;
  }, [appt, patients]);

  const messages = chat
    .filter((m) => m.appointmentId === params.appointmentId)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  const [text, setText] = useState("");

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const run = async () => {
      setMediaError(null);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch {
        setMediaError("Camera/mic permission denied (or unavailable).");
      }
    };

    run();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const sendText = () => {
    const v = text.trim();
    if (!v) return;
    addChatMessage({
      appointmentId: params.appointmentId,
      sender: role,
      text: v,
    });
    setText("");
  };

  const sendImage = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error("read error"));
      r.readAsDataURL(file);
    });

    addChatMessage({
      appointmentId: params.appointmentId,
      sender: role,
      imageDataUrl: dataUrl,
    });
  };

  return (
    <AppShell title="Meeting" nav={[]}> 
      <AutoSeed />
      <div className="mx-auto w-full max-w-6xl">
        {!appt ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-8">
            <div className="text-base font-semibold text-zinc-900">
              Meeting not found
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-zinc-500">Meeting</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-900">
                    {doctor ? doctor.name : "Doctor"} ↔ {patient ? patient.fullName : "Patient"}
                  </div>
                  <div className="mt-1 text-sm text-zinc-600">
                    {formatDateTime(appt.scheduledAt)} • Role: {role}
                  </div>
                </div>
                <a
                  href={role === "doctor" ? "/doctor/appointments" : "/book"}
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Leave
                </a>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-black/95 p-3">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="aspect-video w-full rounded-xl bg-black object-cover"
                  />
                  <div className="mt-2 text-xs font-semibold text-white/80">
                    Your camera (local preview)
                  </div>
                  {mediaError ? (
                    <div className="mt-2 text-xs text-red-200">{mediaError}</div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    Remote video
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">
                    This MVP includes the full UI and local preview. For real
                    doctor↔patient video you’ll plug in a signaling server (or a
                    provider like LiveKit/Twilio) to connect peers.
                  </div>
                  <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
                    Placeholder
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Live chat</div>
              <div className="mt-4 h-[420px] overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="grid gap-3">
                  {messages.length === 0 ? (
                    <div className="text-sm text-zinc-600">
                      No messages yet.
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`grid gap-2 ${m.sender === role ? "justify-items-end" : "justify-items-start"}`}
                      >
                        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          {m.sender}
                        </div>
                        {m.text ? (
                          <div className="max-w-[85%] rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800">
                            {m.text}
                          </div>
                        ) : null}
                        {m.imageDataUrl ? (
                          <Image
                            src={m.imageDataUrl}
                            alt="uploaded"
                            width={640}
                            height={640}
                            className="h-auto w-auto max-w-[85%] rounded-2xl border border-zinc-200 bg-white"
                          />
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendText();
                    }}
                    className="h-10 flex-1 rounded-xl border border-zinc-200 px-3 text-sm"
                    placeholder="Type a message"
                  />
                  <button
                    onClick={sendText}
                    className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    Send
                  </button>
                </div>

                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-zinc-700">
                    Upload image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void sendImage(f);
                      e.currentTarget.value = "";
                    }}
                    className="block w-full text-sm"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
