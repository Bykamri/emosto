from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Story, Paragraph
from app.schemas.story import StoryIn 
from app.services.errors import StoryNotFoundError
from app.services.paragraph_splitter import split_paragraphs

def _build_paragraphs(content: str) -> list[Paragraph]:
    return [
        Paragraph(list_pr=list_num, content=paragraph)
        for list_num, paragraph in enumerate(split_paragraphs(content), start=1)
    ]

def create_story(db:Session, data: StoryIn) -> Story:
    story = Story(title=data.title, content=data.content, paragraphs=_build_paragraphs(data.content))
    db.add(story)
    db.commit()
    db.refresh(story)
    return story

def list_stories(db: Session, limit: int, offset: int) -> list[Story]:
    stmt = (
        select(Story)
        .order_by(Story.created_at.desc(), Story.id.desc())
        .limit(limit)
        .offset(offset)
    )
    return list(db.scalars(stmt).all())

def get_story(db: Session, story_id: int) -> Story:
    stmt = select(Story).options(selectinload(Story.paragraphs)).where(Story.id == story_id)
    story = db.scalars(stmt).first()
    if story is None:
        raise StoryNotFoundError(story_id)
    return story
def update_story(db: Session, story_id: int, data: StoryIn) -> Story:
    story = get_story(db, story_id)
    story.title = data.title
    if story.content != data.content:
        story.content = data.content
        story.paragraphs.clear()
        db.flush()
        story.paragraphs = _build_paragraphs(data.content)
    db.commit()
    db.refresh(story)
    return story

def delete_story(db: Session, story_id: int) -> None:
    story = get_story(db, story_id)
    db.delete(story)
    db.commit()