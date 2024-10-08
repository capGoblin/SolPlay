"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, X, Send } from "lucide-react";
import { Chat, Message } from "@/lib/types";
import CreateSidebar from "@/components/CreateSidebar";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import { Draft } from "@/lib/types";

export default function ChatAppLayout() {
  const [selectedDraftId, setSelectedDraftId] = useState<string>("1");

  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: "1",
      title: "Mr Beast",
      avatar: "/placeholder.svg?height=32&width=32",
      description:
        "Mr Beast is a larger-than-life YouTuber known for his extravagant challenges and giveaways. He is always enthusiastic and ready to entertain.",
      nftName: "Mr Beast ",
      nftSymbol: "MR.BEAST",
    },
  ]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <CreateSidebar
          drafts={drafts}
          setDrafts={setDrafts}
          setSelectedDraftId={setSelectedDraftId}
          selectedDraftId={selectedDraftId}
        />
        <main className="flex-1 overflow-hidden">
          <ChatInterface
            draft={drafts.find((draft) => draft.id === selectedDraftId)}
          />
        </main>
      </div>
    </div>
  );
}
