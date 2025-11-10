/* eslint-disable no-unused-vars */
import p5 from "p5";
import { sentimentColors } from "../utils/sentimentColors";

export const createAuraSketch = (getSentiment) => (p) => {
  const s = getSentiment() || {
    sentiment_label: "neutral",
    sentiment_score: 0.5,
  };
  const [a, b] = sentimentColors[s.sentiment_label] || sentimentColors.neutral;

  const particles = [];
  const numParticles = 1000;
  const noiseScale = 0.0018;
  let zOff = 0;

  let currentC1, currentC2;
  let targetC1, targetC2;
  let prevLabel = null;
  let transitionProgress = 1;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();
    p.background(0);

    const s = getSentiment();
    const [a, b] = sentimentColors[s.sentiment_label];
    currentC1 = p.color(a);
    currentC2 = p.color(b);
    targetC1 = p.color(a);
    targetC2 = p.color(b);
    prevLabel = s.sentiment_label;

    initializeParticles();
  };

  function initializeParticles() {
    particles.length = 0;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: p.random(p.width),
        y: p.random(p.height),
        alpha: p.random(40, 100),
        size: p.random(2, 4),
        speed: p.random(0.3, 1.5),
        hueShift: p.random(0.9, 1.1),
      });
    }
  }

  p.draw = () => {
    const s = getSentiment();

    // color transition
    if (s.sentiment_label !== prevLabel && transitionProgress >= 1) {
      const [a, b] =
        sentimentColors[s.sentiment_label] || sentimentColors.neutral;
      targetC1 = p.color(a);
      targetC2 = p.color(b);
      prevLabel = s.sentiment_label;
      transitionProgress = 0;
    }

    const lerpSpeed = Math.min(0.08, p.deltaTime * 0.004);
    currentC1 = p.lerpColor(currentC1, targetC1, lerpSpeed);
    currentC2 = p.lerpColor(currentC2, targetC2, lerpSpeed);
    transitionProgress = Math.min(1, transitionProgress + lerpSpeed * 1.5);

    p.fill(0, 0, 0, 15);
    p.rect(0, 0, p.width, p.height);

    p.blendMode(p.ADD);
    p.drawingContext.globalAlpha = 0.9;

    const flowStrength = 1.2 + s.sentiment_score * 1.5;
    const cx = p.width / 2;
    const cy = p.height / 2;
    const safeZone = Math.min(p.width, p.height) * 0.15;

    for (let i = 0; i < particles.length; i++) {
      const pt = particles[i];
      const n = p.noise(pt.x * noiseScale, pt.y * noiseScale, zOff);
      const angle = n * p.TWO_PI * 2.0;
      const driftX = Math.cos(angle) * flowStrength + 0.3;
      const driftY = Math.sin(angle) * flowStrength * 0.7;

      pt.x += driftX;
      pt.y += driftY;

      if (pt.x < 0) pt.x = p.width;
      if (pt.x > p.width) pt.x = 0;
      if (pt.y < 0) pt.y = p.height;
      if (pt.y > p.height) pt.y = 0;

      const d = p.dist(pt.x, pt.y, cx, cy);
      if (d < safeZone) continue;

      const mix = p.noise(pt.x * 0.001, pt.y * 0.001);
      const base = p.lerpColor(currentC1, currentC2, mix);
      const c = p.color(
        p.hue(base) * pt.hueShift,
        p.saturation(base),
        Math.min(100, p.brightness(base) * 1.3),
        pt.alpha
      );

      p.fill(c);
      p.circle(pt.x, pt.y, pt.size);
    }

    zOff += 0.0025 + s.sentiment_score * 0.01;
    p.blendMode(p.BLEND);
    p.drawingContext.globalAlpha = 1;
  };
};
