"use client";

import { type FormEvent, useId, useState } from "react";
import { ShieldIcon } from "@/components/Icons";
import { siteCopy } from "@/content/site";
import { requestAccountDeletionLink } from "@/lib/api/account-deletion";
import type { PublicLocale } from "@/lib/locales";

type RequestFormStatus =
  | "idle"
  | "loading"
  | "requested"
  | "rateLimited"
  | "unavailable"
  | "validationError";

type AccountDeletionRequestFormProps = {
  locale: PublicLocale;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountDeletionRequestForm({
  locale,
}: AccountDeletionRequestFormProps) {
  const copy = siteCopy[locale].accountDeletion;
  const formId = useId();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<RequestFormStatus>("idle");

  const messageByStatus: Partial<Record<RequestFormStatus, string>> = {
    requested: copy.requested,
    rateLimited: copy.rateLimited,
    unavailable: copy.unavailable,
    validationError: copy.invalidEmail,
  };

  const statusMessage = messageByStatus[status];
  const isLoading = status === "loading";
  const isSuccess = status === "requested";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    // Honeypot: bots that fill hidden fields see a generic success state
    // without ever reaching the API.
    if (website) {
      setEmail("");
      setStatus("requested");
      return;
    }

    if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 320) {
      setStatus("validationError");
      return;
    }

    setStatus("loading");

    try {
      const outcome = await requestAccountDeletionLink(normalizedEmail);
      setStatus(outcome);
    } catch {
      setStatus("unavailable");
    } finally {
      setEmail("");
    }
  };

  return (
    <form
      className="account-deletion-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2>{copy.formTitle}</h2>
      <p className="account-deletion-form__intro">{copy.formIntro}</p>

      <label htmlFor={`${formId}-email`}>
        <span>{copy.emailLabel}</span>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          inputMode="email"
          maxLength={320}
          required
          aria-describedby={
            statusMessage ? `${formId}-message` : undefined
          }
          disabled={isLoading}
        />
      </label>

      <label className="account-deletion-form__honeypot" aria-hidden="true">
        <span>{copy.honeypot}</span>
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </label>

      <button
        type="submit"
        className="button button--primary account-deletion-form__submit"
        disabled={isLoading}
      >
        <ShieldIcon className="button__icon" />
        {isLoading ? copy.loading : copy.submit}
      </button>

      {statusMessage ? (
        <p
          id={`${formId}-message`}
          className={`account-deletion-form__message account-deletion-form__message--${
            isSuccess ? "success" : "error"
          }`}
          role={isSuccess ? "status" : "alert"}
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
