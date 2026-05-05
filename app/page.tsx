"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem("puzzle_username");
    const savedTime = localStorage.getItem("puzzle_timestamp");

    if (savedName && savedTime) {
      const hoursPassed = (Date.now() - parseInt(savedTime)) / (1000 * 60 * 60);
      if (hoursPassed < 3) {
        router.push("/game"); 
      }
    }
  }, [router]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("puzzle_username", name);
      localStorage.setItem("puzzle_timestamp", Date.now().toString());
      router.push("/game");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-6">
      <div className="bg-white p-10 rounded-[40px] shadow-xl max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Samiah's Birthday Puzzle 🎂</h1>
        <p className="text-gray-500 mb-8">Enter your name to play</p>
        <form onSubmit={handleStart} className="space-y-4">
          <input
            required
            className="w-full p-4 border-2 border-pink-100 rounded-2xl outline-none focus:border-pink-500"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-pink-600">
            PLAY GAME
          </button>
        </form>
      </div>
    </div>
  );
}