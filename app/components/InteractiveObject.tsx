"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function Scene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const app = new PIXI.Application({
      view: canvasRef.current!,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resizeTo: window,
    });

    // Фон
    const background = PIXI.Sprite.from("/background.png");
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // Интерактивный объект — книга
    const book = PIXI.Sprite.from("/book.png") as PIXI.Sprite & { buttonMode?: boolean };
    book.x = 1300;
    book.y = 680;
    book.interactive = true;
    book.cursor = "pointer";
    book.buttonMode = true;

    book.on("pointerdown", () => {
      alert("Открыта книга трактовок");
    });

    app.stage.addChild(book);

    return () => {
      app.destroy(true, true);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-screen h-screen" />;
}
