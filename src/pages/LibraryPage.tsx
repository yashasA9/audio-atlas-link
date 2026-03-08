import { motion } from "framer-motion";
import { mockTracks, mockPlaylists } from "@/data/mockData";
import { MusicCard } from "@/components/MusicCard";
import { ListMusic } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LibraryPage() {
  const likedTracks = mockTracks.filter((t) => t.liked);
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground">Your Library</h1>
      </motion.div>

      {/* Playlists */}
      <section>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mockPlaylists.map((pl, i) => (
            <motion.div
              key={pl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/playlist/${pl.id}`)}
              className="surface rounded-xl p-3 cursor-pointer surface-hover"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <img src={pl.coverArt} alt={pl.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-semibold text-foreground truncate">{pl.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <ListMusic className="h-3 w-3" /> {pl.trackCount} tracks
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Liked Songs */}
      <section>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Liked Songs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {likedTracks.map((track, i) => (
            <MusicCard key={track.id} track={track} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
