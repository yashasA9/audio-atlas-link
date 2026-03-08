import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { Home, Compass, Library, ListMusic, Upload, History, Wallet, LogOut, Loader2, User, LogIn } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/discover", icon: Compass, label: "Discover" },
  { to: "/library", icon: Library, label: "Library" },
  { to: "/playlists", icon: ListMusic, label: "Playlists" },
  { to: "/upload", icon: Upload, label: "Upload" },
  { to: "/transactions", icon: History, label: "History" },
];

export function AppSidebar() {
  const { address, shortAddress, balance, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-60 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      <div className="p-6">
        <h1 className="font-display text-xl font-bold text-gradient">MusicDapp</h1>
        <p className="text-xs text-muted-foreground mt-1">Decentralized Music</p>
      </div>

      nav className="flex-1 px-3 space-y-1">
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

      {/* User Section */}
      <div className="p-3 space-y-2">
        {user ? (
          <div className="glass-card p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-accent" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {profile?.display_name || user.email?.split("@")[0]}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-destructive py-1.5 rounded-md surface-hover transition-colors"
            >
              <LogOut className="h-3 w-3" /> Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="w-full glass-card p-3 flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:border-primary/30 transition-all"
          >
            <LogIn className="h-4 w-4 text-primary" />
            Sign In
          </button>
        )}

        {/* Wallet Section */}
        {address ? (
          <div className="glass-card p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{shortAddress}</p>
                {balance && <p className="text-[10px] text-muted-foreground">{balance}</p>}
              </div>
            </div>
            <button
              onClick={disconnectWallet}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-destructive py-1.5 rounded-md surface-hover transition-colors"
            >
              <LogOut className="h-3 w-3" /> Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full glass-card p-3 flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
          >
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Wallet className="h-4 w-4 text-primary" />
            )}
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </aside>
  );
}
