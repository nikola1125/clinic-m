"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useClinicStore } from "@/store/clinicStore";
import { LogOut, LayoutDashboard, UserCircle, Briefcase, Activity } from "lucide-react";

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
  const session = useClinicStore((s) => s.session);
  const logout = useClinicStore((s) => s.logout);

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
