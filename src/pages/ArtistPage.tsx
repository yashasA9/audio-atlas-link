import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Heart, Users, Coins } from "lucide-react";
import { mockArtists, mockTracks } from "@/data/mockData";
import { usePlayer } from "@/context/PlayerContext";
import { TipModal } from "@/components/TipModal";

export default function ArtistPage() {
  const { id } = useParams();
  const artist = mockArtists.find((a) => a.id === id) || mockArtists[0];
  const artistTracks = mockTracks.filter((t) => t.artistId === artist.id);
  const { playTrack, setQueue } = usePlayer();
  const [tipOpen, setTipOpen] = useState(false);
  const [following, setFollowing] = useState(false);

  const handlePlayAll = () => {
    if (artistTracks.length > 0) {
      setQueue(artistTracks);
      playTrack(artistTracks[0]);
    }
  };

  return (
    <div className="pb-8">
      {/* Banner */}
      <div className="relative h-64 md:h-80">
        <img src={artist.banner} alt={artist.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-6 left-6 md:left-8 flex items-end gap-4">
          <img src={artist.avatar} alt={artist.name} className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background object-cover" />
          <div>
            <p className="text-xs text-primary font-semibold uppercase tracking-wider">Artist</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">{artist.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{artist.followers.toLocaleString()} followers</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 md:px-8 mt-6 flex items-center gap-4">
        <button onClick={handlePlayAll} className="h-12 w-12 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform glow-primary">
          <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
        </button>
        <button onClick={() => setFollowing(!following)} className={`px-6 py-2 rounded-full border text-sm font-semibold transition-all ${following ? "bg-primary text-primary-foreground border-primary" : "border-foreground/30 text-foreground hover:border-foreground"}`}>
          {following ? "Following" : "Follow"}
        </button>
        <button onClick={() => setTipOpen(true)} className="px-6 py-2 rounded-full gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
          <Coins className="h-4 w-4" /> Tip
        </button>
      </div>

      {/* Stats */}
      <div className="px-6 md:px-8 mt-6 flex gap-6">
        <div className="glass-card px-4 py-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{artist.followers.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">Followers</span>
        </div>
        <div className="glass-card px-4 py-3 flex items-center gap-2">
          <Coins className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">{artist.totalTips} ETH</span>
          <span className="text-xs text-muted-foreground">Tips</span>
        </div>
      </div>

      {/* Tracks */}
      <div className="px-6 md:px-8 mt-8">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Tracks</h2>
        <div className="space-y-2">
          {artistTracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setQueue(artistTracks); playTrack(track); }}
              className="flex items-center gap-4 p-3 rounded-lg surface-hover cursor-pointer group"
            >
              <span className="w-6 text-center text-sm text-muted-foreground group-hover:hidden">{i + 1}</span>
              <Play className="w-6 h-4 text-foreground hidden group-hover:block" />
              <img src={track.coverArt} alt={track.title} className="h-10 w-10 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground">{track.playCount.toLocaleString()} plays</p>
              </div>
              <span className="text-xs text-muted-foreground">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}</span>
              <Heart className={`h-4 w-4 cursor-pointer ${track.liked ? "text-primary fill-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`} />
            </motion.div>
          ))}
        </div>
      </div>

      <TipModal artistName={artist.name} isOpen={tipOpen} onClose={() => setTipOpen(false)} />
    </div>
  );
}
