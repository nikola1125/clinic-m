"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { api, getToken, API_BASE_URL } from "@/lib/api";

interface ChatMessage {
  id: string;
  appointment_id: string;
  sender: "patient" | "doctor";
  message: string;
  image_url: string | null;
  created_at: string;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  wsConnected: boolean;
  sendChatMessage: (text: string, imageDataUrl?: string) => void;
  wsMessages: ChatMessage[];
  mediaError: string | null;
  peerJoined: boolean;
  connectionState: string;
  sessionId: string | null;
}

function buildWsBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_WS_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const base = API_BASE_URL.replace(/\/$/, "");
  if (base.startsWith("https://")) return "wss://" + base.slice("https://".length);
  if (base.startsWith("http://")) return "ws://" + base.slice("http://".length);
  return base;
}

export function useWebRTC(
  appointmentId: string,
  role: "patient" | "doctor"
): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsMessages, setWsMessages] = useState<ChatMessage[]>([]);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [peerJoined, setPeerJoined] = useState(false);
  const [connectionState, setConnectionState] = useState("new");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescSetRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  const token = role === "doctor" ? getToken("doctor") : getToken("patient");

  useEffect(() => {
    if (!token) return;

    let ws: WebSocket | null = null;
    let localMedia: MediaStream | null = null;
    let iceServers: RTCIceServer[] = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ];
    let isClosed = false;
    let offerInFlight = false;

    const buildPeerConnection = (): RTCPeerConnection => {
      const pc = new RTCPeerConnection({ iceServers });

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0] && !isClosed) {
          setRemoteStream(event.streams[0]);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && ws?.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: event.candidate,
              session_id: sessionIdRef.current,
            })
          );
        }
      };

      pc.onconnectionstatechange = () => {
        if (!isClosed) setConnectionState(pc.connectionState);
      };

      if (localMedia) {
        localMedia.getTracks().forEach((t) => pc.addTrack(t, localMedia!));
      }

      return pc;
    };

    const resetPeerConnection = () => {
      if (pcRef.current) {
        try {
          pcRef.current.close();
        } catch {}
        pcRef.current = null;
      }
      pendingCandidatesRef.current = [];
      remoteDescSetRef.current = false;
      offerInFlight = false;
      if (!isClosed) {
        setRemoteStream(null);
        setConnectionState("new");
      }
      pcRef.current = buildPeerConnection();
    };

    const flushPendingCandidates = async () => {
      const pc = pcRef.current;
      if (!pc) return;
      const pending = pendingCandidatesRef.current;
      pendingCandidatesRef.current = [];
      for (const c of pending) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        } catch (e) {
          console.error("Failed to flush ICE candidate:", e);
        }
      }
    };

    const maybeCreateOffer = async () => {
      if (role !== "patient") return;
      const pc = pcRef.current;
      if (!pc || offerInFlight) return;
      if (pc.signalingState !== "stable") return;
      if (!sessionIdRef.current) return;
      offerInFlight = true;
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ws?.send(
          JSON.stringify({
            type: "offer",
            sdp: offer,
            session_id: sessionIdRef.current,
          })
        );
      } catch (e) {
        console.error("Failed to create offer:", e);
      } finally {
        offerInFlight = false;
      }
    };

    const run = async () => {
      try {
        localMedia = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (!isClosed) setLocalStream(localMedia);
      } catch {
        if (!isClosed) setMediaError("Camera/mic permission denied or unavailable.");
      }

      try {
        api.setRole(role);
        const turnCreds = await api.getTurnCredentials();
        iceServers = [
          ...iceServers,
          {
            urls: turnCreds.uris,
            username: turnCreds.username,
            credential: turnCreds.password,
          },
        ];
      } catch (e) {
        console.error("Failed to fetch TURN credentials, continuing with STUN only:", e);
      }

      if (isClosed) return;

      pcRef.current = buildPeerConnection();

      const wsBase = buildWsBaseUrl();
      const wsUrl = `${wsBase}/ws/meet/${appointmentId}?token=${encodeURIComponent(token)}`;
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isClosed) setWsConnected(true);
      };

      ws.onclose = () => {
        if (!isClosed) {
          setWsConnected(false);
          setPeerJoined(false);
          setSessionId(null);
          sessionIdRef.current = null;
        }
      };

      ws.onerror = (e) => {
        console.error("Signaling WebSocket error:", e);
      };

      ws.onmessage = async (event) => {
        if (isClosed) return;
        let msg: any;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }

        if (msg.type === "peer-joined") {
          setPeerJoined(true);
          // Offer creation waits for `session-ready` so both peers agree on
          // which session they're in before SDP/ICE starts flowing.
        } else if (msg.type === "peer-left") {
          setPeerJoined(false);
          setSessionId(null);
          sessionIdRef.current = null;
          resetPeerConnection();
        } else if (msg.type === "session-ready") {
          // Fresh call session: reset any residual pc state from a prior call.
          sessionIdRef.current = msg.session_id;
          setSessionId(msg.session_id);
          resetPeerConnection();
          await maybeCreateOffer();
        } else if (msg.type === "session-ended") {
          sessionIdRef.current = null;
          setSessionId(null);
          resetPeerConnection();
        } else if (msg.type === "session-evicted") {
          console.warn("This connection was replaced by a newer session.");
        } else if (msg.type === "offer") {
          if (role !== "doctor") return;
          // Reject SDP from a stale session
          if (msg.session_id && msg.session_id !== sessionIdRef.current) return;
          const pc = pcRef.current;
          if (!pc) return;
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            remoteDescSetRef.current = true;
            await flushPendingCandidates();

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws?.send(
              JSON.stringify({
                type: "answer",
                sdp: answer,
                session_id: sessionIdRef.current,
              })
            );
          } catch (e) {
            console.error("Failed to handle offer:", e);
          }
        } else if (msg.type === "answer") {
          if (role !== "patient") return;
          if (msg.session_id && msg.session_id !== sessionIdRef.current) return;
          const pc = pcRef.current;
          if (!pc) return;
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            remoteDescSetRef.current = true;
            await flushPendingCandidates();
          } catch (e) {
            console.error("Failed to handle answer:", e);
          }
        } else if (msg.type === "ice-candidate") {
          if (msg.session_id && msg.session_id !== sessionIdRef.current) return;
          const pc = pcRef.current;
          if (!pc) return;
          if (!remoteDescSetRef.current) {
            pendingCandidatesRef.current.push(msg.candidate);
          } else {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } catch (e) {
              console.error("Failed to add ICE candidate:", e);
            }
          }
        } else if (msg.type === "chat") {
          setWsMessages((prev) => [...prev, msg.message]);
        }
      };
    };

    run();

    return () => {
      isClosed = true;
      remoteDescSetRef.current = false;
      pendingCandidatesRef.current = [];
      sessionIdRef.current = null;
      try { ws?.close(); } catch {}
      try { pcRef.current?.close(); } catch {}
      pcRef.current = null;
      localMedia?.getTracks().forEach((t) => t.stop());
    };
  }, [appointmentId, role, token]);

  const sendChatMessage = useCallback(
    (text: string, imageDataUrl?: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "chat",
            text,
            imageUrl: imageDataUrl || null,
          })
        );
      }
    },
    []
  );

  return {
    localStream,
    remoteStream,
    wsConnected,
    sendChatMessage,
    wsMessages,
    mediaError,
    peerJoined,
    connectionState,
    sessionId,
  };
}
