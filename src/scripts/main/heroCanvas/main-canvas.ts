import bg from "/src/assets/images/background.webp";

const canvas = document.querySelector<HTMLCanvasElement>("#hero-canvas");
if (!canvas) throw new Error("Canvas element not found");

const offscreen = canvas.transferControlToOffscreen();

const worker = new Worker(new URL("./worker-2d.ts", import.meta.url), {
  type: "module",
});

worker.postMessage(
  {
    type: "init",
    canvas: offscreen,
    bg: bg.src,
    intensity: Math.floor(Math.random() * 10) + 3, // Range: 3-12
    width: window.innerWidth,
    height: window.innerHeight,
  },
  [offscreen],
);
let resizeScheduled = false;

window.addEventListener("resize", () => {
  if (resizeScheduled) return;
  resizeScheduled = true;

  requestAnimationFrame(() => {
    resizeScheduled = false;
    worker.postMessage({
      type: "resize",
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });
});
