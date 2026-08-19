export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export class HourglassRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animFrameId: number | null = null;
  private width: number = 0;
  private height: number = 0;
  
  // Hourglass configuration
  public remainingPct: number = 100; // 0 - 100
  public isIdle: boolean = false; // if true, don't drop sand
  public primaryColor: string = '#3b82f6';
  public secondaryColor: string = '#60a5fa';
  public glowColor: string = 'rgba(59, 130, 246, 0.4)';
  public title: string = '';

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
    const neckX = this.width / 2;
    const neckY = this.height / 2;
    const bottomY = this.height * 0.88;

    // Generate falling sand if NOT idle and there is sand left to drop
    // (If remainingPct == 100 or isIdle == true, sand doesn't flow!)
    const shouldDrop = !this.isIdle && this.remainingPct < 100 && this.remainingPct > 0;

    if (shouldDrop) {
      // Spawn 1 to 3 particles per frame
      for (let i = 0; i < 2; i++) {
        this.particles.push({
          x: neckX + (Math.random() - 0.5) * 4,
          y: neckY + 2,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 1.5 + Math.random() * 2.5,
          size: 1.2 + Math.random() * 1.5,
          color: Math.random() > 0.4 ? this.primaryColor : this.secondaryColor,
          alpha: 0.8 + Math.random() * 0.2,
        });
      }
    }

    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // Gravity

      // Dynamic pile boundary in bottom bulb
      const usedPct = (100 - this.remainingPct) / 100;
      const pileHeight = (this.height * 0.38) * usedPct;
      const currentBottomLimit = bottomY - pileHeight + Math.abs(p.x - neckX) * 0.4;

      if (p.y >= currentBottomLimit) {
        this.particles.splice(i, 1);
      }
    }

    // Limit maximum active falling particles to prevent lag
    if (this.particles.length > 120) {
      this.particles.splice(0, this.particles.length - 120);
    }
  }

  private render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const topBulbY = h * 0.12;
    const neckY = h * 0.5;
    const bottomBulbY = h * 0.88;
    const bulbRadius = Math.min(w * 0.38, (h * 0.34));
    const neckWidth = 7;

    // Draw Glass Outline & Frame
    this.drawHourglassFrame(ctx, cx, topBulbY, neckY, bottomBulbY, bulbRadius, neckWidth);

    // Draw Top Sand (Remaining Quota)
    this.drawTopSand(ctx, cx, topBulbY, neckY, bulbRadius, neckWidth);

    // Draw Bottom Sand (Consumed Quota)
    this.drawBottomSand(ctx, cx, neckY, bottomBulbY, bulbRadius, neckWidth);

    // Draw Falling Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Draw Glass Highlights / Reflections
    this.drawGlassReflections(ctx, cx, topBulbY, neckY, bottomBulbY, bulbRadius);
  }

  private drawHourglassFrame(
    ctx: CanvasRenderingContext2D,
    cx: number,
    topY: number,
    neckY: number,
    bottomY: number,
    r: number,
    neckW: number
  ) {
    ctx.save();
    
    // Top & Bottom wooden/metal caps
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;

    const capW = r * 1.8;
    const capH = 8;
    
    // Top Cap
    ctx.beginPath();
    ctx.roundRect(cx - capW / 2, topY - capH - 4, capW, capH, 4);
    ctx.fill();
    ctx.stroke();

    // Bottom Cap
    ctx.beginPath();
    ctx.roundRect(cx - capW / 2, bottomY + 4, capW, capH, 4);
    ctx.fill();
    ctx.stroke();

    // Glass Bulb Path
    ctx.beginPath();
    // Top-left
    ctx.moveTo(cx - r * 0.75, topY);
    // Curve to neck
    ctx.bezierCurveTo(cx - r * 0.75, neckY * 0.7, cx - neckW, neckY * 0.9, cx - neckW, neckY);
    // Curve to bottom-left
    ctx.bezierCurveTo(cx - neckW, neckY * 1.1, cx - r * 0.75, bottomY * 0.85, cx - r * 0.75, bottomY);
    // Bottom arc
    ctx.lineTo(cx + r * 0.75, bottomY);
    // Curve to neck from bottom-right
    ctx.bezierCurveTo(cx + r * 0.75, bottomY * 0.85, cx + neckW, neckY * 1.1, cx + neckW, neckY);
    // Curve to top-right
    ctx.bezierCurveTo(cx + neckW, neckY * 0.9, cx + r * 0.75, topY * 0.7, cx + r * 0.75, topY);
    ctx.closePath();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();

    ctx.restore();
  }

  private drawTopSand(
    ctx: CanvasRenderingContext2D,
    cx: number,
    topY: number,
    neckY: number,
    r: number,
    neckW: number
  ) {
    if (this.remainingPct <= 0) return;

    ctx.save();
    // Clip to top bulb
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.75, topY);
    ctx.bezierCurveTo(cx - r * 0.75, neckY * 0.7, cx - neckW, neckY * 0.9, cx - neckW, neckY);
    ctx.lineTo(cx + neckW, neckY);
    ctx.bezierCurveTo(cx + neckW, neckY * 0.9, cx + r * 0.75, topY * 0.7, cx + r * 0.75, topY);
    ctx.closePath();
    ctx.clip();

    // Sand level calculation
    const fillRatio = Math.max(0, Math.min(1, this.remainingPct / 100));
    const sandHeight = (neckY - topY) * fillRatio;
    const sandTopY = neckY - sandHeight;

    // Gradient sand
    const grad = ctx.createLinearGradient(0, sandTopY, 0, neckY);
    grad.addColorStop(0, this.secondaryColor);
    grad.addColorStop(1, this.primaryColor);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx - r, sandTopY);
    // Slight dip at the center of top sand
    ctx.quadraticCurveTo(cx, sandTopY + (this.isIdle ? 2 : 6), cx + r, sandTopY);
    ctx.lineTo(cx + r, neckY + 10);
    ctx.lineTo(cx - r, neckY + 10);
    ctx.closePath();
    ctx.fill();

    // Sand grain texture / glow
    ctx.fillStyle = this.glowColor;
    ctx.fill();

    ctx.restore();
  }

  private drawBottomSand(
    ctx: CanvasRenderingContext2D,
    cx: number,
    neckY: number,
    bottomY: number,
    r: number,
    neckW: number
  ) {
    const usedPct = 100 - this.remainingPct;
    if (usedPct <= 0) return;

    ctx.save();
    // Clip to bottom bulb
    ctx.beginPath();
    ctx.moveTo(cx - neckW, neckY);
    ctx.bezierCurveTo(cx - neckW, neckY * 1.1, cx - r * 0.75, bottomY * 0.85, cx - r * 0.75, bottomY);
    ctx.lineTo(cx + r * 0.75, bottomY);
    ctx.bezierCurveTo(cx + r * 0.75, bottomY * 0.85, cx + neckW, neckY * 1.1, cx + neckW, neckY);
    ctx.closePath();
    ctx.clip();

    const fillRatio = Math.max(0, Math.min(1, usedPct / 100));
    const sandHeight = (bottomY - neckY) * fillRatio * 0.85;
    const pileTopY = bottomY - sandHeight;

    const grad = ctx.createLinearGradient(0, pileTopY, 0, bottomY);
    grad.addColorStop(0, this.secondaryColor);
    grad.addColorStop(1, this.primaryColor);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx - r, bottomY + 5);
    ctx.lineTo(cx - r * 0.7, pileTopY + 8);
    // Center sand cone mound peak
    ctx.quadraticCurveTo(cx, pileTopY - 4, cx + r * 0.7, pileTopY + 8);
    ctx.lineTo(cx + r, bottomY + 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawGlassReflections(
    ctx: CanvasRenderingContext2D,
    cx: number,
    topY: number,
    neckY: number,
    bottomY: number,
    r: number
  ) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    // Left curved specular highlight (top bulb)
    ctx.beginPath();
    ctx.arc(cx - r * 0.45, (topY + neckY) / 2, r * 0.3, Math.PI * 0.8, Math.PI * 1.25);
    ctx.stroke();

    // Left curved specular highlight (bottom bulb)
    ctx.beginPath();
    ctx.arc(cx - r * 0.45, (neckY + bottomY) / 2, r * 0.3, Math.PI * 0.8, Math.PI * 1.25);
    ctx.stroke();

    ctx.restore();
  }
}
