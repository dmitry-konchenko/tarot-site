"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

const SCENE_WIDTH = 2560;
const SCENE_HEIGHT = 1440;
const SCALE = 4 / 3;

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputsRef = useRef<HTMLElement[]>([]);
  const statsTextsRef = useRef<PIXI.BitmapText[]>([]);
  const lastReadoutsRef = useRef<PIXI.BitmapText[]>([]);
  const portraitRef = useRef<PIXI.Sprite | null>(null);
  const tableCloseupRef = useRef<PIXI.Sprite | null>(null);

  const albumLeftSprite = useRef<PIXI.Sprite | null>(null);
  const albumRightSprite = useRef<PIXI.Sprite | null>(null);
  const albumButtonsRef = useRef<PIXI.Container[]>([]);
  const albumTextsRef = useRef<PIXI.BitmapText[]>([]);
  const dialogBoxRef = useRef<PIXI.Sprite | null>(null);
  const dialogTextRef = useRef<PIXI.Text | PIXI.BitmapText | null>(null);

  const albumCards = [
    "/img/TheFool.png",
    "/img/TheMagican.png",
    "/img/TheEmperor.png",
    "/img/TheLovers.png",
    "/img/WheelOfFortune.png",
    "/img/TheTower.png",
    "/img/TheMoon.png",
    "/img/TheSun.png",
  ];

  const cardData = [
    {
      name: "Дурак",
      reverseName: "Перевернутый Дурак",
      description: "Смелое начало нового пути, спонтанность и открытость миру.",
      reversedDescription: "Необдуманные решения, опрометчивость, легкомыслие."
    },
    {
      name: "Маг",
      reverseName: "Перевернутый Маг",
      description: "Мастерство, воля и умение использовать ресурсы. Начало действия с полной уверенностью.",
      reversedDescription: "Манипуляция, рассеянность воли, использование силы во вред."
    },
    {
      name: "Император",
      reverseName: "Перевернутый Император",
      description: "Порядок, власть, структура и стабильность. Сила отца и правителя.",
      reversedDescription: "Тирания, негибкость, злоупотребление властью, слабость воли."
    },
    {
      name: "Влюбленные",
      reverseName: "Перевернутые Влюбленные",
      description: "Гармония, партнерство, выбор, чувства и доверие.",
      reversedDescription: "Разлад, сомнения, неверность, трудный выбор."
    },
    {
      name: "Колесо Фортуны",
      reverseName: "Перевернутое Колесо Фортуны",
      description: "Смена цикла, судьбоносный поворот, удача и изменения к лучшему.",
      reversedDescription: "Неудача, сопротивление переменам, нарушение ритма судьбы."
    },
    {
      name: "Башня",
      reverseName: "Перевернутая Башня",
      description: "Внезапные перемены, разрушение старого, освобождение.",
      reversedDescription: "Затруднения в переменах, сопротивление, страх перед новой ситуацией."
    },
    {
      name: "Луна",
      reverseName: "Перевернутая Луна",
      description: "Тайны, иллюзии, интуиция и скрытые страхи. Путь через тьму.",
      reversedDescription: "Обман рассеивается, выход из заблуждений, преодоление страхов."
    },
    {
      name: "Солнце",
      reverseName: "Перевернутое Солнце",
      description: "Радость, успех, ясность и витальность. Счастье и процветание.",
      reversedDescription: "Самонадеянность, задержка успеха, временные трудности."
    },
  ];

  // Расклады
  const spreads = [
    { name: "Карта дня", reverseName: "Перевернутая карта дня", description: "Одна карта, отражающая день.", reversedDescription: "Перевернутая трактовка дня." },
    { name: "Триплет", reverseName: "Перевернутый триплет", description: "Три карты, символизирующие прошлое, настоящее и будущее.", reversedDescription: "Перевернутый триплет может означать сбой в планах." },
    { name: "Лестница", reverseName: "Перевернутая лестница", description: "Пять карт в ряд для анализа прогресса.", reversedDescription: "Перевернутая лестница указывает на препятствия на пути." }
  ];

  let currentCardIndex = 0;
  let isSpreadMode = false;

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    const app = new PIXI.Application();

    app.init({
      view: canvas,
      resizeTo: window,
      backgroundColor: 0x000000,
      antialias: false,
    });

    containerRef.current.appendChild(canvas);

    (async () => {
      await PIXI.Assets.load([
        "/img/background.png",
        "/img/FortuneTeller.png",
        "/img/flame-1.png",
        "/img/flame-2.png",
        "/img/flame-3.png",
        "/img/flame-4.png",
        "/img/flame-glow.png",
        "/img/CrystalBall.png",
        "/img/CrystalBall-glow.png",
        "/img/CrystalBall-outline.png",
        "/img/DeckOfCards.png",
        "/img/DeckOfCards-outline.png",
        "/img/GuestBook.png",
        "/img/GuestBook-outline.png",
        "/img/AlbumOfCards.png",
        "/img/AlbumOfCards-outline.png",
        "/img/List.png",
        "/img/List-outline.png",
        "/img/OpenedBook.png",
        "/img/OpenedAlbum.png",
        "/img/portrait.png",
        "/img/TheFool.png",
        "/img/TheMagican.png",
        "/img/TheEmperor.png",
        "/img/TheLovers.png",
        "/img/WheelOfFortune.png",
        "/img/TheTower.png",
        "/img/TheMoon.png",
        "/img/TheSun.png",
        "/img/CardBack.png",
        "/img/DialogBox.png",
        "/img/TableCloseup.png",
        "/img/FortuneTeller-closed-eye.png",
        "/fonts/PxPlus_IBM_VGA8.fnt",
      ]);

      await document.fonts.load('28px "PxPlus_IBM_VGA8"');

      const scene = new PIXI.Container();
      app.stage.addChild(scene);
      scene.addChild(PIXI.Sprite.from("/img/background.png"));

      const flameGlow = PIXI.Sprite.from("/img/flame-glow.png");
      flameGlow.anchor.set(0.5);
      flameGlow.x = SCENE_WIDTH / 2;
      flameGlow.y = SCENE_HEIGHT / 2;
      flameGlow.alpha = 0.35;
      scene.addChild(flameGlow);

      const crystalGlow = PIXI.Sprite.from("/img/CrystalBall-glow.png");
      crystalGlow.anchor.set(0.5);
      crystalGlow.x = 1600 * SCALE;
      crystalGlow.y = 700 * SCALE - 24;
      crystalGlow.alpha = 0.45;
      scene.addChild(crystalGlow);

      const fortuneTeller = PIXI.Sprite.from("/img/FortuneTeller.png");
      fortuneTeller.anchor.set(0.5, 1);
      fortuneTeller.x = 960 * SCALE;
      fortuneTeller.y = 800 * SCALE;
      scene.addChild(fortuneTeller);

      const closedEye = PIXI.Sprite.from("/img/FortuneTeller-closed-eye.png");
      closedEye.anchor.set(0.5, 1);
      closedEye.x = fortuneTeller.x;
      closedEye.y = fortuneTeller.y;
      closedEye.visible = false;
      scene.addChild(closedEye);

      const blink = (holdMs = 120) => {
        closedEye.visible = true;
        setTimeout(() => { closedEye.visible = false; }, holdMs);
      };

      const scheduleNextBlink = () => {
        const delay = 3000 + Math.random() * 4000;
        setTimeout(() => { blink(); scheduleNextBlink(); }, delay);
      };
      scheduleNextBlink();

      const flameFrames = [
        PIXI.Texture.from("/img/flame-1.png"),
        PIXI.Texture.from("/img/flame-2.png"),
        PIXI.Texture.from("/img/flame-3.png"),
        PIXI.Texture.from("/img/flame-4.png"),
      ];
      const candle = new PIXI.AnimatedSprite(flameFrames);
      candle.anchor.set(0.5);
      candle.x = 300 * SCALE;
      candle.y = 600 * SCALE;
      candle.animationSpeed = 0.12;
      candle.play();
      scene.addChild(candle);

      const uiLayer = new PIXI.Container();
      app.stage.addChild(uiLayer);

      const interactives: { container: PIXI.Container; name: string }[] = [];
      const tableLayer = new PIXI.Container();
      scene.addChild(tableLayer);

      let tableCards: PIXI.Sprite[] = [];
      let tableMode = false;
      let currentSpreadIndex = 0;

      const createInteractive = (texture: string, outlineTexture: string, x:number, y:number, anchorX=0.5, anchorY=0.5, onClick?:()=>void, name?:string) => {
        const container = new PIXI.Container();
        const sprite = PIXI.Sprite.from(texture); sprite.anchor.set(anchorX,anchorY);
        const outline = PIXI.Sprite.from(outlineTexture); outline.anchor.set(anchorX,anchorY); outline.visible=false;
        container.x=x; container.y=y; container.eventMode="static"; container.cursor="pointer";
        container.on("pointerover",()=>outline.visible=true); container.on("pointerout",()=>outline.visible=false);
        if(onClick) container.on("pointerdown",onClick);
        container.addChild(outline,sprite);
        scene.addChild(container);
        if(name) interactives.push({container,name});
      };

      // Интерактивы с именами для обучения
      createInteractive("/img/CrystalBall.png","/img/CrystalBall-outline.png",1600*SCALE,700*SCALE,0.5,0.5,()=>console.log("Crystal Ball"),"CrystalBall");
      createInteractive("/img/DeckOfCards.png","/img/DeckOfCards-outline.png",600*SCALE,750*SCALE,0.5,0.5,()=>showSpreadSelection(),"Deck");
      createInteractive("/img/GuestBook.png","/img/GuestBook-outline.png",60*SCALE,242*SCALE,0,1,()=>switchMode("book"),"GuestBook");
      createInteractive("/img/AlbumOfCards.png","/img/AlbumOfCards-outline.png",1720*SCALE,576*SCALE,0,1,()=>switchMode("album"),"Album");




      const openedBook = PIXI.Sprite.from("/img/OpenedBook.png");
      openedBook.anchor.set(0.5);
      openedBook.x = SCENE_WIDTH / 2;
      openedBook.y = SCENE_HEIGHT / 2;

      const openedAlbum = PIXI.Sprite.from("/img/OpenedAlbum.png");
      openedAlbum.anchor.set(0.5);
      openedAlbum.x = SCENE_WIDTH / 2;
      openedAlbum.y = SCENE_HEIGHT / 2;

      const tableCloseup = PIXI.Sprite.from("/img/TableCloseup.png");
      tableCloseup.anchor.set(0.5);
      tableCloseup.x = SCENE_WIDTH / 2;
      tableCloseup.y = SCENE_HEIGHT / 2;

      const createCloseButton = (label: string, x: number, y: number, callback: () => void, color: number = 0x000000) => {
        const btn = new PIXI.Container();
        const text = new PIXI.BitmapText({ text: label, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 32 } });
        text.tint = color;
        btn.addChild(text);
        const underline = new PIXI.Graphics();
        underline.beginFill(0x000000);
        underline.drawRect(0, text.height + 2, text.width, 2);
        underline.endFill();
        underline.visible = false;
        btn.addChild(underline);
        btn.x = x;
        btn.y = y;
        btn.eventMode = "static";
        btn.cursor = "pointer";
        btn.on("pointerover", () => (underline.visible = true));
        btn.on("pointerout", () => (underline.visible = false));
        btn.on("pointerdown", callback);
        return btn;
      };

      const closeBookBtn = createCloseButton("ЗАКРЫТЬ", SCENE_WIDTH / 2 - 700, SCENE_HEIGHT / 2 - 425, () => switchMode("main"));
      const closeAlbumBtn = createCloseButton("ЗАКРЫТЬ", SCENE_WIDTH / 2 - 800, SCENE_HEIGHT / 2 - 350, () => switchMode("main"));

      type Mode = "main" | "book" | "album" | "table";
      let mode: Mode = "main";

      const switchMode = (m: Mode) => {
        mode = m;
        uiLayer.removeChildren();
        inputsRef.current.forEach(el => el.remove());
        inputsRef.current = [];
        statsTextsRef.current.forEach(el => uiLayer.removeChild(el));
        statsTextsRef.current = [];
        lastReadoutsRef.current.forEach(el => uiLayer.removeChild(el));
        lastReadoutsRef.current = [];
        if (portraitRef.current) portraitRef.current.destroy();
        portraitRef.current = null;
        albumLeftSprite.current?.destroy();
        albumRightSprite.current?.destroy();
        albumTextsRef.current.forEach(t => uiLayer.removeChild(t));
        albumTextsRef.current = [];
        albumButtonsRef.current.forEach(b => uiLayer.removeChild(b));
        albumButtonsRef.current = [];

        isSpreadMode = false;

        if (m === "book") {
          uiLayer.addChild(openedBook, closeBookBtn);
          addAuthButtons();
        }
        if (m === "album") {
          uiLayer.addChild(openedAlbum, closeAlbumBtn);
          addAlbumButtons();
          showAlbumCard(currentCardIndex);
        }
      };

      // ---------- Авторизация ----------
      const addAuthButtons = () => {
        const labels = ["Войти", "Записаться"];
        const baseX = 1200;
        const baseY = 800;
        labels.forEach((label, i) => {
          const btn = document.createElement("button");
          btn.innerText = label;
          btn.style.position = "absolute";
          btn.style.left = `${baseX}px`;
          btn.style.top = `${baseY + i * 160}px`;
          btn.style.padding = "22px 64px";
          btn.style.fontSize = "22px";
          btn.style.fontFamily = '"PxPlus_IBM_VGA8", monospace';
          btn.style.letterSpacing = "4px";
          btn.style.textTransform = "uppercase";
          btn.style.cursor = "pointer";
          btn.style.color = "#d4a84b";
          btn.style.background = "rgba(8,4,18,0.88)";
          btn.style.border = "2px solid #6a3e10";
          btn.style.boxShadow = "0 0 12px rgba(180,100,10,0.35), inset 0 0 8px rgba(0,0,0,0.6)";
          btn.style.textShadow = "0 0 8px rgba(212,168,75,0.7)";
          btn.style.outline = "none";
          btn.style.opacity = "0";
          btn.style.transition = "opacity 0.4s ease, box-shadow 0.3s ease, color 0.3s ease";
          setTimeout(() => (btn.style.opacity = "1"), 50 + i * 200);

          btn.addEventListener("mouseenter", () => {
            btn.style.color = "#f5c96a";
            btn.style.boxShadow = "0 0 22px rgba(212,168,75,0.6), inset 0 0 10px rgba(0,0,0,0.5)";
            btn.style.border = "2px solid #c87020";
          });
          btn.addEventListener("mouseleave", () => {
            btn.style.color = "#d4a84b";
            btn.style.boxShadow = "0 0 12px rgba(180,100,10,0.35), inset 0 0 8px rgba(0,0,0,0.6)";
            btn.style.border = "2px solid #6a3e10";
          });

          inputsRef.current.push(btn);
          containerRef.current!.appendChild(btn);

          btn.addEventListener("click", () => addAuthForm(label === "Записаться"));
        });
      };

      const addAuthForm = (isRegister: boolean) => {
        inputsRef.current.forEach(el => el.remove());
        inputsRef.current = [];

        const fields = isRegister ? ["Имя", "Логин", "Пароль"] : ["Логин", "Пароль"];
        const baseX = 1200;
        const baseY = 800;

        fields.forEach((placeholder, i) => {
          const input = document.createElement("input");
          input.placeholder = placeholder;
          input.style.position = "absolute";
          input.style.left = `${baseX}px`;
          input.style.top = `${baseY + i * 90}px`;
          input.style.padding = "28px";
          input.style.border = "2px solid #8B4513";
          input.style.background = "#d8a876";
          input.style.color = "#000";
          input.style.fontSize = "18px";
          input.style.opacity = "0";
          input.style.transition = "all 0.3s ease";
          setTimeout(() => (input.style.opacity = "1"), 50 + i * 150);
          inputsRef.current.push(input);
          containerRef.current!.appendChild(input);
        });

        const submitBtn = document.createElement("button");
        submitBtn.innerText = isRegister ? "Записаться" : "Войти";
        submitBtn.style.position = "absolute";
        submitBtn.style.left = `${baseX}px`;
        submitBtn.style.top = `${baseY + fields.length * 90}px`;
        submitBtn.style.padding = "22px 64px";
        submitBtn.style.fontSize = "22px";
        submitBtn.style.fontFamily = '"PxPlus_IBM_VGA8", monospace';
        submitBtn.style.letterSpacing = "4px";
        submitBtn.style.textTransform = "uppercase";
        submitBtn.style.cursor = "pointer";
        submitBtn.style.color = "#d4a84b";
        submitBtn.style.background = "rgba(8,4,18,0.88)";
        submitBtn.style.border = "2px solid #6a3e10";
        submitBtn.style.boxShadow = "0 0 12px rgba(180,100,10,0.35), inset 0 0 8px rgba(0,0,0,0.6)";
        submitBtn.style.textShadow = "0 0 8px rgba(212,168,75,0.7)";
        submitBtn.style.outline = "none";
        submitBtn.style.opacity = "0";
        submitBtn.style.transition = "opacity 0.4s ease, box-shadow 0.3s ease, color 0.3s ease";
        setTimeout(() => (submitBtn.style.opacity = "1"), 50 + fields.length * 150);
        submitBtn.addEventListener("mouseenter", () => {
          submitBtn.style.color = "#f5c96a";
          submitBtn.style.boxShadow = "0 0 22px rgba(212,168,75,0.6), inset 0 0 10px rgba(0,0,0,0.5)";
          submitBtn.style.border = "2px solid #c87020";
        });
        submitBtn.addEventListener("mouseleave", () => {
          submitBtn.style.color = "#d4a84b";
          submitBtn.style.boxShadow = "0 0 12px rgba(180,100,10,0.35), inset 0 0 8px rgba(0,0,0,0.6)";
          submitBtn.style.border = "2px solid #6a3e10";
        });
        inputsRef.current.push(submitBtn);
        containerRef.current!.appendChild(submitBtn);

        submitBtn.addEventListener("click", () => {
          const values = fields.map((_, idx) => (inputsRef.current[idx] as HTMLInputElement).value);
          const name = isRegister ? values[0] : values[0];
          inputsRef.current.forEach(el => el.remove());
          inputsRef.current = [];
          showStats(name);
        });
      };

      const showStats = (userName: string) => {
        const stats = [
          `Имя: ${userName}`,
          "Расклады проведено: 0",
          "Самый частый расклад: Не определено",
          "Частая карта: Не определено"
        ];
        stats.forEach((text, i) => {
          const txt = new PIXI.BitmapText({ text, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 24 } });
          txt.tint = 0x000000;
          txt.x = 800;
          txt.y = 300 + i * 50;
          uiLayer.addChild(txt);
          statsTextsRef.current.push(txt);
        });

        const lastReadoutText = new PIXI.BitmapText({ text: "Последние расклады: (пока пусто)", style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 24 } });
        lastReadoutText.tint = 0x000000;
        lastReadoutText.x = 1350;
        lastReadoutText.y = 294;
        uiLayer.addChild(lastReadoutText);
        lastReadoutsRef.current.push(lastReadoutText);

        // Portrait
        const portrait = PIXI.Sprite.from("/img/portrait.png");
        portrait.x = 600;
        portrait.y = 350;
        portrait.width = 120;
        portrait.height = 120;
        uiLayer.addChild(portrait);
        portraitRef.current = portrait;
      };

      // ---------- Кнопки и тексты альбома ----------
      const createAlbumButton = (label: string, x: number, y: number, callback: () => void) => {
        const btn = new PIXI.Container();
        const text = new PIXI.BitmapText({ text: label, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 28 } });
        text.tint = 0x000000;
        btn.addChild(text);

        const underline = new PIXI.Graphics();
        underline.beginFill(0x000000);
        underline.drawRect(0, text.height + 2, text.width, 2);
        underline.endFill();
        underline.visible = false;
        btn.addChild(underline);

        btn.x = x;
        btn.y = y;
        btn.eventMode = "static";
        btn.cursor = "pointer";

        btn.on("pointerover", () => (underline.visible = true));
        btn.on("pointerout", () => (underline.visible = false));
        btn.on("pointerdown", callback);

        uiLayer.addChild(btn);
        albumButtonsRef.current.push(btn);
      };

      const addAlbumButtons = () => {
        createAlbumButton("Далее", 1350, 390, () => {
          const maxIndex = isSpreadMode ? spreads.length - 1 : albumCards.length - 1;
          if (currentCardIndex < maxIndex) {
            currentCardIndex++;
            showAlbumCard(currentCardIndex);
          }
        });
        createAlbumButton("Назад", 1150, 390, () => {
          if (currentCardIndex > 0) {
            currentCardIndex--;
            showAlbumCard(currentCardIndex);
          }
        });
        createAlbumButton("Карты", 470, 330, () => {
          isSpreadMode = false;
          currentCardIndex = 0;
          showAlbumCard(currentCardIndex);
        });
        createAlbumButton("Расклады", 1850, 330, () => {
          isSpreadMode = true;
          currentCardIndex = 0;
          showAlbumCard(currentCardIndex);
        });
      };

      const showAlbumCard = (index: number) => {
        const dataSource = isSpreadMode ? spreads : cardData;
        const cardTex = PIXI.Texture.from(isSpreadMode ? "/img/CardBack.png" : albumCards[index]);

        closeAlbumBtn.x = SCENE_WIDTH / 2 - 800;
        closeAlbumBtn.y = SCENE_HEIGHT / 2 - 350;

        albumLeftSprite.current?.destroy();
        albumRightSprite.current?.destroy();
        albumTextsRef.current.forEach(t => uiLayer.removeChild(t));
        albumTextsRef.current = [];

        // ---------- Схема карт ----------
        const cardWidth = isSpreadMode ? 100 : 200;
        const cardHeight = isSpreadMode ? 150 : 300;

        const numCards = (() => {
          if (!isSpreadMode) return 1;
          switch (dataSource[index].name) {
            case "Карта дня": return 1;
            case "Триплет": return 3;
            case "Лестница": return 5;
            default: return 1;
          }
        })();

        const startX = 500;
        const startY = 430;
        const spacing = cardWidth + 20;

        const leftCards: PIXI.Sprite[] = [];
        const rightCards: PIXI.Sprite[] = [];

        for (let i = 0; i < numCards; i++) {
          const left = new PIXI.Sprite(cardTex);
          left.x = startX + i * spacing;
          left.y = startY;
          left.width = cardWidth;
          left.height = cardHeight;
          uiLayer.addChild(left);
          leftCards.push(left);

          const right = new PIXI.Sprite(cardTex);
          right.x = startX + 1050 + i * spacing;
          right.y = startY + cardHeight;
          right.width = cardWidth;
          right.height = cardHeight;
          right.rotation = Math.PI;
          uiLayer.addChild(right);
          rightCards.push(right);
        }

        albumLeftSprite.current = leftCards[0];
        albumRightSprite.current = rightCards[0];

        // ---------- Текст ----------
        const leftTitle = new PIXI.BitmapText({ text: dataSource[index].name, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 24 } });
        leftTitle.tint = 0x000000;
        leftTitle.x = startX;
        leftTitle.y = startY + cardHeight + 20;
        uiLayer.addChild(leftTitle);
        albumTextsRef.current.push(leftTitle);

        const leftDesc = new PIXI.BitmapText({ text: dataSource[index].description, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 20 } });
        leftDesc.tint = 0x000000;
        leftDesc.x = startX;
        leftDesc.y = startY + cardHeight + 50;
        uiLayer.addChild(leftDesc);
        albumTextsRef.current.push(leftDesc);

        const rightTitle = new PIXI.BitmapText({ text: dataSource[index].reverseName, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 24 } });
        rightTitle.tint = 0x000000;
        rightTitle.x = startX + 1050;
        rightTitle.y = startY + cardHeight + 20;
        uiLayer.addChild(rightTitle);
        albumTextsRef.current.push(rightTitle);

        const rightDesc = new PIXI.BitmapText({ text: dataSource[index].reversedDescription, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 20 } });
        rightDesc.tint = 0x000000;
        rightDesc.x = startX + 1050;
        rightDesc.y = startY + cardHeight + 50;
        uiLayer.addChild(rightDesc);
        albumTextsRef.current.push(rightDesc);

        // ---------- Кнопки Далее/Назад ----------
        albumButtonsRef.current.forEach(btn => {
          const text = btn.children[0] as PIXI.BitmapText;
          if (text.text === "Назад") btn.visible = index > 0;
          if (text.text === "Далее") btn.visible = index < (isSpreadMode ? spreads.length - 1 : albumCards.length - 1);
        });
      };

            // ---------- Диалоговое окно ----------
      
      const showDialog = (text: string) => {
        if (!dialogBoxRef.current) {
          const box = PIXI.Sprite.from("/img/DialogBox.png");
          box.x = SCENE_WIDTH / 2;
          box.y = SCENE_HEIGHT - 150;
          box.anchor.set(0.5, 0.5);
          uiLayer.addChild(box);
          dialogBoxRef.current = box;
        }
        if (!dialogTextRef.current) {
          const txt = new PIXI.Text({
            text,
            style: {
              fontFamily: "PxPlus_IBM_VGA8, monospace",
              fontSize: 28,
              fill: 0xffffff,
              wordWrap: true,
              wordWrapWidth: 1800,
            },
          });
          txt.x = SCENE_WIDTH / 2 - 900;
          txt.y = SCENE_HEIGHT - 180;
          uiLayer.addChild(txt);
          dialogTextRef.current = txt;
        } else {
          dialogTextRef.current.text = text;
        }
      };

      const tutorialSteps = [
        { name: "GuestBook", text: "Это книга гостей. Тут можно записать себя, и тогда я буду вести вашу статистику и записывать результаты раскладов.", blinkOnShow: true },
        { name: "Deck", text: "Колода карт. Укажите на нее чтобы начать расклад.", blinkOnShow: false },
        { name: "Album", text: "Альбом карт. В нем расписаны трактовки карт и все расклады, которые мы предоставляем", blinkOnShow: true },
      ];


      const startTutorial = () => {
        let currentStep = 0;
        const step = () => {
          if (currentStep >= tutorialSteps.length) {
      // Убираем outline после последнего шага
            interactives.forEach(i => {
              i.container.children[0].visible = false;
            });
            dialogBoxRef.current?.destroy();
            if (dialogTextRef.current) dialogTextRef.current.destroy();
            return;
          }
          const { name, text, blinkOnShow } = tutorialSteps[currentStep];
          interactives.forEach(i => {
            i.container.children[0].visible = i.name === name;
          });
          if (blinkOnShow) blink(350);
          showDialog(text);
          currentStep++;
        };

        // Блокируем интерактивные объекты пока не ответили на вопрос
        interactives.forEach(i => { i.container.eventMode = "none"; });

        showDialog("Здравствуйте! В первый ли здесь вы раз?");
        const yesBtn = document.createElement("button");
        yesBtn.innerText = "Да";
        yesBtn.style.position = "absolute";
        yesBtn.style.left = "1750px";
        yesBtn.style.top = "1600px";
        yesBtn.style.padding = "28px 56px";
        yesBtn.style.fontSize = "20px";
        yesBtn.style.cursor = "pointer";
        containerRef.current!.appendChild(yesBtn);

        const noBtn = document.createElement("button");
        noBtn.innerText = "Нет";
        noBtn.style.position = "absolute";
        noBtn.style.left = "1950px";
        noBtn.style.top = "1600px";
        noBtn.style.padding = "28px 56px";
        noBtn.style.fontSize = "20px";
        noBtn.style.cursor = "pointer";
        containerRef.current!.appendChild(noBtn);

        const unlockInteractives = () => {
          interactives.forEach(i => { i.container.eventMode = "static"; });
        };

        yesBtn.addEventListener("click", () => {
          yesBtn.remove();
          noBtn.remove();
          unlockInteractives();
          // Задержка 2 секунды перед стартом обучения
          setTimeout(() => step(), 2000);
          window.addEventListener("click", step);
        });
        noBtn.addEventListener("click", () => {
          yesBtn.remove();
          noBtn.remove();
          unlockInteractives();
          showDialog("Тогда жду, когда вы будете готовы взглянуть в свое будущее.");
      });
    };

      if (!sessionStorage.getItem("firstVisit")) {
        sessionStorage.setItem("firstVisit", "true");
        setTimeout(() => startTutorial(), 4700); // ждём конца анимации свечи (4000ms + 700ms fade)
      }
      const cleanupOverlay = () => {
        uiLayer.removeChildren();
        inputsRef.current.forEach(el => el.remove());
        inputsRef.current = [];
        statsTextsRef.current.forEach(el => uiLayer.removeChild(el));
        statsTextsRef.current = [];
        lastReadoutsRef.current.forEach(el => uiLayer.removeChild(el));
        lastReadoutsRef.current = [];
        if (portraitRef.current) portraitRef.current.destroy();
        portraitRef.current = null;
        albumLeftSprite.current?.destroy();
        albumRightSprite.current?.destroy();
        albumTextsRef.current.forEach(t => uiLayer.removeChild(t));
        albumTextsRef.current = [];
        albumButtonsRef.current.forEach(b => uiLayer.removeChild(b));
        albumButtonsRef.current = [];
      };

      const showSpreadSelection = () => {
        cleanupOverlay();
        let spreadPage = 0;
        const totalPages = Math.ceil(spreads.length / 2);

        const makeNavButton = (label: string, x: number, y: number, onClick: () => void) => {
          const btn = new PIXI.Container();
          const txt = new PIXI.BitmapText({ text: label, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 28 } });
          txt.tint = 0x000000;
          const ul = new PIXI.Graphics();
          ul.beginFill(0x000000);
          ul.drawRect(0, txt.height + 2, txt.width, 2);
          ul.endFill();
          ul.visible = false;
          btn.addChild(txt, ul);
          btn.x = x; btn.y = y;
          btn.eventMode = "static"; btn.cursor = "pointer";
          btn.on("pointerover", () => (ul.visible = true));
          btn.on("pointerout",  () => (ul.visible = false));
          btn.on("pointerdown", onClick);
          return btn;
        };

        const renderSpreadPage = () => {
          uiLayer.removeChildren();
          uiLayer.addChild(openedAlbum);
          uiLayer.addChild(createCloseButton("ЗАКРЫТЬ", SCENE_WIDTH / 2 - 800, SCENE_HEIGHT / 2 - 350, () => switchMode("main")));

          const pageXs = [500, 1560];
          const fromIdx = spreadPage * 2;
          const pageIndices = [fromIdx, fromIdx + 1].filter(idx => idx < spreads.length);

          pageIndices.forEach((spreadIdx, col) => {
            const spread = spreads[spreadIdx];
            const cx = pageXs[col];

            const nc = spread.name === "Карта дня" ? 1 : spread.name === "Триплет" ? 3 : 5;
            const cardW = 55, cardH = 82, cardSpacing = 68;

            for (let c = 0; c < nc; c++) {
              const preview = PIXI.Sprite.from("/img/CardBack.png");
              preview.anchor.set(0, 0.5);
              preview.width = cardW;
              preview.height = cardH;
              preview.x = cx + c * cardSpacing;
              preview.y = SCENE_HEIGHT / 2 - 250;
              uiLayer.addChild(preview);
            }

            const nameText = new PIXI.BitmapText({ text: spread.name, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 30 } });
            nameText.tint = 0x000000;
            nameText.x = cx;
            nameText.y = SCENE_HEIGHT / 2 - 150;
            uiLayer.addChild(nameText);

            const descText = new PIXI.Text({
              text: spread.description,
              style: { fontFamily: "PxPlus_IBM_VGA8, monospace", fontSize: 20, fill: 0x000000, wordWrap: true, wordWrapWidth: 460 },
            });
            descText.x = cx;
            descText.y = SCENE_HEIGHT / 2 - 100;
            uiLayer.addChild(descText);

            const btn = new PIXI.Container();
            const btnText = new PIXI.BitmapText({ text: "[ НАЧАТЬ ]", style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 28 } });
            btnText.tint = 0x3a1a00;
            btn.addChild(btnText);
            btn.x = cx;
            btn.y = SCENE_HEIGHT / 2 + 60;
            btn.eventMode = "static"; btn.cursor = "pointer";
            btn.on("pointerover", () => { btnText.tint = 0x8B4513; });
            btn.on("pointerout",  () => { btnText.tint = 0x3a1a00; });
            btn.on("pointerdown", () => openTable(spreadIdx));
            uiLayer.addChild(btn);
          });

          if (spreadPage > 0) {
            uiLayer.addChild(makeNavButton("Назад", 1150, 390, () => { spreadPage--; renderSpreadPage(); }));
          }
          if (spreadPage < totalPages - 1) {
            uiLayer.addChild(makeNavButton("Далее", 1350, 390, () => { spreadPage++; renderSpreadPage(); }));
          }
        };

        renderSpreadPage();
      };

      const openTable = (spreadIndex: number) => {
        cleanupOverlay();
        tableMode = true;
        currentSpreadIndex = spreadIndex;

        uiLayer.addChild(tableCloseup);

        const spread = spreads[spreadIndex];
        const numCards = (() => {
          switch (spread.name) {
            case "Карта дня": return 1;
            case "Триплет": return 3;
            case "Лестница": return 5;
            default: return 1;
          }
        })();

        // Случайный набор карт без повторов, с шансом переворота
        const shuffled = [...albumCards].sort(() => Math.random() - 0.5);
        const selectedCards = shuffled.slice(0, numCards);
        const reversedFlags = selectedCards.map(() => Math.random() < 0.1);

        const spacing = 250;
        const startX = SCENE_WIDTH / 2 - ((numCards - 1) * spacing) / 2;
        const y = SCENE_HEIGHT / 2;

        tableCards = [];
        for (let i = 0; i < numCards; i++) {
          const card = PIXI.Sprite.from("/img/CardBack.png");
          card.anchor.set(0.5);
          card.x = startX + i * spacing;
          card.y = y;
          card.width = 200;
          card.height = 300;
          card.eventMode = "static";
          card.cursor = "pointer";

          const baseScaleX = card.scale.x;
          let isFlipped = false;
          let isAnimating = false;
          let shakeTime = 0;

          const shakeFn = (ticker: PIXI.Ticker) => {
            shakeTime += ticker.deltaMS;
            card.rotation = Math.sin(shakeTime / 80) * 0.05;
          };

          card.on("pointerover", () => {
            if (!isAnimating && !isFlipped) {
              shakeTime = 0;
              app.ticker.add(shakeFn);
            }
          });

          card.on("pointerout", () => {
            app.ticker.remove(shakeFn);
            if (!isFlipped) card.rotation = 0;
          });

          card.on("pointerdown", () => {
            if (isFlipped || isAnimating) return;
            isAnimating = true;
            app.ticker.remove(shakeFn);
            card.rotation = 0;

            let elapsed = 0;
            const halfDur = 180;
            let swapped = false;
            let newBaseScaleX = baseScaleX;

            const flipFn = (ticker: PIXI.Ticker) => {
              elapsed += ticker.deltaMS;

              if (!swapped) {
                const t = Math.min(elapsed / halfDur, 1);
                card.scale.x = baseScaleX * (1 - t);
                if (t >= 1) {
                  card.texture = PIXI.Texture.from(selectedCards[i]);
                  card.width = 200;
                  card.height = 300;
                  if (reversedFlags[i]) card.rotation = Math.PI;
                  newBaseScaleX = card.scale.x;
                  card.scale.x = 0;
                  swapped = true;
                  elapsed = 0;
                }
              } else {
                const t = Math.min(elapsed / halfDur, 1);
                card.scale.x = newBaseScaleX * t;
                if (t >= 1) {
                  card.scale.x = newBaseScaleX;
                  isFlipped = true;
                  isAnimating = false;
                  app.ticker.remove(flipFn);
                }
              }
            };

            app.ticker.add(flipFn);
          });

          uiLayer.addChild(card);
          tableCards.push(card);
        }

        uiLayer.addChild(createCloseButton("ЗАКРЫТЬ", SCENE_WIDTH / 2 - 1200, SCENE_HEIGHT / 2 - 700, () => {
          switchMode("main");
        }, 0xffffff));
      };


      app.ticker.add(() => {
        const t = performance.now() / 300;
        flameGlow.alpha = 0.32 + Math.sin(t) * 0.03;
        crystalGlow.alpha = 0.42 + Math.sin(t * 1.5) * 0.06;
      });

      const resize = () => {
        const scale = Math.min(window.innerWidth / SCENE_WIDTH, window.innerHeight / SCENE_HEIGHT);
        app.stage.scale.set(scale);
        app.stage.x = (window.innerWidth - SCENE_WIDTH * scale) / 2;
        app.stage.y = (window.innerHeight - SCENE_HEIGHT * scale) / 2;
      };

      window.addEventListener("resize", resize);
      resize();
    })();

    return () => {
      app.destroy(true);
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    />
  );
}
