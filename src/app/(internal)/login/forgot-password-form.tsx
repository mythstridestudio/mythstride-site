"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRightIcon, ShieldIcon } from "@/components/Icons";
import {
  requestPasswordResetCode,
  resetPasswordWithCode,
} from "@/lib/api/password-reset";
import { useTranslations } from "@/lib/i18n";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{6}$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 25;

type Step = "request" | "reset";
type RequestStatus = "idle" | "loading" | "sent" | "rateLimited" | "unavailable";
type ResetStatus = "idle" | "loading" | "invalidCode" | "rateLimited" | "unavailable";

type ForgotPasswordFormProps = {
  onBackToLogin: (resetEmail?: string) => void;
};

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const { t } = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [requestValidationMessage, setRequestValidationMessage] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<ResetStatus>("idle");
  const [resetValidationMessage, setResetValidationMessage] = useState<string | null>(null);

  const isSendingCode = requestStatus === "loading";
  const isResetting = resetStatus === "loading";

  const requestStatusMessageMap: Partial<Record<RequestStatus, string>> = {
    sent: t("forgotPassword.messages.codeSent"),
    rateLimited: t("forgotPassword.messages.rateLimited"),
    unavailable: t("forgotPassword.messages.unavailable"),
  };
  const requestMessage = requestValidationMessage ?? requestStatusMessageMap[requestStatus];
  const isRequestMessageError = Boolean(requestValidationMessage) || requestStatus === "rateLimited" || requestStatus === "unavailable";

  const resetStatusMessageMap: Partial<Record<ResetStatus, string>> = {
    invalidCode: t("forgotPassword.messages.invalidCode"),
    rateLimited: t("forgotPassword.messages.rateLimited"),
    unavailable: t("forgotPassword.messages.unavailable"),
  };
  const resetMessage = resetValidationMessage ?? resetStatusMessageMap[resetStatus];

  const sendCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setRequestValidationMessage(t("forgotPassword.messages.validationEmail"));
      return;
    }

    setRequestValidationMessage(null);
    setRequestStatus("loading");
    const outcome = await requestPasswordResetCode(normalizedEmail);
    setRequestStatus(outcome);

    if (outcome === "sent") {
      setStep("reset");
    }
  };

  const handleRequestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendCode();
  };

  const handleResendCode = async () => {
    setResetStatus("idle");
    setResetValidationMessage(null);
    await sendCode();
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedCode = code.trim();

    if (!CODE_PATTERN.test(trimmedCode)) {
      setResetValidationMessage(t("forgotPassword.messages.validationCode"));
      return;
    }

    if (newPassword.length < PASSWORD_MIN_LENGTH || newPassword.length > PASSWORD_MAX_LENGTH) {
      setResetValidationMessage(t("forgotPassword.messages.validationPasswordLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetValidationMessage(t("forgotPassword.messages.validationPasswordMismatch"));
      return;
    }

    setResetValidationMessage(null);
    setResetStatus("loading");

    const outcome = await resetPasswordWithCode({
      email: normalizedEmail,
      code: trimmedCode,
      newPassword,
      newPasswordConfirm: confirmPassword,
    });

    if (outcome === "success") {
      onBackToLogin(normalizedEmail);
      return;
    }

    setResetStatus(outcome);
  };

  const motionProps = {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: prefersReducedMotion ? undefined : { opacity: 0, y: -12 },
    transition: { duration: prefersReducedMotion ? 0 : 0.3, ease: [0.25, 0.4, 0.2, 1] as const },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === "request" ? (
        <motion.form
          key="request"
          className="relative grid min-w-0 gap-5 p-6 sm:p-8"
          onSubmit={handleRequestCode}
          {...motionProps}
        >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <ShieldIcon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-fiery-orange">
            {t("forgotPassword.kicker")}
          </p>
          <h2 className="mt-2 font-display text-xl text-gold-bright sm:text-2xl">
            {t("forgotPassword.requestTitle")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {t("forgotPassword.requestDescription")}
          </p>
        </div>

        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.22em] text-gold-muted">
            {t("forgotPassword.fields.email")}
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="myth-input min-w-0 w-full text-sm"
            autoComplete="email"
            required
            disabled={isSendingCode}
          />
        </label>

        <button type="submit" className="button button--primary w-full min-w-0" disabled={isSendingCode}>
          <ShieldIcon className="h-4 w-4" />
          {isSendingCode ? t("forgotPassword.actions.sending") : t("forgotPassword.actions.sendCode")}
        </button>

        {requestMessage && (
          <p
            className={`border px-4 py-3 text-sm leading-relaxed ${
              isRequestMessageError
                ? "border-hp-red/35 bg-hp-red/10 text-text-secondary"
                : "border-emerald/35 bg-emerald/10 text-text-primary"
            }`}
            role={isRequestMessageError ? "alert" : "status"}
          >
            {requestMessage}
          </p>
        )}

        <button
          type="button"
          onClick={() => onBackToLogin()}
          className="justify-self-start text-xs text-gold-muted transition-colors hover:text-gold"
          disabled={isSendingCode}
        >
          {t("forgotPassword.actions.backToLogin")}
        </button>
        </motion.form>
      ) : (
        <motion.form
          key="reset"
          className="relative grid min-w-0 gap-5 p-6 sm:p-8"
          onSubmit={handleResetPassword}
          {...motionProps}
        >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
        <ShieldIcon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.26em] text-fiery-orange">
          {t("forgotPassword.kicker")}
        </p>
        <h2 className="mt-2 font-display text-xl text-gold-bright sm:text-2xl">
          {t("forgotPassword.resetTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {t("forgotPassword.resetDescription")}
        </p>
      </div>

      {requestMessage && (
        <p
          className={`border px-4 py-3 text-sm leading-relaxed ${
            isRequestMessageError
              ? "border-hp-red/35 bg-hp-red/10 text-text-secondary"
              : "border-emerald/35 bg-emerald/10 text-text-primary"
          }`}
          role={isRequestMessageError ? "alert" : "status"}
        >
          {requestMessage}
        </p>
      )}

      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.22em] text-gold-muted">
          {t("forgotPassword.fields.code")}
        </span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          className="myth-input min-w-0 w-full text-center text-lg tracking-[0.4em]"
          required
          disabled={isResetting}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.22em] text-gold-muted">
          {t("forgotPassword.fields.newPassword")}
        </span>
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="myth-input min-w-0 w-full text-sm"
          autoComplete="new-password"
          maxLength={PASSWORD_MAX_LENGTH}
          required
          disabled={isResetting}
        />
        <span className="text-xs text-text-secondary">{t("forgotPassword.hints.password")}</span>
      </label>

      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.22em] text-gold-muted">
          {t("forgotPassword.fields.confirmPassword")}
        </span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="myth-input min-w-0 w-full text-sm"
          autoComplete="new-password"
          maxLength={PASSWORD_MAX_LENGTH}
          required
          disabled={isResetting}
        />
      </label>

      <button type="submit" className="button button--primary w-full min-w-0" disabled={isResetting}>
        <ShieldIcon className="h-4 w-4" />
        {isResetting ? t("forgotPassword.actions.resetting") : t("forgotPassword.actions.resetPassword")}
      </button>

      {resetMessage && (
        <p
          className="border border-hp-red/35 bg-hp-red/10 px-4 py-3 text-sm leading-relaxed text-text-secondary"
          role="alert"
        >
          {resetMessage}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleResendCode}
          className="text-xs text-gold-muted transition-colors hover:text-gold"
          disabled={isResetting || isSendingCode}
        >
          {isSendingCode ? t("forgotPassword.actions.sending") : t("forgotPassword.actions.resendCode")}
        </button>
        <button
          type="button"
          onClick={() => onBackToLogin()}
          className="inline-flex items-center gap-1 text-xs text-gold-muted transition-colors hover:text-gold"
          disabled={isResetting}
        >
          <ArrowRightIcon className="h-3 w-3 rotate-180" />
          {t("forgotPassword.actions.backToLogin")}
        </button>
      </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
