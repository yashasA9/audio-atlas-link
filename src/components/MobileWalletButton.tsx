import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileWalletButton() {
  const { address, shortAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:border-primary/40 transition-colors"
      >
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <Wallet className="h-4 w-4 text-primary" />
        )}
        <span className="text-xs font-medium text-foreground">
          {isConnecting ? "..." : address ? shortAddress : "Connect"}
        </span>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {address ? (
              <>
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs text-muted-foreground">Connected Wallet</p>
                  <p className="text-sm font-mono font-semibold text-foreground mt-1 break-all">{address}</p>
                </div>
                <button
                  onClick={() => {
                    disconnectWallet();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  connectWallet();
                  setMenuOpen(false);
                }}
                disabled={isConnecting}
                className="w-full px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
