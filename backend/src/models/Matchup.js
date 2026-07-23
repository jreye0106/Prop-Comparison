import mongoose from "mongoose";

const MatchupSchema = new mongoose.Schema({
  playerId: Number,
  opponent: String,
  games: Array,
  averages: Object
});

export default mongoose.model("Matchup", MatchupSchema);
