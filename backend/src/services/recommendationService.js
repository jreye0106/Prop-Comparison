/**
 * Recommendation Service
 * Suggests the best prop based on:
 * - season averages
 * - last10 trends
 * - rolling trends
 * - projections
 *
 * Works with the unified pipeline output.
 */

function getBestPropForContext(context) {
  const {
    season,
    last10,
    trends,
    projections,
    statType
  } = context;

  // If statType is missing, default to points
  const stat = statType || "points";

  // Build a simple scoring system
  const score = {
    season: season[stat] || 0,
    last10: last10[stat] || 0,
    trend5: trends.last5[stat] || 0,
    trend10: trends.last10[stat] || 0,
    projection: projections[stat] || 0
  };

  // Weighted blend
  const finalScore =
    score.season * 0.4 +
    score.last10 * 0.2 +
    score.trend5 * 0.15 +
    score.trend10 * 0.15 +
    score.projection * 0.1;

  return {
    stat,
    recommendedLine: +finalScore.toFixed(1),
    details: score
  };
}

const recommendationService = {
  getBestPropForContext
};

export default recommendationService;
