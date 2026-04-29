"use client";

import { useEffect, useState } from "react";
import { useClinicStore } from "@/store/clinicStore";
import { api, getToken, clearToken, type RoleKey } from "@/lib/api";

/**
 * Verifies each role's token independently.
 * If a role has a stored token, validate it via /auth/me.
 * If invalid, clear that role's token & session without affecting other roles.
 */
function SessionSync() {
  const setSession = useClinicStore((s) => s.setSession);
  const logout = useClinicStore((s) => s.logout);
  const adminSession = useClinicStore((s) => s.adminSession);
  const doctorSession = useClinicStore((s) => s.doctorSession);
  const patientSession = useClinicStore((s) => s.patientSession);

  useEffect(() => {
    const verifyRole = async (role: RoleKey) => {
      const token = getToken(role);
      if (!token) return; // no token for this role — nothing to verify

      api.setRole(role);
      try {
        const user = await api.getMe();
        // Re-populate session from server (ensures consistency)
        if (role === "admin" && user.role === "admin") {
          setSession({ role: "admin" });
        } else if (role === "doctor" && user.role === "doctor") {
          setSession({ role: "doctor", doctorId: user.doctor_id || user.id });
        } else if (role === "patient" && user.role === "patient") {
          setSession({ role: "patient", patientId: user.patient_id || user.id });
        } else {
          // Token role mismatch — clear this role
          logout(role);
        }
      } catch (err: any) {
        console.warn(`Session verify failed for ${role}:`, err.message);
        logout(role);
      }
    };

    // Verify all roles that have a stored token
    if (getToken("admin") || adminSession) verifyRole("admin");
    if (getToken("doctor") || doctorSession) verifyRole("doctor");
    if (getToken("patient") || patientSession) verifyRole("patient");
  }, []); // Run once on mount

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
