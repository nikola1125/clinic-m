"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { formatDateTime } from "@/lib/format";
import { useClinicStore } from "@/store/clinicStore";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function MeetingPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = use(params);
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "doctor" | "patient") ?? "patient";

  const doctors = useClinicStore((s) => s.doctors);
  const patients = useClinicStore((s) => s.patients);
  const appointments = useClinicStore((s) => s.appointments);

  const appt = appointments.find((a) => a.id === appointmentId) ?? null;

  const doctor = useMemo(() => {
    if (!appt) return null;
    return doctors.find((d) => d.id === appt.doctorId) ?? null;
  }, [appt, doctors]);

  const patient = useMemo(() => {
    if (!appt) return null;
    return patients.find((p) => p.id === appt.patientId) ?? null;
  }, [appt, patients]);

  const {
    localStream,
    remoteStream,
    wsConnected,
    sendChatMessage,
    wsMessages,
    mediaError,
    peerJoined,
    connectionState,
  } = useWebRTC(appointmentId, role);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const [text, setText] = useState("");

  const sendText = () => {
    const v = text.trim();
    if (!v) return;
    sendChatMessage(v);
    setText("");
  };

  const sendImage = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error("read error"));
      r.readAsDataURL(file);
    });
    sendChatMessage("", dataUrl);
  };

  const statusBadge = () => {
    if (!wsConnected) return <span className="text-xs text-red-600">● Offline</span>;
    if (!peerJoined) return <span className="text-xs text-amber-600">● Waiting for peer</span>;
    if (connectionState === "connected") return <span className="text-xs text-emerald-600">● Connected</span>;
    if (connectionState === "connecting") return <span className="text-xs text-blue-600">● Connecting…</span>;
    return <span className="text-xs text-zinc-500">● {connectionState}</span>;
  };

  return (
    <AppShell title="Meeting" nav={[]}> 
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
                    {formatDateTime(appt.scheduledAt)} • Role: {role} • {statusBadge()}
                  </div>
                </div>
                <a
                  href={role === "doctor" ? "/portal/appointments" : "/patient/dashboard"}
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Leave
                </a>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {/* Local video */}
                <div className="rounded-2xl border border-zinc-200 bg-black/95 p-3">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="aspect-video w-full rounded-xl bg-black object-cover"
                  />
                  <div className="mt-2 text-xs font-semibold text-white/80">
                    Your camera (local)
                  </div>
                  {mediaError ? (
                    <div className="mt-2 text-xs text-red-200">{mediaError}</div>
                  ) : null}
                </div>

                {/* Remote video */}
                <div className="rounded-2xl border border-zinc-200 bg-black/95 p-3">
                  {remoteStream ? (
                    <>
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="aspect-video w-full rounded-xl bg-black object-cover"
                      />
                      <div className="mt-2 text-xs font-semibold text-white/80">
                        Remote camera
                      </div>
                    </>
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center rounded-xl bg-zinc-900">
                      <div className="text-sm font-semibold text-white/60">
                        {peerJoined ? "Connecting…" : "Waiting for peer to join"}
                      </div>
                      <div className="mt-2 text-xs text-white/40">
                        {wsConnected
                          ? peerJoined
                            ? "Establishing peer connection via WebRTC"
                            : "Share this appointment link with the other party"
                          : "Reconnecting to signaling server…"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Live chat */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Live chat</div>
              <div className="mt-4 h-[420px] overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="grid gap-3">
                  {wsMessages.length === 0 ? (
                    <div className="text-sm text-zinc-600">
                      No messages yet.
                    </div>
                  ) : (
                    wsMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`grid gap-2 ${m.sender === role ? "justify-items-end" : "justify-items-start"}`}
                      >
                        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          {m.sender}
                        </div>
                        {m.message ? (
                          <div className="max-w-[85%] rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800">
                            {m.message}
                          </div>
                        ) : null}
                        {m.image_url ? (
                          <Image
                            src={m.image_url}
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
