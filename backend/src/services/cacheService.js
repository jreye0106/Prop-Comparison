import GameLog from "../models/GameLog.js";
import Matchup from "../models/Matchup.js";

export async function cacheSeasonLogs(playerId, logs) {
  await GameLog.deleteMany({ playerId });

  const formatted = logs.map(g => ({
    playerId,
    gameDate: g.GAME_DATE,
    matchup: g.MATCHUP,
    pts: Number(g.PTS),
    reb: Number(g.REB),
    ast: Number(g.AST),
    raw: g
  }));

  await GameLog.insertMany(formatted);
}

export async function cacheMatchup(playerId, opponent, games) {
  const averages = computeAverages(games);

  await Matchup.findOneAndUpdate(
    { playerId, opponent },
    { games, averages },
    { upsert: true }
  );
}

function computeAverages(games) {
  if (!games || games.length === 0) return { pts: 0, reb: 0, ast: 0 };

  let pts = 0, reb = 0, ast = 0;

  for (const g of games) {
    pts += Number(g.PTS) || 0;
    reb += Number(g.REB) || 0;
    ast += Number(g.AST) || 0;
  }

  const count = games.length;

  return {
    pts: pts / count,
    reb: reb / count,
    ast: ast / count
  };
}
