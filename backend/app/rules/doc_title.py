from bs4 import BeautifulSoup


def check_doc_title(html: str) -> list[dict]:
    violations = []
    soup = BeautifulSoup(html, "html.parser")
    title_tag = soup.find("title")
    if not title_tag or not title_tag.text.strip():
        violations.append(
            {
                "ruleId": "DOC_TITLE_MISSING",
                "message": "Every page must have a non-empty <title> tag.",
                "element": "title",
                "selector": "head > title",
                "codeSnippet": (
                    str(title_tag)[:100] if title_tag else "<title> tag missing"
                ),
            }
        )
    return violations
