from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING

from core.config import settings

try:
    import certifi
except ImportError:
    certifi = None


class Database:
    client: AsyncIOMotorClient = None
    db = None


db_state = Database()


async def connect_to_mongo():
    client_kwargs = {}
    if settings.MONGODB_URL.startswith("mongodb+srv://"):
        client_kwargs["tls"] = True
        if certifi is not None:
            client_kwargs["tlsCAFile"] = certifi.where()

    db_state.client = AsyncIOMotorClient(settings.MONGODB_URL, **client_kwargs)
    db_state.db = db_state.client[settings.DATABASE_NAME]
    await db_state.client.admin.command("ping")

    await db_state.db["students"].create_index([("email", ASCENDING)], unique=True)
    await db_state.db["companies"].create_index([("email", ASCENDING)], unique=True)
    await db_state.db["admins"].create_index([("email", ASCENDING)], unique=True)
    await db_state.db["studentProfile"].create_index([("student_id", ASCENDING)], unique=True)
    await db_state.db["jobs"].create_index([("company_id", ASCENDING)])
    await db_state.db["jobs"].create_index([("status", ASCENDING)])
    await db_state.db["applied_jobs"].create_index(
        [("student_id", ASCENDING), ("job_id", ASCENDING)],
        unique=True,
    )
    await db_state.db["applied_jobs"].create_index([("company_id", ASCENDING)])
    await db_state.db["chat"].create_index([("sender_id", ASCENDING), ("recipient_id", ASCENDING)])
    await db_state.db["feedback"].create_index([("company_id", ASCENDING), ("student_id", ASCENDING)])
    print("Connected to MongoDB!")


async def close_mongo_connection():
    if db_state.client:
        db_state.client.close()
        print("Disconnected from MongoDB!")


def get_database():
    return db_state.db
