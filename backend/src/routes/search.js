import { Router } from "express";
import { parseQuery } from "../services/parserService.js";

import playerPipelineService from "../services/playerPipelineService.js";
import recommendationService from "../services/recommendationService.js";


const router = Router();

/**
 * Unified Search Route
 * This replaces the old multi-step logic with the new pipeline.
 */
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Query is required" });
    }

    // Parse natural language query
    const parsed = parseQuery(query);
    console.log("Parsed query:", parsed);

    // -------------------------
    // FULL PLAYER PIPELINE
    // -------------------------
    const profile = await playerPipelineService.getPlayerFullProfile(query);


    // -------------------------
    // BEST PROP RECOMMENDATION
    // -------------------------
    let bestProp = null;
    try {
      bestProp = recommendationService.getBestPropForContext({
        season: profile.season,
        last10: profile.last10,
        trends: profile.trends,
        projections: profile.projections,
        statType: parsed.statType
    });

    } catch (err) {
      console.log("Best prop failed:", err.message);
    }

    // -------------------------
    // FINAL RESPONSE
    // -------------------------
    return res.json(profile);

  } catch (err) {
    console.log("Search route crashed:", err);
    return res.status(500).json({ error: "Search failed" });
  }
});

export default router;
