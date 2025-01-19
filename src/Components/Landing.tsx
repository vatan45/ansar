import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

type EthereumWindow = {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: any) => void;
    removeListener: (event: string, callback: any) => void;
  };
} & Window;

export default function Landing(): JSX.Element {
  const [walletAddress, setWalletAddress] = useState<string>("Not connected");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const addDebugInfo = (info: string) => {
    setDebugInfo((prev) => `${prev}\n${info}`);
    console.log(info);
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      addDebugInfo("Starting wallet connection process...");

      // Get the ethereum object
      const ethereumWindow = window as EthereumWindow;
      if (!ethereumWindow.ethereum) {
        throw new Error("No ethereum object found. Please install Trust Wallet.");
      }

      // Detect Trust Wallet using user-agent and ethereum object
      const isTrustWallet = /trust/i.test(navigator.userAgent);
      if (isTrustWallet) {
        addDebugInfo("Trust Wallet detected");
      } else {
        addDebugInfo("MetaMask or other wallet detected");
      }

      // Request accounts using the lower-level request method
      const accounts = await ethereumWindow.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned after permission granted");
      }

      const address = accounts[0];
      addDebugInfo(`Account received: ${address}`);

      // Switch to BSC network using the request method directly (this is for Trust Wallet and MetaMask)
      try {
        addDebugInfo("Switching to BSC network...");
        await ethereumWindow.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
        addDebugInfo("Successfully switched to BSC");
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            addDebugInfo("Adding BSC network...");
            await ethereumWindow.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x38",
                  chainName: "BNB Smart Chain",
                  nativeCurrency: {
                    name: "BNB",
                    symbol: "BNB",
                    decimals: 18,
                  },
                  rpcUrls: ["https://bsc-dataseed.binance.org/"],
                  blockExplorerUrls: ["https://bscscan.com"],
                },
              ],
            });
            addDebugInfo("BSC network added successfully");
          } catch (addError: any) {
            throw new Error(`Failed to add BSC network: ${addError.message}`);
          }
        } else {
          throw new Error(`Failed to switch network: ${switchError.message}`);
        }
      }

      setWalletAddress(address);
      setStatus("Connected successfully!");
      addDebugInfo("Wallet connection completed");
    } catch (error: any) {
      addDebugInfo(`Connection error: ${error.message}`);
      setStatus(`Error: ${error.message}`);
      console.error("Detailed error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const setupWalletListeners = () => {
      const ethereumWindow = window as EthereumWindow;

      if (ethereumWindow.ethereum) {
        addDebugInfo("Setting up wallet listeners...");

        const handleAccountsChanged = (accounts: string[]) => {
          addDebugInfo("Accounts changed event triggered");
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          } else {
            setWalletAddress("Not connected");
          }
        };

        const handleChainChanged = () => {
          addDebugInfo("Chain changed event triggered");
          window.location.reload();
        };

        ethereumWindow.ethereum.on("accountsChanged", handleAccountsChanged);
        ethereumWindow.ethereum.on("chainChanged", handleChainChanged);

        return () => {
          if (ethereumWindow.ethereum) {
            ethereumWindow.ethereum.removeListener(
              "accountsChanged",
              handleAccountsChanged
            );
            ethereumWindow.ethereum.removeListener(
              "chainChanged",
              handleChainChanged
            );
          }
        };
      }
    };

    return setupWalletListeners();
  }, []);

  return (
    <div className="relative h-screen bg-gray-900">
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center relative z-10">
        <div className="mt-[140px]">
          <h1 className="text-[32px] font-semibold mb-6 text-white">
            Connect to <span className="text-yellow-400">Trust Wallet</span>
          </h1>

          <p className="text-[13px] mb-3 text-white">
            {walletAddress !== "Not connected"
              ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
                  -4
                )}`
              : "Wallet: Not connected"}
          </p>

          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={connectWallet}
              className="w-[280px] text-black text-sm py-3 bg-yellow-400 rounded-md transition hover:bg-yellow-500"
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>

            {status && <div className="text-yellow-400 mt-4">{status}</div>}

            <div className="mt-4 p-4 bg-gray-800 rounded-md w-full max-w-lg">
              <h3 className="text-white text-sm mb-2">Debug Info:</h3>
              <pre className="text-left text-xs text-gray-300 whitespace-pre-wrap">
                {debugInfo || "No debug information available"}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
