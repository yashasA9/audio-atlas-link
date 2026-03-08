import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, Heart } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer() {
  const {
    currentTrack, isPlaying, togglePlay, nextTrack, prevTrack,
    volume, setVolume, progress, setProgress, shuffle, toggleShuffle,
    repeat, toggleRepeat,
  } = usePlayer();

  if (!currentTrack) return null;

  const elapsed = (progress / 100) * currentTrack.duration;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 h-20 border-t border-border bg-card/95 backdrop-blur-xl"
    >
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-64 min-w-0">
          <img
            src={currentTrack.coverArt}
            alt={currentTrack.title}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          <Heart className={`h-4 w-4 flex-shrink-0 cursor-pointer transition-colors ${currentTrack.liked ? "text-primary fill-primary" : "text-muted-foreground hover:text-foreground"}`} />
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1 max-w-xl">
          <div className="flex items-center gap-4">
            <button onClick={toggleShuffle} className={`transition-colors ${shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <Shuffle className="h-4 w-4" />
            </button>
            <button onClick={prevTrack} className="text-muted-foreground hover:text-foreground transition-colors">
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-background" />
              ) : (
                <Play className="h-4 w-4 text-background ml-0.5" />
              )}
            </button>
            <button onClick={nextTrack} className="text-muted-foreground hover:text-foreground transition-colors">
              <SkipForward className="h-5 w-5" />
            </button>
            <button onClick={toggleRepeat} className={`transition-colors ${repeat !== "off" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {repeat === "one" ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-muted-foreground w-10 text-right">{formatTime(elapsed)}</span>
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={([v]) => setProgress(v)}
              className="flex-1"
            />
            <span className="text-[10px] text-muted-foreground w-10">{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-2 w-36">
          <button onClick={() => setVolume(volume === 0 ? 75 : 0)} className="text-muted-foreground hover:text-foreground transition-colors">
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={([v]) => setVolume(v)}
            className="flex-1"
          />
        </div>
      </div>
    </motion.div>
  );
}
