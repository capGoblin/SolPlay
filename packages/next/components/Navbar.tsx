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
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between p-4 bg-black text-gray-300">
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
      </div>
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
    </nav>
  );
}
