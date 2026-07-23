import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  date: String,
  matchup: String,
  pts: Number,
  ast: Number,
  reb: Number,
  min: Number
});

const PlayerLogsSchema = new mongoose.Schema({
  name: String,
  team: String,
  playerId: Number,
  games: [GameSchema]
});

export default mongoose.model("PlayerLogs", PlayerLogsSchema);
