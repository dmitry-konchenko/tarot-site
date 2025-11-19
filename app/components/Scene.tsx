"use client";

import { useEffect, useRef } from "react";
import { Application, Assets, Sprite } from "pixi.js";
import { useRouter } from "next/navigation";

export default function Scene() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    let destroyed = false;

    const initPixi = async () => {
      const app = new Application();
      appRef.current = app;

      // Ждём инициализации
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0
      });

      if (destroyed) return;
      if (!containerRef.current) return;

      // Теперь canvas точно доступен
      containerRef.current.appendChild(app.canvas);

      // Загружаем фон
      const bgTexture = await Assets.load("/img/background.png");
      const bg = new Sprite(bgTexture);
      bg.anchor.set(0);
      app.stage.addChild(bg);
      const resizeBackground = () => {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const tw = bg.texture.width;
        const th = bg.texture.height;

        const scale = Math.max(screenW / tw, screenH / th);

        bg.scale.set(scale);
        bg.x = (screenW - bg.width) / 2;
        bg.y = (screenH - bg.height) / 2;
      };
      resizeBackground();
      window.addEventListener("resize", resizeBackground);

      // Создаём шар
      const crystalTexture = await Assets.load("/img/CrystalBall.png");
      const crystal = new Sprite(crystalTexture);
      crystal.anchor.set(0.5);
      crystal.x = window.innerWidth / 2 + 400;
      crystal.y = window.innerHeight / 2 + 400;
      crystal.eventMode = "static";
      crystal.cursor = "pointer";
      crystal.on("pointertap", () => {
        router.push("/crystal");
      });

      app.stage.addChild(crystal);
      
      // Подгонка при изменении окна
      window.addEventListener("resize", () => {
        bg.x = 0;
        bg.y = 0;
      });
    };

    initPixi();

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, [router]);

return (
  <div
    ref={containerRef}
    style={{
      position: "fixed",
      inset: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
    }}
  />
);

}
