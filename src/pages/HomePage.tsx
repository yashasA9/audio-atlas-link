import { motion } from "framer-motion";
import { MusicCard } from "@/components/MusicCard";
import { ArtistCard } from "@/components/ArtistCard";
import { trendingTracks, recommendedArtists, newReleases } from "@/data/mockData";

export default function HomePage() {
  return (
    <div className="p-6 md:p-8 space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Good Evening
        </h1>
        <p className="text-muted-foreground mt-1">Welcome back to the decentralized beat.</p>
      </motion.div>

      {/* Trending */}
      <section>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingTracks.map((track, i) => (
            <MusicCard key={track.id} track={track} index={i} />
          ))}
        </div>
      </section>

      {/* Artists */}
      <section>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Recommended Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recommendedArtists.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">New Releases</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newReleases.map((track, i) => (
            <MusicCard key={track.id} track={track} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
