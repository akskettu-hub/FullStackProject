const CORPUS_NAMES = ["CEEC", "CEECSU", "CEECE"] as const;
export type CorpusName = (typeof CORPUS_NAMES)[number];
