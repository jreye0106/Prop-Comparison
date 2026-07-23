from nba_api.stats.static import players
import json

all_players = players.get_players()

with open("players.json", "w") as f:
    json.dump(all_players, f, indent=2)

print("players.json generated!")
