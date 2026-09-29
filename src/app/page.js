"use client";
import React, { useState, useEffect } from "react";
import { Renderer } from "./renderer";
import {
  createPsychedelicChessboard,
  createSoilLayer,
  createMountainRange,
  createAnimatedGrass,
  createAnimatedClouds,
} from "./sceneObjects";

const AnimatedMountainScene = () => {
  const [bitmap, setBitmap] = useState([]);
  const [pixelSize, setPixelSize] = useState(4);
  const [isAnimating, setIsAnimating] = useState(true);

  const sceneObjects = [
    // createSoilLayer(),
    createPsychedelicChessboard(),
    // sky,
    // createAnimatedClouds(),
    // createMountainRange(),
    // createAnimatedGrass(85),
  ];

  useEffect(() => {
    const renderer = new Renderer({ width: 128, height: 128 });
    let animationFrameId;
    let startTime = Date.now();
    let lastFrameTime = 0;
    const frameInterval = 1000 / 15; // 15 FPS

    const animate = () => {
      if (!isAnimating) return;

      const currentTime = Date.now();
      const elapsed = currentTime - lastFrameTime;

      if (elapsed > frameInterval) {
        const time = (currentTime - startTime) / 1000;
        const newBitmap = renderer.render(sceneObjects, time);
        setBitmap([...newBitmap]);
        lastFrameTime = currentTime - (elapsed % frameInterval);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating]);

  if (!bitmap.length) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Animated Mountain Landscape</h2>
      <div className="relative bg-white p-2 rounded shadow-lg">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${bitmap[0].length}, ${pixelSize}px)`,
            gap: "0px",
          }}
        >
          {bitmap.map((row, y) =>
            row.map((pixel, x) => (
              <div
                key={`${x}-${y}`}
                className="aspect-square"
                style={{
                  backgroundColor: pixel || "#ffffff",
                  width: `${pixelSize}px`,
                  height: `${pixelSize}px`,
                }}
              />
            ))
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setPixelSize((prev) => Math.max(1, prev - 1))}
        >
          Zoom Out
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setPixelSize((prev) => prev + 1)}
        >
          Zoom In
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => setIsAnimating((prev) => !prev)}
        >
          {isAnimating ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default AnimatedMountainScene;
