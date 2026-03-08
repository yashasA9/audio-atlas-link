import React, { createContext, useContext, useState, useCallback } from "react";
import { Track } from "@/types/music";

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  volume: number;
  progress: number;
  shuffle: boolean;
  repeat: "off" | "one" | "all";
}

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (v: number) => void;
  setProgress: (p: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    volume: 75,
    progress: 0,
    shuffle: false,
    repeat: "off",
  });

  const playTrack = useCallback((track: Track) => {
    setState((s) => ({ ...s, currentTrack: track, isPlaying: true, progress: 0 }));
  }, []);

  const togglePlay = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
  }, []);

  const nextTrack = useCallback(() => {
    setState((s) => {
      const idx = s.queue.findIndex((t) => t.id === s.currentTrack?.id);
      const next = s.queue[(idx + 1) % s.queue.length];
      return next ? { ...s, currentTrack: next, progress: 0 } : s;
    });
  }, []);

  const prevTrack = useCallback(() => {
    setState((s) => {
      const idx = s.queue.findIndex((t) => t.id === s.currentTrack?.id);
      const prev = s.queue[(idx - 1 + s.queue.length) % s.queue.length];
      return prev ? { ...s, currentTrack: prev, progress: 0 } : s;
    });
  }, []);

  const setVolume = useCallback((v: number) => setState((s) => ({ ...s, volume: v })), []);
  const setProgress = useCallback((p: number) => setState((s) => ({ ...s, progress: p })), []);
  const toggleShuffle = useCallback(() => setState((s) => ({ ...s, shuffle: !s.shuffle })), []);
  const toggleRepeat = useCallback(() => {
    setState((s) => ({
      ...s,
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    }));
  }, []);
  const addToQueue = useCallback((track: Track) => setState((s) => ({ ...s, queue: [...s.queue, track] })), []);
  const setQueue = useCallback((tracks: Track[]) => setState((s) => ({ ...s, queue: tracks })), []);

  return (
    <PlayerContext.Provider value={{ ...state, playTrack, togglePlay, nextTrack, prevTrack, setVolume, setProgress, toggleShuffle, toggleRepeat, addToQueue, setQueue }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
