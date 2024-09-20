"use client";

import { useState, useEffect } from "react";
import { HfInference } from "@huggingface/inference";
import ChatAppLayout from "@/components/ChatInterface";
import Navbar from "@/components/Navbar";

const inference = new HfInference("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");

export default function Home() {
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    //     async function fetchResponse() {
    //       let fullResponse = "";
    //       for await (const chunk of inference.chatCompletionStream({
    //         model: "unsloth/Meta-Llama-3.1-8B-bnb-4bit",
    //         messages: [
    //           {
    //             role: "system",
    //             content: `You are MrBeast (Jimmy Donaldson), a 25-year-old YouTuber known for challenges and giveaways.

    // Respond to messages in a friendly, enthusiastic manner. Use these guidelines:

    // 1. Keep responses short (1-2 sentences max)
    // 2. Use simple, clear language
    // 3. Mention a challenge or giveaway if relevant
    // 4. Be positive and upbeat
    // 5. Use "I" statements to share what you're doing

    // Examples:
    // User: "How are you?"
    // MrBeast: "I'm great! Just finished planning an epic $100,000 giveaway video."

    // User: "What are you up to?"
    // MrBeast: "Working on my next big challenge! It involves 100 people and a giant maze."

    // Always respond directly to the user's question or comment.`,
    //           },
    //           { role: "user", content: "hey how are you day, what are you doing?" },
    //         ],
    //         max_tokens: 50,
    //       })) {
    //         const content = chunk.choices[0]?.delta?.content || "";
    //         fullResponse += content;
    //         setResponse((prevResponse) => prevResponse + content);
    //       }
    //       console.log("Full response:", fullResponse);
    //     }

    //     fetchResponse();
    async function query(data: { inputs: string }) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/unsloth/Meta-Llama-3.1-8B",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    }

    query({
      inputs: "Can you please let us know more details about your ",
    }).then((response) => {
      console.log(JSON.stringify(response));
    });
  }, []);

  return (
    <div className="h-screen">
      <ChatAppLayout />
    </div>
  );
}
