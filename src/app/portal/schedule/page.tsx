"use client";

import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { api, type AvailabilitySlot } from "@/lib/api";
import { Clock, Save, ToggleLeft, ToggleRight, CalendarClock, CheckCircle2 } from "lucide-react";

const PORTAL_NAV = [
  { label: "Dashboard", href: "/portal" },
  { label: "Appointments", href: "/portal/appointments" },
  { label: "Patients", href: "/portal/patients" },
  { label: "Schedule", href: "/portal/schedule" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type SlotRow = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_min: number;
  is_active: boolean;
};

const DEFAULT_SLOTS: SlotRow[] = DAYS.map((_, i) => ({
  day_of_week: i,
  start_time: "09:00",
  end_time: "17:00",
  slot_duration_min: 30,
  is_active: i < 5, // Mon-Fri active by default
}));

export default function DoctorSchedulePage() {
  const [slots, setSlots] = useState<SlotRow[]>(DEFAULT_SLOTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSlots = useCallback(async () => {
    try {
      api.setRole("doctor");
      const data: AvailabilitySlot[] = await api.getAvailability();
      if (data && data.length > 0) {
        const merged = DEFAULT_SLOTS.map((def) => {
          const remote = data.find((s) => s.day_of_week === def.day_of_week);
          return remote
            ? {
                day_of_week: remote.day_of_week,
                start_time: remote.start_time.slice(0, 5),
                end_time: remote.end_time.slice(0, 5),
                slot_duration_min: remote.slot_duration_min,
                is_active: remote.is_active,
              }
            : def;
        });
        setSlots(merged);
      }
    } catch {
      /* use defaults */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const update = (dayIdx: number, field: keyof SlotRow, value: string | number | boolean) => {
    setSlots((prev) =>
      prev.map((s) => (s.day_of_week === dayIdx ? { ...s, [field]: value } : s))
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      api.setRole("doctor");
      await api.upsertAvailability(slots);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save availability", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Doctor Portal" nav={PORTAL_NAV}>
      <RequireRole role="doctor">
        <DataLoader role="doctor" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                Weekly Availability
              </div>
              <div className="text-sm text-foreground/60">
                Set the hours patients can book with you.
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-105 active:scale-100 disabled:opacity-50 shrink-0"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Schedule"}
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          </div>
        ) : (
          <div className="grid gap-3">
            {slots.map((slot) => (
              <div
                key={slot.day_of_week}
                className={`rounded-2xl border bg-white p-5 transition-all ${
                  slot.is_active
                    ? "border-primary/20 shadow-sm"
                    : "border-foreground/5 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Day name + toggle */}
                  <div className="flex items-center gap-3 w-full sm:w-36">
                    <button
                      onClick={() => update(slot.day_of_week, "is_active", !slot.is_active)}
                      className="shrink-0"
                    >
                      {slot.is_active ? (
                        <ToggleRight className="h-7 w-7 text-primary" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-foreground/30" />
                      )}
                    </button>
                    <span className="font-bold text-foreground text-sm">
                      {DAYS[slot.day_of_week]}
                    </span>
                  </div>

                  {/* Time inputs */}
                  {slot.is_active && (
                    <div className="flex items-center gap-3 flex-wrap flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-foreground/30" />
                        <input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => update(slot.day_of_week, "start_time", e.target.value)}
                          className="rounded-xl border-none bg-foreground/5 px-3 py-2 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-foreground/30 font-bold">→</span>
                        <input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => update(slot.day_of_week, "end_time", e.target.value)}
                          className="rounded-xl border-none bg-foreground/5 px-3 py-2 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground/40">Slot:</span>
                        <select
                          value={slot.slot_duration_min}
                          onChange={(e) =>
                            update(slot.day_of_week, "slot_duration_min", Number(e.target.value))
                          }
                          className="rounded-xl border-none bg-foreground/5 px-3 py-2 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value={15}>15 min</option>
                          <option value={20}>20 min</option>
                          <option value={30}>30 min</option>
                          <option value={45}>45 min</option>
                          <option value={60}>60 min</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {!slot.is_active && (
                    <span className="text-xs font-bold text-foreground/30 uppercase tracking-wider">
                      Day off
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </RequireRole>
    </AppShell>
  );
}
