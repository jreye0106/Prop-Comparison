import mongoose from "mongoose";

const ComputedStatsSchema = new mongoose.Schema({
  playerId: Number,
  season: String,
  seasonAvg: Object,
  last10Avg: Object,
  last20Avg: Object,
  homeAvg: Object,
  awayAvg: Object,
  matchupAvg: Object
});

export default mongoose.model("ComputedStats", ComputedStatsSchema);
