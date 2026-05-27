"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { rehearsals, MONTH_NAMES, getAudioPath, trackSlug, Track } from "@/data/rehearsals";
import AudioPlayer from "./AudioPlayer";
import ShareMenu from "./ShareMenu";

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Section = "2026" | "archive";
const ARCHIVE_YEARS = ["2022"];

function getDefaultsForYear(year: string) {
  const months = Object.keys(rehearsals[year] ?? {}).sort();
  const month = months[months.length - 1] ?? null;
  const days = month ? Object.keys(rehearsals[year]?.[month] ?? {}).sort() : [];
  const day = days[days.length - 1] ?? null;
  return { month, day };
}

// Flat list of every session for a section
function getSessions(section: Section) {
  const years = section === "2026" ? ["2026"] : ARCHIVE_YEARS;
  const items: { year: string; month: string; day: string }[] = [];
  for (const year of years) {
    for (const month of Object.keys(rehearsals[year] ?? {}).sort()) {
      for (const day of Object.keys(rehearsals[year]?.[month] ?? {}).sort()) {
        items.push({ year, month, day });
      }
    }
  }
  return items;
}

export default function RehearsalBrowser() {
  const navRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState<Section>("2026");
  const [archiveYear, setArchiveYear] = useState<string | null>(null);

  const init = getDefaultsForYear("2026");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(init.month);
  const [selectedDay, setSelectedDay] = useState<string | null>(init.day);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [heroOpacity, setHeroOpacity] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);

  const [openDropdown, setOpenDropdown] = useState<Section | null>(null);

  const [share, setShare] = useState<
    | {
        track: Track;
        variant: "popover" | "sheet";
        anchorRect: DOMRect | null;
      }
    | null
  >(null);
  const longPressTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);
  const pressStart = useRef<{ x: number; y: number } | null>(null);

  // Dissolve hero on scroll
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight ?? 1;
      setHeroOpacity(Math.max(0, 1 - window.scrollY / heroHeight));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown]);

  // Load track durations for current session
  const activeYear =
    activeSection === "archive" ? archiveYear : activeSection;
  const sessionKey = `${activeSection}-${archiveYear ?? ""}-${selectedMonth ?? ""}-${selectedDay ?? ""}`;
  useEffect(() => {
    setDurations({});
    if (!activeYear || !selectedMonth || !selectedDay) return;
    const audios: HTMLAudioElement[] = [];
    (rehearsals[activeYear]?.[selectedMonth]?.[selectedDay] ?? []).forEach((track) => {
      const a = new Audio(getAudioPath(activeYear, selectedMonth, selectedDay, track.filename));
      a.preload = "metadata";
      a.addEventListener("loadedmetadata", () => {
        setDurations((prev) => ({ ...prev, [track.filename]: a.duration }));
      });
      audios.push(a);
    });
    return () => audios.forEach((a) => { a.src = ""; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  const tracks =
    activeYear && selectedMonth && selectedDay
      ? (rehearsals[activeYear]?.[selectedMonth]?.[selectedDay] ?? [])
      : [];
  const currentTrack =
    currentTrackIndex !== null ? (tracks[currentTrackIndex] ?? null) : null;

  function handleNavButtonClick(s: Section) {
    setOpenDropdown((prev) => (prev === s ? null : s));
  }

  function selectSession(section: Section, year: string, month: string, day: string) {
    setActiveSection(section);
    setArchiveYear(section === "archive" ? year : null);
    setSelectedMonth(month);
    setSelectedDay(day);
    setCurrentTrackIndex(null);
    setOpenDropdown(null);
  }

  function openShare(
    track: Track,
    variant: "popover" | "sheet",
    anchorRect: DOMRect | null
  ) {
    setShare({ track, variant, anchorRect });
  }

  function buildShareUrl(track: Track): string {
    if (!activeYear || !selectedMonth || !selectedDay) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/t/${activeYear}-${selectedMonth}-${selectedDay}/${trackSlug(track.filename)}`;
  }

  function startLongPress(track: Track, e: React.PointerEvent) {
    if (e.pointerType === "mouse") return;
    longPressFired.current = false;
    pressStart.current = { x: e.clientX, y: e.clientY };
    longPressTimer.current = window.setTimeout(() => {
      longPressFired.current = true;
      if (navigator.vibrate) navigator.vibrate(15);
      openShare(track, "sheet", null);
    }, 500);
  }

  function cancelLongPress() {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function maybeCancelOnMove(e: React.PointerEvent) {
    if (!pressStart.current) return;
    const dx = e.clientX - pressStart.current.x;
    const dy = e.clientY - pressStart.current.y;
    if (Math.hypot(dx, dy) > 10) cancelLongPress();
  }

  function handleNext() {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1)
      setCurrentTrackIndex(currentTrackIndex + 1);
  }
  function handlePrev() {
    if (currentTrackIndex !== null && currentTrackIndex > 0)
      setCurrentTrackIndex(currentTrackIndex - 1);
  }

  return (
    <div className={currentTrack ? "pb-36" : ""}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          Rehearsal Archives
        </h1>

        {/* Nav */}
        <div className="relative flex items-center gap-1 shrink-0" ref={navRef}>
          {(["2026", "archive"] as Section[]).map((s) => (
            <button
              key={s}
              onClick={() => handleNavButtonClick(s)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === s
                  ? "bg-[#e84d4d] text-white shadow-sm shadow-[#e84d4d]/30"
                  : openDropdown === s
                  ? "bg-[#1e1e1e] text-white"
                  : "text-[#888] hover:text-white hover:bg-[#1e1e1e]"
              }`}
            >
              {s === "archive" ? "Archive" : s}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-3 h-3 opacity-60 transition-transform shrink-0 ${openDropdown === s ? "rotate-180" : ""}`}
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
          ))}

          {/* Dropdown */}
          {openDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-[#161616] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl z-40 w-[calc(100vw-3rem)] md:w-auto md:min-w-[180px]">
              {getSessions(openDropdown).map(({ year, month, day }) => {
                const isActive =
                  activeSection === openDropdown &&
                  (openDropdown === "archive" ? archiveYear === year : true) &&
                  selectedMonth === month &&
                  selectedDay === day;
                const label =
                  openDropdown === "archive"
                    ? `${year} · ${MONTH_NAMES[month]} ${parseInt(day, 10)}`
                    : `${MONTH_NAMES[month]} ${parseInt(day, 10)}`;
                return (
                  <button
                    key={`${year}-${month}-${day}`}
                    onClick={() => selectSession(openDropdown, year, month, day)}
                    className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                      isActive
                        ? "text-[#e84d4d] bg-[#e84d4d]/10 font-medium"
                        : "text-[#aaa] hover:text-white hover:bg-[#222]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* ── Band logo (scroll-dissolve) ── */}
      <div
        ref={heroRef}
        className="w-full mb-10"
        style={{ opacity: heroOpacity }}
      >
        <Image
          src="/last-nights-munchies-desktop.jpg"
          alt="Last Night's Munchies"
          width={1920}
          height={392}
          className="hidden md:block w-full h-auto"
          priority
        />
        <Image
          src="/last-nights-munchies-mobile.jpg"
          alt="Last Night's Munchies"
          width={1400}
          height={463}
          className="block md:hidden w-full h-auto"
          priority
        />
      </div>

      {/* ── Track list ── */}
      {tracks.length > 0 && (
        <section>
          <p className="text-[#555] text-xs uppercase tracking-widest mb-4">
            {tracks.length} track{tracks.length !== 1 ? "s" : ""}
          </p>
          <ul className="space-y-1">
            {tracks.map((track, index) => {
              const isActive = currentTrackIndex === index;
              return (
                <li key={track.number}>
                  <div
                    className={`w-full flex items-center gap-4 pl-4 pr-2 py-3 rounded-lg transition-colors text-left group ${
                      isActive
                        ? "bg-[#e84d4d]/15 border border-[#e84d4d]/30 text-white"
                        : "bg-[#161616] hover:bg-[#1e1e1e] border border-transparent text-[#bbb] hover:text-white"
                    }`}
                    style={{ WebkitTouchCallout: "none" }}
                  >
                    <button
                      onClick={() => {
                        if (longPressFired.current) {
                          longPressFired.current = false;
                          return;
                        }
                        setCurrentTrackIndex(index);
                      }}
                      onPointerDown={(e) => startLongPress(track, e)}
                      onPointerUp={cancelLongPress}
                      onPointerCancel={cancelLongPress}
                      onPointerLeave={cancelLongPress}
                      onPointerMove={maybeCancelOnMove}
                      onContextMenu={(e) => {
                        if (longPressFired.current) e.preventDefault();
                      }}
                      className="flex-1 min-w-0 flex items-center gap-4 text-left select-none"
                    >
                      <span className="w-7 shrink-0 text-center">
                        {isActive ? (
                          <span className="text-[#e84d4d] text-base leading-none">♪</span>
                        ) : (
                          <span className="text-[#555] text-xs font-mono group-hover:text-[#888]">
                            {String(track.number).padStart(2, "0")}
                          </span>
                        )}
                      </span>
                      <span className="flex-1 min-w-0 text-sm truncate">{track.title}</span>
                      {isActive ? (
                        <span className="text-[#e84d4d] text-xs font-medium shrink-0 pl-2">
                          Playing
                        </span>
                      ) : (
                        <span className="text-[#bbb] text-xs font-mono shrink-0 pl-2">
                          {formatDuration(durations[track.filename])}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                        openShare(track, "popover", rect);
                      }}
                      title="Share track"
                      aria-label={`Share ${track.title}`}
                      className="hidden md:flex w-8 h-8 items-center justify-center rounded-md text-[#666] hover:text-white hover:bg-[#222] transition-colors shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <ShareIcon />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <AudioPlayer
        track={currentTrack}
        year={activeYear ?? ""}
        month={selectedMonth ?? ""}
        day={selectedDay ?? ""}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={
          currentTrackIndex !== null &&
          currentTrackIndex < tracks.length - 1
        }
        hasPrev={currentTrackIndex !== null && currentTrackIndex > 0}
      />

      {share && (
        <ShareMenu
          onClose={() => setShare(null)}
          shareUrl={buildShareUrl(share.track)}
          trackTitle={share.track.title}
          variant={share.variant}
          anchorRect={share.anchorRect}
        />
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92S21 19.61 21 18s-1.34-1.92-3-1.92z" />
    </svg>
  );
}
