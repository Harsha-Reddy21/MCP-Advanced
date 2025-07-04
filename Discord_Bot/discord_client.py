"""
Discord API Client

A simple, focused wrapper around the Discord REST API for MCP integration.
Handles authentication and provides typed responses for common Discord operations.
"""

import os
import httpx
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class DiscordClient:
    def __init__(self, bot_token: str, base_url: str = "https://discord.com/api/v10"):
        self.bot_token = bot_token
        self.base_url = base_url
        self.client = httpx.AsyncClient(
            headers={
                "Authorization": f"Bot {bot_token}",
                "Content-Type": "application/json"
            }
        )

    async def close(self):
        await self.client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

    async def _get(self, endpoint: str, params: Optional[Dict] = None) -> Any:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        return response.json()

    async def get_bot_user(self) -> Dict[str, Any]:
        return await self._get("/users/@me")

def create_client_from_env() -> DiscordClient:
    bot_token = os.getenv("DISCORD_BOT_TOKEN")
    base_url = os.getenv("DISCORD_API_BASE_URL", "https://discord.com/api/v10")
    if not bot_token:
        raise ValueError("DISCORD_BOT_TOKEN environment variable is required")
    return DiscordClient(bot_token=bot_token, base_url=base_url)