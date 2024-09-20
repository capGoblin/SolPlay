import React, { useState } from "react";

export default function ChatInput() {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log("Sending message:", inputValue);
      setInputValue("");
    }
  };

  const handleRegenerateResponse = () => {
    console.log("Regenerating response");
  };

  const handleClearChat = () => {
    console.log("Clearing chat");
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between p-4 border-b border-gray-200">
        <button
          onClick={handleRegenerateResponse}
          className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ↻ Regenerate response
        </button>
        <button
          onClick={handleClearChat}
          className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ✕ Clear chat
        </button>
      </div>
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Send a message..."
            className="w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {/* <p className="mt-2 text-xs text-gray-500">Write in between two asterisks for italics.</p> */}
      </div>
    </div>
  );
}
