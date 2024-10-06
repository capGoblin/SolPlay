"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ReclaimProofRequest, Proof } from "@reclaimprotocol/js-sdk";
import QRCode from "react-qr-code";

export default function Navbar() {
  const router = useRouter();
  const [requestUrl, setRequestUrl] = useState("");
  const [proofs, setProofs] = useState<Proof>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  const getVerificationReq = async () => {
    const APP_ID = "0xf8F6Aa27ed43E6c0AC0D974C33920190D6b11918";
    const providerId = "39c31ffd-0be0-4e45-9a18-1eb3cb8099d4";
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      "0x9b852d0efd058b5790eb55c3c8f2919dadf9c885db7c56ce83565d5f489a1a60",
      providerId
    );

    const requestUrl = await reclaimProofRequest.getRequestUrl();
    console.log("Request URL:", requestUrl);

    await reclaimProofRequest.startSession({
      onSuccess(proofs) {
        console.log("Verification success", proofs);
        setProofs(proofs);
        setIsDialogOpen(false);
      },
      onError: (error) => {
        console.error("Verification failed", error);
      },
    });

    setRequestUrl(requestUrl);
    setIsDialogOpen(true);
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-800 bg-black text-gray-300">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
            SolPlay
          </span>
        </Link>
        <Link
          href="/create"
          className="hover:text-yellow-500 transition-colors"
        >
          Create
        </Link>
        <Link href="/chat" className="hover:text-yellow-500 transition-colors">
          Chat
        </Link>
        <Link
          href="/marketplace"
          className="hover:text-yellow-500 transition-colors"
        >
          Marketplace
        </Link>
      </div>
      <div className="flex justify-end">
        {!proofs ? (
          <button
            onClick={getVerificationReq}
            className="px-3 py-1 mr-8 rounded-md w-20 text-sm text-black bg-gradient-to-r from-yellow-500 to-yellow-700 hover:opacity-90 focus:outline-none focus:ring-2"
          >
            Sign in
          </button>
        ) : (
          <p>Signed in</p>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full hover:bg-gray-800"
            >
              <Avatar className="h-8 w-8 border border-yellow-700">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="@username"
                />
                <AvatarFallback className="bg-gray-900 text-yellow-500">
                  UN
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-gray-900 border border-gray-800 text-gray-300"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-yellow-500">
                  username
                </p>
                <p className="text-xs leading-none text-gray-400">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            {/* <DropdownMenuItem className="hover:bg-gray-800 hover:text-yellow-500 focus:bg-gray-800 focus:text-yellow-500"> */}
            <WalletMultiButtonDynamic />
            {/* </DropdownMenuItem> */}
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem
              onClick={() => {
                router.push("/profile");
              }}
              className="hover:bg-gray-800 hover:text-yellow-500 focus:bg-gray-800 focus:text-yellow-500"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 hover:text-yellow-500 focus:bg-gray-800 focus:text-yellow-500">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="hover:bg-gray-800 hover:text-yellow-500 focus:bg-gray-800 focus:text-yellow-500">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>Request URL</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            {requestUrl && <QRCode value={requestUrl} />}
          </div>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
