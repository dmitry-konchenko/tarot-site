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
    "/img/TheFool.png",         // 0 — Дурак
    "/img/TheMagican.png",      // 1 — Маг
    "/img/TheHighPriestess.png",// 2 — Верховная Жрица
    "/img/TheEmpress.png",      // 3 — Императрица
    "/img/TheEmperor.png",      // 4 — Император
    "/img/TheHierophant.png",   // 5 — Иерофант
    "/img/TheLovers.png",       // 6 — Влюбленные
    "/img/TheChariot.png",      // 7 — Колесница
    "/img/Strenght.png",        // 8 — Сила
    "/img/TheHermit.png",       // 9 — Отшельник
    "/img/WheelOfFortune.png",  // 10 — Колесо Фортуны
    "/img/Justice.png",         // 11 — Справедливость
    "/img/TheHangedMan.png",    // 12 — Повешенный
    "/img/Death.png",           // 13 — Смерть
    "/img/Temperance.png",      // 14 — Умеренность
    "/img/TheDevil.png",        // 15 — Дьявол
    "/img/TheTower.png",        // 16 — Башня
    "/img/TheStar.png",         // 17 — Звезда
    "/img/TheMoon.png",         // 18 — Луна
    "/img/TheSun.png",          // 19 — Солнце
    "/img/Judgement.png",       // 20 — Суд
    "/img/TheWorld.png",        // 21 — Мир
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
      name: "Верховная Жрица",
      reverseName: "Перевернутая Верховная Жрица",
      description: "Интуиция, тайна, внутренняя мудрость и скрытое знание.",
      reversedDescription: "Поверхностность, утаивание информации, игнорирование интуиции."
    },
    {
      name: "Императрица",
      reverseName: "Перевернутая Императрица",
      description: "Изобилие, плодородие, творчество и материнская забота.",
      reversedDescription: "Зависимость, творческий блок, сверхконтроль."
    },
    {
      name: "Император",
      reverseName: "Перевернутый Император",
      description: "Порядок, власть, структура и стабильность. Сила отца и правителя.",
      reversedDescription: "Тирания, негибкость, злоупотребление властью, слабость воли."
    },
    {
      name: "Иерофант",
      reverseName: "Перевернутый Иерофант",
      description: "Традиции, духовное наставничество, институты и устои.",
      reversedDescription: "Догматизм, слепое следование правилам, отказ от перемен."
    },
    {
      name: "Влюбленные",
      reverseName: "Перевернутые Влюбленные",
      description: "Гармония, партнерство, выбор, чувства и доверие.",
      reversedDescription: "Разлад, сомнения, неверность, трудный выбор."
    },
    {
      name: "Колесница",
      reverseName: "Перевернутая Колесница",
      description: "Воля, победа, движение вперёд и контроль над ситуацией.",
      reversedDescription: "Потеря контроля, агрессия, движение без цели."
    },
    {
      name: "Сила",
      reverseName: "Перевернутая Сила",
      description: "Внутренняя сила, смелость, выдержка и укрощение инстинктов.",
      reversedDescription: "Слабость воли, страх, потеря самообладания."
    },
    {
      name: "Отшельник",
      reverseName: "Перевернутый Отшельник",
      description: "Уединение, внутренний поиск, мудрость и путь наставника.",
      reversedDescription: "Изоляция, отчуждение, избегание общества."
    },
    {
      name: "Колесо Фортуны",
      reverseName: "Перевернутое Колесо Фортуны",
      description: "Смена цикла, судьбоносный поворот, удача и изменения к лучшему.",
      reversedDescription: "Неудача, сопротивление переменам, нарушение ритма судьбы."
    },
    {
      name: "Справедливость",
      reverseName: "Перевернутая Справедливость",
      description: "Равновесие, правда, закон и честное воздаяние.",
      reversedDescription: "Несправедливость, предвзятость, уклонение от ответственности."
    },
    {
      name: "Повешенный",
      reverseName: "Перевернутый Повешенный",
      description: "Добровольная жертва, пауза, иной взгляд на ситуацию и смирение.",
      reversedDescription: "Бессмысленная жертва, откладывание, нежелание меняться."
    },
    {
      name: "Смерть",
      reverseName: "Перевернутая Смерть",
      description: "Конец старого и начало нового. Трансформация и неизбежные перемены.",
      reversedDescription: "Сопротивление переменам, застревание в прошлом, страх потерь."
    },
    {
      name: "Умеренность",
      reverseName: "Перевернутая Умеренность",
      description: "Баланс, гармония, терпение и умелое сочетание противоположностей.",
      reversedDescription: "Излишества, дисбаланс, нетерпение, конфликт интересов."
    },
    {
      name: "Дьявол",
      reverseName: "Перевернутый Дьявол",
      description: "Привязанности, искушение, материализм и скрытые цепи.",
      reversedDescription: "Освобождение от зависимости, разрыв оков, пробуждение."
    },
    {
      name: "Башня",
      reverseName: "Перевернутая Башня",
      description: "Внезапные перемены, разрушение старого, освобождение.",
      reversedDescription: "Затруднения в переменах, сопротивление, страх перед новой ситуацией."
    },
    {
      name: "Звезда",
      reverseName: "Перевернутая Звезда",
      description: "Надежда, вдохновение, исцеление и вера в будущее.",
      reversedDescription: "Разочарование, потеря веры, отчаяние, уныние."
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
    {
      name: "Суд",
      reverseName: "Перевернутый Суд",
      description: "Пробуждение, призыв, обновление и воздаяние за прошлое.",
      reversedDescription: "Самокритика, страх суда, промедление с важным решением."
    },
    {
      name: "Мир",
      reverseName: "Перевернутый Мир",
      description: "Завершение, целостность, достижение цели и торжество духа.",
      reversedDescription: "Незавершённость, откладывание финала, неудовлетворённость результатом."
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
        "/img/Portrait.png",
        "/img/TheFool.png",
        "/img/TheMagican.png",
        "/img/TheHighPriestess.png",
        "/img/TheEmpress.png",
        "/img/TheEmperor.png",
        "/img/TheHierophant.png",
        "/img/TheLovers.png",
        "/img/TheChariot.png",
        "/img/Strenght.png",
        "/img/TheHermit.png",
        "/img/WheelOfFortune.png",
        "/img/Justice.png",
        "/img/TheHangedMan.png",
        "/img/Death.png",
        "/img/Temperance.png",
        "/img/TheDevil.png",
        "/img/TheTower.png",
        "/img/TheStar.png",
        "/img/TheMoon.png",
        "/img/TheSun.png",
        "/img/Judgement.png",
        "/img/TheWorld.png",
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

      const toCSS = (sx: number, sy: number) => {
        const s = Math.min(window.innerWidth / SCENE_WIDTH, window.innerHeight / SCENE_HEIGHT);
        const ox = (window.innerWidth - SCENE_WIDTH * s) / 2;
        const oy = (window.innerHeight - SCENE_HEIGHT * s) / 2;
        return { left: Math.round(ox + sx * s), top: Math.round(oy + sy * s), s };
      };

      const wrapText = (text: string, maxChars: number): string[] => {
        const words = text.split(" ");
        const lines: string[] = [];
        let cur = "";
        for (const w of words) {
          const test = cur ? cur + " " + w : w;
          if (test.length > maxChars && cur) { lines.push(cur); cur = w; }
          else cur = test;
        }
        if (cur) lines.push(cur);
        return lines;
      };

      type Mode = "main" | "book" | "album" | "table";
      let mode: Mode = "main";

      const switchMode = (m: Mode) => {
        mode = m;
        uiLayer.removeChildren();
        dialogBoxRef.current = null;
        dialogTextRef.current = null;
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
      const isTokenValid = () => {
        const token = localStorage.getItem("tarot_token");
        if (!token) return false;
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload.exp * 1000 > Date.now();
        } catch {
          return false;
        }
      };

      const clearAuth = () => {
        localStorage.removeItem("tarot_token");
        localStorage.removeItem("tarot_user");
      };

      const addAuthButtons = () => {
        const saved = localStorage.getItem("tarot_user");
        if (saved && isTokenValid()) {
          const user = JSON.parse(saved);
          showStats(user.name);
          return;
        }
        if (saved) clearAuth();

        const labels = ["Войти", "Записаться"];
        labels.forEach((label, i) => {
          const { left, top, s } = toCSS(820, 520 + i * 130);
          const btn = document.createElement("button");
          btn.innerText = label;
          btn.style.position = "absolute";
          btn.style.left = `${left}px`;
          btn.style.top = `${top}px`;
          btn.style.padding = `${Math.round(22 * s)}px ${Math.round(64 * s)}px`;
          btn.style.fontSize = `${Math.round(22 * s)}px`;
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

        fields.forEach((placeholder, i) => {
          const { left, top, s } = toCSS(820, 520 + i * 90);
          const input = document.createElement("input");
          input.placeholder = placeholder;
          input.style.position = "absolute";
          input.style.left = `${left}px`;
          input.style.top = `${top}px`;
          input.style.padding = `${Math.round(28 * s)}px`;
          input.style.border = "2px solid #8B4513";
          input.style.background = "#d8a876";
          input.style.color = "#000";
          input.style.fontSize = `${Math.round(18 * s)}px`;
          input.style.opacity = "0";
          input.style.transition = "all 0.3s ease";
          setTimeout(() => (input.style.opacity = "1"), 50 + i * 150);
          inputsRef.current.push(input);
          containerRef.current!.appendChild(input);
        });

        const { left: sl, top: st, s: ss } = toCSS(820, 520 + fields.length * 90);
        const submitBtn = document.createElement("button");
        submitBtn.innerText = isRegister ? "Записаться" : "Войти";
        submitBtn.style.position = "absolute";
        submitBtn.style.left = `${sl}px`;
        submitBtn.style.top = `${st}px`;
        submitBtn.style.padding = `${Math.round(22 * ss)}px ${Math.round(64 * ss)}px`;
        submitBtn.style.fontSize = `${Math.round(22 * ss)}px`;
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

        submitBtn.addEventListener("click", async () => {
          const values = fields.map((_, idx) => (inputsRef.current[idx] as HTMLInputElement).value);

          if (values.some(v => !v.trim())) {
            submitBtn.innerText = "Заполните все поля";
            setTimeout(() => { submitBtn.innerText = isRegister ? "Записаться" : "Войти"; }, 2000);
            return;
          }

          submitBtn.innerText = "...";
          submitBtn.style.pointerEvents = "none";

          try {
            const body = isRegister
              ? { name: values[0], login: values[1], password: values[2] }
              : { login: values[0], password: values[1] };

            const res = await fetch(`http://localhost:8080/api/${isRegister ? "register" : "login"}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
              submitBtn.innerText = data.error || "Ошибка";
              submitBtn.style.pointerEvents = "auto";
              setTimeout(() => { submitBtn.innerText = isRegister ? "Записаться" : "Войти"; }, 2500);
              return;
            }

            localStorage.setItem("tarot_token", data.token);
            localStorage.setItem("tarot_user", JSON.stringify(data.user));

            inputsRef.current.forEach(el => el.remove());
            inputsRef.current = [];
            showStats(data.user.name);
          } catch {
            submitBtn.innerText = "Нет связи с сервером";
            submitBtn.style.pointerEvents = "auto";
            setTimeout(() => { submitBtn.innerText = isRegister ? "Записаться" : "Войти"; }, 2500);
          }
        });
      };

      const showStats = async (userName: string) => {
        const makeStat = (text: string, y: number) => {
          const txt = new PIXI.BitmapText({ text, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 24 } });
          txt.tint = 0x000000;
          txt.x = 800;
          txt.y = y;
          uiLayer.addChild(txt);
          statsTextsRef.current.push(txt);
          return txt;
        };

        makeStat(`Имя: ${userName}`, 300);
        const totalTxt   = makeStat("Расклады: ...", 350);
        const topTxt     = makeStat("Любимый расклад: ...", 400);
        const topCardTxt = makeStat("Любимая карта: ...", 450);

        const recentTitle = new PIXI.BitmapText({ text: "Последние расклады:", style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 24 } });
        recentTitle.tint = 0x000000;
        recentTitle.x = 1350;
        recentTitle.y = 294;
        uiLayer.addChild(recentTitle);
        lastReadoutsRef.current.push(recentTitle);

        const logoutBtn = createCloseButton("Выйти", 800, 540, () => {
          localStorage.removeItem("tarot_token");
          localStorage.removeItem("tarot_user");
          switchMode("book");
        }, 0x000000);
        uiLayer.addChild(logoutBtn);
        statsTextsRef.current.push(logoutBtn as unknown as PIXI.BitmapText);

        const portrait = PIXI.Sprite.from("/img/Portrait.png");
        portrait.x = 600;
        portrait.y = 350;
        portrait.width = 120;
        portrait.height = 120;
        uiLayer.addChild(portrait);
        portraitRef.current = portrait;

        try {
          const token = localStorage.getItem("tarot_token") || "";
          const resp = await fetch("http://localhost:8080/api/stats", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await resp.json();

          totalTxt.text   = `Расклады: ${data.total ?? 0}`;
          topTxt.text     = `Любимый расклад: ${data.top_spread || "нет данных"}`;
          topCardTxt.text = `Любимая карта: ${data.top_card ? getCardName(data.top_card, false) : "нет данных"}`;

          type ReadingRecord = { id: number; spread: string; question: string; cards: string; answer: string; created_at: string };
          const recent: ReadingRecord[] = data.recent ?? [];
          if (recent.length === 0) {
            const noData = new PIXI.BitmapText({ text: "(пока пусто)", style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 20 } });
            noData.tint = 0x000000;
            noData.x = 1350;
            noData.y = 334;
            uiLayer.addChild(noData);
            lastReadoutsRef.current.push(noData);
          } else {
            recent.slice(0, 5).forEach((r, i) => {
              const date = new Date(r.created_at).toLocaleDateString("ru-RU");
              const q = r.question.length > 20 ? r.question.slice(0, 20) + "…" : r.question;
              const line = new PIXI.BitmapText({ text: `▶ ${date}  ${r.spread}: ${q}`, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 18 } });
              line.tint = 0x000000;
              line.x = 1350;
              line.y = 334 + i * 36;
              line.eventMode = "static";
              line.cursor = "pointer";
              line.on("pointerover", () => { line.tint = 0x4a2a00; });
              line.on("pointerout",  () => { line.tint = 0x000000; });
              line.on("pointerdown", () => showReadingDetail(r, userName));
              uiLayer.addChild(line);
              lastReadoutsRef.current.push(line);
            });
          }
        } catch {
          totalTxt.text = "Расклады: нет связи";
        }
      };

      const refreshBookContent = () => {
        statsTextsRef.current.forEach(el => uiLayer.removeChild(el));
        statsTextsRef.current = [];
        lastReadoutsRef.current.forEach(el => uiLayer.removeChild(el));
        lastReadoutsRef.current = [];
        if (portraitRef.current) { uiLayer.removeChild(portraitRef.current); portraitRef.current.destroy(); portraitRef.current = null; }
        inputsRef.current.forEach(el => el.remove());
        inputsRef.current = [];
        addAuthButtons();
      };

      const showReadingDetail = (r: { spread: string; question: string; cards: string; answer: string; created_at: string }, userName: string) => {
        statsTextsRef.current.forEach(el => uiLayer.removeChild(el));
        statsTextsRef.current = [];
        lastReadoutsRef.current.forEach(el => uiLayer.removeChild(el));
        lastReadoutsRef.current = [];
        if (portraitRef.current) { uiLayer.removeChild(portraitRef.current); portraitRef.current.destroy(); portraitRef.current = null; }
        inputsRef.current.forEach(el => el.remove());
        inputsRef.current = [];

        const add = (text: string, x: number, y: number, size: number) => {
          const t = new PIXI.BitmapText({ text, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: size } });
          t.tint = 0x000000;
          t.x = x; t.y = y;
          uiLayer.addChild(t);
          statsTextsRef.current.push(t);
          return t;
        };

        const date = new Date(r.created_at).toLocaleDateString("ru-RU");
        add(`${r.spread}  ·  ${date}`, 620, 330, 22);

        add("Вопрос:", 620, 375, 20);
        const qLines = wrapText(r.question, 38);
        qLines.forEach((line, i) => add(line, 620, 405 + i * 28, 18));

        const cardsY = 405 + qLines.length * 28 + 24;
        add("Карты:", 620, cardsY, 20);
        r.cards.split(", ").forEach((path, i) => {
          add(`• ${getCardName(path.trim(), false)}`, 640, cardsY + 30 + i * 26, 18);
        });

        const backBtn = createCloseButton("← Назад", 620, 820, () => refreshBookContent(), 0x000000);
        uiLayer.addChild(backBtn);
        statsTextsRef.current.push(backBtn as unknown as PIXI.BitmapText);

        add("Трактовка:", 1380, 270, 22);
        const cleanAnswer = (r.answer || "(трактовка не сохранена)").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
        const answerLines = wrapText(cleanAnswer, 48);
        answerLines.forEach((line, i) => add(line, 1380, 310 + i * 34, 18));
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

      const splitIntoChunks = (text: string, maxLen: number): string[] => {
        const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) ?? [text];
        const chunks: string[] = [];
        let current = "";
        for (const s of sentences) {
          const trimmed = s.trim();
          if (!trimmed) continue;
          if (!current || current.length + 1 + trimmed.length <= maxLen) {
            current = current ? current + " " + trimmed : trimmed;
          } else {
            chunks.push(current);
            current = trimmed;
          }
        }
        if (current) chunks.push(current);
        return chunks.length > 0 ? chunks : [text];
      };

      const showDialogSequence = (text: string, onFinish?: () => void) => {
        const chunks = splitIntoChunks(text, 250);
        let idx = 0;

        const advance = () => {
          if (idx >= chunks.length) return;
          const isLast = idx === chunks.length - 1;
          showDialog(chunks[idx] + (isLast ? "" : "  ▶"));
          idx++;
          const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "BUTTON") return;
            window.removeEventListener("click", handler);
            if (isLast) onFinish?.();
            else advance();
          };
          setTimeout(() => window.addEventListener("click", handler), 400);
        };

        advance();
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

      if (!localStorage.getItem("hasVisitedBefore")) {
        localStorage.setItem("hasVisitedBefore", "true");
        setTimeout(() => startTutorial(), 4700);
      } else {
        const savedUser = localStorage.getItem("tarot_user");
        if (savedUser && isTokenValid()) {
          const user = JSON.parse(savedUser);
          setTimeout(() => {
            showDialog(`С возвращением, ${user.name}. Готовы узнать что готовит вам судьба?`);
          }, 500);
        }
      }
      const cleanupOverlay = () => {
        uiLayer.removeChildren();
        dialogBoxRef.current = null;
        dialogTextRef.current = null;
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
            btn.on("pointerdown", () => askQuestion(spreadIdx));
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

      const getCardName = (path: string, reversed: boolean): string => {
        const idx = albumCards.indexOf(path);
        if (idx < 0) return path;
        return reversed ? cardData[idx].reverseName : cardData[idx].name;
      };

      const askQuestion = (spreadIdx: number) => {
        switchMode("main");

        showDialog("Что вы хотите узнать?");

        const sceneScale = Math.min(window.innerWidth / SCENE_WIDTH, window.innerHeight / SCENE_HEIGHT);
        const stageX = (window.innerWidth - SCENE_WIDTH * sceneScale) / 2;
        const stageY = (window.innerHeight - SCENE_HEIGHT * sceneScale) / 2;

        // Inject placeholder colour (can't do pseudo-elements inline)
        const styleEl = document.createElement("style");
        styleEl.textContent = ".tarot-q::placeholder{color:rgba(255,255,255,0.38);}";
        document.head.appendChild(styleEl);

        // Input — right half of dialog, starts at scene x = SCENE_WIDTH/2 + 100
        const inputLeft = stageX + (SCENE_WIDTH / 2 + 100) * sceneScale;
        const input = document.createElement("input");
        input.className = "tarot-q";
        input.placeholder = "Задайте свой вопрос...";
        input.style.position = "absolute";
        input.style.left = `${inputLeft}px`;
        input.style.top = `${stageY + (SCENE_HEIGHT - 177) * sceneScale}px`;
        input.style.width = `${750 * sceneScale}px`;
        input.style.padding = `${6 * sceneScale}px ${10 * sceneScale}px`;
        input.style.fontSize = `${22 * sceneScale}px`;
        input.style.fontFamily = '"PxPlus_IBM_VGA8", monospace';
        input.style.background = "transparent";
        input.style.border = "none";
        input.style.borderBottom = "2px solid rgba(255,255,255,0.5)";
        input.style.color = "#ffffff";
        input.style.caretColor = "#ffffff";
        input.style.outline = "none";
        input.style.boxSizing = "border-box";
        input.style.letterSpacing = "2px";
        inputsRef.current.push(input);
        containerRef.current!.appendChild(input);
        setTimeout(() => input.focus(), 100);

        // Spread name label above input
        const spreadLabel = new PIXI.BitmapText({ text: `— ${spreads[spreadIdx].name} —`, style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 22 } });
        spreadLabel.tint = 0xaaaaaa;
        spreadLabel.x = SCENE_WIDTH / 2 + 100;
        spreadLabel.y = SCENE_HEIGHT - 208;
        uiLayer.addChild(spreadLabel);

        // [ НАЧАТЬ ] — right of input
        const startBtn = new PIXI.Container();
        const startText = new PIXI.BitmapText({ text: "[ НАЧАТЬ ]", style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 32 } });
        startText.tint = 0xffffff;
        startBtn.addChild(startText);
        startBtn.x = SCENE_WIDTH / 2 + 880;
        startBtn.y = SCENE_HEIGHT - 182;
        startBtn.eventMode = "static";
        startBtn.cursor = "pointer";
        startBtn.on("pointerover", () => { startText.tint = 0xffd700; });
        startBtn.on("pointerout",  () => { startText.tint = 0xffffff; });
        uiLayer.addChild(startBtn);

        // < НАЗАД — below input
        const backBtn = new PIXI.Container();
        const backText = new PIXI.BitmapText({ text: "< НАЗАД", style: { fontFamily: "PxPlus_IBM_VGA8", fontSize: 22 } });
        backText.tint = 0xffffff;
        backBtn.addChild(backText);
        backBtn.x = SCENE_WIDTH / 2 + 100;
        backBtn.y = SCENE_HEIGHT - 120;
        backBtn.eventMode = "static";
        backBtn.cursor = "pointer";
        backBtn.on("pointerover", () => { backText.tint = 0xffd700; });
        backBtn.on("pointerout",  () => { backText.tint = 0xffffff; });
        backBtn.on("pointerdown", () => {
          styleEl.remove();
          inputsRef.current.forEach(el => el.remove());
          inputsRef.current = [];
          uiLayer.removeChildren();
          dialogBoxRef.current = null;
          dialogTextRef.current = null;
          showSpreadSelection();
        });
        uiLayer.addChild(backBtn);

        const startReading = () => {
          const question = input.value.trim() || "Что меня ждёт?";
          styleEl.remove();
          inputsRef.current.forEach(el => el.remove());
          inputsRef.current = [];
          uiLayer.removeChildren();
          dialogBoxRef.current = null;
          dialogTextRef.current = null;
          openTable(spreadIdx, question);
        };

        startBtn.on("pointerdown", startReading);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") startReading();
        });
      };

      const openTable = (spreadIndex: number, question = "Что меня ждёт?") => {
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

        const shuffled = [...albumCards].sort(() => Math.random() - 0.5);
        const selectedCards = shuffled.slice(0, numCards);
        const reversedFlags = selectedCards.map(() => Math.random() < 0.3);

        let flippedCount = 0;
        const onAllFlipped = async () => {
          const cardNames = selectedCards.map((p, i) => getCardName(p, reversedFlags[i]));
          showDialog("Думаю...");
          const token = localStorage.getItem("tarot_token");
          try {
            const res = await fetch("http://localhost:8080/api/reading/ask", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ spread: spread.name, question, cards: cardNames }),
            });
            const data = await res.json();
            showDialogSequence(data.text ?? data.error ?? "Нет ответа", () => switchMode("main"));
          } catch {
            showDialog("Не удалось получить предсказание.");
          }
        };

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
            if (!isFlipped && !isAnimating) card.rotation = 0;
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
                  flippedCount++;
                  if (flippedCount === numCards) onAllFlipped();
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
