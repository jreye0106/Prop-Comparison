import PlayerLogs from "../models/PlayerLogs.js";
import normalizeLogs from "../utils/normalizeLogs.js";
import statsService from "./statsService.js";
import matchupService from "./matchupService.js";
import trendService from "./trendService.js";
import propsService from "./propsService.js";
import axios from "axios";

/* -------------------------------------------------------
   QUERY PARSER
------------------------------------------------------- */
const STAT_KEYWORDS = {
  points: ["points", "pts", "point"],
  rebounds: ["rebounds", "rebs", "boards", "reb"],
  assists: ["assists", "asts", "dimes", "ast"]
};

const TEAM_ALIASES = {
  warriors: "GSW",
  golden_state: "GSW",
  gsw: "GSW",
  lakers: "LAL",
  lal: "LAL",
  nuggets: "DEN",
  den: "DEN",
  suns: "PHX",
  phx: "PHX",
  clippers: "LAC",
  lac: "LAC",
  kings: "SAC",
  sac: "SAC",
  mavs: "DAL",
  dal: "DAL"
};

function detectStatType(text) {
  const lower = text.toLowerCase();
  for (const [stat, words] of Object.entries(STAT_KEYWORDS)) {
    if (words.some(w => lower.includes(w))) return stat;
  }
  return null;
}

function detectOpponent(text) {
  const lower = text.toLowerCase().replace(/\s+/g, "_");
  for (const [alias, code] of Object.entries(TEAM_ALIASES)) {
    if (lower.includes(alias)) return code;
  }
  return null;
}

function parseQuery(raw) {
  const text = raw.trim();

  const statType = detectStatType(text);
  const opponent = detectOpponent(text);

  let playerName = text;
  const vsIndex = text.toLowerCase().indexOf(" vs ");
  if (vsIndex !== -1) {
    playerName = text.slice(0, vsIndex).trim();
  }

  return { playerName, statType, opponent };
}

/* -------------------------------------------------------
   MATCHUP FILTER
------------------------------------------------------- */
function filterGamesByOpponent(games, opponentCode) {
  if (!opponentCode) return games;

  return games.filter(g => {
    const matchup = g.MATCHUP || g.matchup;
    if (!matchup) return false;

    const clean = matchup
      .replace(/vs\./gi, "vs")
      .replace(/@/g, "@")
      .replace(/[^A-Za-z\s@]/g, "")
      .trim();

    const parts = clean.split(" ");
    const lastTeam = parts[parts.length - 1].toUpperCase();

    return lastTeam === opponentCode.toUpperCase();
  });
}

/* -------------------------------------------------------
   HIT RATE HELPER
------------------------------------------------------- */
function computeHitRate(games, statKey, threshold) {
  if (!games || games.length === 0 || threshold == null) return 0;

  const hits = games.filter(g => (g[statKey] ?? 0) > threshold).length;
  return +(hits / games.length * 100).toFixed(1);
}

/* -------------------------------------------------------
   MAIN PIPELINE
------------------------------------------------------- */
const playerPipelineService = {
  async getPlayerFullProfile(rawQuery) {
    const context = parseQuery(rawQuery);
    const name = context.playerName;

    let logs = await PlayerLogs.findOne({ name: name.toLowerCase() });

    if (!logs) {
      const response = await axios.get(
        `http://localhost:5001/player?name=${name}`
      );

      const normalized = normalizeLogs(response.data);
      logs = await PlayerLogs.create(normalized);
    }

    const allGames = logs.games;
    const matchupGames = filterGamesByOpponent(allGames, context.opponent);

    // Season + matchup stats
    const seasonOverall = statsService.computeSeasonAverages(allGames);
    const seasonMatchup = statsService.computeSeasonAverages(matchupGames);

    // Last10 based on full season
    const last10Overall = statsService.computeLast10(allGames);

    // Splits + trends based on full season
    const splits = matchupService.computeSplits(allGames);
    const trends = trendService.computeTrends(allGames);

    // Projections from season + last10 (overall) — still available if you want later
    const projections = propsService.computeProjections(seasonOverall, last10Overall);

    // Deltas for matchup delta box
    const deltas = propsService.computeDeltas(seasonOverall, seasonMatchup);

    // Recommended prop from season vs matchup delta
    const bestProp = context.opponent
      ? propsService.computeBestProp({
          season: seasonOverall,
          matchup: seasonMatchup
        })
      : null;

    // Hit rate + recent series only if we have a recommended stat
    let hitRate = null;
    let recentSeries = [];

    if (bestProp) {
      const statKey =
        bestProp.stat === "points"
          ? "pts"
          : bestProp.stat === "rebounds"
          ? "reb"
          : "ast";

      const threshold = seasonOverall[bestProp.stat];

      const seasonHitRate = computeHitRate(allGames, statKey, threshold);
      const matchupHitRate = computeHitRate(matchupGames, statKey, threshold);
      const last5HitRate = computeHitRate(allGames.slice(0, 5), statKey, threshold);
      const last10HitRate = computeHitRate(allGames.slice(0, 10), statKey, threshold);

      hitRate = {
        stat: bestProp.stat,
        threshold,
        season: seasonHitRate,
        matchup: matchupHitRate,
        last5: last5HitRate,
        last10: last10HitRate
      };

      // Recent series for bar graph (last 5 games for that stat)
      recentSeries = matchupGames.map(g => ({
        date: g.date,
        value: g[statKey] ?? 0
    }));

    }

    return {
      context,
      player: name,
      team: logs.team,
      season: seasonOverall,
      matchup: seasonMatchup,
      deltas,
      last10: last10Overall,
      splits,
      trends,
      projections,
      bestProp,
      hitRate,
      recentSeries,
      gameLogs: context.opponent ? matchupGames.slice(0, 10) : allGames.slice(0, 82),
      recentGames: allGames.slice(0, 10)
    };
  }
};

export default playerPipelineService;
