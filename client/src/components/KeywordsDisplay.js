import React from "react";

export default function KeywordsDisplay({ keywords }) {
  return React.createElement(
    "div",
    {
      className:
        "absolute top-10 w-full flex justify-center flex-wrap gap-4 transition-all duration-1000 ease-in-out",
    },
    keywords.map((word, idx) =>
      React.createElement(
        "span",
        {
          key: word + idx,
          className:
            "text-lg font-medium text-white bg-white/10 px-3 py-1 rounded-full backdrop-blur-md opacity-80 transform transition-all duration-1000 ease-in-out hover:opacity-100 hover:scale-110",
          style: {
            transitionDelay: `${idx * 150}ms`,
          },
        },
        word
      )
    )
  );
}
