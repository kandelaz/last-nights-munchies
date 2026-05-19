"use client";

import { useEffect, useRef, useState } from "react";
import { Track, getAudioPath } from "@/data/rehearsals";

interface AudioPlayerProps {
  track: Track | null;
  year: string;
  month: string;
  day: string;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  track,
  year,
  month,
  day,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const src = track ? getAudioPath(year, month, day, track.filename) : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      if (hasNext) onNext();
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [hasNext, onNext]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const seekBack = (secs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - secs);
  };

  const seekForward = (secs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration || 0, audio.currentTime + secs);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  if (!track) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#2a2a2a] px-4 md:px-6 py-4 md:py-4 z-50">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src ?? undefined} preload="metadata" />

      <div className="max-w-4xl mx-auto space-y-3 md:space-y-3">
        {/* Track info */}
        <div className="flex items-center gap-3">
          <span className="text-[#e84d4d] text-xs font-mono font-bold shrink-0">
            #{String(track.number).padStart(2, "0")}
          </span>
          <span className="text-white font-medium text-sm truncate">{track.title}</span>
          <span className="text-[#555] text-xs ml-auto shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-1 bg-[#2a2a2a] rounded-full cursor-pointer hover:h-2 transition-all"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-[#e84d4d] rounded-full pointer-events-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Mobile controls: −30s −20s −10s | Prev Play/Pause Next | +20s ── */}
        <div className="flex md:hidden items-center justify-between gap-0.5 pt-2">
          <ControlBtn onClick={() => seekBack(30)} title="Back 30s">
            <span className="text-xs font-mono leading-none">−30s</span>
          </ControlBtn>
          <ControlBtn onClick={() => seekBack(20)} title="Back 20s">
            <span className="text-xs font-mono leading-none">−20s</span>
          </ControlBtn>
          <ControlBtn onClick={() => seekBack(10)} title="Back 10s">
            <span className="text-xs font-mono leading-none">−10s</span>
          </ControlBtn>
          <ControlBtn onClick={onPrev} disabled={!hasPrev} title="Previous track">
            <PrevIcon />
          </ControlBtn>
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-[#e84d4d] hover:bg-[#f05f5f] active:bg-[#c73c3c] text-white flex items-center justify-center transition-colors shrink-0"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <ControlBtn onClick={onNext} disabled={!hasNext} title="Next track">
            <NextIcon />
          </ControlBtn>
          <ControlBtn onClick={() => seekForward(20)} title="Forward 20s">
            <span className="text-xs font-mono leading-none">+20s</span>
          </ControlBtn>
        </div>

        {/* ── Desktop controls: −40s −20s | Prev Play/Pause Next | +20s | Volume ── */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ControlBtn onClick={() => seekBack(40)} title="Back 40s">
              <span className="text-xs font-mono">−40s</span>
            </ControlBtn>
            <ControlBtn onClick={() => seekBack(20)} title="Back 20s">
              <span className="text-xs font-mono">−20s</span>
            </ControlBtn>
            <ControlBtn onClick={onPrev} disabled={!hasPrev} title="Previous track">
              <PrevIcon />
            </ControlBtn>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#e84d4d] hover:bg-[#f05f5f] active:bg-[#c73c3c] text-white flex items-center justify-center transition-colors mx-1"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <ControlBtn onClick={onNext} disabled={!hasNext} title="Next track">
              <NextIcon />
            </ControlBtn>
            <ControlBtn onClick={() => seekForward(20)} title="Forward 20s">
              <span className="text-xs font-mono">+20s</span>
            </ControlBtn>
          </div>

          {/* Volume (desktop only) */}
          <div className="flex items-center gap-2">
            <VolumeIcon muted={volume === 0} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 accent-[#e84d4d] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlBtn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-9 h-9 flex items-center justify-center rounded text-[#999] hover:text-white hover:bg-[#1e1e1e] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#555] shrink-0">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-10-8L6 8H2v8h4l3 3V4zm7.07 8L14 10.07V5.23a6.5 6.5 0 0 1 4 5.99 6.47 6.47 0 0 1-.64 2.77l1.45 1.45A8.47 8.47 0 0 0 20 12c0-4.44-3.04-8.16-7.12-9.25" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#555] shrink-0">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}
