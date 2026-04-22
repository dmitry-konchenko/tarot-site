"use client";

import { useEffect, useRef } from "react";
import Scene from "@/app/components/Scene";

// Candle is at ~15.6% from left, ~55.6% from top in any window size
const CANDLE_CX = 0.190;
const CANDLE_CY = 0.450;

const PHASE1_END = 900;   // ms: tiny flicker
const PHASE2_END = 2600;  // ms: slow expansion
const TOTAL_DUR  = 4000;  // ms: full reveal done
const FADE_DUR   = 700;   // ms: overlay fades out after reveal

export default function HomePage() {
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;

    // Анимация только при первом визите за сессию
    if (sessionStorage.getItem("firstVisit")) {
      canvas.style.display = "none";
      return;
    }

    const ctx = canvas.getContext("2d")!;

    const setSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const startTime = performance.now();
    let raf: number;

    const draw = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed >= TOTAL_DUR + FADE_DUR) {
        canvas.style.display = "none";
        return;
      }

      const W = canvas.width;
      const H = canvas.height;
      const cx = W * CANDLE_CX;
      const cy = H * CANDLE_CY;
      const maxR = Math.sqrt(W * W + H * H);

      // --- compute radius ---
      let radius: number;
      if (elapsed < PHASE1_END) {
        // tiny flicker: 30-70px with sine wobble
        const base = 50;
        const flicker = Math.sin(elapsed * 0.018) * 12 + Math.sin(elapsed * 0.031) * 8;
        radius = base + flicker;
      } else if (elapsed < PHASE2_END) {
        // slow expansion: 70 → 350px
        const t = (elapsed - PHASE1_END) / (PHASE2_END - PHASE1_END);
        const eased = t * t; // ease-in
        radius = 70 + eased * 280;
      } else if (elapsed < TOTAL_DUR) {
        // rapid full reveal
        const t = (elapsed - PHASE2_END) / (TOTAL_DUR - PHASE2_END);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        radius = 350 + eased * (maxR - 350);
      } else {
        radius = maxR;
      }

      // --- draw overlay ---
      ctx.clearRect(0, 0, W, H);

      // 1. Ambient dark background — subtle window-light glow in center, not pure black
      const ambient = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.65);
      ambient.addColorStop(0, "rgba(18,8,28,0.96)");
      ambient.addColorStop(1, "rgba(3,1,6,1)");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, W, H);

      // 2. Punch a soft circular hole — reveals scene under candlelight
      const hole = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
      hole.addColorStop(0,   "rgba(0,0,0,1)");
      hole.addColorStop(0.6, "rgba(0,0,0,0.85)");
      hole.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = hole;
      ctx.fillRect(0, 0, W, H);

      // 3. Warm orange tint over lit area — simulates candle warmth
      ctx.globalCompositeOperation = "source-over";
      const warmR = radius * 0.55;
      const warm = ctx.createRadialGradient(cx, cy, 0, cx, cy, warmR);
      warm.addColorStop(0,   "rgba(255,150,20,0.13)");
      warm.addColorStop(0.5, "rgba(220,80,10,0.06)");
      warm.addColorStop(1,   "rgba(180,40,0,0)");
      ctx.fillStyle = warm;
      ctx.beginPath();
      ctx.arc(cx, cy, warmR, 0, Math.PI * 2);
      ctx.fill();

      // 4. Fade out after full reveal
      if (elapsed > TOTAL_DUR) {
        const fadeT = (elapsed - TOTAL_DUR) / FADE_DUR;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(0,0,0,${(1 - fadeT) * 0.0})`; // already at 0, canvas alpha handles it
        canvas.style.opacity = String(1 - fadeT);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <main style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#000" }}>
      <Scene />
      <canvas
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </main>
  );
}
