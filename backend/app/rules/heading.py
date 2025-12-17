from bs4 import BeautifulSoup


def check_single_h1(html: str) -> list[dict]:
    violations = []
    soup = BeautifulSoup(html, "html.parser")
    h1_tags = soup.find_all("h1")
    if len(h1_tags) != 1:
        violations.append(
            {
                "ruleId": "HEADING_MULTIPLE_H1",
                "message": f"There must be exactly one <h1> per page, found {len(h1_tags)}.",
                "element": "h1",
                "selector": "body > h1",
                "codeSnippet": str(h1_tags[0])[:100] if h1_tags else "",
            }
        )
    return violations
