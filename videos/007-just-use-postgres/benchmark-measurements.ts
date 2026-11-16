/** Measured episode data; no visual or timing dependencies. Shared by long and vertical versions. */
export const queueMeasurements = [
  {
    jobs: 0,
    healthyMs: 0.044,
    blockedMs: 0.041,
    healthyKb: 240,
    blockedKb: 240,
    buffers: 23,
  },
  {
    jobs: 20000,
    healthyMs: 0.046,
    blockedMs: 2.2,
    healthyKb: 424,
    blockedKb: 736,
    buffers: 22287,
  },
  {
    jobs: 40000,
    healthyMs: 0.045,
    blockedMs: 3.7,
    healthyKb: 608,
    blockedKb: 1104,
    buffers: 26726,
  },
  {
    jobs: 60000,
    healthyMs: 0.042,
    blockedMs: 5.3,
    healthyKb: 608,
    blockedKb: 1472,
    buffers: 31162,
  },
  {
    jobs: 80000,
    healthyMs: 0.042,
    blockedMs: 6.9,
    healthyKb: 608,
    blockedKb: 1840,
    buffers: 35599,
  },
  {
    jobs: 100000,
    healthyMs: 0.044,
    blockedMs: 8.5,
    healthyKb: 608,
    blockedKb: 2208,
    buffers: 40039,
  },
] as const;

export const notifyMeasurements = [
  {
    clients: 1,
    plainTps: 248,
    notifyTps: 238,
    plainMs: 4.0,
    notifyMs: 4.2,
  },
  {
    clients: 16,
    plainTps: 2253,
    notifyTps: 273,
    plainMs: 7.1,
    notifyMs: 58.5,
  },
  {
    clients: 64,
    plainTps: 8936,
    notifyTps: 278,
    plainMs: 7.2,
    notifyMs: 229.9,
  },
] as const;
