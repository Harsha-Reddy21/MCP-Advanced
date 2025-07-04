"""
Discord MCP Server

A Model Context Protocol (MCP) server that provides tools and resources for interacting
with Discord via a bot.
"""

import os
import asyncio
from typing import Dict, Any, Optional, List
from fastmcp import FastMCP, Context
from fastmcp.exceptions import ToolError
from dotenv import load_dotenv
from discord_client import DiscordClient, create_client_from_env

load_dotenv()

mcp = FastMCP(
    name="Discord MCP Server",
    instructions="""
    This server provides access to Discord bot information, messaging, and moderation.
    Use get_bot_info to retrieve the bot's user information.
    Use get_channel_info to fetch channel metadata by channel ID.
    Use send_message to send messages to channels.
    Use get_messages to retrieve message history.
    Use search_messages to search messages with filters.
    Use moderate_content for message deletion and user management.
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

@mcp.tool
async def get_channel_info(channel_id: str, ctx: Context = None) -> Dict[str, Any]:
    """
    Get detailed information about a specific Discord channel.
    
    Args:
        channel_id: The Discord channel ID to fetch information for
    
    Returns:
        Detailed channel information including name, type, permissions, etc.
    """
    if ctx:
        await ctx.info(f"Fetching channel info for channel ID: {channel_id}")
    try:
        # Ensure client is initialized before using it
        await ensure_client_initialized()
        client = get_client()
        channel = await client.get_channel_info(channel_id)
        if ctx:
            await ctx.info("Channel info retrieved successfully")
        return channel
    except Exception as e:
        error_msg = f"Failed to get channel info for '{channel_id}': {str(e)}"
        if ctx:
            await ctx.error(error_msg)
        raise ToolError(error_msg)

@mcp.tool
async def send_message(channel_id: str, content: str, ctx: Context = None) -> Dict[str, Any]:
    """
    Send a message to a Discord channel.
    
    Args:
        channel_id: The Discord channel ID to send the message to
        content: The message content to send
    
    Returns:
        Information about the sent message
    """
    if ctx:
        await ctx.info(f"Sending message to channel {channel_id}")
    try:
        await ensure_client_initialized()
        client = get_client()
        message = await client.send_message(channel_id, content)
        if ctx:
            await ctx.info("Message sent successfully")
        return {
            "id": message["id"],
            "content": message["content"],
            "channel_id": message["channel_id"],
            "author": message["author"]["username"],
            "timestamp": message["timestamp"]
        }
    except Exception as e:
        error_msg = f"Failed to send message to channel '{channel_id}': {str(e)}"
        if ctx:
            await ctx.error(error_msg)
        raise ToolError(error_msg)

@mcp.tool
async def get_messages(channel_id: str, limit: int = 50, ctx: Context = None) -> List[Dict[str, Any]]:
    """
    Retrieve message history from a Discord channel.
    
    Args:
        channel_id: The Discord channel ID to get messages from
        limit: Maximum number of messages to retrieve (max 100)
    
    Returns:
        List of messages with their content and metadata
    """
    if ctx:
        await ctx.info(f"Fetching {limit} messages from channel {channel_id}")
    try:
        await ensure_client_initialized()
        client = get_client()
        messages = await client.get_messages(channel_id, limit)
        if ctx:
            await ctx.info(f"Retrieved {len(messages)} messages")
        return [
            {
                "id": msg["id"],
                "content": msg["content"],
                "author": msg["author"]["username"],
                "author_id": msg["author"]["id"],
                "timestamp": msg["timestamp"],
                "edited_timestamp": msg.get("edited_timestamp"),
                "attachments": msg.get("attachments", []),
                "embeds": msg.get("embeds", [])
            }
            for msg in messages
        ]
    except Exception as e:
        error_msg = f"Failed to get messages from channel '{channel_id}': {str(e)}"
        if ctx:
            await ctx.error(error_msg)
        raise ToolError(error_msg)

@mcp.tool
async def search_messages(channel_id: str, query: str, limit: int = 25, ctx: Context = None) -> Dict[str, Any]:
    """
    Search messages in a Discord channel with filters.
    
    Args:
        channel_id: The Discord channel ID to search in
        query: The search query to filter messages
        limit: Maximum number of search results (max 25)
    
    Returns:
        Search results with matching messages
    """
    if ctx:
        await ctx.info(f"Searching for '{query}' in channel {channel_id}")
    try:
        await ensure_client_initialized()
        client = get_client()
        results = await client.search_messages(channel_id, query, limit)
        if ctx:
            await ctx.info(f"Search completed with {len(results.get('results', []))} results")
        return results
    except Exception as e:
        error_msg = f"Failed to search messages in channel '{channel_id}': {str(e)}"
        if ctx:
            await ctx.error(error_msg)
        raise ToolError(error_msg)

@mcp.tool
async def moderate_content(
    action: str,
    channel_id: str = None,
    message_id: str = None,
    user_id: str = None,
    guild_id: str = None,
    reason: str = None,
    ctx: Context = None
) -> Dict[str, Any]:
    """
    Moderate Discord content - delete messages, manage users.
    
    Args:
        action: The moderation action ('delete_message', 'delete_messages_bulk', 'kick_user', 'ban_user', 'unban_user')
        channel_id: The Discord channel ID (required for message operations)
        message_id: The message ID to delete (required for single message deletion)
        user_id: The user ID to moderate (required for user operations)
        guild_id: The guild/server ID (required for user operations)
        reason: Optional reason for the moderation action
    
    Returns:
        Result of the moderation action
    """
    if ctx:
        await ctx.info(f"Performing moderation action: {action}")
    try:
        await ensure_client_initialized()
        client = get_client()
        
        if action == "delete_message":
            if not channel_id or not message_id:
                raise ToolError("channel_id and message_id are required for delete_message action")
            await client.delete_message(channel_id, message_id)
            result = {"action": "delete_message", "success": True, "message_id": message_id}
            
        elif action == "delete_messages_bulk":
            if not channel_id or not message_id:
                raise ToolError("channel_id and message_id are required for delete_messages_bulk action")
            # For bulk delete, message_id should be a comma-separated list
            message_ids = [msg_id.strip() for msg_id in message_id.split(",")]
            await client.delete_messages_bulk(channel_id, message_ids)
            result = {"action": "delete_messages_bulk", "success": True, "message_ids": message_ids}
            
        elif action == "kick_user":
            if not guild_id or not user_id:
                raise ToolError("guild_id and user_id are required for kick_user action")
            await client.remove_guild_member(guild_id, user_id, reason)
            result = {"action": "kick_user", "success": True, "user_id": user_id}
            
        elif action == "ban_user":
            if not guild_id or not user_id:
                raise ToolError("guild_id and user_id are required for ban_user action")
            ban_result = await client.ban_guild_member(guild_id, user_id, reason)
            result = {"action": "ban_user", "success": True, "user_id": user_id, "ban_data": ban_result}
            
        elif action == "unban_user":
            if not guild_id or not user_id:
                raise ToolError("guild_id and user_id are required for unban_user action")
            await client.unban_guild_member(guild_id, user_id)
            result = {"action": "unban_user", "success": True, "user_id": user_id}
            
        else:
            raise ToolError(f"Unknown moderation action: {action}")
        
        if ctx:
            await ctx.info(f"Moderation action '{action}' completed successfully")
        return result
        
    except Exception as e:
        error_msg = f"Failed to perform moderation action '{action}': {str(e)}"
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