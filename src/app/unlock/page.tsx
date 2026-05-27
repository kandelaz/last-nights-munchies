import type { Metadata } from "next";
import UnlockForm from "@/components/UnlockForm";

export const metadata: Metadata = {
  title: "Last Night's Munchies",
  robots: { index: false, follow: false },
};

export default function UnlockPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 py-10">
      <UnlockForm />
    </main>
  );
}
