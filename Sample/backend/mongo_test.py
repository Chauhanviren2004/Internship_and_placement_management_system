import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

url = "mongodb+srv://chauhanviren839_db_user:dSHaOoHDUsRnQacc@intelliplace.wwszlpx.mongodb.net/?appName=Intelliplace"

async def test():
    try:
        print("Attempting to connect...")
        client = AsyncIOMotorClient(url, serverSelectionTimeoutMS=5000)
        res = await client.admin.command('ping')
        print("Successfully Connected! Ping Response:", res)
    except Exception as e:
        print("\n--- CONNECTION FAILED ---")
        print("Error Type:", type(e).__name__)
        print("Exact Reason:", str(e))
        print("-------------------------\n")

asyncio.run(test())
