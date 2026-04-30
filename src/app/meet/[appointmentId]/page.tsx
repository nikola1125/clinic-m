"use client";

import { use, useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { formatDateTime } from "@/lib/format";
import { api, getToken, type MeetContextResponse } from "@/lib/api";
import { useWebRTC } from "@/hooks/useWebRTC";
import type { AppointmentStatus } from "@/store/clinicStore";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  X, Send, Paperclip, Users,
} from "lucide-react";

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

  const localVideoRef  = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatEndRef     = useRef<HTMLDivElement | null>(null);

  const [text, setText]         = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [micOn, setMicOn]       = useState(true);
  const [camOn, setCamOn]       = useState(true);

  /* ── wire streams to video elements ── */
  useEffect(() => {
    if (localVideoRef.current && localStream)
      localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream)
      remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  /* ── auto-scroll chat ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [wsMessages]);

  /* ── mic / cam toggles via track enabled flag ── */
  useEffect(() => {
    localStream?.getAudioTracks().forEach(t => { t.enabled = micOn; });
  }, [micOn, localStream]);

  useEffect(() => {
    localStream?.getVideoTracks().forEach(t => { t.enabled = camOn; });
  }, [camOn, localStream]);

  const sendText = useCallback(() => {
    const v = text.trim();
    if (!v) return;
    sendChatMessage(v);
    setText("");
  }, [text, sendChatMessage]);

  const sendImage = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload  = () => resolve(String(r.result));
      r.onerror = () => reject(new Error("read error"));
      r.readAsDataURL(file);
    });
    sendChatMessage("", dataUrl);
  };

  const remoteName = meetRole === "doctor" ? patientName : doctorName;

  const connLabel = signalingError
    ? { text: signalingError,         dot: "bg-red-500" }
    : !wsConnected
    ? { text: "Reconnecting…",        dot: "bg-red-500 animate-pulse" }
    : !peerJoined
    ? { text: "Waiting for other side", dot: "bg-amber-400 animate-pulse" }
    : connectionState === "connected"
    ? { text: "Connected",            dot: "bg-emerald-400" }
    : { text: connectionState,        dot: "bg-blue-400 animate-pulse" };

  const leaveHref = meetRole === "doctor" ? "/portal/appointments" : "/patient/dashboard";

  return (
    /* ── full-viewport dark canvas ── */
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 overflow-hidden">

      {/* ── top bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 backdrop-blur-sm shrink-0 gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white/80 shrink-0">
            <span className={`h-2 w-2 rounded-full ${connLabel.dot}`} />
            <span className="hidden xs:inline">{connLabel.text}</span>
          </div>
          <span className="hidden sm:inline text-white/20">·</span>
          <span className="hidden sm:inline text-xs text-white/50 truncate">{formatDateTime(scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50 min-w-0">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[160px] sm:max-w-none">{doctorName} &amp; {patientName}</span>
        </div>
      </div>

      {/* ── main area: remote video + pip ── */}
      <div className="relative flex-1 overflow-hidden">

        {/* Remote — full area */}
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <div className="h-24 w-24 rounded-full bg-zinc-700 flex items-center justify-center text-4xl font-bold text-white/40">
              {remoteName.charAt(0).toUpperCase()}
            </div>
            <div className="text-base font-semibold text-white/60">{remoteName}</div>
            <div className="text-sm text-white/30">
              {peerJoined ? "Establishing connection…" : "Waiting to join…"}
            </div>
          </div>
        )}

        {/* Remote name label */}
        {remoteStream && (
          <div className="absolute bottom-[88px] sm:bottom-[96px] left-3 sm:left-4 rounded-xl bg-black/50 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            {remoteName}
          </div>
        )}

        {/* ── PiP: local camera (mirrored so face looks natural) ── */}
        <div className="absolute bottom-[88px] sm:bottom-[96px] right-3 sm:right-4 w-[120px] sm:w-[160px] lg:w-[200px] overflow-hidden rounded-xl sm:rounded-2xl border-2 border-white/20 shadow-2xl bg-zinc-900">
          {camOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-2xl object-cover aspect-video"
              style={{ transform: "scaleX(-1)" }}
            />
          ) : (
            <div className="aspect-video flex items-center justify-center bg-zinc-800 rounded-2xl">
              <VideoOff className="h-6 w-6 text-white/40" />
            </div>
          )}
          <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white/70">You</div>
        </div>

        {/* media error */}
        {mediaError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-xl bg-red-900/80 px-4 py-2 text-xs font-semibold text-red-200 backdrop-blur-sm">
            {mediaError}
          </div>
        )}

        {/* ── chat slide-in panel ── */}
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[320px] bg-zinc-900/95 backdrop-blur-md flex flex-col transition-transform duration-300 ease-in-out ${chatOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <span className="text-sm font-bold text-white">Chat</span>
            <button onClick={() => setChatOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {wsMessages.length === 0 ? (
              <p className="text-xs text-white/30 text-center mt-8">No messages yet</p>
            ) : wsMessages.map((m) => {
              const isMine = m.sender === meetRole;
              return (
                <div key={m.id} className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                    {isMine ? "You" : remoteName}
                  </span>
                  {m.message && (
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isMine ? "bg-primary text-white" : "bg-zinc-700 text-white/90"}`}>
                      {m.message}
                    </div>
                  )}
                  {m.image_url && (
                    <Image src={m.image_url} alt="img" width={240} height={240}
                      className="max-w-[85%] rounded-2xl border border-white/10" />
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* input */}
          <div className="shrink-0 border-t border-white/10 p-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendText(); }}
                placeholder="Message…"
                className="flex-1 rounded-xl bg-zinc-800 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={sendText}
                className="rounded-xl bg-primary px-3 py-2 text-white hover:bg-primary/90 transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-white/40 hover:text-white/70 transition-colors">
              <Paperclip className="h-3.5 w-3.5" />
              <span>Send image</span>
              <input type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) void sendImage(f); e.currentTarget.value = ""; }} />
            </label>
          </div>
        </div>
      </div>

      {/* ── controls bar ── */}
      <div className="shrink-0 flex items-center justify-center gap-3 sm:gap-5 py-3 sm:py-4 bg-zinc-900/80 backdrop-blur-sm">

        {/* Mic */}
        <button onClick={() => setMicOn(v => !v)}
          className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all active:scale-95 ${micOn ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}
          title={micOn ? "Mute mic" : "Unmute mic"}>
          {micOn ? <Mic className="h-5 w-5 sm:h-6 sm:w-6" /> : <MicOff className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>

        {/* Camera */}
        <button onClick={() => setCamOn(v => !v)}
          className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all active:scale-95 ${camOn ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}
          title={camOn ? "Turn off camera" : "Turn on camera"}>
          {camOn ? <Video className="h-5 w-5 sm:h-6 sm:w-6" /> : <VideoOff className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>

        {/* Leave */}
        <a href={leaveHref}
          className="flex h-12 w-14 sm:h-14 sm:w-16 items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white transition-all active:scale-95 shadow-lg"
          title="Leave call">
          <PhoneOff className="h-5 w-5 sm:h-6 sm:w-6" />
        </a>

        {/* Chat toggle */}
        <button onClick={() => setChatOpen(v => !v)}
          className={`relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all active:scale-95 ${chatOpen ? "bg-primary text-white" : "bg-zinc-700 hover:bg-zinc-600 text-white"}`}
          title="Toggle chat">
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
          {wsMessages.length > 0 && !chatOpen && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
              {wsMessages.length > 9 ? "9+" : wsMessages.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
