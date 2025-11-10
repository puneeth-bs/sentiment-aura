import React, { useState } from "react";
import useDeepgramStream from "./hooks/useDeepgramStream";
import Controls from "./components/Controls";
import SpeechAura from "./components/SpeechAura";

export default function App() {
  const { transcript, sentiment, startStreaming, stopStreaming } = useDeepgramStream();
  const [recording, setRecording] = useState(false);

  const handleToggle = () => {
    if (recording) {
      stopStreaming();
      setRecording(false);
    } else {
      startStreaming();
      setRecording(true);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      <SpeechAura transcript={transcript} sentiment={sentiment} listening={recording} />
      <Controls recording={recording} onToggle={handleToggle} />
    </div>
  );
}
