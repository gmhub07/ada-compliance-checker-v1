from bs4 import BeautifulSoup


def check_doc_lang(html: str) -> list[dict]:
    violations = []
    soup = BeautifulSoup(html, "html.parser")
    html_tag = soup.find("html")
    if not html_tag or not html_tag.get("lang", "").strip():
        violations.append(
            {
                "ruleId": "DOC_LANG_MISSING",
                "message": "The <html> element must have a valid lang attribute.",
                "element": "html",
                "selector": "html",
                "codeSnippet": (
                    str(html_tag)[:100] if html_tag else "<html> tag missing"
                ),
            }
        )
    return violations
