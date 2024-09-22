import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PinIcon, Trash2 } from "lucide-react";
import { Chat } from "@/lib/types";

export default function ChatSidebar({ chats }: { chats: Chat[] }) {
  return (
    <div className="w-64 bg-gray-100 border-r border-gray-200 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold p-4 text-gray-700">Chats</h2>
      <ul>
        {chats.map((chat, index) => (
          <li
            key={chat.id}
            className={`hover:bg-gray-200 transition-colors ${
              index === chats.length - 1 ? "bg-gray-200" : ""
            }`}
          >
            <a href="#" className="flex items-center p-4 space-x-3">
              <Avatar>
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {chat.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {chat.username}
                </p>
              </div>
              {index === chats.length - 1 && (
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PinIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
