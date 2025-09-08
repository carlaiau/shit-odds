export const getMatchTimeInfo = (commence_time: string | number) => {
  // Ensure we get a Date regardless of whether it's ISO or unix
  const matchDate =
    typeof commence_time === "number"
      ? new Date(commence_time * 1000) // unix seconds → ms
      : new Date(commence_time);

  const now = new Date();
  const diffMs = matchDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relative: string;
  let hasStarted = diffMs <= 0;

  if (hasStarted) {
    relative = "Already started";
  } else if (diffDays >= 1) {
    relative = `${diffDays} day${diffDays > 1 ? "s" : ""} away`;
  } else if (diffHours >= 1) {
    relative = `${diffHours} hour${diffHours > 1 ? "s" : ""} away`;
  } else {
    relative = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} away`;
  }

  return {
    startDate: matchDate.toLocaleString(), // nice readable format
    hasStarted,
    relative,
  };
};

export const devigPowerMethod = (odds: number[], k: number): number[] => {
  // Step 1: Convert decimal odds to implied probabilities
  const implied = odds.map((o) => 1 / o);

  // Step 2: Apply power transform
  const powered = implied.map((p) => Math.pow(p, k));
  const total = powered.reduce((a, b) => a + b, 0);

  // Step 3: Normalize to get fair probs
  return powered.map((p) => p / total);
};
