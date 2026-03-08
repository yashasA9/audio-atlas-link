import { Play } from "lucide-react";
import { Track } from "@/types/music";
import { usePlayer } from "@/context/PlayerContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface MusicCardProps {
  track: Track;
  index?: number;
}

export function MusicCard({ track, index = 0 }: MusicCardProps) {
  const { playTrack, setQueue } = usePlayer();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative rounded-xl p-3 surface-hover cursor-pointer surface"
      onClick={() => navigate(`/artist/${track.artistId}`)}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
        <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              playTrack(track);
            }}
            className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform glow-primary"
          >
            <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
          </button>
        </div>
      </div>
      <h3 className="text-sm font-semibold truncate text-foreground">{track.title}</h3>
      <p className="text-xs text-muted-foreground truncate mt-0.5">{track.artist}</p>
    </motion.div>
  );
}
