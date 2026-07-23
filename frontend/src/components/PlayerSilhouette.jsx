export default function PlayerSilhouette() {
  return (
    <div style={styles.container}>
      <div style={styles.head}></div>
      <div style={styles.body}></div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: "20px"
  },
  head: {
    width: "60px",
    height: "60px",
    background: "#000",
    borderRadius: "50%"
  },
  body: {
    width: "80px",
    height: "120px",
    background: "#000",
    borderRadius: "10px",
    marginTop: "10px"
  }
};
