"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { getLanguageLocale, useLanguage } from "@/contexts/LanguageContext";
import AuthenticatedTopbar from "@/components/AuthenticatedTopbar";
import { getAssetPath } from "@/lib/assets";
import { parseApiDate } from "@/lib/dates";
import { useTranslations } from "@/lib/i18n";
import { ApiError } from "@/lib/api/client";
import { getPublicEarnedMedals, resolveEventMedalImage, type EarnedEventMedal } from "@/lib/api/medals";
import { ArrowRightIcon, CloseIcon, CrownIcon, ShareIcon, TrophyIcon } from "@/components/Icons";

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; medals: EarnedEventMedal[] }
  | { kind: "error"; key: string };

function displayDate(iso: string | null | undefined, locale: string) {
  if (!iso) return "—";
  const date = parseApiDate(iso);
  return date
    ? new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(date)
    : "—";
}

function displayDistance(distance: number | null | undefined, locale: string) {
  return typeof distance === "number" && Number.isFinite(distance)
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(distance) + " km"
    : "—";
}

function displayDuration(seconds: number | null | undefined) {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = Math.round(seconds % 60);
  return (hours > 0 ? String(hours).padStart(2, "0") + ":" : "")
    + String(minutes).padStart(2, "0") + ":" + String(remainder).padStart(2, "0");
}

function displayPace(pace: number | null | undefined) {
  if (typeof pace !== "number" || !Number.isFinite(pace) || pace <= 0) return "—";
  const seconds = Math.round(pace * 60);
  return String(Math.floor(seconds / 60)).padStart(2, "0")
    + ":" + String(seconds % 60).padStart(2, "0") + " /km";
}

function medalYear(medal: EarnedEventMedal): string {
  const date = parseApiDate(medal.earnedAtUtc);
  return date ? String(date.getUTCFullYear()) : "—";
}

function MedalArt({ medal, className = "" }: { medal: EarnedEventMedal; className?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const url = resolveEventMedalImage(medal.medalha.imagemUrl, medal.medalha.internalKey);

  return (
    <div className={"relative flex items-center justify-center " + className}>
      <div className="absolute inset-[13%] rounded-full bg-gold/20 blur-2xl" aria-hidden="true" />
      {url && !imageFailed ? (
        <Image
          src={url}
          alt={medal.medalha.nome}
          width={360}
          height={360}
          sizes="(max-width: 640px) 160px, 260px"
          unoptimized
          onError={() => setImageFailed(true)}
          className="relative h-full w-full object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.7)]"
        />
      ) : (
        <div className="relative flex h-[72%] w-[72%] items-center justify-center rounded-full border-2 border-dashed border-gold/40 bg-void/80 shadow-[0_0_35px_rgba(216,171,93,0.15)]">
          <TrophyIcon className="h-[43%] w-[43%] text-gold/75" />
        </div>
      )}
    </div>
  );
}

function MedalDetails({
  medal,
  locale,
  close,
  onShare,
}: {
  medal: EarnedEventMedal;
  locale: string;
  close: () => void;
  onShare: (medalId: string) => void;
}) {
  const { t } = useTranslations();
  const stats = medal.estatisticas;
  const details = [
    [t<string>("medalWall.distance"), displayDistance(stats?.distanciaKm, locale)],
    [t<string>("medalWall.duration"), displayDuration(stats?.tempoSegundos)],
    [t<string>("medalWall.pace"), displayPace(stats?.paceMinKm)],
    [t<string>("medalWall.runDate"), displayDate(stats?.dataCorrida, locale)],
    [t<string>("medalWall.location"), stats?.localNome?.trim() || "—"],
    [t<string>("medalWall.finishOrder"), typeof stats?.ordemConclusao === "number" ? "#" + stats.ordemConclusao : "—"],
  ];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = original;
    };
  }, [close]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-6 sm:p-8">
      <button type="button" aria-label={t("medalWall.close")} onClick={close} className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <section role="dialog" aria-modal="true" aria-labelledby="medal-dialog-title" className="relative z-10 max-h-full w-full max-w-2xl overflow-y-auto rounded-[24px] border border-gold/40 bg-void p-5 shadow-[0_36px_90px_rgba(0,0,0,0.8)] sm:p-8">
        <div className="absolute inset-0 bg-stone-texture opacity-20 pointer-events-none" />
        <div className="relative">
          <button type="button" aria-label={t("medalWall.close")} onClick={close} className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/10">
            <CloseIcon className="h-5 w-5" />
          </button>
          <div className="pr-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-fiery-orange">{t("medalWall.earned")}</span>
            <h2 id="medal-dialog-title" className="mt-2 font-display text-3xl text-gold-bright sm:text-4xl">{medal.medalha.nome}</h2>
            <p className="mt-2 text-sm text-text-secondary">{medal.eventoNome}</p>
          </div>
          <MedalArt key={medal.id} medal={medal} className="mx-auto my-3 h-52 w-52 sm:h-64 sm:w-64" />
          {medal.medalha.descricao && <p className="mb-6 text-center text-sm leading-relaxed text-text-secondary">{medal.medalha.descricao}</p>}
          <div className="mb-5 border-y border-gold/15 py-4 text-center text-xs uppercase tracking-[0.18em] text-gold">
            {t("medalWall.awardedOn")} · {displayDate(medal.earnedAtUtc, locale)}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-gold/15 bg-charcoal/50 p-3">
                <div className="text-[10px] uppercase tracking-[0.16em] text-text-muted">{label}</div>
                <div className="mt-2 break-words font-display text-base text-gold-bright sm:text-lg">{value}</div>
              </div>
            ))}
          </div>
          <button type="button" className="button button--primary mt-6 w-full justify-center" onClick={() => onShare(medal.id)}>
            <ShareIcon className="h-4 w-4" />{t("medalWall.shareMedal")}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function MedalsWallPage() {
  const params = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { lang } = useLanguage();
  const { t } = useTranslations();
  const locale = getLanguageLocale(lang);
  const username = params.get("username")?.trim() || user?.username?.trim() || "";
  const requestedMedalId = params.get("medal");
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shareNote, setShareNote] = useState(false);

  useEffect(() => {
    if (!username) return;
    let active = true;
    getPublicEarnedMedals(username)
      .then((medals) => {
        if (active) setState({ kind: "ready", medals });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          kind: "error",
          key: error instanceof ApiError && error.status === 404 ? "medalWall.notFound" : "medalWall.error",
        });
      });
    return () => { active = false; };
  }, [username]);

  const medals = state.kind === "ready" ? state.medals : [];
  const years = useMemo(() => Array.from(new Set(medals.map(medalYear))).sort((a, b) => b.localeCompare(a)), [medals]);
  const visible = useMemo(() => medals
    .filter((medal) => year === "all" || medalYear(medal) === year)
    .filter((medal) => (medal.eventoNome + " " + medal.medalha.nome).toLocaleLowerCase().includes(search.trim().toLocaleLowerCase(lang)))
    .sort((a, b) => b.earnedAtUtc.localeCompare(a.earnedAtUtc)), [medals, year, search, lang]);

  const activeMedal = medals.find((medal) => medal.id === (selectedId === null ? requestedMedalId : selectedId)) || null;
  const totalDistance = medals.reduce((sum, medal) => sum + (medal.estatisticas?.distanciaKm ?? 0), 0);
  const medalsWithDistance = medals.filter((medal) => typeof medal.estatisticas?.distanciaKm === "number").length;

  const share = async (medalId?: string) => {
    if (!username) return;
    const link = new URL(getAssetPath("/medals"), window.location.origin);
    link.searchParams.set("username", username);
    if (medalId) link.searchParams.set("medal", medalId);
    try {
      if (navigator.share) {
        await navigator.share({ title: t("medalWall.title") + " · " + username, url: link.href });
      } else {
        await navigator.clipboard.writeText(link.href);
        setShareNote(true);
        window.setTimeout(() => setShareNote(false), 3000);
      }
    } catch {
      // Canceling the native share sheet must not display a success message.
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-void pb-24 pt-24 md:pt-32">
      {isAuthenticated && <AuthenticatedTopbar profileUsername={user?.username} />}
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('" + getAssetPath("/images/optimized/hero-desktop.webp") + "')" }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/95 via-void/85 to-void" />
      <div className="pointer-events-none absolute inset-0 bg-stone-texture opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[540px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-fiery-orange">
              <CrownIcon className="h-4 w-4" /> {t("medalWall.kicker")}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-gold-bright sm:text-5xl md:text-6xl">{t("medalWall.title")}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">{t("medalWall.subtitle")}</p>
            {username && <p className="mt-4 text-sm tracking-wider text-gold">@{username}</p>}
          </div>
          {username && (
            <button type="button" onClick={() => void share()} className="button button--secondary shrink-0">
              <ShareIcon className="h-4 w-4" />{t("medalWall.shareWall")}
            </button>
          )}
        </div>

        {!username ? (
          <div className="app-panel app-panel-compact rpg-card p-8 text-center">
            <TrophyIcon className="mx-auto h-12 w-12 text-gold" />
            <p className="mt-4 text-text-secondary">{t("medalWall.chooseRunner")}</p>
            <Link href="/login" className="button button--primary mt-6">{t("medalWall.login")}<ArrowRightIcon className="h-4 w-4" /></Link>
          </div>
        ) : state.kind === "loading" ? (
          <div role="status" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((n) => <div key={n} className="aspect-[3/4] animate-pulse rounded-[22px] border border-gold/15 bg-charcoal/55" />)}
          </div>
        ) : state.kind === "error" ? (
          <div role="alert" className="app-panel app-panel-compact rpg-card p-8 text-center text-text-secondary">{t(state.key)}</div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rpg-inset rounded-xl border border-gold/25 p-4 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">{t("medalWall.totalMedals")}</p>
                <p className="mt-2 font-display text-4xl text-gold-bright">{medals.length}</p>
              </div>
              <div className="rpg-inset rounded-xl border border-gold/25 p-4 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">{t("medalWall.eventsCompleted")}</p>
                <p className="mt-2 font-display text-4xl text-gold-bright">{new Set(medals.map((m) => m.eventoId)).size}</p>
              </div>
              <div className="rpg-inset col-span-2 rounded-xl border border-gold/25 p-4 sm:col-span-1 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">{t("medalWall.medalDistance")}</p>
                <p className="mt-2 font-display text-3xl text-gold-bright">{medalsWithDistance ? displayDistance(totalDistance, locale) : "—"}</p>
                <p className="mt-1 text-xs text-text-muted">{t("medalWall.distanceFootnote")}</p>
              </div>
            </div>

            {medals.length > 0 && (
              <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <label className="flex-1">
                  <span className="sr-only">{t("medalWall.search")}</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("medalWall.search")}
                    className="w-full rounded-xl border border-gold/25 bg-void/75 px-4 py-3 text-sm text-text-secondary outline-none focus:border-gold"
                  />
                </label>
                <label>
                  <span className="sr-only">{t("medalWall.year")}</span>
                  <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-xl border border-gold/25 bg-void/75 px-4 py-3 text-sm text-text-secondary outline-none focus:border-gold sm:w-44">
                    <option value="all">{t("medalWall.allYears")}</option>
                    {years.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
              </div>
            )}

            {medals.length === 0 ? (
              <div className="app-panel app-panel-compact rpg-card py-16 text-center">
                <TrophyIcon className="mx-auto h-14 w-14 text-gold/60" />
                <h2 className="mt-4 font-display text-2xl text-gold-bright">{t("medalWall.emptyTitle")}</h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-secondary">{t("medalWall.emptyDescription")}</p>
              </div>
            ) : visible.length === 0 ? (
              <p className="rounded-xl border border-gold/20 bg-charcoal/40 p-8 text-center text-text-secondary">{t("medalWall.noMatches")}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {visible.map((medal, index) => (
                  <button
                    key={medal.id}
                    type="button"
                    onClick={() => setSelectedId(medal.id)}
                    aria-label={t("medalWall.viewDetails") + ": " + medal.medalha.nome}
                    className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-[22px] border border-gold/25 bg-gradient-to-b from-charcoal/90 to-void p-3 text-left shadow-[0_20px_55px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/65 hover:shadow-[0_24px_45px_rgba(177,128,50,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:p-5"
                  >
                    <span className="absolute left-3 top-3 text-[10px] uppercase tracking-[0.2em] text-gold/60">{String(index + 1).padStart(2, "0")}</span>
                    <span className="absolute right-3 top-3 rounded-full border border-gold/30 bg-gold/10 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-gold">{t("medalWall.earned")}</span>
                    <MedalArt medal={medal} className="mx-auto mt-8 aspect-square w-full max-w-[195px] transition-transform duration-500 group-hover:scale-105" />
                    <div className="mt-auto w-full border-t border-gold/15 pt-4 text-center">
                      <h2 className="font-display text-base leading-tight text-gold-bright sm:text-xl">{medal.medalha.nome}</h2>
                      <p className="mt-1 line-clamp-2 text-xs text-text-muted">{medal.eventoNome}</p>
                      <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-fiery-orange">{displayDate(medal.earnedAtUtc, locale)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        {shareNote && <div role="status" className="fixed bottom-6 right-4 z-[120] rounded-xl border border-gold/40 bg-void px-5 py-3 text-sm text-gold shadow-xl">{t("medalWall.linkCopied")}</div>}
      </div>
      {activeMedal && <MedalDetails medal={activeMedal} locale={locale} close={() => setSelectedId("")} onShare={(medalId) => void share(medalId)} />}
    </main>
  );
}
