"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UnlockForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Wrong password.");
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm bg-[#141414] border border-[#2a2a2a] rounded-2xl p-7 shadow-2xl"
    >
      <div className="flex justify-center mb-5 text-4xl">🍕</div>
      <h1 className="text-white text-xl font-semibold text-center">
        Last Night&apos;s Munchies
      </h1>
      <p className="text-[#888] text-sm text-center mt-1 mb-6">
        Rehearsal archives — enter password
      </p>

      <input
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white placeholder-[#555] outline-none focus:border-[#e84d4d] transition-colors"
        placeholder="Password"
        aria-label="Password"
      />

      {error && (
        <p className="text-[#e84d4d] text-xs mt-2" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !password}
        className="w-full mt-4 bg-[#e84d4d] hover:bg-[#f05f5f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {pending ? "Unlocking…" : "Unlock"}
      </button>
    </form>
  );
}
