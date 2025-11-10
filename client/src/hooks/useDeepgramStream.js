import { useState, useRef } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { analyzeSentiment } from "../api/analyzeSentiment";

export default function useDeepgramStream() {
  const [transcript, setTranscript] = useState("");
  const [sentiment, setSentiment] = useState({
    sentiment_label: "neutral",
    sentiment_score: 0.5,
  });
  const [socketOpen, setSocketOpen] = useState(false);
  const mediaRecorderRef = useRef(null);
  const connectionRef = useRef(null);

  const deepgram = createClient(process.env.REACT_APP_DEEPGRAM_API_KEY);

  const startStreaming = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Your browser does not support microphone access.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = recorder;

    // 🎧 Create Deepgram live transcription connection
    const connection = deepgram.listen.live({
      model: "nova-3",
      language: "en-US",
      smart_format: true,
      interim_results: true, // 👈 this enables real-time updates
    });
    connectionRef.current = connection;

    connection.on(LiveTranscriptionEvents.Open, () => {
      //console.log("🟢 Deepgram connected");
      setSocketOpen(true);
    });

    connection.on(LiveTranscriptionEvents.Transcript, async (data) => {
      const phrase = data.channel?.alternatives?.[0]?.transcript || "";
      if (!phrase) return;

      //console.log(phrase);
      // 🟡 Update text live
      setTranscript(phrase);

      // 🔵 Only analyze when transcript is final
      if (data.is_final) {
        const result = await analyzeSentiment(phrase);
        if (result) setSentiment(result);
      }
    });

    connection.on(LiveTranscriptionEvents.Close, () => {
      //console.log("🔴 Deepgram connection closed");
      setSocketOpen(false);
    });

    connection.on(LiveTranscriptionEvents.Error, (err) => {
      console.error("Deepgram error:", err);
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0 && connection.getReadyState() === 1) {
        e.data.arrayBuffer().then((buffer) => connection.send(buffer));
      }
    };

    recorder.start(500); // send every 500ms
  };

  const stopStreaming = () => {
    //console.log("🛑 Stopping Deepgram stream...");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    if (connectionRef.current) {
      connectionRef.current.finish();
      connectionRef.current = null;
    }
    setSocketOpen(false);
  };

  return { transcript, sentiment, startStreaming, stopStreaming, socketOpen };
}
