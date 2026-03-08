import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Heart } from "lucide-react";
import { mockPlaylists } from "@/data/mockData";
import { usePlayer } from "@/context/PlayerContext";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const playlist = mockPlaylists.find((p) => p.id === id) || mockPlaylists[0];
  const { playTrack, setQueue } = usePlayer();

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks);
      playTrack(playlist.tracks[0]);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-end gap-6">
        <img src={playlist.coverArt} alt={playlist.name} className="h-48 w-48 rounded-xl object-cover shadow-2xl" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Playlist</p>
          <h1 className="font-display text-4xl font-bold text-foreground mt-1">{playlist.name}</h1>
          <p className="text-sm text-muted-foreground mt-2">{playlist.trackCount} tracks</p>
          <button onClick={handlePlayAll} className="mt-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform glow-primary">
            <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {playlist.tracks.map((track, i) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => { setQueue(playlist.tracks); playTrack(track); }}
            className="flex items-center gap-4 p-3 rounded-lg surface-hover cursor-pointer group"
          >
            <span className="w-6 text-center text-sm text-muted-foreground group-hover:hidden">{i + 1}</span>
            <Play className="w-6 h-4 text-foreground hidden group-hover:block" />
            <img src={track.coverArt} alt={track.title} className="h-10 w-10 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground">{track.artist}</p>
            </div>
            <span className="text-xs text-muted-foreground">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}</span>
            <Heart className={`h-4 w-4 ${track.liked ? "text-primary fill-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
