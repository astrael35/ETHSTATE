"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import AddAssetForm from "./_components/AddAssetForm";
import YourCollectibleABI from "/home/barosky/Desktop/challenge-0-simple-nft/packages/hardhat/artifacts/contracts/YourCollectible.sol/YourCollectible.json"; // Adjust the path as needed

const Marketplace = () => {
  const [assets, setAssets] = useState([
    {
      id: 1,
      name: "Luxury Villa",
      image: "kind.png",
      category: "Real Estate",
      price: "5", // ETH
      owner: "0x1234567890abcdef1234567890abcdef12345678",
      tokenId: 1,
    },
    {
      id: 2,
      name: "Modern Apartment",
      image: "Mask1.png",
      category: "Real Estate",
      price: "2", // ETH
      owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
      tokenId: 2,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const tempProvider = new ethers.providers.Web3Provider((window as any).ethereum);
          setProvider(tempProvider);

          const tempContract = new ethers.Contract(
            contractAddress,
            YourCollectibleABI.abi,
            tempProvider.getSigner()
          );
          setContract(tempContract);
        } catch (error) {
          console.error("Error initializing provider or contract:", error);
        }
      } else {
        console.error("MetaMask not installed.");
      }
    };

    init();
  }, []);

  const handlePurchase = async () => {
    if (!contract) {
      alert("Contract is not initialized.");
      return;
    }

    if (!selectedAsset) {
      alert("No asset selected.");
      return;
    }

    try {
      const { price, tokenId } = selectedAsset;
      const priceInWei = ethers.utils.parseEther(price);

      // Request user's MetaMask account
      const accounts = await provider.listAccounts();
      if (!accounts.length) {
        alert("No wallet connected. Please connect your MetaMask wallet.");
        return;
      }

      // Ensure MetaMask is connected to the correct network
      const network = await provider.getNetwork();
      const expectedChainId = 31337; // Replace with your expected Chain ID
      if (network.chainId !== expectedChainId) {
        alert("Please connect to the correct network.");
        return;
      }

      // Execute the purchaseAsset function from the smart contract
      const tx = await contract.purchaseAsset(tokenId, {
        value: priceInWei,
      });

      console.log("Transaction sent:", tx);
      await tx.wait();

      alert("Purchase successful! Token transferred and payment sent.");
      setShowPurchaseModal(false);
    } catch (error) {
      console.error("Error purchasing asset:", error);

      // Specific error handling based on the nature of the error
      if (error.code === 4001) {
        alert("Transaction rejected by user.");
      } else if (error.message.includes("insufficient funds")) {
        alert("Insufficient funds to complete the transaction.");
      } else {
        alert("Failed to purchase asset. Please check the console for more details.");
      }
    }
  };

  const openPurchaseModal = (asset) => {
    setSelectedAsset(asset);
    setShowPurchaseModal(true);
  };

  return (
    <div className="relative p-6 bg-neutral-100 dark:bg-neutral-900">
      <button
        onClick={() => setShowModal(true)}
        className="bg-primary text-primary-content py-2 px-6 rounded-md shadow-lg hover:bg-primary-dark transition"
      >
        
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl relative w-full max-w-md h-auto max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              Add AddAssetForm
            </button>
            <AddAssetForm onAddAsset={() => {}} />
          </div>
        </div>
      )}

      {showPurchaseModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl relative w-full max-w-md h-auto max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowPurchaseModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              ✕
            </button>
            <h2 className="text-3xl font-semibold mb-6 text-primary-content">Confirm Purchase</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              You are purchasing <strong>{selectedAsset.name}</strong> for {selectedAsset.price} ETH.
            </p>
            <button
              onClick={handlePurchase}
              className="bg-success text-base-100 py-2 px-6 rounded-md shadow-md hover:bg-success-dark transition w-full"
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-base-100 border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <img src={asset.image} alt={asset.name} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-primary-content">{asset.name}</h3>
              <p className="text-gray-700 dark:text-gray-300">Category: {asset.category}</p>
              <p className="text-gray-700 dark:text-gray-300">Price: {asset.price} ETH</p>
              <p className="text-gray-700 dark:text-gray-300">Owner: {asset.owner}</p>
              <button
                onClick={() => openPurchaseModal(asset)}
                className="bg-success text-base-100 py-2 px-6 rounded-md shadow-md hover:bg-success-dark transition mt-4 w-full"
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
