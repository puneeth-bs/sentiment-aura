import { useState, useEffect } from "react";

// Mock rotating sentiments (for demo)
const SENTIMENTS = [
  {
    sentiment_label: "very_pos",
    sentiment_score: 0.9,
    transcript: "amazing",
    keywords: ["joy", "light", "smile"],
  },
  {
    sentiment_label: "pos",
    sentiment_score: 0.7,
    transcript: "peace",
    keywords: ["balance", "flow", "energy"],
  },
  {
    sentiment_label: "neutral",
    sentiment_score: 0.5,
    transcript: "okay",
    keywords: ["still", "pause", "breathe"],
  },
  {
    sentiment_label: "neg",
    sentiment_score: 0.3,
    transcript: "tired",
    keywords: ["slow", "dull", "drained"],
  },
  {
    sentiment_label: "very_neg",
    sentiment_score: 0.1,
    transcript: "angry",
    keywords: ["dark", "storm", "rage"],
  },
];

export default function useMockSentiment() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % SENTIMENTS.length);
    }, 4000); // every 4 seconds, change sentiment
    return () => clearInterval(interval);
  }, []);

  return SENTIMENTS[index];
}
