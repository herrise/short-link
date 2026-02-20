from pydantic import BaseModel, HttpUrl
from typing import Optional


class LinkCreate(BaseModel):
    original_url: HttpUrl


class LinkResponse(BaseModel):
    id: int
    original_url: str
    short_code: str
    created_at: str
    click_count: int

    @classmethod
    def from_row(cls, row):
        return cls(
            id=row["id"],
            original_url=row["original_url"],
            short_code=row["short_code"],
            created_at=row["created_at"],
            click_count=row["click_count"],
        )
