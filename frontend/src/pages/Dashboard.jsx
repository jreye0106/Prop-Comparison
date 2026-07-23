import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/player?query=${encodeURIComponent(query)}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Props Analyzer</h1>

        <input
          style={styles.input}
          placeholder="Search player..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button style={styles.button} onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f2f5",
  },

  card: {
    background: "white",
    padding: "3rem 4rem",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  title: {
    fontSize: "3rem",
    marginBottom: "2rem",
    fontWeight: "700",
    color: "#222",
  },

  input: {
    width: "350px",
    padding: "14px",
    fontSize: "1.2rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "1.5rem",
    outline: "none",
  },

  button: {
    padding: "14px 28px",
    fontSize: "1.2rem",
    borderRadius: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },
};
