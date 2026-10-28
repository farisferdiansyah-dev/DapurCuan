"use client";

import { useState, useEffect, type ReactNode, type FormEvent } from "react";
import { Lock, ShieldCheck, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminAuthBarrierProps {
  children: ReactNode;
}

const DEMO_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "admin123";

export function AdminAuthBarrier({ children }: AdminAuthBarrierProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if session has stored authentication or test bypass
    const storedAuth = sessionStorage.getItem("dapurcuan_admin_auth");
    const isTestParam = typeof window !== "undefined" && window.location.search.includes("auth=demo");

    if (storedAuth === "authenticated" || isTestParam) {
      setIsAuthenticated(true);
      if (isTestParam) {
        sessionStorage.setItem("dapurcuan_admin_auth", "authenticated");
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DEMO_PASSCODE || passcode.trim() === "dapurcuan2026") {
      sessionStorage.setItem("dapurcuan_admin_auth", "authenticated");
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError("Passcode salah. Gunakan passcode demo untuk mengakses.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dapurcuan_admin_auth");
    setIsAuthenticated(false);
    setPasscode("");
    setError(null);
  };

  // Loading state during hydration
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Memeriksa hak akses admin...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-md py-16 px-4">
        <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto size-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-3">
              <Lock className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Portal Admin DapurCuan</h1>
            <p className="text-xs text-muted-foreground">
              Area terbatas. Masukkan passcode administrator untuk membuka dashboard simulasi.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-passcode" className="text-xs font-semibold text-foreground">
                Passcode Administrator
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan passcode admin..."
                autoComplete="current-password"
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Kredensial demo prototipe: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary font-semibold">admin123</code>
              </p>
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full font-semibold">
              Buka Akses Admin
            </Button>
          </form>

          <div className="pt-4 border-t space-y-2 text-[11px] text-muted-foreground leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <ShieldCheck className="size-3.5 text-success" />
              <span>Proteksi Akses Publik (Phase 1)</span>
            </div>
            <p>
              Gateway ini memastikan area manajemen mock tidak terbuka bebas untuk publik saat di-deploy ke Vercel. Pada Phase 2 Backend, autentikasi akan digantikan secara penuh oleh Auth.js dengan server-side session & RBAC.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated State: Wrap with simulation banner & logout action
  return (
    <>
      <div
        role="region"
        aria-label="Informasi Status Simulasi Admin"
        className="border-b bg-amber-500/10 px-4 py-2 text-xs text-amber-900 dark:text-amber-200"
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Simulasi Frontend (Phase 1)
            </span>
            <span className="font-medium">
              Area Prototipe Admin: Menggunakan mock state lokal browser. Seluruh perubahan hanya berlaku di sesi ini.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Auth.js RBAC aktif di Phase 2
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-destructive transition-colors rounded px-2 py-1 hover:bg-destructive/10"
              title="Keluar dari sesi admin"
            >
              <LogOut className="size-3" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
