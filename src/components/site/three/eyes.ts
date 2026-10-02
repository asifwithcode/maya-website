// Draws Maya's display (240 × 240 firmware layout, scaled) onto a canvas used as the screen texture.
export type EyeMood = "idle" | "happy" | "love" | "surprised" | "sleepy";

const PINK = "#f7b8c8";
const S = 512 / 240;
const EYES: [number, number][] = [
  [86, 122],
  [154, 122],
];

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function drawEyes(
  ctx: CanvasRenderingContext2D,
  mood: EyeMood,
  t: number,
  look: { x: number; y: number },
  blink: number,
) {
  const W = ctx.canvas.width;
  const g = ctx.createRadialGradient(W * 0.35, W * 0.25, 0, W * 0.5, W * 0.5, W * 0.72);
  g.addColorStop(0, "#1d1b22");
  g.addColorStop(0.6, "#050506");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, W);

  ctx.save();
  ctx.scale(S, S);
  ctx.translate(look.x, look.y);
  ctx.fillStyle = PINK;
  ctx.strokeStyle = PINK;
  ctx.lineCap = "round";
  for (const [x, y] of EYES) {
    ctx.save();
    ctx.translate(x, y);
    switch (mood) {
      case "happy":
        ctx.lineWidth = 13;
        ctx.beginPath();
        ctx.moveTo(-24, 10);
        ctx.quadraticCurveTo(0, -26, 24, 10);
        ctx.stroke();
        break;
      case "sleepy":
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(-22, 4);
        ctx.quadraticCurveTo(0, 18, 22, 4);
        ctx.stroke();
        break;
      case "surprised": {
        const s = 1 + Math.sin(t * 9) * 0.03;
        ctx.beginPath();
        ctx.arc(0, 0, 27 * s, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "love": {
        const s = 1 + Math.max(0, Math.sin(t * 7)) * 0.14;
        ctx.scale(s, s);
        ctx.fillStyle = "#ff7d9c";
        ctx.beginPath();
        ctx.moveTo(0, 22);
        ctx.bezierCurveTo(-34, 0, -30, -26, -13, -26);
        ctx.bezierCurveTo(-5, -26, 0, -19, 0, -14);
        ctx.bezierCurveTo(0, -19, 5, -26, 13, -26);
        ctx.bezierCurveTo(30, -26, 34, 0, 0, 22);
        ctx.fill();
        break;
      }
      default: {
        const h = 60 * Math.max(0.08, 1 - blink);
        roundRect(ctx, -20, -h / 2, 40, h, 18);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  ctx.restore();

  // glass highlight
  ctx.save();
  ctx.translate(W * 0.34, W * 0.19);
  ctx.rotate(-0.32);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.ellipse(0, 0, W * 0.2, W * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
