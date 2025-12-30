import bg from "/src/assets/images/background.webp";

document.addEventListener("astro:page-load", initCanvas);

const intensity = Math.ceil(Math.random() * 10);

function initCanvas() {
  const canvas = document.querySelector<HTMLCanvasElement>("#hero-canvas")!;
  const ctx = canvas.getContext("2d")!;

  if (ctx === null) {
    alert(
      "Unable to initialize canvas. Your browser or machine may not support it.",
    );
    return;
  }

  let baseImageData: ImageData | null = null;
  function drawBaseImage() {
    drawCoverImage();
    baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  let image = new Image();
  image.decoding = "async";
  image.src = bg.src;
  image.onload = function () {
    drawBaseImage();
    applyAberration(ctx, intensity, 0);
  };

  function drawCoverImage() {
    // https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = image.naturalWidth;
    const ih = image.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);

    const sw = iw * scale;
    const sh = ih * scale;

    const dx = (cw - sw) / 2;
    const dy = (ch - sh) / 2;

    ctx.drawImage(image, dx, dy, sw, sh);
  }

  // oxlint-disable-next-line no-unused-vars
  function chromaticAberration(
    ctx: CanvasRenderingContext2D,
    intensity: number,
    phase: number,
  ) {
    /* From: https://gist.github.com/lqt0223/8a258b68ae1c032fa1fb1e26c4965e8d
      Use canvas to draw the original image, and load pixel data by calling getImageData
          The ImageData.data is a one-dimensional Uint8Array with all the color elements flattened. The array contains data in the sequence of [r,g,b,a,r,g,b,a...]
          Because of the cross-origin issue, remember to run the demo in a localhost server or the getImageData call will throw error
          */
    const w = Math.floor(canvas.width);
    const h = Math.floor(canvas.height);
    let imageData = ctx.getImageData(0, 0, w, h);
    let data = imageData.data;
    for (let i = phase % 4; i < data.length; i += 4) {
      // Setting the start of the loop to a different integer will change the aberration color, but a start integer of 4n-1 will not work
      data[i] = data[i + 4 * intensity];
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function applyAberration(
    ctx: CanvasRenderingContext2D,
    intensity: number,
    phase: number,
  ) {
    if (!baseImageData) return;
    const imageData = new ImageData(
      new Uint8ClampedArray(baseImageData.data),
      baseImageData.width,
      baseImageData.height,
    );
    const data = imageData.data;

    // for (let i = phase % 4; i < data.length; i += 4) {
    //   data[i] = data[i + 4 * intensity];
    // }
    const offset = 4 * intensity;
    for (let i = phase & 3; i < data.length - offset; i += 4) {
      data[i] = data[i + offset];
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function resizeCanvas() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    // Redraw image and effects after resizing
    if (image.complete) {
      drawBaseImage();
      applyAberration(ctx, intensity, 0);
    }
  }
  resizeCanvas();
  let resizePending = false;
  window.addEventListener("resize", () => {
    if (!resizePending) {
      resizePending = true;
      requestAnimationFrame(() => {
        resizeCanvas();
        resizePending = false;
      });
    }
  });
}
