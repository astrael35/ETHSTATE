"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { uploadToIPFS } from "/home/barosky/Desktop/challenge-0-simple-nft/packages/nextjs/utils/simpleNFT/ipfs.ts";
import { useAccount } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { YourCollectibleAddress, YourCollectibleABI } from "/home/barosky/Desktop/challenge-0-simple-nft/packages/nextjs/utils/config.ts";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

let provider: ethers.providers.Web3Provider;
let signer: ethers.Signer;
let contract: ethers.Contract;

const initializeProvider = async () => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    provider = new ethers.providers.Web3Provider((window as any).ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(YourCollectibleAddress, YourCollectibleABI, signer);
  }
};

initializeProvider();

const AddAssetForm = ({ onAddAsset }) => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState("Car");
  const [price, setPrice] = useState("");
  const [owner, setOwner] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Please upload an image");

    const notificationId = notification.loading("Uploading asset to IPFS...");

    try {
      // Upload image to IPFS
      const imageUrl = await uploadToIPFS(image);
      if (!imageUrl) throw new Error("Failed to upload image to IPFS");

      console.log("Image URL:", imageUrl);

      // Create metadata JSON for the asset
      const metadata = {
        name,
        image: imageUrl,
        category,
        price, // Add price to metadata
        owner // Add owner to metadata
      };
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
      const metadataUrl = await uploadToIPFS(metadataBlob);
      if (!metadataUrl) throw new Error("Failed to upload metadata to IPFS");

      console.log("Metadata URL:", metadataUrl);

      // Mint the NFT with metadata URL
      const mintTx = await contract.mintItem(owner || connectedAddress, metadataUrl);
      const receipt = await mintTx.wait();

      console.log("Mint Transaction Receipt:", receipt);

      // Extract the tokenId from the receipt
      const event = receipt.events?.find((e) => e.event === "Transfer");
      if (!event) throw new Error("Transfer event not found in transaction receipt");

      const tokenId = event?.args?.tokenId.toString();
      if (!tokenId) throw new Error("Token ID not found in transaction receipt");

      console.log("Minted Token ID:", tokenId);

      // List the asset for sale
      const priceInWei = ethers.utils.parseEther(price);
      const listTx = await contract.listAssetForSale(tokenId, priceInWei);
      await listTx.wait();

      notification.remove(notificationId);
      notification.success("Asset minted and listed for sale successfully!");

      // Clear form
      setName("");
      setImage(null);
      setCategory("Car");
      setPrice("");
      setOwner("");

      // Notify parent component
      onAddAsset({ name, image: imageUrl, category, price: priceInWei, owner });
    } catch (error) {
      notification.remove(notificationId);
      console.error("Error adding asset:", error);
      alert(`Failed to add asset: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-center mb-8 text-4xl font-bold">Add Asset</h1>
      {!isConnected || isConnecting ? (
        <RainbowKitCustomConnectButton />
      ) : (
        <>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Asset Name</label>
            <input
              type="text"
              placeholder="Asset Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input input-bordered w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              required
              className="file-input file-input-bordered w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-bordered w-full mt-2"
            >
              <option value="Car">Car</option>
              <option value="Building">Building</option>
              <option value="Land">Land</option>
              <option value="Estate">Estate</option>
              <option value="Digital Asset">Digital Asset</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Price in ETH</label>
            <input
              type="text"
              placeholder="Price in ETH"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="input input-bordered w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Owner Address</label>
            <input
              type="text"
              placeholder="Owner Address"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
              className="input input-bordered w-full mt-2"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-content py-3 px-6 rounded-md shadow-lg hover:bg-primary-dark transition w-full"
          >
            Add Asset
          </button>
        </>
      )}
    </form>
  );
};

export default AddAssetForm;
