import { useState } from "react";
import { motion } from "framer-motion";
import { MusicCard } from "@/components/MusicCard";
import { mockTracks } from "@/data/mockData";

const genres = ["All", "Electronic", "Hip Hop", "Lo-Fi", "Ambient", "Indie", "Pop", "R&B", "Jazz"];

export default function DiscoverPage() {
  const [activeGenre, setActiveGenre] = useState("All");

  const filtered = activeGenre === "All" ? mockTracks : mockTracks.filter((t) => t.genre === activeGenre);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground">Discover</h1>
        <p className="text-muted-foreground mt-1">Explore the decentralized soundscape</p>
      </motion.div>

      {/* Genre Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeGenre === genre
                ? "bg-primary text-primary-foreground"
                : "surface text-muted-foreground hover:text-foreground surface-hover"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((track, i) => (
          <MusicCard key={track.id} track={track} index={i} />
        ))}
      </div>
    </div>
  );
}
