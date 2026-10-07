import { CanvasTexture, SRGBColorSpace } from 'three';

export const NUMERAL_FONT = "'Times New Roman','Cinzel','Trajan Pro','Cormorant SC',Georgia,serif";

/** Engraved rank numeral for the pillar face. Redraws once the web font loads. */
export function makeNumeralTexture(label: string, color: string): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  const draw = () => {
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, 256, 256);
    g.font = `700 190px ${NUMERAL_FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const grad = g.createLinearGradient(0, 40, 0, 220);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, color);
    grad.addColorStop(1, color + '66');
    g.shadowColor = color;
    g.shadowBlur = 22;
    g.fillStyle = grad;
    g.fillText(label, 128, 140);
    tex.needsUpdate = true;
  };
  draw();
  document.fonts?.load(`700 120px ${NUMERAL_FONT}`).then(draw).catch(() => {});
  return tex;
}

/** White radial falloff (alpha) for floor glow pools. */
export function makeRadialGlow(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.28)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new CanvasTexture(c);
}

/** Grayscale vertical ramp used as an alphaMap (dark top → bright bottom). */
export function makeVerticalFade(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#000');
  grad.addColorStop(1, '#fff');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 128);
  return new CanvasTexture(c);
}
