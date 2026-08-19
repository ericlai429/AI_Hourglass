export interface Bubble {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  alpha: number;
}

export class CrystalBallRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private width: number = 0;
  private height: number = 0;
  private waveOffset: number = 0;
  private bubbles: Bubble[] = [];

  // Configuration
  public remainingPct: number = 100; // 0 - 100
  public topColor: string = '#60a5fa';
  public bottomColor: string = '#1d4ed8';
  public glowColor: string = '#93c5fd';
  public particleColor: string = 'rgba(255, 255, 255, 0.8)';
  public isIdle: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get 2d context');
    this.ctx = ctx;
    this.resize();
  }

  public resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  public start() {
    if (this.animFrameId) return;
    const loop = () => {
      this.update();
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private update() {
    // Wave speed depends on idle state
    const speed = this.isIdle ? 0.02 : 0.045;
    this.waveOffset += speed;

    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.42;

    // Fluid height level
    const fillRatio = Math.max(0.02, Math.min(0.98, this.remainingPct / 100));
    const liquidTopY = cy + radius - (radius * 2 * fillRatio);

    // Spawn bubbles in liquid
    if (Math.random() < (this.isIdle ? 0.2 : 0.4) && this.remainingPct > 5) {
      const bubbleX = cx + (Math.random() - 0.5) * radius * 1.4;
      this.bubbles.push({
        x: bubbleX,
        y: cy + radius - Math.random() * 20,
        r: 1.5 + Math.random() * 2.5,
        vy: 0.6 + Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.3,
        alpha: 0.7 + Math.random() * 0.3,
      });
    }

    // Update bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.y -= b.vy;
      b.x += b.vx;
      b.alpha -= 0.005;

      // Pop at liquid surface or fade out
      if (b.y <= liquidTopY || b.alpha <= 0) {
        this.bubbles.splice(i, 1);
      }
    }

    if (this.bubbles.length > 50) {
      this.bubbles.splice(0, this.bubbles.length - 50);
    }
  }

  private render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.42;

    // Draw Outer Glow Aura
    this.drawAura(ctx, cx, cy, radius);

    // Draw Glass Base
    this.drawPedestal(ctx, cx, cy + radius);

    // Draw Spherical Glass Orb Background
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Dark Orb Interior Gradient
    const orbBg = ctx.createRadialGradient(cx, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
    orbBg.addColorStop(0, '#101827');
    orbBg.addColorStop(1, '#030712');
    ctx.fillStyle = orbBg;
    ctx.fill();

    // Draw Dynamic Potion Liquid
    this.drawLiquid(ctx, cx, cy, radius);

    // Draw Rising Magical Bubbles
    for (const b of this.bubbles) {
      ctx.fillStyle = this.particleColor;
      ctx.globalAlpha = b.alpha;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Draw Internal Glow at Core
    const coreGlow = ctx.createRadialGradient(cx, cy + radius * 0.2, 5, cx, cy + radius * 0.2, radius * 0.9);
    coreGlow.addColorStop(0, this.glowColor);
    coreGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGlow;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Glass Orb Reflections & Rim Light
    this.drawGlassHighlights(ctx, cx, cy, radius);

    ctx.restore();

    // Glass Outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  private drawAura(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.save();
    const aura = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.25);
    aura.addColorStop(0, this.glowColor);
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawPedestal(ctx: CanvasRenderingContext2D, cx: number, bottomY: number) {
    ctx.save();
    const pw = 70;
    const ph = 12;

    // Metallic / Obsidian Stand
    const grad = ctx.createLinearGradient(cx - pw / 2, bottomY, cx + pw / 2, bottomY);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.5, '#475569');
    grad.addColorStop(1, '#1e293b');

    ctx.fillStyle = grad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.roundRect(cx - pw / 2, bottomY - 6, pw, ph, 4);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  private drawLiquid(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    const fillRatio = Math.max(0, Math.min(1, this.remainingPct / 100));
    if (fillRatio <= 0.01) return;

    const baseLevel = cy + r - (r * 2 * fillRatio);
    const amp1 = this.isIdle ? 3 : 6;
    const amp2 = this.isIdle ? 2 : 4;

    ctx.save();

    // Liquid Body Gradient
    const liquidGrad = ctx.createLinearGradient(cx, baseLevel, cx, cy + r);
    liquidGrad.addColorStop(0, this.topColor);
    liquidGrad.addColorStop(1, this.bottomColor);

    ctx.fillStyle = liquidGrad;
    ctx.beginPath();
    ctx.moveTo(cx - r - 10, cy + r + 10);

    // Sine Wave Surface
    const segments = 30;
    const startX = cx - r - 10;
    const endX = cx + r + 10;
    const step = (endX - startX) / segments;

    for (let i = 0; i <= segments; i++) {
      const x = startX + i * step;
      const y = baseLevel + 
        Math.sin(i * 0.4 + this.waveOffset) * amp1 + 
        Math.cos(i * 0.25 - this.waveOffset * 1.2) * amp2;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(cx + r + 10, cy + r + 10);
    ctx.closePath();
    ctx.fill();

    // Top Wave Crest Highlight Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  private drawGlassHighlights(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.save();

    // Top-left primary crescent reflection
    const hlGrad = ctx.createLinearGradient(cx - r * 0.7, cy - r * 0.7, cx, cy);
    hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    hlGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    hlGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = hlGrad;
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy - r * 0.4, r * 0.25, r * 0.12, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Bottom-right rim reflection
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, Math.PI * 0.15, Math.PI * 0.45);
    ctx.stroke();

    ctx.restore();
  }
}
