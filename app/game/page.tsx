"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import confetti from "canvas-confetti";

export default function GamePage() {
  const [pieces, setPieces] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("puzzle_username");
    if (!user) {
      router.push("/");
      return;
    }
    setName(user);
    setStartTime(Date.now());
    
    const shuffled = [...Array(27).keys()].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, [router]);

  const handleSwap = async (idx: number) => {
    if (selected === null) {
      setSelected(idx);
    } else {
      const next = [...pieces];
      [next[selected], next[idx]] = [next[idx], next[selected]];
      setPieces(next);
      setSelected(null);

      // Check if perfectly ordered
      if (next.every((v, i) => v === i)) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        await addDoc(collection(db, "leaderboard"), {
          name,
          time: timeTaken,
          createdAt: serverTimestamp()
        });
        setTimeout(() => router.push("/leaderboard"), 3000);
      }
    }
  };

  return (
    <div style={{...styles.container, backgroundColor: '#f0f9ff'}}>
      {/* Header Info */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.birthdayText}>Happy 27th! 🎂</h1>
          <p style={styles.playerText}>Solving: <b>{name}</b></p>
        </div>
        <button onClick={() => router.push("/leaderboard")} style={styles.lbBtn}>
          🏆 Scores
        </button>
      </div>

      {/* The 3x9 Grid */}
      <div style={styles.grid}>
        {pieces.map((p, i) => {
          // Math for 3 columns and 9 rows
          const column = p % 3;
          const row = Math.floor(p / 3);
          
          return (
            <div 
              key={i} 
              onClick={() => handleSwap(i)}
              style={{
                ...styles.piece,
                backgroundImage: `url('/samiah-27.jpeg')`,
                backgroundSize: '300% 900%', // 3x width, 9x height
                // Precise positioning for 3x9
                backgroundPosition: `${(column * 100) / 2}% ${(row * 100) / 8}%`,
                border: selected === i ? '3px solid #3b82f6' : '0.5px solid rgba(255,255,255,0.3)',
                opacity: selected === i ? 0.7 : 1,
                transform: selected === i ? 'scale(0.96)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
      
      <div style={styles.instructions}>
        <p>Tap two pieces to swap them!</p>
        <p style={{fontSize: '10px', marginTop: '5px', opacity: 0.6}}>27 Pieces for your 27th Year</p>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    backgroundColor: '#fff5f7',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    userSelect: 'none', // Prevents annoying text selection while playing
    WebkitUserSelect: 'none'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '360px',
    marginBottom: '15px',
    alignItems: 'center',
    padding: '0 5px'
  },
  birthdayText: {
    fontSize: '22px',
    margin: 0,
    color: '#be185d',
    fontWeight: '800'
  },
  playerText: {
    fontSize: '14px',
    margin: 0,
    color: '#666'
  },
  lbBtn: {
    backgroundColor: '#be185d',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1px',
    backgroundColor: '#be185d', 
    padding: '2px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '360px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  },
  piece: {
    aspectRatio: '270/120', 
    cursor: 'pointer',
    transition: 'transform 0.1s ease, opacity 0.1s ease',
  },
  instructions: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#db2777',
    fontSize: '14px',
    fontWeight: '500'
  }
};