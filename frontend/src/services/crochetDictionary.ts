export type CrochetTerm = {
  translation: string;
  producedStitches: number;
  consumedStitches: number;
};

export const crochetDictionary: Record<string, CrochetTerm> = {
  sc: {
    translation: "single crochet",
    producedStitches: 1,
    consumedStitches: 1,
  },

  inc: {
    translation: "increase",
    producedStitches: 2,
    consumedStitches: 1,
  },

  dec: {
    translation: "decrease",
    producedStitches: 1,
    consumedStitches: 2,
  },

  ch: {
    translation: "chain",
    producedStitches: 1,
    consumedStitches: 1,
  },

  "sl st": {
    translation: "slip stitch",
    producedStitches: 1,
    consumedStitches: 1,
  },
};
