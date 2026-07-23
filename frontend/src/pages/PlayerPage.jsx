import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPlayer } from "../api/backend";
import StatsTable from "../components/StatsTable";
import PlayerSilhouette from "../components/PlayerSilhouette";
import { TEAM_COLORS, TEAM_NAME_MAP } from "../data/teamColors";
import { TEAM_LOGOS } from "../data/teamLogos";

export default function PlayerPage() {
  const [params] = useSearchParams();
  const query = params.get("query");

  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await searchPlayer(query);
      setData(result);
    }
    load();
  }, [query]);

  if (!data) return <div>Loading...</div>;

  const rawTeam = data.team?.toUpperCase() || "";
  const normalizedTeam = TEAM_NAME_MAP[rawTeam] || rawTeam;

  const teamColor = TEAM_COLORS[normalizedTeam] || "#333";
  const teamLogo = TEAM_LOGOS[normalizedTeam];

  const season = data.season || {};
  const matchup = data.matchup || {};
  const deltas = data.deltas || {};

  const gameLogs = data.gameLogs || [];
  const recentGames = data.recentGames || [];

  const bestProp = data.bestProp || null;
  const hitRate = data.hitRate || null;
  const recentSeries = data.recentSeries || [];

  return (
    <div style={styles.container}>
      {/* Search */}
      <div style={styles.searchContainer}>
        <input
          style={styles.searchInput}
          placeholder="Search player..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              window.location.href = `/player?query=${encodeURIComponent(
                e.target.value
              )}`;
            }
          }}
        />
      </div>

      {/* Banner */}
      <div style={{ ...styles.banner, background: teamColor }}>
        {teamLogo && (
          <img src={teamLogo} alt={normalizedTeam} style={styles.logo} />
        )}

        <PlayerSilhouette />

        <div style={styles.playerInfo}>
          <h2 style={styles.playerName}>{data.player}</h2>
          <p style={styles.playerMeta}>{normalizedTeam}</p>

          <p style={styles.averages}>
            {season.points.toFixed(1)} PTS / {season.rebounds.toFixed(1)} REB /{" "}
            {season.assists.toFixed(1)} AST
          </p>
        </div>
      </div>

      {/* Row 1 */}
      <div style={styles.row}>
        <div style={styles.col}>
          <div style={styles.propBox}>
            <h3 style={styles.propTitle}>Season Summary</h3>
            <p style={styles.propDetails}>
              {data.player} averages {season.points.toFixed(1)} PTS,{" "}
              {season.rebounds.toFixed(1)} REB, {season.assists.toFixed(1)} AST
              during the regular season.
            </p>
          </div>
        </div>

        {data.context.opponent && (
          <div style={styles.col}>
            <div style={styles.propBox}>
              <h3 style={styles.propTitle}>
                Matchup Summary vs {data.context.opponent}
              </h3>
              <p style={styles.propDetails}>
                {data.player} averages {matchup.points.toFixed(1)} PTS,{" "}
                {matchup.rebounds.toFixed(1)} REB, {matchup.assists.toFixed(1)}{" "}
                AST against {data.context.opponent}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Row 2 */}
      <div style={styles.row}>
        {/* Matchup Delta */}
        <div style={styles.col}>
          <div style={styles.propBox}>
            <h3 style={styles.propTitle}>Matchup Delta</h3>

            {/* Points */}
            <div style={styles.deltaRow}>
              <p style={styles.propDetails}>
                PTS: {season.points.toFixed(1)} → {matchup.points.toFixed(1)}
              </p>
              <span
                style={{
                  ...styles.deltaBadge,
                  ...(deltas.points > 0
                    ? styles.deltaPositive
                    : deltas.points < 0
                    ? styles.deltaNegative
                    : styles.deltaNeutral)
                }}
              >
                {deltas.points > 0 ? "+" : ""}
                {deltas.points.toFixed(1)}
              </span>
            </div>

            {/* Rebounds */}
            <div style={styles.deltaRow}>
              <p style={styles.propDetails}>
                REB: {season.rebounds.toFixed(1)} → {matchup.rebounds.toFixed(1)}
              </p>
              <span
                style={{
                  ...styles.deltaBadge,
                  ...(deltas.rebounds > 0
                    ? styles.deltaPositive
                    : deltas.rebounds < 0
                    ? styles.deltaNegative
                    : styles.deltaNeutral)
                }}
              >
                {deltas.rebounds > 0 ? "+" : ""}
                {deltas.rebounds.toFixed(1)}
              </span>
            </div>

            {/* Assists */}
            <div style={styles.deltaRow}>
              <p style={styles.propDetails}>
                AST: {season.assists.toFixed(1)} → {matchup.assists.toFixed(1)}
              </p>
              <span
                style={{
                  ...styles.deltaBadge,
                  ...(deltas.assists > 0
                    ? styles.deltaPositive
                    : deltas.assists < 0
                    ? styles.deltaNegative
                    : styles.deltaNeutral)
                }}
              >
                {deltas.assists > 0 ? "+" : ""}
                {deltas.assists.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Prop */}
        {bestProp && (
          <div style={styles.col}>
            <div style={styles.propBox}>
              <h3 style={styles.propTitle}>Recommended Prop</h3>
              <p style={styles.propStat}>
                {bestProp.stat.toUpperCase()} — {bestProp.direction}
              </p>
              <p style={styles.propDetails}>
                Season: {bestProp.seasonValue.toFixed(1)} • Matchup:{" "}
                {bestProp.matchupValue.toFixed(1)} • Delta:{" "}
                {bestProp.delta.toFixed(1)}
              </p>
            </div>
          </div>
        )}

        {/* Hit Rate */}
        {hitRate && (
          <div style={styles.col}>
            <div style={styles.propBox}>
              <h3 style={styles.propTitle}>
                Hit Rate ({hitRate.stat.toUpperCase()})
              </h3>
              <p style={styles.propDetails}>
                Season: {hitRate.season}% • Matchup: {hitRate.matchup}%
              </p>
              <p style={styles.propDetails}>
                Last 5: {hitRate.last5}% • Last 10: {hitRate.last10}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      {hitRate && recentSeries.length > 0 && (
        <div style={styles.fullWidthBox}>
          <h3 style={styles.propTitle}>
            Matchup Performance ({hitRate.stat.toUpperCase()})
          </h3>

          <div style={styles.chartContainer}>
            {recentSeries.map((g, i) => {
              const threshold = hitRate.threshold ?? 0;
              const isOver = g.value >= threshold;

              const maxValue = Math.max(...recentSeries.map(r => r.value));
              const widthPercent = (g.value / maxValue) * 100;

              return (
                <div key={i} style={styles.chartRow}>
                  <span style={styles.chartLabel}>{g.date}</span>

                  <div style={styles.chartBarWrapper}>
                    <div
                      style={{
                        ...styles.chartMidline,
                        left: `${(threshold / maxValue) * 100}%`
                      }}
                    />

                    <div
                      style={{
                        ...styles.chartBar,
                        width: `${widthPercent}%`,
                        background: isOver ? "#4caf50" : "#f44336"
                      }}
                    />
                  </div>

                  <span style={styles.chartValue}>{g.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Logs */}
      <h3>{data.context.opponent ? "Matchup Games" : "Season Games"}</h3>
      <StatsTable rows={gameLogs} />

      <h3>Recent Games</h3>
      <StatsTable rows={recentGames} />
    </div>
  );
}

const styles = {
  container: { padding: "2rem" },

  row: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  },

  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  searchContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "1rem"
  },

  searchInput: {
    width: "250px",
    padding: "8px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  banner: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "2rem",
    color: "white",
    gap: "20px"
  },

  logo: { width: "110px", height: "110px", objectFit: "contain" },

  playerInfo: { display: "flex", flexDirection: "column", gap: "5px" },

  playerName: { margin: 0, fontSize: "2rem", fontWeight: "700" },

  playerMeta: { margin: 0, fontSize: "1.2rem", opacity: 0.9 },

  averages: { margin: 0, fontSize: "1.1rem", fontWeight: "600" },

  /* ⭐ CLEAN, CENTERED, UNIFORM BOXES */
  propBox: {
    background: "#fff",
    padding: "1.25rem",
    borderRadius: "12px",
    height: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },

  propTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: 0
  },

  propDetails: {
    fontSize: "1rem",
    opacity: 0.85,
    lineHeight: "1.4",
    margin: 0
  },

  propStat: {
    fontSize: "1.4rem",
    fontWeight: "700",
    margin: 0
  },

  /* ⭐ DELTA BADGES */
  deltaRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  deltaBadge: {
    padding: "4px 10px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "white",
    minWidth: "55px",
    textAlign: "center"
  },

  deltaPositive: {
    background: "#4caf50"
  },

  deltaNegative: {
    background: "#f44336"
  },

  deltaNeutral: {
    background: "#777"
  },

  fullWidthBox: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },

  chartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px"
  },

  chartRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  chartLabel: {
    width: "120px",
    opacity: 0.7
  },

  chartBarWrapper: {
    position: "relative",
    flex: 1,
    height: "22px"
  },

  chartMidline: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "3px",
    background: "#999"
  },

  chartBar: {
    position: "absolute",
    left: 0,
    height: "22px",
    borderRadius: "4px"
  },

  chartValue: {
    width: "40px",
    textAlign: "right",
    opacity: 0.8
  }
};
