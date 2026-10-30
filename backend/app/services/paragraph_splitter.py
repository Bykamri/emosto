import re

MIN_CHARS = 20
_BLANK_LINE = re.compile(r"\n\s*\n")

def split_paragraphs(text: str, min_chars: int = MIN_CHARS) -> list[str]:

    normalized_text = text.replace("\r\n", "\n").replace("\r", "\n")
    parts = [p.strip() for p in _BLANK_LINE.split(normalized_text)]
    parts = [p for p in parts if p]

    merged: list[str] = []
    pending = ""

    for part in parts:
        if pending:
            part = f"{pending}\n\n{part}"
            pending = ""

        if len(part) < min_chars:
            if merged:
                merged[-1] = f"{merged[-1]}\n{part}"
            else:
                pending = part
        else:
            merged.append(part)

    if pending:
        merged.append(pending)
    return merged