from flask import Flask, request, jsonify
from nba_api.stats.endpoints import PlayerGameLog, PlayerProfileV2
from nba_api.stats.static import players
from nba_api.stats.static import teams

app = Flask(__name__)

# ---------------------------------------------------
# Helper: Find player ID by name
# ---------------------------------------------------
def find_player_by_name(name):
    lower = name.lower()
    for p in players.get_players():
        if p["full_name"].lower() == lower:
            return p
    return None

# ---------------------------------------------------
# Helper: Convert TEAM_ID → abbreviation (current team)
# ---------------------------------------------------
def get_team_abbrev_from_id(team_id):
    for t in teams.get_teams():
        if t["id"] == team_id:
            return t["abbreviation"]
    return None

# ---------------------------------------------------
# /player → unified endpoint for your backend
# ---------------------------------------------------
@app.route("/player", methods=["GET"])
def player():
    name = request.args.get("name")
    if not name:
        return jsonify({"error": "Missing player name"}), 400

    # 1. Lookup player ID
    player_info = find_player_by_name(name)
    if not player_info:
        return jsonify({"error": f"Player not found: {name}"}), 404

    player_id = player_info["id"]

    # ⭐ NEW: Fetch CURRENT team using TEAM_ID
    try:
        profile = PlayerProfileV2(player_id=player_id).get_data_frames()[0]
        team_id = profile["TEAM_ID"].iloc[0]
        team_abbrev = get_team_abbrev_from_id(team_id)
        print("TEAM DEBUG:", team_id, team_abbrev)
    except Exception as e:
        print("TEAM ERROR:", e)
        team_abbrev = None

    # 2. Fetch full season logs
    logs = None
    for season in ["2023-24", "2022-23", "2021-22"]:
        try:
            df = PlayerGameLog(player_id=player_id, season=season).get_data_frames()[0]
            if len(df) > 1:
                logs = df
                break
        except Exception as e:
            print("LOG ERROR:", e)
        print("LOG ERROR:", e)


    # 3. Return unified structure
    return jsonify({
        "player": {
            "id": player_id,
            "name": player_info["full_name"]
        },
        "team": team_abbrev,   # ⭐ CURRENT TEAM FIXED
        "logs": logs.to_dict(orient="records")
    })

if __name__ == "__main__":
    app.run(port=5001)
