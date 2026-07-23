import { Router } from "express";
import { getBestPropForContext } from "../services/recommendationService.js";

const router = Router();

router.get("/recommendation", async (req, res) => {
  try {
    const { playerId, league, opponent, homeAway, statType } = req.query;

    const bestProp = await getBestPropForContext({
      playerId,
      league,
      opponent,
      homeAway,
      statType
    });

    res.json(bestProp);
  } catch (err) {
    res.status(500).json({ error: "Failed to compute recommendation" });
  }
});

export default router;
