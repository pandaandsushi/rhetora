const DEFAULT_FILLER_WORDS = [
  "like",
  "so",
  "right",
  "actually",
  "basically",
  "literally",
  "you know",
  "i mean",
];

const normalizeWord = (word) => word.toLowerCase().replace(/[^a-z\s]/g, "").trim();

const buildSpeechMetrics = (words, durationSeconds, fillerWords = DEFAULT_FILLER_WORDS) => {
  const totalWords = words.length;
  const wordRatePerMinute = durationSeconds > 0
    ? Math.round((totalWords / durationSeconds) * 60)
    : 0;

  const fillerWordCounts = new Map();
  const fillerSet = new Set(fillerWords.map((word) => word.toLowerCase()));

  for (const word of words) {
    const raw = word?.word ?? word?.punctuated_word ?? "";
    const normalized = normalizeWord(raw);

    if (normalized && fillerSet.has(normalized)) {
      fillerWordCounts.set(
        normalized,
        (fillerWordCounts.get(normalized) || 0) + 1,
      );
    }
  }

  const fillerList = Array.from(fillerWordCounts.entries()).map(([word, count]) => ({
    word,
    count,
  }));
  const totalFillerWords = fillerList.reduce((sum, item) => sum + item.count, 0);

  return {
    durationSeconds,
    totalWords,
    wordRatePerMinute,
    totalFillerWords,
    fillerWords: fillerList,
  };
};

export { DEFAULT_FILLER_WORDS, buildSpeechMetrics };
