from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict

class StoryIn(BaseModel):
    
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=150)
    content: str = Field(min_length=1, max_length=20000)

class ParagraphOut(BaseModel):
    
    model_config = ConfigDict(from_attributes=True)

    id: int
    list_pr: int
    content: str

class StorySummary(BaseModel):
    
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    created_at: datetime
    updated_at: datetime

class StoryDetail(StorySummary):
    

    content: str
    paragraphs: list[ParagraphOut] 