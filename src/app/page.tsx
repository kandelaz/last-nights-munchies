import RehearsalBrowser from "@/components/RehearsalBrowser";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Last Night&apos;s Munchies
          </h1>
          <p className="text-[#555] mt-1 text-sm tracking-wide uppercase">Rehearsal Archives</p>
        </header>
        <RehearsalBrowser />
      </div>
    </main>
  );
}
