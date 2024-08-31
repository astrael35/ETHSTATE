import { ethers } from "ethers";
import { YourCollectibleAddress, YourCollectibleABI } from "./config";
import { uploadToIPFS } from "/home/barosky/Desktop/challenge-0-simple-nft/packages/nextjs/utils/simpleNFT/ipfs.ts"; // Adjust the import path based on your project structure

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

export const addAssetToMarket = async (
  formData: FormData
) => {
  try {
    // Extract data from FormData
    const name = formData.get("name") as string;
    const image = formData.get("image") as File;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const owner = formData.get("owner") as string;

    // Upload image to IPFS
    const imageUrl = await uploadToIPFS(image);
    console.log("Image URL:", imageUrl);

    // Create metadata JSON for the asset
    const metadata = {
      name,
      image: imageUrl,
      category,
    };
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    const metadataUrl = await uploadToIPFS(metadataBlob);
    console.log("Metadata URL:", metadataUrl);

    // Mint the NFT with metadata URL
    const tx = await contract.mintItem(owner, metadataUrl);
    console.log("Mint Transaction:", tx);
    const receipt = await tx.wait();
    console.log("Mint Transaction Receipt:", receipt);

    // Extract the tokenId from the receipt
    const event = receipt.events?.find((e) => e.event === "Transfer");
    const tokenId = event?.args?.tokenId.toString(); // Adjust based on your contract's event logs

    if (!tokenId) throw new Error("Token ID not found in transaction receipt");

    // List the asset for sale
    const priceInWei = ethers.utils.parseEther(price);
    const listTx = await contract.listAssetForSale(tokenId, priceInWei);
    console.log("List Transaction:", listTx);
    await listTx.wait();
    
  } catch (error) {
    console.error("Error in addAssetToMarket:", error);
    throw error;
  }
};

export const fetchAssets = async () => {
  if (!contract) throw new Error("Contract is not initialized.");

  const totalSupply = await contract.totalSupply();
  const assets = [];

  for (let i = 0; i < totalSupply; i++) {
    const tokenId = await contract.tokenByIndex(i);
    const tokenURI = await contract.tokenURI(tokenId);
    const price = await contract.assetPrices(tokenId);
    const isListed = await contract.listedForSale(tokenId);
    const owner = await contract.ownerOf(tokenId);

    if (isListed) {
      assets.push({
        id: tokenId.toNumber(),
        name: tokenURI, // Assuming tokenURI contains name, adjust accordingly
        image: tokenURI, // Assuming tokenURI contains image URL, adjust accordingly
        category: "Unknown", // Placeholder, adapt based on your data
        price,
        owner,
      });
    }
  }

  return assets;
};

export const purchaseAsset = async (assetId: number, price: string) => {
  try {
    const tx = await contract.purchaseAsset(assetId, {
      value: price
    });
    await tx.wait();
    console.log("Transaction successful:", tx);
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
};
