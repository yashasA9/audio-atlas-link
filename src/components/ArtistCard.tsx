import { Artist } from "@/types/music";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
  artist: Artist;
  index?: number;
}

export function ArtistCard({ artist, index = 0 }: ArtistCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/artist/${artist.id}`)}
      className="group flex flex-col items-center p-4 rounded-xl cursor-pointer surface surface-hover"
    >
      <div className="relative h-32 w-32 rounded-full overflow-hidden mb-3 ring-2 ring-border group-hover:ring-primary transition-all">
        <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{artist.name}</h3>
      <p className="text-xs text-muted-foreground">{artist.followers.toLocaleString()} followers</p>
    </motion.div>
  );
}
