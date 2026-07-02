import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def get_auth_headers(client: AsyncClient, email: str, username: str) -> dict:
    await client.post("/api/auth/register", json={
        "email": email,
        "username": username,
        "password": "password123",
        "nome": "OriginalName",
        "sobrenome": "OriginalSurname"
    })
    response = await client.post("/api/auth/login", data={"username": username, "password": "password123"})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


async def test_get_profile_me(client: AsyncClient) -> None:
    headers = await get_auth_headers(client, "profile@example.com", "profileuser")

    response = await client.get("/api/users/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "profile@example.com"
    assert data["nome"] == "OriginalName"


async def test_update_profile_me(client: AsyncClient) -> None:
    headers = await get_auth_headers(client, "update_profile@example.com", "upuser")

    update_payload = {
        "nome": "NewName",
        "sobrenome": "NewSurname",
        "telefone": "(11) 99999-8888",
        "endereco": "Avenue 1",
        "numero": "200A",
        "cidade": "Metropolis",
        "estado": "SP"
    }
    response = await client.put("/api/users/me", json=update_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "NewName"
    assert data["telefone"] == "(11) 99999-8888"
    assert data["cidade"] == "Metropolis"

    # Confirm via GET
    get_response = await client.get("/api/users/me", headers=headers)
    assert get_response.json()["nome"] == "NewName"
    assert get_response.json()["endereco"] == "Avenue 1"
