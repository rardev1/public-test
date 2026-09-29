import { COLORS } from "./constants";
import { noise, fibonacci, goldenRatio } from "./utils";

const CHESS_COLORS = {
  primary: ["#FF00FF", "#00FFFF", "#FFFF00"], // Psychedelic colors for first squares
  secondary: ["#FF0000", "#00FF00", "#0000FF"], // Psychedelic colors for second squares
};

export const createPsychedelicChessboard = () => {
  // Fibonacci sequence for animation
  const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
  const cellSize = 8; // Size of each chess cell

  return {
    position: { x: 0, y: 0 },
    pixels: [],
    animate: (time, _) => {
      const pixels = [];
      const timeScale = 0.001;
      const vectorScale = 0.01;
      const displacementScale = 15;

      // Calculate Fibonacci-based animation parameters
      const fibIndex = Math.floor(time * timeScale) % fib.length;
      const fibValue = fib[fibIndex];
      const nextFibValue = fib[(fibIndex + 1) % fib.length];
      const fibRatio = (fibValue / nextFibValue + 1) * 0.5;

      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          // Create vector displacement using noise
          const vectorX =
            noise.noise2D(x * vectorScale + time * timeScale, y * vectorScale) *
            displacementScale *
            fibRatio;

          const vectorY =
            noise.noise2D(x * vectorScale, y * vectorScale + time * timeScale) *
            displacementScale *
            fibRatio;

          // Apply displacement
          const displacedX = x + vectorX;
          const displacedY = y + vectorY;

          // Calculate chess position with animation
          const chessX = Math.floor(displacedX / cellSize);
          const chessY = Math.floor(displacedY / cellSize);
          const isAlternate = (chessX + chessY) % 2 === 0;

          // Color selection based on Fibonacci sequence
          const colorArray = isAlternate
            ? CHESS_COLORS.primary
            : CHESS_COLORS.secondary;
          const colorIndex = Math.floor(
            (Math.sin(time * timeScale * fibValue + (x + y) * 0.1) + 1) *
              colorArray.length *
              0.5
          );

          // Add psychedelic color cycling
          const cycleOffset =
            Math.sin(
              time * timeScale * 2 + (displacedX + displacedY) * 0.05 * fibRatio
            ) *
            colorArray.length *
            0.5;

          const finalColorIndex =
            Math.abs(Math.floor(colorIndex + cycleOffset)) % colorArray.length;

          const finalX = Math.floor(displacedX);
          const finalY = Math.floor(displacedY);

          if (finalX >= 0 && finalX < 128 && finalY >= 0 && finalY < 128) {
            pixels.push({
              position: { x: finalX, y: finalY },
              color: colorArray[finalColorIndex],
            });
          }
        }
      }

      return pixels;
    },
  };
};

// Create color with 80% black mix and generate shades
// Create color shades without darkening the base color
const createColorShades = (hex) => {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Create variations (darker and lighter shades)
  const baseColor = hex;
  const darkerColor = `#${Math.floor(r * 0.5)
    .toString(16)
    .padStart(2, "0")}${Math.floor(g * 0.5)
    .toString(16)
    .padStart(2, "0")}${Math.floor(b * 0.5)
    .toString(16)
    .padStart(2, "0")}`;
  const lighterColor = `#${Math.min(255, Math.floor(r * 1.3))
    .toString(16)
    .padStart(2, "0")}${Math.min(255, Math.floor(g * 1.3))
    .toString(16)
    .padStart(2, "0")}${Math.min(255, Math.floor(b * 1.3))
    .toString(16)
    .padStart(2, "0")}`;

  return [darkerColor, baseColor, lighterColor];
};

// Generate color palette with shades
const COLORS_WITH_SHADES = [
  ...createColorShades("#6C9A8B"), // Red shades
  ...createColorShades("#E8998D"), // Green shades
  ...createColorShades("#EED2CC"), // Blue shades
  ...createColorShades("#FBF7F4"), // Yellow shades
  ...createColorShades("#A1683A"), // Magenta shades
  ...createColorShades("#80F8FF"), // Cyan shades
];

export const createSoilLayer = () => {
  return {
    position: { x: 0, y: 0 },
    pixels: [],
    animate: (time, _) => {
      const pixels = [];
      const noiseScale = 0.012;
      const timeScale = 0.21;
      const moveScale = 8;

      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          // Wave patterns
          const wave1 = Math.sin(time * timeScale + y * 0.1) * moveScale;
          const wave2 =
            Math.cos(time * timeScale * 0.5 + x * 0.05) * moveScale * 0.7;

          const adjustedX = x + wave1;
          const adjustedY = y + wave2;

          // Color selection noise
          const noise1 = noise.noise2D(
            adjustedX * noiseScale + time * timeScale * 0.3,
            adjustedY * noiseScale + time * timeScale * 0.2
          );

          const noise2 = noise.noise2D(
            adjustedX * noiseScale * 2 + time * timeScale * 0.5,
            adjustedY * noiseScale * 2 + time * timeScale * 0.4
          );

          // Shade variation noise
          const shadeNoise = noise.noise2D(
            adjustedX * noiseScale * 3 + time * timeScale * 0.2,
            adjustedY * noiseScale * 3 + time * timeScale * 0.3
          );

          // Combine noises
          const combinedNoise = (noise1 + noise2) * 0.5;

          // Select base color and shade
          const baseColorIndex = Math.floor((combinedNoise + 1) * 6);
          const shadeOffset = Math.floor((shadeNoise + 1) * 1.5);
          const colorIndex =
            (baseColorIndex * 3 + shadeOffset) % COLORS_WITH_SHADES.length;
          const color = COLORS_WITH_SHADES[Math.abs(colorIndex)];

          const finalX = Math.floor(adjustedX);
          const finalY = Math.floor(adjustedY);

          if (finalX >= 0 && finalX < 128 && finalY >= 0 && finalY < 128) {
            pixels.push({
              position: { x: finalX, y: finalY },
              color: color,
            });
          }
        }
      }

      return pixels;
    },
  };
};

export const sky = {
  position: { x: 0, y: 0 },
  pixels: (() => {
    const pixels = [];
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 128; x++) {
        const color =
          y < 20
            ? COLORS.sky.light
            : y < 40
            ? COLORS.sky.primary
            : COLORS.sky.dark;
        pixels.push({ position: { x, y }, color });
      }
    }
    return pixels;
  })(),
};

export const createMountainRange = () => {
  const fibNumbers = fibonacci(10);
  return {
    position: { x: 30, y: 40 },
    pixels: (() => {
      const pixels = [];
      const mountainScale = 0.035;
      const detailScale = 0.07;
      const ridgeScale = 0.02;

      fibNumbers.forEach((fib, index) => {
        const ridgeOffset = Math.floor(fib * goldenRatio) % 20;
        const baseHeight = 45 - index * 3;

        for (let x = 0; x < 70; x++) {
          const baseNoise = noise.noise2D(
            x * mountainScale,
            index * mountainScale
          );
          const detailNoise =
            noise.noise2D(x * detailScale, index * detailScale) * 0.5;
          const ridgeNoise = Math.abs(
            noise.noise2D(x * ridgeScale, index * ridgeScale)
          );

          const heightMultiplier =
            (fib / fibNumbers[fibNumbers.length - 1]) * 25;
          const mountainHeight = Math.floor(
            (baseNoise + detailNoise) * heightMultiplier +
              ridgeNoise * heightMultiplier * 0.5
          );

          for (let y = 0; y <= mountainHeight; y++) {
            const relativeHeight = y / mountainHeight;
            const xPos = x + ridgeOffset;
            const yPos = baseHeight + y;

            const slope =
              (noise.noise2D((x + 1) * mountainScale, index * mountainScale) -
                noise.noise2D(x * mountainScale, index * mountainScale)) *
              10;
            const shadowIntensity = Math.max(0, slope * 2 + ridgeNoise);

            if (x < 25 + ridgeNoise * 5) {
              const colors = COLORS.mountains.dark;
              const colorIndex = Math.floor(
                shadowIntensity * (colors.length - 1)
              );
              pixels.push({
                position: { x: xPos, y: yPos },
                color: colors[Math.min(colorIndex, colors.length - 1)],
              });
            } else {
              const colors = COLORS.mountains.golden;
              const sunlightIntensity = (1 - shadowIntensity) * relativeHeight;
              const colorIndex = Math.floor(
                sunlightIntensity * (colors.length - 1)
              );
              pixels.push({
                position: { x: xPos, y: yPos },
                color: colors[Math.min(colorIndex, colors.length - 1)],
              });
            }

            if (shadowIntensity > 0.7) {
              const shadowColors = COLORS.mountains.shadow;
              const shadowIndex = Math.floor(
                shadowIntensity * (shadowColors.length - 1)
              );
              pixels.push({
                position: { x: xPos + 1, y: yPos },
                color:
                  shadowColors[Math.min(shadowIndex, shadowColors.length - 1)],
              });
            }
          }
        }
      });

      return pixels;
    })(),
  };
};

export const createAnimatedGrass = (baseY) => {
  const grassTypes = [
    { color: COLORS.grass.light, threshold: 0.6, heightVariation: 1 },
    { color: COLORS.grass.medium, threshold: 0.5, heightVariation: 1.2 },
    { color: COLORS.grass.dark, threshold: 0.4, heightVariation: 0.8 },
    { color: COLORS.grass.highlights, threshold: 0.7, heightVariation: 1.5 },
  ];

  return {
    position: { x: 0, y: baseY },
    pixels: [],
    animate: (time, _) => {
      const pixels = [];
      const scale = 0.01;
      const timeScale = 5;

      for (let y = 0; y < 43; y++) {
        const baseWave =
          noise.noise2D(
            (y + time * timeScale) * scale,
            time * timeScale * 0.5
          ) * 0.5;
        const detailWave =
          noise.noise2D(
            (y + time * timeScale * 1.5) * scale * 2,
            time * timeScale
          ) * 0.25;
        const waveOffset = baseWave + detailWave;

        for (let x = 0; x < 128; x++) {
          const baseNoise = noise.noise2D(
            x * scale,
            (y + time * timeScale) * scale
          );
          const detailNoise =
            noise.noise2D(
              x * scale * 2,
              (y + time * timeScale * 1.5) * scale * 2
            ) * 0.5;
          const microNoise =
            noise.noise2D(
              x * scale * 4,
              (y + time * timeScale * 2) * scale * 4
            ) * 0.25;

          const combinedNoise =
            (baseNoise + detailNoise + microNoise) * 0.75 + 0.5;

          grassTypes.forEach((grassType) => {
            if (combinedNoise > grassType.threshold) {
              const heightOffset =
                noise.noise2D(x * scale * 3, time * timeScale) *
                grassType.heightVariation;

              pixels.push({
                position: {
                  x: x + waveOffset,
                  y: y + heightOffset,
                },
                color: grassType.color,
              });

              if (combinedNoise > grassType.threshold + 0.2 && y > 5) {
                const bladeHeight = Math.floor(combinedNoise * 2);
                for (let h = 1; h <= bladeHeight && h <= 3; h++) {
                  pixels.push({
                    position: {
                      x:
                        x +
                        waveOffset +
                        noise.noise2D(x * scale, time * timeScale + h) * 0.5,
                      y: y - h + heightOffset,
                    },
                    color: grassType.color,
                  });
                }
              }
            }
          });
        }
      }
      return pixels;
    },
  };
};

export const createAnimatedClouds = () => {
  return {
    position: { x: 0, y: 0 },
    pixels: [],
    animate: (time, _) => {
      const pixels = [];
      const baseScale = 0.03;
      const detailScale = 0.06;
      const timeScale = 0.001;

      const cloudLayers = [
        { y: 5, height: 15, threshold: 0.2, alpha: 0.9, speed: 1.0 },
        { y: 10, height: 12, threshold: 0.3, alpha: 0.8, speed: 0.7 },
        { y: 3, height: 8, threshold: 0.4, alpha: 0.7, speed: 1.2 },
      ];

      cloudLayers.forEach((layer) => {
        for (let y = layer.y; y < layer.y + layer.height; y++) {
          for (let x = 0; x < 128; x++) {
            const baseNoise = noise.noise2D(
              (x + time * timeScale * layer.speed) * baseScale,
              y * baseScale
            );

            const detailNoise =
              noise.noise2D(
                (x + time * timeScale * layer.speed * 1.5) * detailScale,
                y * detailScale
              ) * 0.5;

            const turbulence =
              noise.noise2D(
                (x + time * timeScale * layer.speed * 0.7) * detailScale * 2,
                (y + time * timeScale * 0.3) * detailScale * 2
              ) * 0.25;

            const combinedNoise = baseNoise + detailNoise + turbulence;

            const heightFalloff =
              1 -
              Math.abs(y - (layer.y + layer.height / 2)) / (layer.height / 2);
            const threshold = layer.threshold + (1 - heightFalloff) * 0.3;

            if (combinedNoise > threshold) {
              const opacity = Math.min(1, (combinedNoise - threshold) * 2);
              const alpha = Math.floor(opacity * layer.alpha * 255);
              const alphaHex = alpha.toString(16).padStart(2, "0");
              const color = `#FFFFFF${alphaHex}`;

              const verticalOffset =
                noise.noise2D(x * baseScale, time * timeScale) * 1.5;

              pixels.push({
                position: {
                  x: x,
                  y: y + verticalOffset,
                },
                color: color,
              });
            }
          }
        }
      });

      return pixels;
    },
  };
};
