import { teamMap } from "./teamMap.js";

export default function normalizeLogs(raw) {
  const logs = raw.logs || [];

  // ⭐ Extract team from the first game log
  let detectedTeam = null;

  if (logs.length > 0) {
    const first = logs[0];

    detectedTeam =
      first.TEAM_ABBREVIATION ||
      first.team_abbreviation ||
      (first.MATCHUP ? first.MATCHUP.split(" ")[0] : null);
  }

  return {
    playerId: raw.player.id,
    name: raw.player.name.toLowerCase(),

    // ⭐ Use detected team instead of raw.team
    team: detectedTeam || null,

    games: logs.map(data => ({
      date: data.GAME_DATE || data.game_date || "",
      matchup: data.MATCHUP || data.matchup || "",
      pts: Number(data.PTS ?? data.pts ?? 0),
      ast: Number(data.AST ?? data.ast ?? 0),
      reb: Number(data.REB ?? data.reb ?? 0),
      min: Number(data.MIN ?? data.min ?? 0),

      // ⭐ Include shooting stats if available
      FGA: Number(data.FGA ?? 0),
      FGM: Number(data.FGM ?? 0),
      FG3A: Number(data.FG3A ?? 0),
      FG3M: Number(data.FG3M ?? 0)
    }))
  };
}

