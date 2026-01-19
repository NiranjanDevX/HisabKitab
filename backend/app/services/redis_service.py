"""
Redis Service for Caching and Memory
"""
import json
from redis.asyncio import Redis, from_url
from typing import Optional, List, Dict, Any
from app.core.config import settings

class RedisService:
    def __init__(self):
        self.redis_url = settings.CELERY_BROKER_URL  # reusing the same redis instance
        self.client: Optional[Redis] = None

    async def connect(self):
        if not self.client:
            self.client = from_url(self.redis_url, encoding="utf-8", decode_responses=True)

    async def close(self):
        if self.client:
            await self.client.close()
            self.client = None

    async def get_json(self, key: str) -> Optional[Any]:
        await self.connect()
        if not self.client:
            return None
        val = await self.client.get(key)
        return json.loads(val) if val else None

    async def set_json(self, key: str, value: Any, expire: int = 3600):
        await self.connect()
        if not self.client:
            return
        await self.client.set(key, json.dumps(value), ex=expire)

    async def add_to_history(self, user_id: int, message: str, role: str):
        """Append a message to the user's chat history"""
        await self.connect()
        if not self.client:
            return
        key = f"chat_history:{user_id}"
        entry = json.dumps({"role": role, "content": message})
        # Keep last 20 messages
        await self.client.rpush(key, entry)
        await self.client.ltrim(key, -20, -1)
        # Set expiry for context (e.g., 24 hours)
        await self.client.expire(key, 86400)

    async def get_history(self, user_id: int) -> List[Dict[str, str]]:
        await self.connect()
        if not self.client:
            return []
        key = f"chat_history:{user_id}"
        items = await self.client.lrange(key, 0, -1)
        return [json.loads(item) for item in items]

redis_service = RedisService()
