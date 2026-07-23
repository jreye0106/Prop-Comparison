/**
 * Compute matchup splits (home vs away)
 * Assumes normalized game logs:
 * {
 *   date,
 *   matchup,
 *   pts,
 *   ast,
 *   reb,
 *   min
 * }
 */

function computeSplits(games) {
  if (!games || games.length === 0) {
    return {
      home: { games: 0, points: 0, assists: 0, rebounds: 0 },
      away: { games: 0, points: 0, assists: 0, rebounds: 0 }
    };
  }

  const homeGames = games.filter(g => g.matchup && g.matchup.includes("vs"));
  const awayGames = games.filter(g => g.matchup && g.matchup.includes("@"));


  const avg = (arr, stat) =>
    arr.length === 0
      ? 0
      : +(arr.reduce((sum, g) => sum + g[stat], 0) / arr.length).toFixed(1);

  return {
    home: {
      games: homeGames.length,
      points: avg(homeGames, "pts"),
      assists: avg(homeGames, "ast"),
      rebounds: avg(homeGames, "reb")
    },
    away: {
      games: awayGames.length,
      points: avg(awayGames, "pts"),
      assists: avg(awayGames, "ast"),
      rebounds: avg(awayGames, "reb")
    }
  };
}

const matchupService = {
  computeSplits
};

export default matchupService;
