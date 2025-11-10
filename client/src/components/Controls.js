import React from "react";

export default function Controls({ recording, onToggle }) {
  return (
    <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
      <button
        onClick={onToggle}
        className={`px-5 py-2 rounded-full font-semibold text-white text-base shadow-md transition-all duration-300 
          ${recording
            ? "bg-red-600 hover:bg-red-700 scale-95 shadow-red-600/40"
            : "bg-green-600 hover:bg-green-700 scale-100 shadow-green-600/40"
          }`}
      >
        {recording ? "Stop" : "Start"}
      </button>

      {/* Optional mic indicator light */}
      <div
        className={`w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm 
          ${recording ? "bg-red-400 animate-pulse" : "bg-gray-400"}`}
      ></div>
    </div>
  );
}
