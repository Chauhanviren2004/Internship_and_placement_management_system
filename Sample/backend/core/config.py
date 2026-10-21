from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "HireHub BackendAPI"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "hirehub"
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    FRONTEND_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    GEMINI_API_KEY: str 

    class Config:
        env_file = ".env"


settings = Settings()
