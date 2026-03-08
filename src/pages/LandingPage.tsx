import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, Music, Coins, Shield } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-background">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4">
          Music<span className="text-gradient">Dapp</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-8">
          The decentralized music platform where artists own their music and fans power the ecosystem.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
          {[
            { icon: Music, label: "Stream Music", desc: "Decentralized audio" },
            { icon: Coins, label: "Tip Artists", desc: "Direct crypto support" },
            { icon: Shield, label: "Own Your Music", desc: "Blockchain verified" },
            { icon: Wallet, label: "Web3 Native", desc: "Wallet-first auth" },
          ].map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass-card p-4">
              <f.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate("/")}
          className="px-8 py-4 rounded-full gradient-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity glow-primary"
        >
          Enter MusicDapp
        </motion.button>
      </motion.div>
    </div>
  );
}
