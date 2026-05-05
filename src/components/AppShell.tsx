"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useClinicStore } from "@/store/clinicStore";
import { api, type Notification } from "@/lib/api";
import { LogOut, LayoutDashboard, UserCircle, Briefcase, Activity, Bell, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type NavItem = {
  label: string;
  href: string;
};

export function AppShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const adminSession = useClinicStore((s) => s.adminSession);
  const doctorSession = useClinicStore((s) => s.doctorSession);
  const patientSession = useClinicStore((s) => s.patientSession);
  const logoutFn = useClinicStore((s) => s.logout);

  // Determine which session is relevant based on current path
  const isPortal = pathname.startsWith("/portal");
  const isAdmin = pathname.includes("/hq-command");
  const isPatient = pathname.startsWith("/patient");

  const session = isPortal ? doctorSession : isAdmin ? adminSession : isPatient ? patientSession : (patientSession || adminSession || doctorSession);
  const currentRole = isPortal ? "doctor" as const : isAdmin ? "admin" as const : "patient" as const;

  const logout = () => logoutFn(currentRole);

  /* ── Notifications (patient only) ── */
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!patientSession) return;
    try {
      api.setRole("patient");
      const data = await api.getMyNotifications();
      setNotifications(data ?? []);
    } catch { /* silent */ }
  }, [patientSession]);

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id: string) => {
    try {
      api.setRole("patient");
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch { /* silent */ }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
                MjekOn
              </span>
            </Link>
            <div className="h-6 w-px bg-foreground/10 mx-2 hidden sm:block" />
            <div className="text-sm font-bold text-foreground hidden sm:block">{title}</div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            {isPatient && patientSession && (
              <div ref={bellRef} className="relative">
                <button
                  onClick={() => setBellOpen((o) => !o)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-foreground/10"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl border border-foreground/10 bg-white shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between border-b border-foreground/5 px-4 py-3">
                      <span className="text-sm font-bold text-foreground">Notifications</span>
                      {unreadCount > 0 && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{unreadCount} new</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-foreground/40">No notifications yet</div>
                      ) : (
                        notifications.slice(0, 20).map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              "flex items-start gap-3 px-4 py-3 border-b border-foreground/5 last:border-0 transition-colors",
                              n.read ? "bg-white" : "bg-primary/5"
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-foreground truncate">{n.title}</div>
                              <div className="text-[11px] text-foreground/60 mt-0.5 line-clamp-2">{n.body}</div>
                              <div className="text-[10px] text-foreground/30 mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</div>
                            </div>
                            {!n.read && (
                              <button
                                onClick={() => markRead(n.id)}
                                className="shrink-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {session?.role === "doctor" && (
              <Link
                href="/portal"
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              >
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Doctor Portal</span>
              </Link>
            )}
            {session?.role === "admin" && (
              <Link
                href="/hq-command"
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            {session?.role === "patient" && (
              <Link
                href="/patient/dashboard"
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              >
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Patient</span>
              </Link>
            )}
            {session && (
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105 hover:bg-foreground/90 active:scale-100"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar/Mobile Nav */}
          {nav.length > 0 && (
            <aside className="w-full md:w-64 shrink-0 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
              <nav className="glass rounded-2xl md:rounded-4xl p-2 md:p-4 shadow-premium sticky top-24 inline-flex md:block w-fit md:w-auto min-w-full bg-card">
                <div className="flex md:flex-col gap-2 w-full">
                  {nav.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block rounded-xl md:rounded-2xl px-3 py-2.5 md:px-4 md:py-3 text-xs md:text-sm font-bold transition-all whitespace-nowrap md:whitespace-normal min-w-fit",
                          isActive 
                            ? "bg-primary text-white shadow-premium" 
                            : "text-foreground hover:bg-foreground/5"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </aside>
          )}

          {/* Page Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
