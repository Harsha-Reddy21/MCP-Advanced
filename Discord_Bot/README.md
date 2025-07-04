# Discord MCP Server

A Model Context Protocol (MCP) server that enables AI models to interact with Discord. This project provides a secure, extensible API for Discord bot operations, including message management, moderation, and channel info, with robust authentication and audit logging.

## Features
- **MCP Server** with Discord tools:
  - `send_message`: Send messages to channels
  - `get_messages`: Retrieve message history
  - `get_channel_info`: Fetch channel metadata
  - `search_messages`: Search with filters
  - `moderate_content`: Delete messages, manage users
- **API Key Authentication** and permission system
- **Multi-tenancy**: Support for multiple Discord bots
- **Audit Logging** for all operations
- **Input Validation** and **Rate Limiting**
- **Unit Tests** with >80% coverage

## Setup

### 1. Install Dependencies
```sh
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file in the project root:
```
DISCORD_BOT_TOKEN=your_discord_bot_token

```

### 3. Run the Server
```sh
python discord_server.py
```

