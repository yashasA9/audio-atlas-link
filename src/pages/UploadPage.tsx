import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Music, Image, Check, Wallet } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

export default function UploadPage() {
  const [step, setStep] = useState(0);
  const { address, shortAddress } = useWallet();

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground">Upload Music</h1>
        <p className="text-muted-foreground mt-1">Share your music on the decentralized network</p>
        {address && (
          <div className="mt-4 glass-card px-4 py-3 flex items-center gap-2 w-fit">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Publishing as:</span>
            <span className="text-sm font-mono font-medium text-foreground">{shortAddress}</span>
          </div>
        )}
      </motion.div>

      {/* Steps */}
      <div className="flex items-center gap-4">
        {["Upload File", "Add Details", "Publish"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i <= step ? "bg-primary text-primary-foreground" : "surface text-muted-foreground"
            }`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
            {i < 2 && <div className={`h-px w-8 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8">
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setStep(1)}>
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-foreground font-medium">Drop your audio file here</p>
            <p className="text-sm text-muted-foreground mt-1">MP3, WAV, FLAC up to 50MB</p>
            <button className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">Browse Files</button>
          </div>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Track Title</label>
            <input className="w-full px-4 py-3 rounded-lg surface border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter track title" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Genre</label>
            <select className="w-full px-4 py-3 rounded-lg surface border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary bg-transparent">
              <option>Electronic</option>
              <option>Hip Hop</option>
              <option>Lo-Fi</option>
              <option>Ambient</option>
              <option>Indie</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Cover Art</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Upload cover image</p>
            </div>
          </div>
          <button onClick={() => setStep(2)} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Continue</button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Music className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">Ready to Publish</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">Your track will be stored on IPFS and registered on the blockchain</p>
          {address && (
            <div className="glass-card px-4 py-3 flex items-center justify-center gap-2 mb-6 w-fit mx-auto">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Publishing Identity:</span>
              <span className="text-sm font-mono font-medium text-foreground">{shortAddress}</span>
            </div>
          )}
          {!address && (
            <div className="glass-card px-4 py-3 mb-6 text-center bg-accent/10 border border-accent/30">
              <p className="text-sm text-accent font-medium">⚠️ Connect your wallet to publish tracks</p>
            </div>
          )}
          <button onClick={() => setStep(0)} disabled={!address} className={`px-8 py-3 rounded-full font-semibold transition-opacity ${
            address ? "gradient-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}>
            Publish to Blockchain
          </button>
        </motion.div>
      )}
    </div>
  );
}
