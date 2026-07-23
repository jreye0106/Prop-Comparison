import { Router } from "express";
import { getTodayMatchups } from "../services/matchupService.js";

const router = Router();

router.get("/today", async (req, res) => {
  try {
    const { league } = req.query; // optional: filter by league
    const matchups = await getTodayMatchups(league);
    res.json(matchups);
  } catch (err) {
    res.status(500).json({ error: "Failed to load matchups" });
  }
});

export default router;
