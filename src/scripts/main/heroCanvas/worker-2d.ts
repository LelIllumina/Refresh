let canvas: OffscreenCanvas;
let ctx: OffscreenCanvasRenderingContext2D | null;
let imageBitmap: ImageBitmap;
let baseImageData: ImageData | null = null;
let intensity = 0;

self.onmessage = async (e) => {
  const msg = e.data;

  if (msg.type === "init") {
    canvas = msg.canvas;
    canvas.width = msg.width;
    canvas.height = msg.height;
    intensity = msg.intensity;

    ctx = canvas.getContext("2d");

    // Workers can't use <img>, so do this instead:
    if (imageBitmap) imageBitmap.close();

    const res = await fetch(msg.bg);
    const blob = await res.blob();
    imageBitmap = await createImageBitmap(blob);

    drawBaseImage();
    applyAberration(0);
  }

  if (msg.type === "resize") {
    if (
      !msg.canvas ||
      !msg.width ||
      !msg.height ||
      !msg.bg ||
      msg.intensity === undefined
    ) {
      self.postMessage({
        type: "error",
        message: "Invalid init message: missing required fields",
      });
      return;
    }

    canvas.width = msg.width;
    canvas.height = msg.height;
    drawBaseImage();
    applyAberration(0);
  }
};

function drawBaseImage() {
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = imageBitmap.width;
  const ih = imageBitmap.height;

  const scale = Math.max(cw / iw, ch / ih);
  const sw = iw * scale;
  const sh = ih * scale;

  const dx = (cw - sw) / 2;
  const dy = (ch - sh) / 2;

  if (!ctx) throw new Error("Canvas rendering context not available");
  ctx.drawImage(imageBitmap, dx, dy, sw, sh);
  baseImageData = ctx.getImageData(0, 0, cw, ch);
}

function applyAberration(phase: number) {
  if (!baseImageData) return;

  const imageData = new ImageData(
    new Uint8ClampedArray(baseImageData.data),
    baseImageData.width,
    baseImageData.height,
  );

  const data = imageData.data;
  const offset = 4 * intensity;

  for (let i = phase & 3; i < data.length - offset; i += 4) {
    data[i] = data[i + offset];
  }

  if (!ctx) throw new Error("Canvas rendering context not available");
  ctx.putImageData(imageData, 0, 0);
}
