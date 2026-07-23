import mongoose from "mongoose";

const GameLogSchema = new mongoose.Schema({
  playerId: Number,
  gameDate: String,
  matchup: String,
  pts: Number,
  reb: Number,
  ast: Number,
  raw: Object
});

export default mongoose.model("GameLog", GameLogSchema);
