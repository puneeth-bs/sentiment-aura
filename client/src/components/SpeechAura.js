import React, { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { createAuraSketch } from "./AuraCanvas";

export default function SpeechAura({ transcript, sentiment, listening }) {
  const containerRef = useRef(null);
  const sketchRef = useRef(null);
  const sentimentRef = useRef(sentiment);

  const [showListening, setShowListening] = useState(false);
  const [wordQueue, setWordQueue] = useState([]);
  const lastTranscriptRef = useRef("");

  
  useEffect(() => {
    if (containerRef.current && !sketchRef.current) {
      sketchRef.current = new p5(
        createAuraSketch(() => sentimentRef.current),
        containerRef.current
      );
    }
    return () => {
      sketchRef.current?.remove();
      sketchRef.current = null;
    };
  }, []);

  // 🎨 Keep sentiment synced
  useEffect(() => {
    sentimentRef.current = sentiment || {
      sentiment_label: "neutral",
      sentiment_score: 0.5,
    };
  }, [sentiment]);

  // 🎧 Reset on start
  useEffect(() => {
    if (listening) {
      setShowListening(true);
      setWordQueue([]);
      lastTranscriptRef.current = "";
    } else {
      setShowListening(false);
    }
  }, [listening]);

  // 🗣️ Handle new transcript
  useEffect(() => {
    if (!transcript || transcript.trim().length === 0) return;
    setShowListening(false);

    const prev = lastTranscriptRef.current.trim();
    const curr = transcript.trim();

    if (curr.length > prev.length) {
      const newPart = curr.slice(prev.length).trim();
      if (newPart.length > 0) {
        const newWords = newPart.split(/\s+/).filter(Boolean);
        newWords.forEach((w) => {
          const id = Date.now() + Math.random();
          setWordQueue((prev) => {
            const updated = [...prev, { id, text: w }];
            return updated.slice(-15); // keep last 15 words visible
          });
          setTimeout(() => {
            setWordQueue((prev) => prev.filter((x) => x.id !== id));
          }, 4000); // fade after 4s
        });
      }
    }

    lastTranscriptRef.current = curr;
  }, [transcript]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 🌌 Aura */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* 🎧 Listening Pulse */}
      {listening && showListening && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="animate-ping w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute w-24 h-24 rounded-full bg-white/25 blur-2xl"></div>
          <p className="absolute text-3xl font-semibold text-white tracking-wide drop-shadow-lg animate-pulse">
            Listening...
          </p>
        </div>
      )}

      {/* 💬 Centered real-time line */}
      <div className="absolute inset-0 flex items-center justify-center z-30 text-center px-10">
        <div className="inline-block text-white text-4xl font-medium leading-snug tracking-wide transition-all duration-500">
          {wordQueue.map((word) => (
            <span
              key={word.id}
              className="mx-2 inline-block animate-subtleFade"
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
