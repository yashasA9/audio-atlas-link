import { NavLink as RouterNavLink } from "react-router-dom";
import { Home, Compass, Library, ListMusic, Upload, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/discover", icon: Compass, label: "Discover" },
  { to: "/library", icon: Library, label: "Library" },
  { to: "/playlists", icon: ListMusic, label: "Playlists" },
  { to: "/upload", icon: Upload, label: "Upload" },
];

export function AppSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      <div className="p-6">
        <h1 className="font-display text-xl font-bold text-gradient">MusicDapp</h1>
        <p className="text-xs text-muted-foreground mt-1">Decentralized Music</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </RouterNavLink>
        ))}
      </nav>

      <div className="p-4 m-3 glass-card">
        <div className="flex items-center gap-2 text-sm">
          <Wallet className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Connect Wallet</span>
        </div>
      </div>
    </aside>
  );
}
