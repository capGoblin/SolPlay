"use client";

import React, { ReactElement, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { ShoppingBag, User, Sparkles } from "lucide-react";

interface NFT {
  id: string;
  name: string;
  image: string;
  price: number;
}

const nfts: NFT[] = [
  {
    id: "1",
    name: "Cosmic Cube",
    image: "/placeholder.svg?height=300&width=300",
    price: 0.5,
  },
  {
    id: "2",
    name: "Digital Dreamscape",
    image: "/placeholder.svg?height=300&width=300",
    price: 0.7,
  },
  {
    id: "3",
    name: "Neon Nexus",
    image: "/placeholder.svg?height=300&width=300",
    price: 0.3,
  },
  {
    id: "4",
    name: "Quantum Quasar",
    image: "/placeholder.svg?height=300&width=300",
    price: 0.9,
  },
];

export default function Marketplace() {
  const [isMarketView, setIsMarketView] = useState(true);

  const handleBuy = (nft: NFT) => {
    console.log(`Buying ${nft.name} for ${nft.price} SOL`);
    // Implement actual purchase logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar />
      <main className="flex-grow p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-4 mb-8">
            <div className="relative flex max-w-md mx-auto">
              <div
                className={`absolute top-0 h-full transition-all duration-300 ease-in-out rounded-md bg-yellow-500 ${
                  isMarketView ? "left-0 w-1/2" : "left-1/2 w-1/2"
                }`}
              ></div>
              <ToggleButton
                isActive={isMarketView}
                onClick={() => setIsMarketView(true)}
                icon={<ShoppingBag size={20} />}
                label="Marketplace"
              />
              <ToggleButton
                isActive={!isMarketView}
                onClick={() => setIsMarketView(false)}
                icon={<User size={20} />}
                label="My Collection"
              />
            </div>
            <p className="text-gray-400 mt-4 text-center text-sm">
              {isMarketView
                ? "Explore and purchase unique NFTs from talented creators"
                : "View and manage your valuable NFT collection"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} onBuy={handleBuy} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function ToggleButton({
  isActive,
  onClick,
  icon,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: ReactElement;
  label: string;
}) {
  return (
    <button
      className={`relative z-10 py-3 w-1/2 rounded-md flex items-center justify-center transition-colors duration-200 ${
        isActive ? "text-gray-900" : "text-gray-400 hover:text-white"
      }`}
      onClick={onClick}
    >
      {React.cloneElement(icon, { className: "mr-2" })}
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function NFTCard({ nft, onBuy }: { nft: NFT; onBuy: (nft: NFT) => void }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-yellow-500/20 hover:-translate-y-1">
      <div className="relative">
        <Image
          src={nft.image}
          alt={nft.name}
          width={300}
          height={300}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 rounded-full px-2 py-1 text-xs font-semibold flex items-center">
          <Sparkles size={12} className="mr-1" />
          Featured
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-yellow-500">
          {nft.name}
        </h2>
        <p className="text-gray-400 mb-4">{nft.price} SOL</p>
        <Button
          onClick={() => onBuy(nft)}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4 rounded transition-colors"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
