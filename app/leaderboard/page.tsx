"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function LeaderboardPage() {
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "leaderboard"), orderBy("time", "asc"), limit(20));
    return onSnapshot(q, (snapshot) => {
      setScores(snapshot.docs.map(doc => doc.data()));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 shadow-xl">
        <h1 className="text-3xl font-black text-center mb-8 text-gray-800 italic">RANKINGS 🏆</h1>
        
        <div className="space-y-4">
          {scores.map((s, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-b-2 border-gray-100">
              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold ${i < 3 ? 'text-yellow-500' : 'text-gray-300'}`}>#{i + 1}</span>
                <span className="font-semibold text-gray-700">{s.name}</span>
              </div>
              <span className="font-mono text-pink-500 font-bold">{s.time}s</span>
            </div>
          ))}
        </div>

        <Link href="/" className="block text-center mt-10 text-pink-500 font-bold hover:underline">
          ← Back to Game
        </Link>
      </div>
    </div>
  );
}