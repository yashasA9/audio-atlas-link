import { motion } from "framer-motion";
import { mockPlaylists } from "@/data/mockData";
import { ListMusic, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlaylistsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">Playlists</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> New Playlist
        </button>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mockPlaylists.map((pl, i) => (
          <motion.div
            key={pl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/playlist/${pl.id}`)}
            className="surface rounded-xl p-3 cursor-pointer surface-hover group"
          >
            <div className="aspect-square rounded-lg overflow-hidden mb-3">
              <img src={pl.coverArt} alt={pl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h3 className="text-sm font-semibold text-foreground truncate">{pl.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <ListMusic className="h-3 w-3" /> {pl.trackCount} tracks
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
