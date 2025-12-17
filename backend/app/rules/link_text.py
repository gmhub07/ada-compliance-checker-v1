from bs4 import BeautifulSoup

GENERIC_LINK_TEXTS = {"click here", "read more", "more", "here"}


def check_generic_link_text(html: str) -> list[dict]:
    violations = []
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a"):
        link_text = a.text.strip().lower()
        if link_text in GENERIC_LINK_TEXTS:
            selector = f"a[href='{a.get('href', '')}']"
            violations.append(
                {
                    "ruleId": "LINK_GENERIC_TEXT",
                    "message": "Link text should be descriptive. Avoid generic terms like 'click here'.",
                    "element": "a",
                    "selector": selector,
                    "codeSnippet": str(a)[:100],
                }
            )
    return violations
