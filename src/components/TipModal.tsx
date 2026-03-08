import { useState } from "react";
import { X, Send, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import { BrowserProvider, parseEther } from "ethers";
import { toast } from "@/components/ui/sonner";

interface TipModalProps {
  artistName: string;
  artistWallet?: string;
  isOpen: boolean;
  onClose: () => void;
}

const tipAmounts = [0.01, 0.05, 0.1, 0.5, 1];

// Demo recipient address (used when no artistWallet is provided)
const DEMO_RECIPIENT = "0x000000000000000000000000000000000000dEaD";

export function TipModal({ artistName, artistWallet, isOpen, onClose }: TipModalProps) {
  const [selected, setSelected] = useState(0.05);
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();

  const resetState = () => {
    setTxHash(null);
    setError(null);
    setSending(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleTip = async () => {
    if (!address) {
      setError("Please connect your wallet first.");
      toast.error("Please connect your wallet first.");
      return;
    }

    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      setError("MetaMask not found.");
      toast.error("MetaMask not found.");
      return;
    }

    setSending(true);
    setError(null);
    setTxHash(null);

    try {
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const recipient = artistWallet || DEMO_RECIPIENT;

      const tx = await signer.sendTransaction({
        to: recipient,
        value: parseEther(selected.toString()),
      });

      setTxHash(tx.hash);
      toast.loading(`Confirming ${selected} ETH transaction on-chain...`);
      
      await tx.wait();
      setSending(false);
      toast.success(`Tip of ${selected} ETH sent to ${artistName}! 🎉`);
    } catch (err: any) {
      setSending(false);
      if (err?.code === "ACTION_REJECTED" || err?.code === 4001) {
        setError("Transaction was rejected.");
        toast.error("Transaction was rejected.");
      } else {
        const errMsg = err?.message?.slice(0, 80) || "Transaction failed.";
        setError(errMsg);
        toast.error(errMsg);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
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
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Success state */}
            {txHash && !sending ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-foreground font-semibold mb-1">Tip Sent!</p>
                <p className="text-sm text-muted-foreground mb-3">{selected} ETH sent to {artistName}</p>
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline font-mono break-all"
                >
                  {txHash.slice(0, 16)}...{txHash.slice(-8)}
                </a>
                <button onClick={handleClose} className="w-full mt-4 py-2.5 rounded-lg surface text-foreground text-sm font-medium hover:bg-muted transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <>
                {!address && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30 mb-4">
                    <Wallet className="h-4 w-4 text-accent shrink-0" />
                    <p className="text-xs text-accent font-medium">Connect your wallet to send tips</p>
                  </div>
                )}

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

                {error && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 mb-4">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    <p className="text-xs text-destructive font-medium">{error}</p>
                  </div>
                )}

                {txHash && sending && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 mb-4">
                    <p className="text-xs text-primary font-medium">⛓ Confirming on-chain...</p>
                  </div>
                )}

                <button
                  onClick={handleTip}
                  disabled={sending || !address}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 ${
                    address ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <Send className="h-4 w-4" />
                  {sending ? "Sending..." : `Send ${selected} ETH`}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}