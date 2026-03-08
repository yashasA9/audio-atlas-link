import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Users, Coins, Music, Play, Trash2, Edit2, Plus, Loader2, TrendingUp, Eye
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface ArtistStats {
  totalTips: number;
  totalPlays: number;
  totalFollowers: number;
  totalTracks: number;
}

interface DashboardTrack {
  id: string;
  title: string;
  genre: string | null;
  cover_art: string | null;
  duration: number;
  play_count: number;
  created_at: string;
}

export default function ArtistDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [artistId, setArtistId] = useState<string | null>(null);
  const [artistName, setArtistName] = useState("");
  const [stats, setStats] = useState<ArtistStats>({
    totalTips: 0, totalPlays: 0, totalFollowers: 0, totalTracks: 0,
  });
  const [tracks, setTracks] = useState<DashboardTrack[]>([]);
  const [editingTrack, setEditingTrack] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!user) return;
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;
    setLoading(true);

    // Check if user has an artist profile
    const { data: artist } = await supabase
      .from("artists")
      .select("id, name, followers_count, total_tips")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!artist) {
      setLoading(false);
      return;
    }

    setArtistId(artist.id);
    setArtistName(artist.name);

    // Fetch tracks
    const { data: trackData } = await supabase
      .from("tracks")
      .select("id, title, genre, cover_art, duration, play_count, created_at")
      .eq("artist_id", artist.id)
      .order("created_at", { ascending: false });

    const fetchedTracks = trackData || [];
    setTracks(fetchedTracks);

    // Fetch follower count
    const { count: followerCount } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("artist_id", artist.id);

    // Fetch total tips
    const { data: tipData } = await supabase
      .from("tips")
      .select("amount")
      .eq("to_artist_id", artist.id)
      .eq("status", "confirmed");

    const totalTipAmount = tipData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalPlays = fetchedTracks.reduce((sum, t) => sum + t.play_count, 0);

    setStats({
      totalTips: totalTipAmount,
      totalPlays,
      totalFollowers: followerCount || 0,
      totalTracks: fetchedTracks.length,
    });

    setLoading(false);
  };

  const handleDeleteTrack = async (trackId: string) => {
    const { error } = await supabase.from("tracks").delete().eq("id", trackId);
    if (error) {
      toast.error("Failed to delete track");
    } else {
      toast.success("Track deleted");
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
      setStats((s) => ({ ...s, totalTracks: s.totalTracks - 1 }));
    }
  };

  const handleRenameTrack = async (trackId: string) => {
    if (!editTitle.trim()) return;
    const { error } = await supabase
      .from("tracks")
      .update({ title: editTitle.trim() })
      .eq("id", trackId);
    if (error) {
      toast.error("Failed to rename track");
    } else {
      toast.success("Track renamed");
      setTracks((prev) =>
        prev.map((t) => (t.id === trackId ? { ...t, title: editTitle.trim() } : t))
      );
      setEditingTrack(null);
    }
  };

  const handleCreateArtist = async () => {
    if (!user) return;
    const name = prompt("Enter your artist name:");
    if (!name?.trim()) return;
    const { error } = await supabase.from("artists").insert({
      user_id: user.id,
      name: name.trim(),
    });
    if (error) {
      toast.error("Failed to create artist profile");
    } else {
      toast.success("Artist profile created!");
      loadDashboard();
    }
  };

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!user) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="glass-card p-12 text-center">
          <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground font-semibold text-lg">Sign in to access your dashboard</p>
          <button onClick={() => navigate("/auth")} className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!artistId) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="glass-card p-12 text-center">
          <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground font-semibold text-lg">You don't have an artist profile yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Create one to start publishing music and receiving tips</p>
          <button
            onClick={handleCreateArtist}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" /> Create Artist Profile
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Plays", value: stats.totalPlays.toLocaleString(), icon: Play, color: "text-primary" },
    { label: "Followers", value: stats.totalFollowers.toLocaleString(), icon: Users, color: "text-accent" },
    { label: "Tips Earned", value: `${stats.totalTips.toFixed(4)} ETH`, icon: Coins, color: "text-primary" },
    { label: "Tracks", value: stats.totalTracks.toString(), icon: Music, color: "text-accent" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground">Artist Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, <span className="text-primary font-medium">{artistName}</span></p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground font-display">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tracks Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Your Tracks
          </h2>
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Upload
          </button>
        </div>

        {tracks.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Music className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-foreground font-semibold">No tracks yet</p>
            <p className="text-sm text-muted-foreground mt-1">Upload your first track to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track, i) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                {/* Cover */}
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {track.cover_art ? (
                    <img src={track.cover_art} alt={track.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Music className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {editingTrack === track.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRenameTrack(track.id)}
                        className="px-2 py-1 rounded surface border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-transparent flex-1"
                        autoFocus
                      />
                      <button onClick={() => handleRenameTrack(track.id)} className="text-xs text-primary font-medium">Save</button>
                      <button onClick={() => setEditingTrack(null)} className="text-xs text-muted-foreground">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-foreground truncate">{track.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {track.genre && <span className="text-xs text-muted-foreground">{track.genre}</span>}
                        <span className="text-xs text-muted-foreground">{formatDuration(track.duration)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Play count */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Eye className="h-3 w-3" />
                  {track.play_count.toLocaleString()}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setEditingTrack(track.id); setEditTitle(track.title); }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    title="Rename"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTrack(track.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
