import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PinIcon, Trash2 } from "lucide-react";
import { Chat } from "@/lib/types";

export default function ChatSidebar({
  chats,
  setSelectedChatId,
  selectedChatId,
}: {
  chats: Chat[];
  setSelectedChatId: (id: string) => void;
  selectedChatId: string;
}) {
  const handleChatClick = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="w-64 bg-black h-full overflow-y-auto">
      <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
        Chats
      </h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`hover:bg-gray-900 transition-colors cursor-pointer ${
              selectedChatId === chat.id ? "bg-gray-900" : ""
            }`}
            onClick={() => handleChatClick(chat.id)}
          >
            <div className="flex items-center p-4 space-x-3">
              <Avatar className="border-2 border-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-[2px]">
                <AvatarImage
                  src={chat.avatar}
                  alt={chat.name}
                  className="rounded-full bg-black"
                />
                <AvatarFallback className="bg-black text-yellow-500 rounded-full">
                  {chat.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {chat.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {chat.username}
                </p>
              </div>
              {selectedChatId === chat.id && (
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-yellow-500 hover:bg-gray-800"
                  >
                    <PinIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-yellow-500 hover:bg-gray-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
