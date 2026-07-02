import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def get_auth_headers(client: AsyncClient, email: str, username: str) -> dict:
    await client.post("/api/auth/register", json={
        "email": email,
        "username": username,
        "password": "password123",
        "nome": "Name",
        "sobrenome": "Surname"
    })
    response = await client.post("/api/auth/login", data={"username": username, "password": "password123"})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


async def test_create_match_and_verify_game_stats(client: AsyncClient) -> None:
    headers = await get_auth_headers(client, "player@example.com", "player1")

    # Create Game
    game_response = await client.post(
        "/api/games/",
        json={"title": "Catan", "min_players": 3, "max_players": 4},
        headers=headers
    )
    game_id = game_response.json()["id"]

    # Verify game starts with 0 times_played
    games_list_response = await client.get("/api/games/", headers=headers)
    assert games_list_response.json()[0]["times_played"] == 0

    # Create Match
    match_payload = {
        "game_id": game_id,
        "duration_minutes": 90,
        "players_count": 4,
        "winner_name": "Fábio",
        "notes": "Draft inicial de estradas"
    }
    match_response = await client.post("/api/matches/", json=match_payload, headers=headers)
    assert match_response.status_code == 201
    match_data = match_response.json()
    assert match_data["winner_name"] == "Fábio"
    assert match_data["game_title"] == "Catan"

    # Verify game now has 1 times_played!
    games_list_response2 = await client.get("/api/games/", headers=headers)
    assert games_list_response2.json()[0]["times_played"] == 1


async def test_list_and_filter_matches(client: AsyncClient) -> None:
    headers = await get_auth_headers(client, "filter@example.com", "filteruser")

    # Create Game A & B
    game_a = (await client.post("/api/games/", json={"title": "Game A"}, headers=headers)).json()
    game_b = (await client.post("/api/games/", json={"title": "Game B"}, headers=headers)).json()

    # Log Matches
    await client.post(
        "/api/matches/",
        json={"game_id": game_a["id"], "duration_minutes": 30, "players_count": 2, "winner_name": "Ana"},
        headers=headers
    )
    await client.post(
        "/api/matches/",
        json={"game_id": game_b["id"], "duration_minutes": 60, "players_count": 3, "winner_name": "Carlos"},
        headers=headers
    )

    # List all matches
    all_matches = (await client.get("/api/matches/", headers=headers)).json()
    assert len(all_matches) == 2

    # Filter by Game A
    filtered_matches = (await client.get(f"/api/matches/?game_ids={game_a['id']}", headers=headers)).json()
    assert len(filtered_matches) == 1
    assert filtered_matches[0]["game_title"] == "Game A"
    assert filtered_matches[0]["winner_name"] == "Ana"


async def test_delete_match(client: AsyncClient) -> None:
    headers = await get_auth_headers(client, "delete@example.com", "deleteuser")
    game = (await client.post("/api/games/", json={"title": "Solo Game"}, headers=headers)).json()

    match_rec = (await client.post(
        "/api/matches/",
        json={"game_id": game["id"], "duration_minutes": 15, "players_count": 1, "winner_name": "Myself"},
        headers=headers
    )).json()

    # Delete
    del_response = await client.delete(f"/api/matches/{match_rec['id']}", headers=headers)
    assert del_response.status_code == 200

    # Verify empty list
    all_matches = (await client.get("/api/matches/", headers=headers)).json()
    assert len(all_matches) == 0
