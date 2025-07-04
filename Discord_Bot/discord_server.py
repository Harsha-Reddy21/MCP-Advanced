"""
Discord MCP Server

A Model Context Protocol (MCP) server that provides tools and resources for interacting
with Discord via a bot.
"""

import os
import asyncio
from typing import Dict, Any, Optional
from fastmcp import FastMCP, Context
from fastmcp.exceptions import ToolError
from dotenv import load_dotenv
from discord_client import DiscordClient, create_client_from_env

load_dotenv()

mcp = FastMCP(
    name="Discord MCP Server",
    instructions="""
    This server provides access to Discord bot information.
    Use the get_bot_info tool to retrieve the bot's user information.
    """
)

# Global client management
_discord_client: Optional[DiscordClient] = None

def get_client() -> DiscordClient:
    if _discord_client is None:
        raise ToolError("Discord client not initialized. Check your environment variables.")
    return _discord_client

async def ensure_client_initialized():
    """Ensure the Discord client is initialized"""
    global _discord_client
    if _discord_client is None:
        _discord_client = create_client_from_env()
        print("[DEBUG] Discord client initialized successfully")

@mcp.tool
async def get_bot_info(ctx: Context = None) -> Dict[str, Any]:
    """
    Get information about the Discord bot.
    """
    if ctx:
        await ctx.info("Fetching Discord bot info")
    try:
        # Ensure client is initialized before using it
        await ensure_client_initialized()
        client = get_client()
        user = await client.get_bot_user()
        if ctx:
            await ctx.info("Bot info retrieved successfully")
        return user
    except Exception as e:
        error_msg = f"Failed to get bot info: {str(e)}"
        if ctx:
            await ctx.error(error_msg)
        raise ToolError(error_msg)

# Server lifecycle
async def initialize_client():
    global _discord_client
    try:
        _discord_client = create_client_from_env()
        print(f"✅ Discord client initialized.")
    except Exception as e:
        print(f"❌ Failed to initialize Discord client: {e}")
        raise

async def cleanup_client():
    global _discord_client
    if _discord_client:
        await _discord_client.close()
        print("✅ Discord client closed")

def main():
    async def run_server():
        await initialize_client()
        try:
            print("🚀 Starting Discord MCP Server...")
            print("📡 Server will be available for MCP connections")
            await mcp.run_async()
        finally:
            await cleanup_client()
    asyncio.run(run_server())

if __name__ == "__main__":
    main()