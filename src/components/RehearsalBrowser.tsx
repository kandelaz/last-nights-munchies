"use client";

import { useState } from "react";
import { rehearsals, MONTH_NAMES } from "@/data/rehearsals";
import AudioPlayer from "./AudioPlayer";

export default function RehearsalBrowser() {
  const years = Object.keys(rehearsals).sort();
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);

  const months = Object.keys(rehearsals[selectedYear] ?? {}).sort();
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const days = Object.keys(rehearsals[selectedYear]?.[selectedMonth] ?? {}).sort();
  const [selectedDay, setSelectedDay] = useState(days[days.length - 1]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

  const tracks = rehearsals[selectedYear]?.[selectedMonth]?.[selectedDay] ?? [];
  const currentTrack = currentTrackIndex !== null ? (tracks[currentTrackIndex] ?? null) : null;

  function selectYear(year: string) {
    setSelectedYear(year);
    const newMonths = Object.keys(rehearsals[year] ?? {}).sort();
    const newMonth = newMonths.includes(selectedMonth) ? selectedMonth : newMonths[newMonths.length - 1];
    setSelectedMonth(newMonth);
    const newDays = Object.keys(rehearsals[year]?.[newMonth] ?? {}).sort();
    const newDay = newDays.includes(selectedDay) ? selectedDay : newDays[newDays.length - 1];
    setSelectedDay(newDay);
    setCurrentTrackIndex(null);
  }

  function selectMonth(month: string) {
    setSelectedMonth(month);
    const newDays = Object.keys(rehearsals[selectedYear]?.[month] ?? {}).sort();
    const newDay = newDays.includes(selectedDay) ? selectedDay : newDays[newDays.length - 1];
    setSelectedDay(newDay);
    setCurrentTrackIndex(null);
  }

  function selectDay(day: string) {
    setSelectedDay(day);
    setCurrentTrackIndex(null);
  }

  function handleNext() {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  }

  function handlePrev() {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  }

  return (
    <div className={currentTrack ? "pb-36" : ""}>
      {/* Year tabs */}
      <nav className="mb-7">
        <p className="text-[#555] text-xs uppercase tracking-widest mb-3">Year</p>
        <div className="flex gap-2 flex-wrap">
          {years.map((year) => (
            <TabButton key={year} active={selectedYear === year} onClick={() => selectYear(year)}>
              {year}
            </TabButton>
          ))}
        </div>
      </nav>

      {/* Month tabs */}
      <nav className="mb-7">
        <p className="text-[#555] text-xs uppercase tracking-widest mb-3">Month</p>
        <div className="flex gap-2 flex-wrap">
          {months.map((month) => (
            <TabButton key={month} active={selectedMonth === month} onClick={() => selectMonth(month)}>
              {MONTH_NAMES[month]}
            </TabButton>
          ))}
        </div>
      </nav>

      {/* Day tabs */}
      <nav className="mb-10">
        <p className="text-[#555] text-xs uppercase tracking-widest mb-3">Day</p>
        <div className="flex gap-2 flex-wrap">
          {days.map((day) => (
            <TabButton key={day} active={selectedDay === day} onClick={() => selectDay(day)}>
              {parseInt(day, 10)}
            </TabButton>
          ))}
        </div>
      </nav>

      {/* Track list */}
      {tracks.length > 0 && (
        <section>
          <p className="text-[#555] text-xs uppercase tracking-widest mb-4">
            {MONTH_NAMES[selectedMonth]} {parseInt(selectedDay, 10)}, {selectedYear} &mdash;{" "}
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
                      <span className="text-[#e84d4d] text-xs font-medium shrink-0">Playing</span>
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
        year={selectedYear}
        month={selectedMonth}
        day={selectedDay}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={currentTrackIndex !== null && currentTrackIndex < tracks.length - 1}
        hasPrev={currentTrackIndex !== null && currentTrackIndex > 0}
      />
    </div>
  );
}

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
