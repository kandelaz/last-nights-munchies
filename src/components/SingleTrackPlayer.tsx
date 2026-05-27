"use client";

import { useEffect, useRef, useState } from "react";

interface SingleTrackPlayerProps {
  src: string;
  title: string;
  subtitle: string;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SingleTrackPlayer({ src, title, subtitle }: SingleTrackPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
  };

  const seek = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration || 0, audio.currentTime + delta));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 sm:p-7 shadow-2xl">
      <audio ref={audioRef} src={src} preload="metadata" />

      <p className="text-[#888] text-xs uppercase tracking-widest text-center">{subtitle}</p>
      <h1 className="text-white text-xl sm:text-2xl font-semibold text-center mt-2 leading-snug break-words">
        {title}
      </h1>

      <div className="mt-7">
        <div
          className="h-1.5 bg-[#2a2a2a] rounded-full cursor-pointer hover:h-2 transition-all"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-[#e84d4d] rounded-full pointer-events-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[#666] text-[11px] font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-5">
        <SeekBtn onClick={() => seek(-20)} label="−20s" />
        <SeekBtn onClick={() => seek(-10)} label="−10s" />
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-[#e84d4d] hover:bg-[#f05f5f] active:bg-[#c73c3c] text-white flex items-center justify-center transition-colors"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <SeekBtn onClick={() => seek(10)} label="+10s" />
        <SeekBtn onClick={() => seek(20)} label="+20s" />
      </div>
    </div>
  );
}

function SeekBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="h-10 px-2.5 rounded-md text-[11px] font-mono text-[#999] hover:text-white hover:bg-[#1e1e1e] transition-colors"
    >
      {label}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
