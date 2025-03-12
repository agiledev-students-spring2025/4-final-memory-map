import React, { useState, useEffect } from "react";

const DotsAnimation = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold flex items-center space-x-1">
        <span>Loading</span>
        <span className="flex">
          <span
            className={`w-2 h-2 mx-0.5 bg-gray-600 rounded-full transition-opacity ${
              animate ? "animate-bounce" : "opacity-0"
            }`}
            style={{ animationDelay: "0s" }}
          ></span>
          <span
            className={`w-2 h-2 mx-0.5 bg-gray-600 rounded-full transition-opacity ${
              animate ? "animate-bounce" : "opacity-0"
            }`}
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className={`w-2 h-2 mx-0.5 bg-gray-600 rounded-full transition-opacity ${
              animate ? "animate-bounce" : "opacity-0"
            }`}
            style={{ animationDelay: "0.4s" }}
          ></span>
        </span>
      </h1>
    </div>
  );
};

export default DotsAnimation;
