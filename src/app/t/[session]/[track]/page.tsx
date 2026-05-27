import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllShareableTracks,
  getAudioPath,
  getTrackBySlug,
  MONTH_NAMES,
} from "@/data/rehearsals";
import SingleTrackPlayer from "@/components/SingleTrackPlayer";

type Params = { session: string; track: string };

export function generateStaticParams() {
  return getAllShareableTracks();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { session, track } = await params;
  const found = getTrackBySlug(session, track);
  if (!found) return { title: "Track not found" };
  const { track: t, month, day, year } = found;
  const dateLabel = `${MONTH_NAMES[month]} ${parseInt(day, 10)}, ${year}`;
  const title = `${t.title} — Last Night's Munchies`;
  const description = `Rehearsal recording from ${dateLabel}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "music.song" },
    twitter: { card: "summary", title, description },
    robots: { index: false, follow: false },
  };
}

export default async function TrackPage({ params }: { params: Promise<Params> }) {
  const { session, track } = await params;
  const found = getTrackBySlug(session, track);
  if (!found) notFound();
  const { track: t, year, month, day } = found;
  const src = getAudioPath(year, month, day, t.filename);
  const subtitle = `${MONTH_NAMES[month]} ${parseInt(day, 10)}, ${year}`;

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center px-4 py-10">
      <SingleTrackPlayer src={src} title={t.title} subtitle={subtitle} />
    </main>
  );
}
