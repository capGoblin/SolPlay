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
  const [selectedChatId, setSelectedChatId] = useState<string>("1");

  const chats: Chat[] = [
    {
      id: "1",
      name: "Mr Beast",
      username: "@smolcreampuff",
      avatar: "/placeholder.svg?height=40&width=40",
      description:
        "Mr Beast is a larger-than-life YouTuber known for his extravagant challenges and giveaways. He is always enthusiastic and ready to entertain.",
    },
    {
      id: "2",
      name: "Brightwater (Fantasy Adv",
      username: "@phillip",
      avatar: "/placeholder.svg?height=40&width=40",
      description:
        "Brightwater is a mystical fantasy adventurer known for his bravery and wisdom. He wields a magical sword and protects the realm from dark forces.",
    },
    {
      id: "3",
      name: "Tom Nuuk",
      username: "@ceomg",
      avatar: "/placeholder.svg?height=40&width=40",
      description:
        "Tom Nuuk is a tech-savvy entrepreneur with a knack for innovation. He is always on the lookout for the next big thing in technology.",
    },
    {
      id: "4",
      name: "Zazke (Love from Beyond",
      username: "@saiyagina",
      avatar: "/placeholder.svg?height=40&width=40",
      description:
        "Zazke is a romantic spirit from another dimension. She communicates through poetic messages and spreads love wherever she goes.",
    },
    {
      id: "5",
      name: "Prince Sara Ann Winder o",
      username: "@clarissaexplainingtail",
      avatar: "/placeholder.svg?height=40&width=40",
      description:
        "Prince Sara Ann Winder is a noble figure with a strong sense of justice. She is known for her diplomatic skills and her ability to lead with grace.",
    },
    {
      id: "6",
      name: "Mr Beast",
      username: "@smolcreampuff",
      avatar: "/placeholder.svg?height=40&width=40",
      description:
        "Mr Beast is a larger-than-life YouTuber known for his extravagant challenges and giveaways. He is always enthusiastic and ready to entertain.",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          chats={chats}
          setSelectedChatId={setSelectedChatId}
          selectedChatId={selectedChatId}
        />
        <main className="flex-1 overflow-hidden">
          <ChatInterface
            chat={chats.find((chat) => chat.id === selectedChatId) as Chat}
          />
        </main>
      </div>
    </div>
  );
}
