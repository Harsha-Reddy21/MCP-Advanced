"""
Discord API Client

A simple, focused wrapper around the Discord REST API for MCP integration.
Handles authentication and provides typed responses for common Discord operations.
"""

import os
import httpx
from typing import Dict, Any, Optional, List
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

    async def _post(self, endpoint: str, data: Optional[Dict] = None) -> Any:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        kwargs = {"json": data} if data else {}
        response = await self.client.post(url, **kwargs)
        response.raise_for_status()
        return response.json() if response.content else {}

    async def _delete(self, endpoint: str) -> Any:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = await self.client.delete(url)
        response.raise_for_status()
        return response.json() if response.content else {}

    async def get_bot_user(self) -> Dict[str, Any]:
        return await self._get("/users/@me")

    async def get_channel_info(self, channel_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific channel"""
        return await self._get(f"/channels/{channel_id}")

    async def send_message(self, channel_id: str, content: str) -> Dict[str, Any]:
        """Send a message to a channel"""
        return await self._post(f"/channels/{channel_id}/messages", {"content": content})

    async def get_messages(self, channel_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get message history from a channel"""
        params = {"limit": min(limit, 100)}  # Discord max is 100
        return await self._get(f"/channels/{channel_id}/messages", params)

    async def search_messages(self, channel_id: str, query: str, limit: int = 25) -> Dict[str, Any]:
        """Search messages in a channel with filters"""
        params = {
            "content": query,
            "limit": min(limit, 25)  # Discord search max is 25
        }
        return await self._get(f"/channels/{channel_id}/messages/search", params)

    async def delete_message(self, channel_id: str, message_id: str) -> bool:
        """Delete a specific message"""
        await self._delete(f"/channels/{channel_id}/messages/{message_id}")
        return True

    async def delete_messages_bulk(self, channel_id: str, message_ids: List[str]) -> Dict[str, Any]:
        """Delete multiple messages (bulk delete)"""
        return await self._post(f"/channels/{channel_id}/messages/bulk-delete", {"messages": message_ids})

    async def get_guild_member(self, guild_id: str, user_id: str) -> Dict[str, Any]:
        """Get information about a guild member"""
        return await self._get(f"/guilds/{guild_id}/members/{user_id}")

    async def remove_guild_member(self, guild_id: str, user_id: str, reason: Optional[str] = None) -> bool:
        """Remove a member from the guild (kick)"""
        params = {"reason": reason} if reason else {}
        await self._delete(f"/guilds/{guild_id}/members/{user_id}")
        return True

    async def ban_guild_member(self, guild_id: str, user_id: str, reason: Optional[str] = None, delete_message_days: int = 0) -> Dict[str, Any]:
        """Ban a member from the guild"""
        data = {
            "delete_message_days": delete_message_days
        }
        if reason:
            data["reason"] = reason
        return await self._put(f"/guilds/{guild_id}/bans/{user_id}", data)

    async def unban_guild_member(self, guild_id: str, user_id: str) -> bool:
        """Unban a member from the guild"""
        await self._delete(f"/guilds/{guild_id}/bans/{user_id}")
        return True

    async def _put(self, endpoint: str, data: Optional[Dict] = None) -> Any:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = await self.client.put(url, json=data)
        response.raise_for_status()
        return response.json() if response.content else {}

def create_client_from_env() -> DiscordClient:
    bot_token = os.getenv("DISCORD_BOT_TOKEN")
    guild_id = os.getenv("DISCORD_GUILD_ID", "")  # Optional for some operations
    base_url = os.getenv("DISCORD_API_BASE_URL", "https://discord.com/api/v10")
    if not bot_token:
        raise ValueError("DISCORD_BOT_TOKEN environment variable is required")
    return DiscordClient(bot_token=bot_token, base_url=base_url)