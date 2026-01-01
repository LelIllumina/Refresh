import bg from "/src/assets/images/background.webp";
import * as twgl from "twgl.js";

document.addEventListener("astro:page-load", initCanvas);

/* Shader Consts */
const vertexShaderSource = /* GLSL */ `#version 300 es
  in vec4 position;
  void main() {
    gl_Position = position;
  }
`;

const fragmentShaderSource = /* GLSL */ `#version 300 es
  precision highp float;
  uniform vec2 u_resolution;
  uniform sampler2D u_image;
  out vec4 outColor;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.y = 1.0 - uv.y; // Flip Y coordinate
    vec4 texel = texture(u_image, uv);
    outColor = texel; 
  }
`;

/* Init stuff */
function initCanvas() {
  const canvas = document.querySelector<HTMLCanvasElement>("#hero-canvas");
  if (!canvas) {
    alert("Canvas element not found");
    return;
  }

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    alert(
      "Unable to initialize Webgl. Your browser may not support it. Switching to 2D canvas context",
    );
    // import("@scripts/main/heroCanvas/2d");
    return;
  }

  // Type assertion after null check
  const glContext = gl as WebGL2RenderingContext;

  // Resize canvas to match display size
  twgl.resizeCanvasToDisplaySize(canvas);
  glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);

  // Create program
  const programInfo = twgl.createProgramInfo(glContext, [
    vertexShaderSource,
    fragmentShaderSource,
  ]);

  // Create a full-screen quad
  const arrays = {
    position: {
      numComponents: 2,
      data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1],
    },
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(glContext, arrays);

  // Load and create texture
  const texture = twgl.createTexture(
    glContext,
    {
      src: bg.src,
    },
    (err, _tex, _source) => {
      if (err) {
        console.error("Error loading texture:", err);
        return;
      }
      // Render once texture is loaded
      render();
    },
  );

  function render() {
    glContext.useProgram(programInfo.program);

    // Set uniforms
    if (!canvas) throw new Error("Canvas not found during render");
    twgl.setUniforms(programInfo, {
      u_resolution: [canvas.width, canvas.height],
      u_image: texture,
    });

    // Bind buffers and draw
    twgl.setBuffersAndAttributes(glContext, programInfo, bufferInfo);
    twgl.drawBufferInfo(glContext, bufferInfo);
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    twgl.resizeCanvasToDisplaySize(canvas);
    glContext.viewport(0, 0, canvas.width, canvas.height);
    render();
  });
}
