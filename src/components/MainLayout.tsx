import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AudioPlayer } from "@/components/AudioPlayer";
import { usePlayer } from "@/context/PlayerContext";
import { Menu } from "lucide-react";
import { useState } from "react";

export function MainLayout() {
  const { currentTrack } = usePlayer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card/95 backdrop-blur-xl border-b border-border flex items-center px-4">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="ml-3 font-display text-lg font-bold text-gradient">MusicDapp</h1>
      </div>

      <main className={`flex-1 overflow-y-auto scrollbar-hide ${currentTrack ? "pb-24" : "pb-4"} md:pt-0 pt-14`}>
        <Outlet />
      </main>

      <AudioPlayer />
    </div>
  );
}
