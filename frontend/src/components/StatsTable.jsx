// StatsTable.jsx
export default function StatsTable({ rows }) {
  if (!rows || rows.length === 0) return <p>No data available.</p>;

  // ⭐ Only show the columns we want
  const HEADERS = [
    "date",
    "matchup",
    "min",
    "pts",
    "reb",
    "ast",
    
  ];

  // ⭐ Rename headers for UI
  const RENAME = {
    date: "Date",
    matchup: "Matchup",
    min: "MIN",
    pts: "PTS",
    reb: "REB",
    ast: "AST",
    
  };

  const formatHeader = (h) => RENAME[h] || h;

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "-";

    if (key === "min") return Math.round(value);
    return value;
  };

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {HEADERS.map((h) => (
            <th key={h} style={styles.th}>{formatHeader(h)}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {HEADERS.map((h) => (
              <td key={h} style={styles.td}>
                {formatValue(h, row[h])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "2rem",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden"
  },
  th: {
    borderBottom: "2px solid #ddd",
    padding: "10px",
    textAlign: "left",
    background: "#f7f7f7",
    fontWeight: "600",
    fontSize: "0.9rem"
  },
  td: {
    padding: "8px",
    borderBottom: "1px solid #eee",
    fontSize: "0.9rem"
  }
};
