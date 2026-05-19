"use client";

import { useState, useEffect, useRef } from "react";
import { rehearsals, MONTH_NAMES } from "@/data/rehearsals";
import AudioPlayer from "./AudioPlayer";

type Section = "2026" | "2025" | "archive";
const ARCHIVE_YEARS = ["2024", "2023", "2022", "2021"];

function getDefaultsForYear(year: string) {
  const months = Object.keys(rehearsals[year] ?? {}).sort();
  const month = months[months.length - 1] ?? null;
  const days = month ? Object.keys(rehearsals[year]?.[month] ?? {}).sort() : [];
  const day = days[days.length - 1] ?? null;
  return { month, day };
}

export default function RehearsalBrowser() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState<Section>("2026");
  const [archiveYear, setArchiveYear] = useState<string | null>(null);

  const init = getDefaultsForYear("2026");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(init.month);
  const [selectedDay, setSelectedDay] = useState<string | null>(init.day);
  const [navExpanded, setNavExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const activeYear =
    activeSection === "archive" ? archiveYear : activeSection;

  const months = activeYear
    ? Object.keys(rehearsals[activeYear] ?? {}).sort()
    : [];
  const days =
    activeYear && selectedMonth
      ? Object.keys(rehearsals[activeYear]?.[selectedMonth] ?? {}).sort()
      : [];
  const tracks =
    activeYear && selectedMonth && selectedDay
      ? (rehearsals[activeYear]?.[selectedMonth]?.[selectedDay] ?? [])
      : [];
  const currentTrack =
    currentTrackIndex !== null ? (tracks[currentTrackIndex] ?? null) : null;

  function switchSection(s: Section) {
    setActiveSection(s);
    setMenuOpen(false);
    setNavExpanded(false);
    setCurrentTrackIndex(null);
    if (s !== "archive") {
      const d = getDefaultsForYear(s);
      setSelectedMonth(d.month);
      setSelectedDay(d.day);
      setArchiveYear(null);
    } else {
      setArchiveYear(null);
      setSelectedMonth(null);
      setSelectedDay(null);
    }
  }

  function selectArchiveYear(year: string) {
    setArchiveYear(year);
    const d = getDefaultsForYear(year);
    setSelectedMonth(d.month);
    setSelectedDay(d.day);
    setCurrentTrackIndex(null);
    setNavExpanded(false);
  }

  function selectMonth(month: string) {
    setSelectedMonth(month);
    const newDays = activeYear
      ? Object.keys(rehearsals[activeYear]?.[month] ?? {}).sort()
      : [];
    setSelectedDay(newDays[newDays.length - 1] ?? null);
    setCurrentTrackIndex(null);
  }

  function selectDay(day: string) {
    setSelectedDay(day);
    setCurrentTrackIndex(null);
    setNavExpanded(false);
  }

  function handleNext() {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1)
      setCurrentTrackIndex(currentTrackIndex + 1);
  }
  function handlePrev() {
    if (currentTrackIndex !== null && currentTrackIndex > 0)
      setCurrentTrackIndex(currentTrackIndex - 1);
  }

  const formattedDate =
    selectedMonth && selectedDay
      ? `${MONTH_NAMES[selectedMonth]} ${parseInt(selectedDay, 10)}, ${activeYear}`
      : null;

  const sectionLabel = (s: Section) =>
    s === "archive" ? "Archive" : s;

  return (
    <div className={currentTrack ? "pb-36" : ""}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between mb-12 gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Last Night&apos;s Munchies
          </h1>
          <p className="text-[#555] mt-0.5 text-xs tracking-wide uppercase">
            Rehearsal Archives
          </p>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 shrink-0">
          {(["2026", "2025", "archive"] as Section[]).map((s) => (
            <button
              key={s}
              onClick={() => switchSection(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === s
                  ? "bg-[#e84d4d] text-white shadow-sm shadow-[#e84d4d]/30"
                  : "text-[#888] hover:text-white hover:bg-[#1e1e1e]"
              }`}
            >
              {sectionLabel(s)}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="relative md:hidden shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 text-[#888] hover:text-white transition-colors"
            aria-label="Open menu"
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 bg-[#161616] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl z-40 min-w-[150px]">
              {(["2026", "2025", "archive"] as Section[]).map((s) => (
                <button
                  key={s}
                  onClick={() => switchSection(s)}
                  className={`w-full px-5 py-3.5 text-sm text-left transition-colors ${
                    activeSection === s
                      ? "text-[#e84d4d] bg-[#e84d4d]/10 font-medium"
                      : "text-[#aaa] hover:text-white hover:bg-[#222]"
                  }`}
                >
                  {sectionLabel(s)}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── Archive: pick a year ── */}
      {activeSection === "archive" && !archiveYear && (
        <div className="mb-10">
          <p className="text-[#555] text-xs uppercase tracking-widest mb-4">
            Select Year
          </p>
          <div className="flex gap-2 flex-wrap">
            {ARCHIVE_YEARS.map((year) => (
              <TabButton key={year} active={false} onClick={() => selectArchiveYear(year)}>
                {year}
              </TabButton>
            ))}
          </div>
        </div>
      )}

      {/* ── Month / Day navigation (shown once a year is active) ── */}
      {activeYear && (activeSection !== "archive" || archiveYear) && (
        <div className="mb-10">
          {/* Back to archive list */}
          {activeSection === "archive" && archiveYear && (
            <button
              onClick={() => {
                setArchiveYear(null);
                setSelectedMonth(null);
                setSelectedDay(null);
              }}
              className="flex items-center gap-1 text-[#555] hover:text-[#888] text-xs mb-6 transition-colors"
            >
              ← Archive
            </button>
          )}

          {!navExpanded ? (
            /* Collapsed date pill */
            formattedDate && (
              <button
                onClick={() => setNavExpanded(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161616] border border-[#2a2a2a] text-[#aaa] hover:text-white hover:border-[#444] transition-colors text-sm group"
              >
                <span className="font-medium text-white">{formattedDate}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 text-[#555] group-hover:text-[#888] transition-colors shrink-0"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
            )
          ) : (
            /* Expanded month/day tabs */
            <div className="space-y-7">
              {months.length > 0 && (
                <nav>
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-3">Month</p>
                  <div className="flex gap-2 flex-wrap">
                    {months.map((m) => (
                      <TabButton
                        key={m}
                        active={selectedMonth === m}
                        onClick={() => selectMonth(m)}
                      >
                        {MONTH_NAMES[m]}
                      </TabButton>
                    ))}
                  </div>
                </nav>
              )}

              {days.length > 0 && (
                <nav>
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-3">Day</p>
                  <div className="flex gap-2 flex-wrap">
                    {days.map((d) => (
                      <TabButton
                        key={d}
                        active={selectedDay === d}
                        onClick={() => selectDay(d)}
                      >
                        {parseInt(d, 10)}
                      </TabButton>
                    ))}
                  </div>
                </nav>
              )}

              <button
                onClick={() => setNavExpanded(false)}
                className="flex items-center gap-1.5 text-[#555] hover:text-[#888] text-xs transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                Collapse
              </button>
            </div>
          )}

          {/* No sessions message */}
          {months.length === 0 && (
            <p className="text-[#555] text-sm pt-4">
              No sessions recorded for {activeYear} yet.
            </p>
          )}
        </div>
      )}

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
                  <button
                    onClick={() => setCurrentTrackIndex(index)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-left group ${
                      isActive
                        ? "bg-[#e84d4d]/15 border border-[#e84d4d]/30 text-white"
                        : "bg-[#161616] hover:bg-[#1e1e1e] border border-transparent text-[#bbb] hover:text-white"
                    }`}
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
                    <span className="flex-1 text-sm">{track.title}</span>
                    {isActive && (
                      <span className="text-[#e84d4d] text-xs font-medium shrink-0">
                        Playing
                      </span>
                    )}
                  </button>
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
    </div>
  );
}

/* ── Shared sub-components ── */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-[#e84d4d] text-white shadow-lg shadow-[#e84d4d]/20"
          : "bg-[#161616] text-[#888] hover:bg-[#1e1e1e] hover:text-white border border-[#2a2a2a]"
      }`}
    >
      {children}
    </button>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
