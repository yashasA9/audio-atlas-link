import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight, Music, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTransactions, Transaction } from "@/context/TransactionContext";

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const config = {
    confirmed: { icon: CheckCircle, label: "Confirmed", cls: "text-primary bg-primary/10" },
    pending: { icon: Loader2, label: "Pending", cls: "text-accent bg-accent/10" },
    failed: { icon: XCircle, label: "Failed", cls: "text-destructive bg-destructive/10" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.cls}`}>
      <config.icon className={`h-3 w-3 ${status === "pending" ? "animate-spin" : ""}`} />
      {config.label}
    </span>
  );
}

export default function TransactionHistoryPage() {
  const { transactions } = useTransactions();

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground">Transaction History</h1>
        <p className="text-muted-foreground mt-1">Your tips and blockchain activity</p>
      </motion.div>

      {transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground font-semibold text-lg">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tip an artist or publish a track to see your activity here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                tx.type === "tip" ? "bg-primary/20" : "bg-accent/20"
              }`}>
                {tx.type === "tip" ? (
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                ) : (
                  <Music className="h-5 w-5 text-accent" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">
                    {tx.type === "tip"
                      ? `Tipped ${tx.recipientName || "Artist"}`
                      : `Published "${tx.trackTitle || "Track"}"`}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {tx.amount && (
                    <span className="text-xs font-mono font-medium text-primary">{tx.amount} ETH</span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatTime(tx.timestamp)}</span>
                </div>
              </div>

              <a
                href={`https://etherscan.io/tx/${tx.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
              >
                {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
