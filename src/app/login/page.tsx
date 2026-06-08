"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ApiConfigurationError, ApiError } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAssetPath } from "@/lib/assets";
import { useTranslations } from "@/lib/i18n";
import { ArrowRightIcon, ShieldIcon, SwordsIcon } from "@/components/Icons";

type LoginStatus = "idle" | "loading" | "success" | "invalidCredentials" | "serverError" | "configError";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const statusMessage: Partial<Record<LoginStatus, string>> = {
    success: t("login.messages.success"),
    invalidCredentials: t("login.messages.invalidCredentials"),
    serverError: t("login.messages.serverError"),
    configError: t("login.messages.configError"),
  };
  const message = statusMessage[status];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      await login({ email: email.trim().toLowerCase(), password });
      setStatus("success");
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ApiError && (error.status === 400 || error.status === 401 || error.status === 403)) {
        setStatus("invalidCredentials");
        return;
      }

      if (error instanceof ApiConfigurationError && process.env.NODE_ENV === "development") {
        setStatus("configError");
        return;
      }

      setStatus("serverError");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-void px-4 py-6 sm:px-6 sm:py-10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('${getAssetPath("/images/background.png")}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/76 to-void" />
      <div className="absolute inset-0 bg-stone-texture opacity-25" />
      <div className="pointer-events-none absolute inset-4 border border-gold-dim/20 md:inset-8" />

      <motion.section
        className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full min-w-0 max-w-6xl items-center justify-center"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.25, 0.4, 0.2, 1] }}
      >
        <div className="app-panel app-panel-compact rpg-card grid w-full min-w-0 max-w-5xl overflow-hidden md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative min-h-64 min-w-0 overflow-hidden border-b border-gold-dim/20 p-6 sm:min-h-72 sm:p-8 md:border-b-0 md:border-r">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45"
              style={{ backgroundImage: `url('${getAssetPath("/images/aethron-scroll-bg.png")}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-void/35 via-void/74 to-void" />
            <div className="relative">
              <Link href="/" className="inline-flex items-center gap-2">
                <img src={getAssetPath("/images/mythstride-app-icon.png")} alt="" className="h-9 w-9 rounded-full" />
                <span className="font-display text-lg tracking-wider text-gold">
                  Myth<span className="text-gold-bright">Stride</span>
                </span>
              </Link>
              <div className="mt-12 max-w-sm sm:mt-16">
                <p className="text-xs uppercase tracking-[0.26em] text-fiery-orange">{t("login.kicker")}</p>
                <h1 className="rpg-heading mt-4 font-display text-3xl leading-tight text-gold-bright sm:text-4xl md:text-5xl">
                  {t("login.title")}
                </h1>
                <p className="rpg-copy mt-4 leading-relaxed text-text-secondary">
                  {t("login.description")}
                </p>
              </div>
            </div>
          </div>

          <form className="relative grid min-w-0 gap-5 p-6 sm:p-8" onSubmit={handleSubmit}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
              <ShieldIcon className="h-6 w-6" />
            </div>

            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.22em] text-gold-muted">{t("login.fields.email")}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="myth-input min-w-0 w-full text-sm"
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.22em] text-gold-muted">{t("login.fields.password")}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="myth-input min-w-0 w-full text-sm"
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
            </label>

            <button
              type="submit"
              className="myth-button-primary w-full min-w-0 px-5 py-3 font-display text-sm tracking-wider sm:px-8 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <SwordsIcon className="h-4 w-4" />
              {isLoading ? t("login.actions.loading") : t("login.actions.submit")}
            </button>

            {message && (
              <p
                className={`border px-4 py-3 text-sm leading-relaxed ${
                  isSuccess
                    ? "border-emerald/35 bg-emerald/10 text-text-primary"
                    : "border-hp-red/35 bg-hp-red/10 text-text-secondary"
                }`}
                role={isSuccess ? "status" : "alert"}
              >
                {message}
              </p>
            )}

            <Link href="/#join" className="myth-button-secondary w-full min-w-0 px-4 py-3 font-display text-sm tracking-wider sm:px-6">
              {t("login.actions.waitlist")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </form>
        </div>
      </motion.section>
    </main>
  );
}
