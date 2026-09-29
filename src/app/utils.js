export class SimplexNoise {
  constructor(seed = Math.random()) {
    this.grad3 = [
      [1, 1, 0],
      [-1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0],
      [1, 0, 1],
      [-1, 0, 1],
      [1, 0, -1],
      [-1, 0, -1],
      [0, 1, 1],
      [0, -1, 1],
      [0, 1, -1],
      [0, -1, -1],
    ];
    this.p = new Array(256);
    this.perm = new Array(512);
    this.permMod12 = new Array(512);

    const random = this.mulberry32(seed);
    for (let i = 0; i < 256; i++) {
      this.p[i] = i;
    }

    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
    }

    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  mulberry32(a) {
    return function () {
      a |= 0;
      a = a + 0x6d2b79f5;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);

    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;

    const n0 = this.getCornerNoise(x0, y0, this.permMod12[ii + this.perm[jj]]);
    const n1 = this.getCornerNoise(
      x1,
      y1,
      this.permMod12[ii + i1 + this.perm[jj + j1]]
    );
    const n2 = this.getCornerNoise(
      x2,
      y2,
      this.permMod12[ii + 1 + this.perm[jj + 1]]
    );

    return 70.0 * (n0 + n1 + n2);
  }

  getCornerNoise(x, y, gi) {
    const t = 0.5 - x * x - y * y;
    if (t < 0) return 0.0;
    const t2 = t * t;
    return t2 * t2 * (this.grad3[gi][0] * x + this.grad3[gi][1] * y);
  }
}

export const fibonacci = (n) => {
  const sequence = [1, 1];
  for (let i = 2; i < n; i++) {
    sequence[i] = sequence[i - 1] + sequence[i - 2];
  }
  return sequence;
};

export const goldenRatio = (1 + Math.sqrt(5)) / 2;

export const noise = new SimplexNoise(42); // Consistent seed for reproducible results
