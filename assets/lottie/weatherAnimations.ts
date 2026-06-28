// Production-grade optimized pure vector layers (Safe for iOS/Android native bridges)
export const sunGlowJSON = {
  v: "4.8.0", fr: 60, ip: 0, op: 120, w: 200, h: 200, nm: "Sun", ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0, ind: 1, ty: 4, nm: "Core", sr: 1, st: 0, op: 120, ip: 0,
      ks: {
        o: { a: 0, k: 100, ix: 1 },
        p: { a: 0, k: [100, 100, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 3 },
        s: {
          a: 1, ix: 4,
          k: [
            { t: 0, s: [90, 90, 100], e: [105, 105, 100] },
            { t: 60, s: [105, 105, 100], e: [90, 90, 100] },
            { t: 120 }
          ]
        },
        r: { a: 0, k: 0, ix: 6 }
      },
      shapes: [{
        ty: "gr", nm: "Group",
        it: [
          { ty: "el", p: { a: 0, k: [0, 0], ix: 2 }, s: { a: 0, k: [90, 90], ix: 3 }, nm: "Ellipse", hd: false },
          { ty: "fl", c: { a: 0, k: [1, 0.72, 0.05, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, nm: "Fill", hd: false },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, nm: "Transform" }
        ]
      }]
    },
    {
      ddd: 0, ind: 2, ty: 4, nm: "Halo", sr: 1, st: 0, op: 120, ip: 0,
      ks: {
        o: { a: 0, k: 30, ix: 1 },
        p: { a: 0, k: [100, 100, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 3 },
        s: {
          a: 1, ix: 4,
          k: [
            { t: 0, s: [120, 120, 100], e: [150, 150, 100] },
            { t: 60, s: [150, 150, 100], e: [120, 120, 100] },
            { t: 120 }
          ]
        },
        r: { a: 0, k: 0, ix: 6 }
      },
      shapes: [{
        ty: "gr", nm: "Group",
        it: [
          { ty: "el", p: { a: 0, k: [0, 0], ix: 2 }, s: { a: 0, k: [150, 150], ix: 3 }, nm: "Ellipse", hd: false },
          { ty: "fl", c: { a: 0, k: [1, 0.6, 0, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, nm: "Fill", hd: false },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, nm: "Transform" }
        ]
      }]
    }
  ]
};

export const moonGlowJSON = {
  v: "4.8.0", fr: 60, ip: 0, op: 120, w: 200, h: 200, nm: "Moon", ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0, ind: 1, ty: 4, nm: "Core", sr: 1, st: 0, op: 120, ip: 0,
      ks: {
        o: { a: 0, k: 95, ix: 1 },
        p: { a: 0, k: [100, 100, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 3 },
        s: {
          a: 1, ix: 4,
          k: [
            { t: 0, s: [95, 95, 100], e: [102, 102, 100] },
            { t: 60, s: [102, 102, 100], e: [95, 95, 100] },
            { t: 120 }
          ]
        },
        r: { a: 0, k: 0, ix: 6 }
      },
      shapes: [{
        ty: "gr", nm: "Group",
        it: [
          { ty: "el", p: { a: 0, k: [0, 0], ix: 2 }, s: { a: 0, k: [85, 85], ix: 3 }, nm: "Ellipse", hd: false },
          { ty: "fl", c: { a: 0, k: [0.92, 0.95, 0.98, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, nm: "Fill", hd: false },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, nm: "Transform" }
        ]
      }]
    }
  ]
};

export const rainAnimationJSON = {
  v: "4.8.0", fr: 60, ip: 0, op: 40, w: 300, h: 500, nm: "Rain", ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0, ind: 1, ty: 4, nm: "R1", sr: 1, st: 0, op: 40, ip: 0,
      ks: {
        o: { a: 0, k: 35, ix: 1 },
        p: { a: 1, k: [{ t: 0, s: [70, -40, 0], e: [50, 560, 0] }, { t: 40 }], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 3 },
        s: { a: 0, k: [100, 100, 100], ix: 4 },
        r: { a: 0, k: 0, ix: 6 }
      },
      shapes: [{
        ty: "gr", nm: "Group",
        it: [
          { ty: "el", p: { a: 0, k: [0, 0], ix: 2 }, s: { a: 0, k: [2, 40], ix: 3 }, nm: "Ellipse", hd: false },
          { ty: "fl", c: { a: 0, k: [0.3, 0.75, 0.95, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, nm: "Fill", hd: false },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, nm: "Transform" }
        ]
      }]
    }
  ]
};

export const ambientCloudsJSON = {
  v: "4.8.0", fr: 60, ip: 0, op: 200, w: 300, h: 200, nm: "Clouds", ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0, ind: 1, ty: 4, nm: "C1", sr: 1, st: 0, op: 200, ip: 0,
      ks: {
        o: { a: 0, k: 25, ix: 1 },
        p: { a: 1, k: [{ t: 0, s: [-120, 70, 0], e: [420, 70, 0] }, { t: 200 }], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 3 },
        s: { a: 0, k: [100, 100, 100], ix: 4 },
        r: { a: 0, k: 0, ix: 6 }
      },
      shapes: [{
        ty: "gr", nm: "Group",
        it: [
          { ty: "el", p: { a: 0, k: [0, 0], ix: 2 }, s: { a: 0, k: [190, 80], ix: 3 }, nm: "Ellipse", hd: false },
          { ty: "fl", c: { a: 0, k: [1, 1, 1, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, nm: "Fill", hd: false },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, nm: "Transform" }
        ]
      }]
    }
  ]
};