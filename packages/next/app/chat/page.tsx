"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, X, Send } from "lucide-react";
import { Chat, Message } from "@/lib/types";
import ChatSidebar from "@/components/ChatSidebar";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";

export default function ChatAppLayout() {
  const chats: Chat[] = [
    {
      id: "1",
      name: "Brightwater (Fantasy Adv",
      username: "@phillip",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Tom Nuuk",
      username: "@ceomg",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Zazke (Love from Beyond",
      username: "@saiyagina",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Prince Sara Ann Winder o",
      username: "@clarissaexplainingtail",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Saltama",
      username: "@smolcreampuff",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar chats={chats} />
        <main className="flex-1 overflow-hidden">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}
