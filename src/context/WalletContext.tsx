import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";

interface WalletState {
  address: string | null;
  isConnecting: boolean;
  chainId: number | null;
  balance: string | null;
}

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  shortAddress: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnecting: false,
    chainId: null,
    balance: null,
  });

  const getProvider = () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      return new BrowserProvider((window as any).ethereum);
    }
    return null;
  };

  const fetchBalance = useCallback(async (addr: string) => {
    const provider = getProvider();
    if (!provider) return;
    try {
      const bal = await provider.getBalance(addr);
      const eth = parseFloat((Number(bal) / 1e18).toFixed(4));
      setState((s) => ({ ...s, balance: `${eth} ETH` }));
    } catch {
      setState((s) => ({ ...s, balance: null }));
    }
  }, []);

  const connectWallet = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setState((s) => ({ ...s, isConnecting: true }));
    try {
      const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });
      const chainId = parseInt(await ethereum.request({ method: "eth_chainId" }), 16);
      setState((s) => ({ ...s, address: accounts[0], chainId, isConnecting: false }));
      fetchBalance(accounts[0]);
    } catch {
      setState((s) => ({ ...s, isConnecting: false }));
    }
  }, [fetchBalance]);

  const disconnectWallet = useCallback(() => {
    setState({ address: null, isConnecting: false, chainId: null, balance: null });
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setState((s) => ({ ...s, address: accounts[0] }));
        fetchBalance(accounts[0]);
      }
    };
    const handleChainChanged = (chainId: string) => {
      setState((s) => ({ ...s, chainId: parseInt(chainId, 16) }));
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);
    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnectWallet, fetchBalance]);

  // Auto-reconnect if already authorized
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;
    ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length > 0) {
        const chainPromise = ethereum.request({ method: "eth_chainId" });
        chainPromise.then((chainId: string) => {
          setState((s) => ({ ...s, address: accounts[0], chainId: parseInt(chainId, 16) }));
          fetchBalance(accounts[0]);
        });
      }
    });
  }, [fetchBalance]);

  const shortAddress = state.address
    ? `${state.address.slice(0, 6)}...${state.address.slice(-4)}`
    : null;

  return (
    <WalletContext.Provider value={{ ...state, connectWallet, disconnectWallet, shortAddress }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
