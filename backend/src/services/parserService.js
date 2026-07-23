// src/services/parserService.js

export function parseQuery(query) {
  const lower = query.toLowerCase().trim();

  let playerName = lower;
  let opponent = null;

  // Normalize separators
  const normalized = lower
    .replace(" vs. ", " vs ")
    .replace(" vs ", " vs ")
    .replace(" against ", " vs ")
    .replace(" @ ", " vs ");

  // Split at "vs"
  if (normalized.includes(" vs ")) {
    const [playerPart, oppPart] = normalized.split(" vs ");
    playerName = playerPart.trim();
    opponent = oppPart.trim();
  }

  // Extract stat type
  const statKeywords = [
    "points",
    "pts",
    "rebounds",
    "rebs",
    "assists",
    "asts",
    "blocks",
    "steals",
    "pra"
  ];

  let statType = null;
  for (const keyword of statKeywords) {
    if (normalized.includes(keyword)) {
      if (["points", "pts"].includes(keyword)) statType = "points";
      else if (["rebounds", "rebs"].includes(keyword)) statType = "rebounds";
      else if (["assists", "asts"].includes(keyword)) statType = "assists";
      else statType = keyword;
      break;
    }
  }

  return {
    playerName,
    statType,
    opponent,
    homeAway: null,
    league: "nba"
  };
}
