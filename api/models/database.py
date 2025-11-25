import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

load_dotenv()

NEON_URL = os.environ.get("NEON_URL")
if not NEON_URL:
    raise ValueError("NEON_URL env variable is missing")

parsed = urlparse(NEON_URL)
queryParams = parse_qs(parsed.query)
cleanParams = {k: v for k, v in queryParams.items() if k.lower() not in ['sslmode', 'channel_binding']}
newQuery = urlencode(cleanParams, doseq=True)

ASYNC_DB_URL = urlunparse((
    'postgresql+asyncpg', 
    parsed.netloc, 
    parsed.path, 
    parsed.params, 
    newQuery, 
    parsed.fragment
))


engine = create_async_engine(
    ASYNC_DB_URL,
    echo=True, 
    connect_args={"ssl": True} 
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session