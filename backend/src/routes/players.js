import { Router } from "express";
import { getPlayerRecentGames } from "../services/statsService.js";


const router = Router();

router.get("/:id/overview", async (req, res) => {
  try {
    const { id } = req.params;
    const { league } = req.query;
    const overview = await getPlayerOverview(id, league);
    res.json(overview);
  } catch (err) {
    res.status(500).json({ error: "Failed to load player overview" });
  }
});

router.get("/:id/recent-games", async (req, res) => {
  try {
    const { id } = req.params;
    const { league } = req.query;
    const games = await getPlayerRecentGames(id, league);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: "Failed to load recent games" });
  }
});

export default router;
