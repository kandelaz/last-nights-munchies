"use client";

import { useEffect, useRef, useState } from "react";

interface ShareMenuProps {
  onClose: () => void;
  shareUrl: string;
  trackTitle: string;
  variant: "popover" | "sheet";
  anchorRect?: DOMRect | null;
}

export default function ShareMenu({
  onClose,
  shareUrl,
  trackTitle,
  variant,
  anchorRect,
}: ShareMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, [onClose]);

  const message = `Listen: ${trackTitle} — ${shareUrl}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(trackTitle)}&body=${encodeURIComponent(message)}`;
  const smsHref = `sms:?&body=${encodeURIComponent(message)}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => onClose(), 900);
    } catch {
      setCopied(false);
    }
  };

  const items = (
    <>
      <MenuItem href={emailHref} onClick={onClose} icon={<EmailIcon />} label="Email" />
      <MenuItem href={smsHref} onClick={onClose} icon={<SmsIcon />} label="Text message" />
      <MenuItem
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        icon={<WhatsAppIcon />}
        label="WhatsApp"
      />
      <button
        onClick={handleCopy}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#ddd] hover:bg-[#222] hover:text-white transition-colors text-left"
      >
        <span className="w-5 h-5 flex items-center justify-center text-[#888]">
          <LinkIcon />
        </span>
        <span>{copied ? "Copied!" : "Copy link"}</span>
      </button>
    </>
  );

  if (variant === "sheet") {
    return (
      <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60">
        <div
          ref={ref}
          className="w-full max-w-md bg-[#161616] border-t border-[#2a2a2a] rounded-t-2xl overflow-hidden shadow-2xl pb-[env(safe-area-inset-bottom)]"
        >
          <div className="flex justify-center pt-2">
            <div className="w-10 h-1 rounded-full bg-[#333]" />
          </div>
          <div className="px-4 pt-3 pb-2">
            <p className="text-[#888] text-xs uppercase tracking-widest">Share</p>
            <p className="text-white text-sm font-medium truncate mt-0.5">{trackTitle}</p>
          </div>
          <div className="py-1">{items}</div>
        </div>
      </div>
    );
  }

  const style: React.CSSProperties = {};
  if (anchorRect) {
    style.top = anchorRect.bottom + 6;
    style.left = Math.max(8, anchorRect.right - 200);
  }

  return (
    <div
      ref={ref}
      style={style}
      className="fixed z-[60] w-[200px] bg-[#161616] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl"
    >
      <div className="px-4 pt-3 pb-2 border-b border-[#2a2a2a]">
        <p className="text-[#888] text-[10px] uppercase tracking-widest">Share</p>
        <p className="text-white text-xs font-medium truncate mt-0.5">{trackTitle}</p>
      </div>
      <div className="py-1">{items}</div>
    </div>
  );
}

function MenuItem({
  href,
  onClick,
  icon,
  label,
  target,
  rel,
}: {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  target?: string;
  rel?: string;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#ddd] hover:bg-[#222] hover:text-white transition-colors"
    >
      <span className="w-5 h-5 flex items-center justify-center text-[#888]">{icon}</span>
      <span>{label}</span>
    </a>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function SmsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.9-2.1-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3c.2.2 2.1 3.3 5.2 4.6 1.9.8 2.7.9 3.7.7.6-.1 1.7-.7 2-1.4.3-.7.3-1.2.2-1.4-.1-.2-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10z" />
    </svg>
  );
}
