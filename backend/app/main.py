from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.database import init_db
from app.routers import stories
from app.services.errors import StoryNotFoundError


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Emosto API", lifespan=lifespan)

@app.exception_handler(StoryNotFoundError)
async def story_not_found_handler(request: Request, exc: StoryNotFoundError):
    return JSONResponse(status_code=404, content={"detail": "The requested story was not found."})


app.include_router(stories.router)


@app.get("/health")
def health():
    return {"status": "ok"}