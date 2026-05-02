"use client";

import { use, useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { formatDateTime } from "@/lib/format";
import { api, getToken, type MeetContextResponse, type MeetingRecord } from "@/lib/api";
import { useWebRTC } from "@/hooks/useWebRTC";
import type { AppointmentStatus } from "@/store/clinicStore";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  X, Send, Paperclip, Users, Clock, Loader2,
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
  const [meeting, setMeeting] = useState<MeetingRecord | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    void (async () => {
      try {
        const data = await loadMeetContext(appointmentId);
        if (!cancelled) {
          setCtx(data);
          setMeeting(data.meeting ?? null);
          // Record join immediately
          try {
            const m = await api.joinMeeting(appointmentId);
            if (!cancelled) setMeeting(m);
          } catch (_) { /* non-fatal */ }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Could not load meeting context.";
        if (!cancelled) setLoadError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [appointmentId]);

  const handleLeave = useCallback(async () => {
    try { await api.endMeeting(appointmentId); } catch (_) { /* non-fatal */ }
  }, [appointmentId]);

  return (
    <AppShell title="Meeting" nav={[]}>
      <div className="mx-auto w-full max-w-6xl">
        {loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
            <div className="text-sm text-zinc-600">Loading meeting…</div>
          </div>
        ) : loadError ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-8">
            <div className="text-base font-semibold text-zinc-900">Cannot open meeting</div>
            <p className="mt-2 text-sm text-zinc-600">{loadError}</p>
            <p className="mt-4 text-sm text-zinc-500">
              Sign in as the doctor or the patient who booked this appointment, then open the link again.
              The site picks the correct role from your account — you do not need{" "}
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
            meetingStatus={meeting?.status ?? "waiting"}
            onLeave={handleLeave}
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
  meetingStatus,
  onLeave,
}: {
  appointmentId: string;
  meetRole: "doctor" | "patient";
  doctorName: string;
  patientName: string;
  scheduledAt: string;
  appointment: ReturnType<typeof mapMeetAppointment>;
  meetingStatus: "waiting" | "active" | "ended";
  onLeave: () => Promise<void>;
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

  const handleLeaveClick = async () => {
    await onLeave();
    window.location.href = leaveHref;
  };

  /* shared chat panel content — reused on both mobile overlay and desktop sidebar */
  const ChatPanel = () => (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <span className="text-sm font-bold text-white">Chat</span>
        <button onClick={() => setChatOpen(false)} className="p-1 text-white/40 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {wsMessages.length === 0 ? (
          <p className="text-xs text-white/30 text-center mt-10">No messages yet</p>
        ) : wsMessages.map((m) => {
          const isMine = m.sender === meetRole;
          return (
            <div key={m.id} className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                {isMine ? "You" : remoteName}
              </span>
              {m.message && (
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${isMine ? "bg-primary text-white" : "bg-zinc-700 text-white/90"}`}>
                  {m.message}
                </div>
              )}
              {m.image_url && (
                <Image src={m.image_url} alt="img" width={240} height={240}
                  className="max-w-[80%] rounded-2xl border border-white/10" />
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
      <div className="shrink-0 border-t border-white/10 p-3 space-y-2">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") sendText(); }}
            placeholder="Message…"
            className="flex-1 rounded-xl bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={sendText}
            className="rounded-xl bg-primary px-3 py-2 text-white hover:bg-primary/90 active:scale-95 transition-all">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-white/40 hover:text-white/60 transition-colors">
          <Paperclip className="h-3.5 w-3.5" />
          <span>Attach image</span>
          <input type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) void sendImage(f); e.currentTarget.value = ""; }} />
        </label>
      </div>
    </>
  );

  return (
    /* ── full-viewport call canvas ── */
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950" style={{ height: "100dvh" }}>

      {/* ── top status bar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full shrink-0 ${connLabel.dot}`} />
          <span className="text-xs font-semibold text-white/70 truncate max-w-[140px] sm:max-w-xs">{connLabel.text}</span>
        </div>
        <span className="text-xs text-white/40 truncate max-w-[160px] sm:max-w-none">
          {doctorName} &amp; {patientName}
        </span>
      </div>

      {/* ── video area ── */}
      <div className="relative flex-1 min-h-0 bg-zinc-950">

        {/* Waiting room overlay */}
        {meetingStatus === "waiting" && !peerJoined && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-zinc-950/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-zinc-900 border border-white/10 max-w-sm w-full mx-4">
              <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Clock className="h-8 w-8 text-amber-400 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">Waiting Room</p>
                <p className="text-sm text-white/50 mt-1">
                  {meetRole === "doctor"
                    ? `Waiting for ${patientName} to join…`
                    : `Waiting for ${doctorName} to join…`}
                </p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Remote — fills entire area */}
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline
            className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-zinc-700 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white/40">
              {remoteName.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm sm:text-base font-semibold text-white/60">{remoteName}</p>
            <p className="text-xs text-white/30">
              {peerJoined ? "Establishing connection…" : "Waiting to join…"}
            </p>
          </div>
        )}

        {/* media error toast */}
        {mediaError && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-xl bg-red-900/90 px-4 py-2 text-xs font-semibold text-red-200 backdrop-blur-sm whitespace-nowrap">
            {mediaError}
          </div>
        )}

        {/* remote name label */}
        {remoteStream && (
          <div className="absolute bottom-3 left-3 z-10 rounded-xl bg-black/50 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            {remoteName}
          </div>
        )}

        {/* PiP — local (mirrored) */}
        <div className="absolute bottom-3 right-3 z-10 w-[100px] sm:w-[140px] lg:w-[180px] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-zinc-900">
          {camOn ? (
            <video ref={localVideoRef} autoPlay playsInline muted
              className="w-full aspect-video object-cover"
              style={{ transform: "scaleX(-1)" }} />
          ) : (
            <div className="aspect-video flex items-center justify-center bg-zinc-800">
              <VideoOff className="h-5 w-5 text-white/30" />
            </div>
          )}
          <div className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white/60">You</div>
        </div>

        {/* ── Desktop chat sidebar (sm+) ── */}
        <div className={`hidden sm:flex absolute top-0 right-0 h-full w-[300px] lg:w-[320px] flex-col bg-zinc-900/95 backdrop-blur-md border-l border-white/10 transition-transform duration-300 ${chatOpen ? "translate-x-0" : "translate-x-full"}`}>
          <ChatPanel />
        </div>
      </div>

      {/* ── Mobile chat overlay (below sm) — conditionally rendered, full-screen ── */}
      {chatOpen && (
        <div className="sm:hidden fixed inset-0 z-60 flex flex-col bg-zinc-950">
          <ChatPanel />
        </div>
      )}

      {/* ── controls bar ── */}
      <div className="shrink-0 flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4 bg-zinc-900/90 backdrop-blur-sm">
        <button onClick={() => setMicOn(v => !v)} title={micOn ? "Mute" : "Unmute"}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-90 ${micOn ? "bg-zinc-700 text-white" : "bg-red-600 text-white"}`}>
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>

        <button onClick={() => setCamOn(v => !v)} title={camOn ? "Camera off" : "Camera on"}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-90 ${camOn ? "bg-zinc-700 text-white" : "bg-red-600 text-white"}`}>
          {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>

        <button onClick={handleLeaveClick} title="Leave call"
          className="flex h-12 w-14 items-center justify-center rounded-full bg-red-600 text-white active:scale-90 transition-all shadow-lg">
          <PhoneOff className="h-5 w-5" />
        </button>

        <button onClick={() => setChatOpen(v => !v)} title="Chat"
          className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-90 ${chatOpen ? "bg-primary text-white" : "bg-zinc-700 text-white"}`}>
          <MessageSquare className="h-5 w-5" />
          {wsMessages.length > 0 && !chatOpen && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
              {wsMessages.length > 9 ? "9+" : wsMessages.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
