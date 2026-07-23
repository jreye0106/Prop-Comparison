/**
 * Stats Service
 * Computes season averages and last10 averages
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

function computeSeasonAverages(games) {
  if (!games || games.length === 0) {
    return {
      games: 0,
      points: 0,
      assists: 0,
      rebounds: 0,
      minutes: 0
    };
  }

  const totals = games.reduce(
    (acc, g) => {
      acc.points += g.pts;
      acc.assists += g.ast;
      acc.rebounds += g.reb;
      acc.minutes += g.min;
      return acc;
    },
    { points: 0, assists: 0, rebounds: 0, minutes: 0 }
  );

  const count = games.length;

  return {
    games: count,
    points: +(totals.points / count).toFixed(1),
    assists: +(totals.assists / count).toFixed(1),
    rebounds: +(totals.rebounds / count).toFixed(1),
    minutes: +(totals.minutes / count).toFixed(1)
  };
}

function computeLast10(games) {
  if (!games || games.length === 0) {
    return {
      games: 0,
      points: 0,
      assists: 0,
      rebounds: 0,
      minutes: 0
    };
  }

  // Assuming logs sorted newest → oldest
  const slice = games.slice(0, 10);

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

  const count = slice.length;

  return {
    games: count,
    points: +(totals.points / count).toFixed(1),
    assists: +(totals.assists / count).toFixed(1),
    rebounds: +(totals.rebounds / count).toFixed(1),
    minutes: +(totals.minutes / count).toFixed(1)
  };
}

const statsService = {
  computeSeasonAverages,
  computeLast10
};

export default statsService;
