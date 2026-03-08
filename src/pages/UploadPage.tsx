import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Music, Image, Check } from "lucide-react";

export default function UploadPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground">Upload Music</h1>
        <p className="text-muted-foreground mt-1">Share your music on the decentralized network</p>
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
          <button onClick={() => setStep(0)} className="px-8 py-3 rounded-full gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Publish to Blockchain
          </button>
        </motion.div>
      )}
    </div>
  );
}
