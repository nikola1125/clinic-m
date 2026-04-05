"use client";

import { useEffect, useState } from "react";
import { useClinicStore } from "@/store/clinicStore";
import { api } from "@/lib/api";

function SessionSync() {
  const setSession = useClinicStore((s: any) => s.setSession);
  const session = useClinicStore((s: any) => s.session);

  useEffect(() => {
    const syncSession = async () => {
      const token = sessionStorage.getItem("access_token");
      
      if (session && !token) {
        setSession(null);
        return;
      }

      if (!token) {
        setSession(null);
        return;
      }

      try {
        const user = await api.getMe();
        let storeSession: any = { role: user.role };
        if (user.role === "doctor") {
          storeSession.doctorId = user.doctor_id || user.id;
        } else if (user.role === "patient") {
          storeSession.patientId = user.patient_id || user.id;
        }
        setSession(storeSession);
      } catch (err: any) {
        console.error("Failed to sync session:", err);
        if (err.message?.includes("401")) {
          console.warn("Session invalid, auto-logging out");
          sessionStorage.removeItem("access_token");
          setSession(null);
        }
      }
    };

    syncSession();
  }, [setSession]);

  return null;
}

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}</>;

  return (
    <>
      <SessionSync />
      {children}
    </>
  );
}
