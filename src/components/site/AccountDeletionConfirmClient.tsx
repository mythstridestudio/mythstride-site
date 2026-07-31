"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteCopy } from "@/content/site";
import { confirmAccountDeletionToken } from "@/lib/api/account-deletion";
import { localePath, type PublicLocale } from "@/lib/locales";

type ConfirmState =
  | { phase: "checking" }
  | { phase: "missingToken" }
  | { phase: "success"; status: string }
  | { phase: "invalid" }
  | { phase: "rateLimited" }
  | { phase: "unavailable" };

type AccountDeletionConfirmClientProps = {
  locale: PublicLocale;
};

function readTokenFromLocationHash(): string | null {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;

  const token = new URLSearchParams(hash).get("token");
  return token && token.length > 0 ? token : null;
}

export function AccountDeletionConfirmClient({
  locale,
}: AccountDeletionConfirmClientProps) {
  const copy = siteCopy[locale].accountDeletion;
  const [state, setState] = useState<ConfirmState>({ phase: "checking" });

  useEffect(() => {
    let cancelled = false;
    const token = readTokenFromLocationHash();

    // The token must never linger in the URL (history, referrer headers,
    // browser autocomplete) once it has been read.
    if (window.history.replaceState) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }

    const nextState: Promise<ConfirmState> = token
      ? confirmAccountDeletionToken(token).then((result) => {
          if (result.outcome === "confirmed") {
            return { phase: "success", status: result.status } as const;
          }
          if (result.outcome === "invalid") {
            return { phase: "invalid" } as const;
          }
          if (result.outcome === "rateLimited") {
            return { phase: "rateLimited" } as const;
          }
          return { phase: "unavailable" } as const;
        })
      : Promise.resolve<ConfirmState>({ phase: "missingToken" });

    nextState
      .then((resolved) => {
        if (!cancelled) setState(resolved);
      })
      .catch(() => {
        if (!cancelled) setState({ phase: "unavailable" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const successMessage = (status: string) => {
    if (status === "AwaitingRetentionDecision") {
      return copy.confirmAwaitingRetention;
    }
    if (status === "Scheduled") {
      return copy.confirmScheduled;
    }
    return copy.confirmGenericSuccess;
  };

  return (
    <div className="account-deletion-confirm">
      <div role="status" aria-live="polite">
        {state.phase === "checking" ? (
          <p className="account-deletion-form__message account-deletion-form__message--info">
            {copy.confirmChecking}
          </p>
        ) : null}
        {state.phase === "missingToken" ? (
          <p className="account-deletion-form__message account-deletion-form__message--error">
            {copy.confirmMissingToken}
          </p>
        ) : null}
        {state.phase === "success" ? (
          <p className="account-deletion-form__message account-deletion-form__message--success">
            {successMessage(state.status)}
          </p>
        ) : null}
        {state.phase === "invalid" ? (
          <p className="account-deletion-form__message account-deletion-form__message--error">
            {copy.confirmInvalid}
          </p>
        ) : null}
        {state.phase === "rateLimited" ? (
          <p className="account-deletion-form__message account-deletion-form__message--error">
            {copy.confirmRateLimited}
          </p>
        ) : null}
        {state.phase === "unavailable" ? (
          <p className="account-deletion-form__message account-deletion-form__message--error">
            {copy.confirmUnavailable}
          </p>
        ) : null}
      </div>

      {state.phase !== "checking" ? (
        <Link
          className="button button--secondary"
          href={localePath(locale, "/delete-account")}
        >
          {copy.backToRequest}
        </Link>
      ) : null}
    </div>
  );
}
