"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useId, useState } from "react";
import { SwordsIcon } from "@/components/Icons";
import { siteCopy } from "@/content/site";
import { ApiConfigurationError } from "@/lib/api/client";
import { joinWaitlist } from "@/lib/api/waitlist";
import { localePath, type PublicLocale } from "@/lib/locales";

type WaitlistFormStatus =
  | "idle"
  | "loading"
  | "success"
  | "alreadyJoined"
  | "ageError"
  | "validationError"
  | "serverError";

type WaitlistFormProps = {
  locale?: PublicLocale;
  className?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const waitlistLanguage: Record<PublicLocale, "pt" | "en" | "es"> = {
  "pt-BR": "pt",
  en: "en",
  es: "es",
};

const campaignKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type CampaignAttribution = Partial<Record<(typeof campaignKeys)[number], string>>;

export function getSessionCampaignAttribution(): CampaignAttribution {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const attribution: CampaignAttribution = {};
  for (const key of campaignKeys) {
    const value = params.get(key)?.trim().slice(0, 200);
    if (value) attribution[key] = value;
  }

  if (Object.keys(attribution).length > 0) {
    try {
      window.sessionStorage.setItem(
        "mythstride:campaign-attribution",
        JSON.stringify(attribution),
      );
    } catch {
      // Attribution is best-effort and must never block signup.
    }
    return attribution;
  }

  try {
    return JSON.parse(
      window.sessionStorage.getItem("mythstride:campaign-attribution") ?? "{}",
    ) as CampaignAttribution;
  } catch {
    return {};
  }
}

export default function WaitlistForm({
  locale = "en",
  className = "",
}: WaitlistFormProps) {
  const copy = siteCopy[locale].waitlist;
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [status, setStatus] = useState<WaitlistFormStatus>("idle");

  useEffect(() => {
    getSessionCampaignAttribution();
  }, []);

  const messageByStatus: Partial<Record<WaitlistFormStatus, string>> = {
    success: copy.success,
    alreadyJoined: copy.duplicate,
    ageError: copy.ageRequired,
    validationError: copy.invalid,
    serverError: copy.failure,
  };

  const statusMessage = messageByStatus[status];
  const isLoading = status === "loading";
  const isSuccessState =
    status === "success" || status === "alreadyJoined";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (website) {
      setStatus("success");
      return;
    }

    if (
      !emailPattern.test(normalizedEmail) ||
      normalizedEmail.length > 320 ||
      trimmedName.length > 120
    ) {
      setStatus("validationError");
      return;
    }

    if (!isAdult) {
      setStatus("ageError");
      return;
    }

    setStatus("loading");

    try {
      const result = await joinWaitlist({
        email: normalizedEmail,
        ...(trimmedName ? { name: trimmedName } : {}),
        language: waitlistLanguage[locale],
        source: "website",
      });

      setEmail(normalizedEmail);
      const nextStatus = result === "alreadyJoined" ? "alreadyJoined" : "success";
      setStatus(nextStatus);
      if (nextStatus === "success") {
        window.dispatchEvent(new CustomEvent("mythstride:waitlist-success"));
      }
    } catch (error) {
      if (
        error instanceof ApiConfigurationError &&
        process.env.NODE_ENV === "development"
      ) {
        console.info("Waitlist API is not configured for this environment.");
      }
      setStatus("serverError");
    }
  };

  return (
    <form
      className={`waitlist-form ${className}`.trim()}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="waitlist-form__fields">
        <label htmlFor={`${formId}-name`}>
          <span>{copy.name}</span>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            maxLength={120}
            disabled={isLoading}
          />
        </label>

        <label htmlFor={`${formId}-email`}>
          <span>{copy.email}</span>
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
            aria-describedby={`${formId}-disclosure`}
            disabled={isLoading}
          />
        </label>
      </div>

      <label className="waitlist-form__honeypot" aria-hidden="true">
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

      <label className="waitlist-form__age" htmlFor={`${formId}-age`}>
        <input
          id={`${formId}-age`}
          name="age-confirmation"
          type="checkbox"
          checked={isAdult}
          onChange={(event) => setIsAdult(event.target.checked)}
          required
          disabled={isLoading}
        />
        <span>{copy.ageConfirmation}</span>
      </label>

      <button
        type="submit"
        className="button button--primary waitlist-form__submit"
        disabled={isLoading}
      >
        <SwordsIcon className="button__icon" />
        {isLoading ? copy.loading : copy.submit}
      </button>

      <div className="waitlist-form__disclosure" id={`${formId}-disclosure`}>
        <p>{copy.disclosure}</p>
        <p>{copy.capacity}</p>
        <Link href={localePath(locale, "/privacy")} prefetch={false}>{copy.privacyLink}</Link>
      </div>

      {statusMessage ? (
        <p
          className={`waitlist-form__message waitlist-form__message--${
            isSuccessState ? "success" : "error"
          }`}
          role={isSuccessState ? "status" : "alert"}
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
