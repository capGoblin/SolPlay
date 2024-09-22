"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    // async function query(data: {
    //   inputs: Array<{ role: string; content: string }>;
    // }) {
    //   const response = await fetch(
    //     "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B-Instruct",
    //     {
    //       headers: {
    //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
    //         "Content-Type": "application/json",
    //       },
    //       method: "POST",
    //       body: JSON.stringify(data),
    //     }
    //   );
    //   const result = await response.json();
    //   console.log;
    //   return result;
    // }
    // query({
    //   inputs: prompt,
    // }).then((response) => {
    //   console.log(JSON.stringify(response));
    // });
  }, []);

  return (
    <div className="h-screen">
      <Navbar />
      Landingpage
    </div>
  );
}
