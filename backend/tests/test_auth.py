import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_register_user(client: AsyncClient) -> None:
    payload = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "strongpassword123",
        "nome": "Test",
        "sobrenome": "User",
        "telefone": "123456789",
        "endereco": "Main St",
        "numero": "100",
        "cidade": "Testville",
        "estado": "TS"
    }
    response = await client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert "id" in data
    assert "password" not in data


async def test_register_user_duplicate_email(client: AsyncClient) -> None:
    payload = {
        "email": "dup@example.com",
        "username": "user1",
        "password": "password",
        "nome": "User",
        "sobrenome": "One"
    }
    # Register first time
    response = await client.post("/api/auth/register", json=payload)
    assert response.status_code == 201

    # Register again with same email, different username
    payload["username"] = "user2"
    response = await client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "email already exists" in response.json()["detail"]


async def test_login_user(client: AsyncClient) -> None:
    # Register a user first
    payload = {
        "email": "login@example.com",
        "username": "loginuser",
        "password": "secretpassword",
        "nome": "Login",
        "sobrenome": "User"
    }
    await client.post("/api/auth/register", json=payload)

    # Login
    login_data = {
        "username": "loginuser",
        "password": "secretpassword"
    }
    response = await client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


async def test_login_user_invalid_credentials(client: AsyncClient) -> None:
    login_data = {
        "username": "nonexistent",
        "password": "wrongpassword"
    }
    response = await client.post("/api/auth/login", data=login_data)
    assert response.status_code == 400
    assert "Incorrect email/username" in response.json()["detail"]
