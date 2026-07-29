"use client";

import Link from "next/link";
import { type FormEvent, useId, useState } from "react";
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
  | "validationError"
  | "serverError";

type WaitlistFormProps = {
  locale?: PublicLocale;
  className?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm({
  locale = "en",
  className = "",
}: WaitlistFormProps) {
  const copy = siteCopy[locale].waitlist;
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<WaitlistFormStatus>("idle");

  const messageByStatus: Partial<Record<WaitlistFormStatus, string>> = {
    success: copy.success,
    alreadyJoined: copy.duplicate,
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

    setStatus("loading");

    try {
      const result = await joinWaitlist({
        email: normalizedEmail,
        ...(trimmedName ? { name: trimmedName } : {}),
        language: locale === "pt-BR" ? "pt" : "en",
        source: "website",
      });

      setEmail(normalizedEmail);
      setStatus(result === "alreadyJoined" ? "alreadyJoined" : "success");
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
        <Link href={localePath(locale, "/privacy")}>{copy.privacyLink}</Link>
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
