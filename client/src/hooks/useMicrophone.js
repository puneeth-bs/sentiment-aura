import { useState, useRef } from "react";

export default function useMicrophone() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // Ask for mic permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.onstart = () => {
        console.log("🎙️ Recording started");
        setRecording(true);
      };

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onerror = (err) => {
        console.error("MediaRecorder error:", err);
        setRecording(false);
      };

      recorder.onstop = () => {
        console.log("🟥 Recording stopped");
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);

        // stop tracks cleanly
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }

        chunksRef.current = [];
        setRecording(false);
      };

      recorder.start();
    } catch (err) {
      console.error("Microphone access denied:", err);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      console.warn("No active recorder found to stop.");
      setRecording(false);
      return;
    }

    console.log("Attempting to stop recorder. Current state:", recorder.state);

    if (recorder.state === "recording") {
      recorder.stop(); // triggers onstop
    } else {
      console.warn("Recorder not in 'recording' state:", recorder.state);
      setRecording(false);
    }
  };

  const resetAudio = () => setAudioBlob(null);

  return { recording, startRecording, stopRecording, audioBlob, resetAudio };
}
