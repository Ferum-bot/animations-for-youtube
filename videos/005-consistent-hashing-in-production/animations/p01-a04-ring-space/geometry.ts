import {ring} from '../../shared/theory/model';
import {mix} from '../../shared/theory/motion';

/** Bend a simple arc, then close it. Its bounds stay inside the diagram area. */
export const scalePoints = (amount: number) => {
  if (amount < 0.0001) return Array.from({length: 101}, (_, i) => ({x: 164 + i * 10.8, y: ring.y}));
  const angle = Math.PI * 2 * amount;
  const points = Array.from({length: 101}, (_, i) => ({
    x: Math.sin((angle * i) / 100),
    y: -Math.cos((angle * i) / 100),
  }));
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = mix(1080, ring.radius * 2, amount);
  const height = ring.radius * 2 * amount;
  return points.map((p) => ({
    x: ring.x + ((p.x - minX) / (maxX - minX) - 0.5) * width,
    y: ring.y + ((p.y - minY) / (maxY - minY) - 0.5) * height,
  }));
};
