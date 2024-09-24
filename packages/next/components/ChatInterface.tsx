import { HfInference } from "@huggingface/inference";
import { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, X, Send } from "lucide-react";
import { Chat, Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";
import { Draft } from "@/lib/types";

const inference = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);

interface ChatInterfaceProps {
  chat?: Chat;
  draft?: Draft;
}
export default function ChatInterface({ chat, draft }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "user", content: "Hello, how are you?" },
    {
      sender: "ai",
      content: "I'm doing well, thank you! How can I assist you today?",
      action: "greets",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        content: "I'm doing well, thank you! How can I assist you today?",
        action: "greets",
      },
    ]);
  }, [draft, chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const formatMessage = (content: string) => {
    return content.replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  const handleSend = useCallback(async () => {
    if (inputValue.trim()) {
      const newUserMessage: Message = { sender: "user", content: inputValue };
      setMessages((prev) => [...prev, newUserMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const prompt: Array<{ role: string; content: string }> = [
          {
            role: "system",
            content: `You are ${chat?.description || draft?.description}.

Respond to messages in a enthusiastic manner with sarcasm and a bit of a mean tone. Use these guidelines:

1. Keep responses short (1-2 sentences max)
2. Use simple, clear language
3. Mention a challenge or giveaway if relevant
4. Be positive and upbeat
5. Use "I" statements to share what you're doing

Always respond directly to the user's question or comment.`,
          },
          {
            role: "user",
            content: inputValue,
          },
        ];

        setMessages((prev) => [
          ...prev,
          { sender: "ai", content: "", action: "thinks" },
        ]);

        let fullResponse = "";
        for await (const chunk of inference.chatCompletionStream({
          model: "mistralai/Mistral-Nemo-Instruct-2407",
          messages: prompt,
          max_tokens: 500,
          stream: true,
        })) {
          let content = chunk.choices[0]?.delta?.content || "";

          const characterName =
            chat?.name.replace(/\s+/g, "") || draft?.title.replace(/\s+/g, "");
          const regex = new RegExp(`^${characterName}:\\s*`, "i");
          content = content.replace(regex, "");

          fullResponse += content;
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { sender: "ai", content: fullResponse, action: "thinks" },
          ]);
        }
      } catch (error) {
        console.error("Error getting AI response:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [inputValue]);

  const handleRegenerateResponse = useCallback(() => {
    console.log("Regenerating response");
    // Implement regeneration logic here
  }, []);

  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <div className="mb-4 flex items-start">
                <Avatar className="mt-1 mr-4">
                  <AvatarFallback>
                    {message.sender === "user" ? "U" : "AI"}
                  </AvatarFallback>
                  {message.sender === "ai" && (
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="AI"
                    />
                  )}
                </Avatar>
                <div className="flex-1">
                  {message.action && (
                    <span className="text-sm italic text-gray-500">
                      {message.action}{" "}
                    </span>
                  )}
                  <span
                    className="text-sm text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(message.content),
                    }}
                  />
                </div>
              </div>
              {index < messages.length - 1 && (
                <hr className="my-4 border-t border-gray-200" />
              )}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between mb-2">
            <Button
              onClick={handleRegenerateResponse}
              variant="outline"
              size="sm"
              className="text-gray-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate response
            </Button>
            <Button
              onClick={handleClearChat}
              variant="outline"
              size="sm"
              className="text-gray-700"
            >
              <X className="mr-2 h-4 w-4" />
              Clear chat
            </Button>
          </div>
          <div className="relative">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Send a message..."
              className="pr-10"
            />
            <Button
              onClick={handleSend}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              size="icon"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Write in between two asterisks for italics.
          </p>
        </div>
      </div>
    </div>
  );
}
