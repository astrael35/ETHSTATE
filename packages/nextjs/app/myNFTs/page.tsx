"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import AddAssetForm from "/home/barosky/Desktop/challenge-0-simple-nft/packages/nextjs/app/marketplace/_components/AddAssetForm.tsx";

const Marketplace = () => {
  // Dummy assets data
  const [assets, setAssets] = useState([
    {
      id: 1,
      name: "Luxury Villa",
      image: "https://via.placeholder.com/400x300.png?text=Luxury+Villa",
      category: "Real Estate",
      price: "5", // ETH
      owner: "0x1234567890abcdef1234567890abcdef12345678",
    },
    {
      id: 2,
      name: "Modern Apartment",
      image: "https://via.placeholder.com/400x300.png?text=Modern+Apartment",
      category: "Real Estate",
      price: "2", // ETH
      owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();

  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
  const { data: tokenIdCounter } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "tokenIdCounter",
    watch: true,
  });

  const handlePurchase = async (assetId: number, price: string) => {
    if (!writeContractAsync) {
      console.error("Contract interaction function not available.");
      return;
    }

    if (!isConnected) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      const priceInWei = ethers.utils.parseEther(price);
      const notificationId = notification.loading("Processing purchase");

      await writeContractAsync({
        functionName: "purchaseAsset",
        args: [assetId],
        value: priceInWei,
      });

      // Remove previous loading notification and show success notification
      notification.remove(notificationId);
      notification.success("Purchase successful!");
    } catch (error) {
      console.error("Error purchasing asset:", error);
      notification.remove(notificationId);
      notification.error("Failed to purchase asset.");
    }
  };

  const handleAddAsset = (newAsset) => {
    setAssets([...assets, newAsset]);
    setShowModal(false);
  };

  return (
    <div className="relative p-6 bg-neutral-100 dark:bg-neutral-900">
      <button
        onClick={() => setShowModal(true)}
        className="bg-primary text-primary-content py-2 px-6 rounded-md shadow-lg hover:bg-primary-dark transition"
      >
        Add Asset
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl relative w-full max-w-md h-auto max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              ✕
            </button>
            <h2 className="text-3xl font-semibold mb-6 text-primary-content">Add New Asset</h2>
            <AddAssetForm onAddAsset={handleAddAsset} />
          </div>
        </div>
      )}

      <div className="flex justify-center">
        {!isConnected || isConnecting ? (
          <RainbowKitCustomConnectButton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-base-100 border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary-content">{asset.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300">Category: {asset.category}</p>
                  <p className="text-gray-700 dark:text-gray-300">Price: {asset.price} ETH</p>
                  <p className="text-gray-700 dark:text-gray-300">Owner: {asset.owner}</p>
                  <button
                    onClick={() => handlePurchase(asset.id, asset.price)}
                    className="bg-success text-base-100 py-2 px-6 rounded-md shadow-md hover:bg-success-dark transition mt-4 w-full"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
