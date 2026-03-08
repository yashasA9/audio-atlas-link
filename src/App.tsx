import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "@/context/PlayerContext";
import { MainLayout } from "@/components/MainLayout";
import HomePage from "@/pages/HomePage";
import DiscoverPage from "@/pages/DiscoverPage";
import ArtistPage from "@/pages/ArtistPage";
import LibraryPage from "@/pages/LibraryPage";
import PlaylistsPage from "@/pages/PlaylistsPage";
import PlaylistDetailPage from "@/pages/PlaylistDetailPage";
import UploadPage from "@/pages/UploadPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PlayerProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/artist/:id" element={<ArtistPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
