// app/marketplace/_components/AssetList.tsx

"use client";

import { ethers } from "ethers";

interface Asset {
  id: number;
  name: string;
  image: string;
  category: string;
  price: ethers.BigNumber;
  owner: string;
}

interface AssetListProps {
  assets: Asset[];
  onPurchase: (assetId: number, price: string) => void;
}

const AssetList = ({ assets, onPurchase }: AssetListProps) => {
  return (
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
            <p className="text-gray-700 dark:text-gray-300">Price: {ethers.utils.formatEther(asset.price)} ETH</p>
            <p className="text-gray-700 dark:text-gray-300">Owner: {asset.owner}</p>
            <button
              onClick={() => onPurchase(asset.id, ethers.utils.formatEther(asset.price))}
              className="bg-success text-base-100 py-2 px-6 rounded-md shadow-md hover:bg-success-dark transition mt-4 w-full"
            >
              Purchase
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssetList;
