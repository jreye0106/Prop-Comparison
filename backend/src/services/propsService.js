/**
 * Prop Projection Engine
 * Base projections from season + last10.
 */

function computeProjections(season, last10) {
  if (!season || !last10) {
    return {
      points: 0,
      assists: 0,
      rebounds: 0
    };
  }

  // Weighted blend:
  // Season = 90%
  // Last10 = 10%
  const blend = (s, l) => +(s * 0.9 + l * 0.1).toFixed(1);

  return {
    points: blend(season.points, last10.points),
    assists: blend(season.assists, last10.assists),
    rebounds: blend(season.rebounds, last10.rebounds)
  };
}

/**
 * Compute deltas between season and matchup averages.
 */
function computeDeltas(season, matchup) {
  if (!season || !matchup) {
    return {
      points: 0,
      rebounds: 0,
      assists: 0
    };
  }

  return {
    points: +(matchup.points - season.points).toFixed(1),
    rebounds: +(matchup.rebounds - season.rebounds).toFixed(1),
    assists: +(matchup.assists - season.assists).toFixed(1)
  };
}

/**
 * Decide best stat based on largest absolute delta.
 */
function pickBestStatByDelta(deltas) {
  const entries = Object.entries(deltas); // [ ['points', delta], ... ]
  entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  return entries[0][0]; // stat key with largest absolute delta
}

/**
 * Compute recommended prop using season vs matchup delta.
 * - If delta > 0 → OVER
 * - If delta < 0 → UNDER
 */
function computeBestProp({ season, matchup }) {
  const deltas = computeDeltas(season, matchup);

  const bestStat = pickBestStatByDelta(deltas);
  const delta = deltas[bestStat];

  const direction = delta > 0 ? "OVER" : "UNDER";

  return {
    stat: bestStat,
    direction,
    delta,
    seasonValue: season[bestStat],
    matchupValue: matchup[bestStat]
  };
}

const propsService = {
  computeProjections,
  computeDeltas,
  computeBestProp
};

export default propsService;
