"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Application, Sprite, Graphics, Assets } from "pixi.js";

export default function Scene() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    const app = new Application();
    appRef.current = app;

    const initApp = async () => {
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(app.canvas);
      }

      // Загружаем фон
      await Assets.load("/img/background.png");
      const bg = Sprite.from("/img/background.png");
      app.stage.addChild(bg);

      const resizeBackground = () => {
        const rw = window.innerWidth;
        const rh = window.innerHeight;
        const tw = bg.texture.width || 1;
        const th = bg.texture.height || 1;
        const scale = Math.max(rw / tw, rh / th);
        bg.scale.set(scale);
        bg.x = (rw - bg.width) / 2;
        bg.y = (rh - bg.height) / 2;
      };

      resizeBackground();

      // Кнопка в правом нижнем углу
      const button = new Graphics();
      const buttonWidth = 150;
      const buttonHeight = 80;

      // Можно сделать слегка видимую кнопку
      button.beginFill(0x00ff00, 0.3); // зелёный с прозрачностью 0.3
      button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 15);
      button.endFill();

      const updateButtonPosition = () => {
        button.x = window.innerWidth - buttonWidth - 20; // 20px от края
        button.y = window.innerHeight - buttonHeight - 20; // 20px от нижнего края
      };
      updateButtonPosition();

      button.eventMode = "static";
      button.cursor = "pointer";
      button.on("pointertap", () => router.push("/crystal"));

      app.stage.addChild(button);

      // Обработчик ресайза
      const handleResize = () => {
        resizeBackground();
        updateButtonPosition();
      };
      window.addEventListener("resize", handleResize);

      (app as any).__sceneCleanup = { handleResize };
    };

    initApp();

    return () => {
      const app = appRef.current;
      if (app) {
        const cleanup = (app as any).__sceneCleanup;
        if (cleanup?.handleResize) window.removeEventListener("resize", cleanup.handleResize);
        app.destroy(true, { children: true, texture: true });
      }
    };
  }, [router]);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
