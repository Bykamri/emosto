from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.story import StoryIn, StoryDetail, StorySummary
from app.services import story_service

router = APIRouter(prefix="/stories", tags=["Stories"])

@router.post("", response_model=StoryDetail, status_code=201)
def create_story(body: StoryIn, db: Session = Depends(get_db)):
    return story_service.create_story(db, body)

@router.get("", response_model=list[StorySummary])
def list_stories(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    return story_service.list_stories(db, limit, offset)

@router.get("/{story_id}", response_model=StoryDetail)
def get_story(story_id: int, db: Session = Depends(get_db)):
    return story_service.get_story(db, story_id)


@router.put("/{story_id}", response_model=StoryDetail)
def update_story(story_id: int, body: StoryIn, db: Session = Depends(get_db)):
    return story_service.update_story(db, story_id, body)


@router.delete("/{story_id}", status_code=204)
def delete_story(story_id: int, db: Session = Depends(get_db)) -> None:
    story_service.delete_story(db, story_id)
