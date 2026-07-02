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


async def test_create_and_list_games(client: AsyncClient) -> None:
    headers = await get_auth_headers(client, "gamer@example.com", "gamer")

    # Create Game 1
    response = await client.post(
        "/api/games/",
        json={"title": "Catan", "min_players": 3, "max_players": 4, "description": "Settlers of Catan"},
        headers=headers
    )
    assert response.status_code == 201
    game1 = response.json()
    assert game1["title"] == "Catan"
    assert game1["times_played"] == 0

    # Create Game 2
    await client.post(
        "/api/games/",
        json={"title": "Carcassonne", "min_players": 2, "max_players": 5},
        headers=headers
    )

    # List Games
    list_response = await client.get("/api/games/", headers=headers)
    assert list_response.status_code == 200
    games = list_response.json()
    assert len(games) == 2
    # Default sort is name-asc, so Carcassonne first, then Catan
    assert games[0]["title"] == "Carcassonne"
    assert games[1]["title"] == "Catan"


async def test_search_and_sort_games(client: AsyncClient) -> None:
    headers = await get_auth_headers(client, "sort@example.com", "sortuser")

    await client.post("/api/games/", json={"title": "Pandemic"}, headers=headers)
    await client.post("/api/games/", json={"title": "7 Wonders"}, headers=headers)

    # Search Pandemic
    response = await client.get("/api/games/?search=pan", headers=headers)
    assert response.status_code == 200
    games = response.json()
    assert len(games) == 1
    assert games[0]["title"] == "Pandemic"

    # Sort descending
    response = await client.get("/api/games/?sort_by=name-desc", headers=headers)
    assert response.status_code == 200
    games = response.json()
    assert games[0]["title"] == "Pandemic"
    assert games[1]["title"] == "7 Wonders"


async def test_update_and_delete_game(client: AsyncClient) -> None:
    headers = await get_auth_headers(client, "edit@example.com", "edituser")

    # Create
    create_response = await client.post("/api/games/", json={"title": "Ticket to Ride"}, headers=headers)
    game_id = create_response.json()["id"]

    # Update
    update_response = await client.put(
        f"/api/games/{game_id}",
        json={"title": "Ticket to Ride Europe", "max_players": 5},
        headers=headers
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Ticket to Ride Europe"
    assert update_response.json()["max_players"] == 5

    # Delete
    delete_response = await client.delete(f"/api/games/{game_id}", headers=headers)
    assert delete_response.status_code == 200
    assert delete_response.json() == {"success": True}

    # Verify deleted
    list_response = await client.get("/api/games/", headers=headers)
    assert len(list_response.json()) == 0
