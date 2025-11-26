

import sys
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

project_root = Path(__file__).resolve().parent

sys.path.append(str(project_root))

from models.database import engine, Base
from routes.router import router


origins = [
    "http://localhost:3000",
    "https://goal-breaker-one.vercel.app"
]

allow_origin_regex = r"https://.*\.vercel\.app"

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def index():
    return {"Server is working"}

@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def catch_all_routes(request: Request, full_path: str):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": f"The path '/{full_path}' does not exist. Try /api/..."
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)