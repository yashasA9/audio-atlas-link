import { useState } from "react";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TipModalProps {
  artistName: string;
  isOpen: boolean;
  onClose: () => void;
}

const tipAmounts = [0.01, 0.05, 0.1, 0.5, 1];

export function TipModal({ artistName, isOpen, onClose }: TipModalProps) {
  const [selected, setSelected] = useState(0.05);
  const [sending, setSending] = useState(false);

  const handleTip = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-6 w-full max-w-sm mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Tip {artistName}</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">Support this artist with ETH</p>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {tipAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelected(amount)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    selected === amount
                      ? "bg-primary text-primary-foreground glow-primary"
                      : "surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>

            <button
              onClick={handleTip}
              disabled={sending}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : `Send ${selected} ETH`}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
