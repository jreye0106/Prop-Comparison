import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  playerId: {
    type: Number,
    required: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },

  team: {
    type: String,
    default: null
  },

  position: {
    type: String,
    default: null
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Player", PlayerSchema);
