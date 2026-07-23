// parseQuery.js
const STAT_KEYWORDS = {
  points: ["points", "pts", "point"],
  rebounds: ["rebounds", "rebs", "boards", "reb"],
  assists: ["assists", "asts", "dimes", "ast"]
};

const TEAM_ALIASES = {
  warriors: "GSW",
  golden_state: "GSW",
  gs: "GSW",
  gsw: "GSW",
  lakers: "LAL",
  la_lakers: "LAL",
  lal: "LAL",
  // add more as needed
};

function detectStatType(text) {
  const lower = text.toLowerCase();
  for (const [stat, words] of Object.entries(STAT_KEYWORDS)) {
    if (words.some(w => lower.includes(w))) return stat; // "points" | "rebounds" | "assists"
  }
  return null;
}

function detectOpponent(text) {
  const lower = text.toLowerCase().replace(/\s+/g, "_");
  for (const [alias, code] of Object.entries(TEAM_ALIASES)) {
    if (lower.includes(alias)) return code; // e.g. "GSW"
  }
  return null;
}

export function parseQuery(raw) {
  const text = raw.trim();

  const statType = detectStatType(text);      // points / rebounds / assists / null
  const opponent = detectOpponent(text);      // "GSW" / "LAL" / null

  // crude player extraction: everything before "vs" or before team keyword
  let playerName = text;
  const vsIndex = text.toLowerCase().indexOf(" vs ");
  if (vsIndex !== -1) {
    playerName = text.slice(0, vsIndex).trim();
  }

  return {
    playerName,   // "lebron james"
    statType,     // "points" | "rebounds" | "assists" | null
    opponent,     // "GSW" | null
  };
}
