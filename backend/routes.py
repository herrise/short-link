import string
import random
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

from database import get_connection
from schemas import LinkCreate, LinkResponse

router = APIRouter()

CHARACTERS = string.ascii_letters + string.digits


def generate_short_code(length: int = 6) -> str:
    """Generate a random short code."""
    return "".join(random.choices(CHARACTERS, k=length))


def get_unique_short_code() -> str:
    """Generate a short code that doesn't already exist in the database."""
    conn = get_connection()
    try:
        for _ in range(10):
            code = generate_short_code()
            row = conn.execute(
                "SELECT id FROM links WHERE short_code = ?", (code,)
            ).fetchone()
            if row is None:
                return code
        raise HTTPException(
            status_code=500, detail="Failed to generate unique short code"
        )
    finally:
        conn.close()


# ──────────────────────────────────────────────
# API endpoints
# ──────────────────────────────────────────────

@router.post("/api/links", response_model=LinkResponse, status_code=201)
def create_link(body: LinkCreate):
    short_code = get_unique_short_code()
    conn = get_connection()
    try:
        cursor = conn.execute(
            "INSERT INTO links (original_url, short_code) VALUES (?, ?)",
            (str(body.original_url), short_code),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM links WHERE id = ?", (cursor.lastrowid,)
        ).fetchone()
        return LinkResponse.from_row(row)
    finally:
        conn.close()


@router.get("/api/links", response_model=list[LinkResponse])
def list_links():
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM links ORDER BY created_at DESC"
        ).fetchall()
        return [LinkResponse.from_row(r) for r in rows]
    finally:
        conn.close()


@router.get("/api/links/{link_id}", response_model=LinkResponse)
def get_link(link_id: int):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM links WHERE id = ?", (link_id,)
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Link not found")
        return LinkResponse.from_row(row)
    finally:
        conn.close()


@router.delete("/api/links/{link_id}", status_code=204)
def delete_link(link_id: int):
    conn = get_connection()
    try:
        result = conn.execute("DELETE FROM links WHERE id = ?", (link_id,))
        conn.commit()
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Link not found")
    finally:
        conn.close()


# ──────────────────────────────────────────────
# Redirect endpoint (public)
# ──────────────────────────────────────────────

@router.get("/{short_code}")
def redirect_to_url(short_code: str):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM links WHERE short_code = ?", (short_code,)
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Short link not found")
        conn.execute(
            "UPDATE links SET click_count = click_count + 1 WHERE id = ?",
            (row["id"],),
        )
        conn.commit()
        return RedirectResponse(url=row["original_url"], status_code=302)
    finally:
        conn.close()
