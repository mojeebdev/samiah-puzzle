"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function LeaderboardPage() {
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "leaderboard"), orderBy("time", "asc"), limit(10));
    return onSnapshot(q, (snapshot) => {
      setScores(snapshot.docs.map(doc => doc.data()));
    });
  }, []);

  return (
    <div style={{...styles.container, backgroundColor: '#f0f9ff'}}>
      <div style={styles.card}>
        <h1 style={styles.title}>Fastest Friends 🏆</h1>
        
        <div style={styles.list}>
          {scores.map((s, i) => (
            <div key={i} style={styles.item}>
              <div style={styles.nameSection}>
                <span style={i < 3 ? styles.topRank : styles.rank}>#{i + 1}</span>
                <span style={styles.name}>{s.name}</span>
              </div>
              <span style={styles.time}>{s.time}s</span>
            </div>
          ))}
          {scores.length === 0 && <p style={styles.empty}>No scores yet. Be the first!</p>}
        </div>

        <Link href="/game" style={styles.backLink}>← Play Again</Link>

        {/* YOUR CREDIT SECTION */}
        <div style={styles.creditBox}>
          <p style={styles.creditMain}>
            Built by <b>mojeeb</b> (<a href="https://mojeeb.xyz" style={styles.blueLink}>mojeeb.xyz</a>)
          </p>
          <p style={styles.creditSub}>
            Founder of <b>Blindspotlab</b> (<a href="https://blindspotlab.xyz" style={styles.blueLink}>blindspotlab.xyz</a>)
          </p>
          <p style={styles.contact}>
            For custom gifts: <a href="https://x.com/mojeebeth" style={styles.pinkLink}>@mojeebeth</a> on X/Telegram
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: { backgroundColor: '#f0f9ff', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', height: 'fit-content' },
  title: { textAlign: 'center', color: '#1e40af', fontSize: '24px', marginBottom: '30px', fontWeight: '900' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', backgroundColor: '#dbeafe', borderRadius: '15px' },
  nameSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  topRank: { color: '#f59e0b', fontWeight: 'bold', fontSize: '18px' },
  rank: { color: '#94a3b8', fontWeight: 'bold' },
  name: { fontWeight: '600', color: '#334155' },
  time: { fontWeight: 'bold', color: '#1e40af', fontFamily: 'monospace' },
  empty: { textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' },
  backLink: { display: 'block', textAlign: 'center', marginTop: '20px', color: '#1e40af', fontWeight: 'bold', textDecoration: 'none' },
  
  // CREDIT STYLES
  creditBox: {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #dbeafe',
    textAlign: 'center',
  },
  creditMain: { fontSize: '13px', color: '#475569', margin: '0 0 5px 0' },
  creditSub: { fontSize: '12px', color: '#64748b', margin: '0 0 10px 0' },
  contact: { fontSize: '11px', color: '#94a3b8', margin: '0' },
  blueLink: { color: '#3b82f6', textDecoration: 'none' },
  pinkLink: { color: '#1e40af', textDecoration: 'none', fontWeight: 'bold' },
};