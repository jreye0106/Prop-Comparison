/**
 * Trend Service
 * Computes rolling averages for:
 * - last 5 games
 * - last 10 games
 * - last 20 games
 *
 * Works with normalized logs:
 * {
 *   date,
 *   matchup,
 *   pts,
 *   ast,
 *   reb,
 *   min
 * }
 */

function computeRolling(games, count) {
  if (!games || games.length === 0) {
    return {
      games: 0,
      points: 0,
      assists: 0,
      rebounds: 0,
      minutes: 0
    };
  }

  const slice = games.slice(0, count);

  const totals = slice.reduce(
    (acc, g) => {
      acc.points += g.pts;
      acc.assists += g.ast;
      acc.rebounds += g.reb;
      acc.minutes += g.min;
      return acc;
    },
    { points: 0, assists: 0, rebounds: 0, minutes: 0 }
  );

  const length = slice.length;

  return {
    games: length,
    points: +(totals.points / length).toFixed(1),
    assists: +(totals.assists / length).toFixed(1),
    rebounds: +(totals.rebounds / length).toFixed(1),
    minutes: +(totals.minutes / length).toFixed(1)
  };
}

function computeTrends(games) {
  return {
    last5: computeRolling(games, 5),
    last10: computeRolling(games, 10),
    last20: computeRolling(games, 20)
  };
}

const trendService = {
  computeTrends
};

export default trendService;
