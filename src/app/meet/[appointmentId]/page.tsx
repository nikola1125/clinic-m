"use client";

import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { formatDateTime } from "@/lib/format";
import { api, getToken, type MeetContextResponse } from "@/lib/api";
import { useWebRTC } from "@/hooks/useWebRTC";
import type { AppointmentStatus } from "@/store/clinicStore";

function mapMeetAppointment(a: MeetContextResponse["appointment"]) {
  return {
    id: a.id,
    doctorId: a.doctor_id,
    patientId: a.patient_id,
    consultId: a.consult_id,
    scheduledAt: a.scheduled_at,
    status: a.status as AppointmentStatus,
    price: a.price_cents / 100,
  };
}

/** Try doctor JWT then patient JWT until one is authorized for this appointment. */
async function loadMeetContext(
  appointmentId: string
): Promise<MeetContextResponse> {
  let lastErr: Error | null = null;
  for (const role of ["doctor", "patient"] as const) {
    const token = getToken(role);
    if (!token) continue;
    api.setRole(role);
    try {
      return await api.getMeetContext(appointmentId);
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastErr ?? new Error("Not signed in");
}

export default function MeetingPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = use(params);
  const [ctx, setCtx] = useState<MeetContextResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    void (async () => {
      try {
        const data = await loadMeetContext(appointmentId);
        if (!cancelled) setCtx(data);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Could not load meeting context.";
        if (!cancelled) setLoadError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  return (
    <AppShell title="Meeting" nav={[]}>
      <div className="mx-auto w-full max-w-6xl">
        {loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-8">
            <div className="text-sm text-zinc-600">Loading meeting…</div>
          </div>
        ) : loadError ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-8">
            <div className="text-base font-semibold text-zinc-900">
              Cannot open meeting
            </div>
            <p className="mt-2 text-sm text-zinc-600">{loadError}</p>
            <p className="mt-4 text-sm text-zinc-500">
              Sign in as the doctor or the patient who booked this appointment,
              then open the link again. The site picks the correct role from your
              account — you do not need{" "}
              <code className="rounded bg-zinc-100 px-1">?role=</code> in the URL.
            </p>
          </div>
        ) : ctx ? (
          <MeetingSession
            appointmentId={appointmentId}
            meetRole={ctx.role}
            doctorName={ctx.doctor_name}
            patientName={ctx.patient_full_name}
            scheduledAt={ctx.appointment.scheduled_at}
            appointment={mapMeetAppointment(ctx.appointment)}
          />
        ) : null}
      </div>
    </AppShell>
  );
}

function MeetingSession({
  appointmentId,
  meetRole,
  doctorName,
  patientName,
  scheduledAt,
  appointment,
}: {
  appointmentId: string;
  meetRole: "doctor" | "patient";
  doctorName: string;
  patientName: string;
  scheduledAt: string;
  appointment: ReturnType<typeof mapMeetAppointment>;
}) {
  const {
    localStream,
    remoteStream,
    wsConnected,
    sendChatMessage,
    wsMessages,
    mediaError,
    peerJoined,
    connectionState,
    signalingError,
  } = useWebRTC(appointmentId, meetRole);

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
    if (signalingError)
      return <span className="text-xs text-red-600">● {signalingError}</span>;
    if (!wsConnected) return <span className="text-xs text-red-600">● Offline</span>;
    if (!peerJoined) return <span className="text-xs text-amber-600">● Waiting for peer</span>;
    if (connectionState === "connected") return <span className="text-xs text-emerald-600">● Connected</span>;
    if (connectionState === "connecting") return <span className="text-xs text-blue-600">● Connecting…</span>;
    return <span className="text-xs text-zinc-500">● {connectionState}</span>;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-zinc-500">Meeting</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {doctorName} ↔ {patientName}
            </div>
            <div className="mt-1 text-sm text-zinc-600">
              {formatDateTime(scheduledAt)} • Role: {meetRole} • {statusBadge()}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Appointment {appointment.status} · ensure both sides use the same link{" "}
              <span className="font-mono text-[11px]">{appointmentId.slice(0, 8)}…</span>
            </div>
          </div>
          <a
            href={meetRole === "doctor" ? "/portal/appointments" : "/patient/dashboard"}
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
              Your camera (local)
            </div>
            {mediaError ? (
              <div className="mt-2 text-xs text-red-200">{mediaError}</div>
            ) : null}
          </div>

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
                  {signalingError
                    ? signalingError
                    : wsConnected
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

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="text-sm font-semibold text-zinc-900">Live chat</div>
        <div className="mt-4 h-[420px] overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="grid gap-3">
            {wsMessages.length === 0 ? (
              <div className="text-sm text-zinc-600">No messages yet.</div>
            ) : (
              wsMessages.map((m) => (
                <div
                  key={m.id}
                  className={`grid gap-2 ${m.sender === meetRole ? "justify-items-end" : "justify-items-start"}`}
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
  );
}
