from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class Story(Base):
    __tablename__ = "stories"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), default=func.now(), onupdate=func.now()
    )

    paragraphs: Mapped[list["Paragraph"]] = relationship(order_by="Paragraph.list_pr", back_populates="story", cascade="all, delete-orphan")

class Paragraph(Base):
    __tablename__ = "paragraphs"
    __table_args__ = (UniqueConstraint("story_id", "list_pr", name="uq_paragraph_story_list"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    story_id: Mapped[int] = mapped_column(ForeignKey("stories.id", ondelete="CASCADE"), index=True)
    list_pr: Mapped[int]
    content: Mapped[str] = mapped_column(Text)

    story: Mapped["Story"] = relationship(back_populates="paragraphs")