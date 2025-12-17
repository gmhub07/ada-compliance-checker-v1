from bs4 import BeautifulSoup


def check_heading_order(html: str) -> list[dict]:
    violations = []
    soup = BeautifulSoup(html, "html.parser")
    headings = soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"])

    previous_level = 0
    for h in headings:
        current_level = int(h.name[1])
        if previous_level != 0 and current_level > previous_level + 1:
            violations.append(
                {
                    "ruleId": "HEADING_ORDER",
                    "message": f"Heading levels must not be skipped: found {h.name} after h{previous_level}.",
                    "element": h.name,
                    "selector": h.name,
                    "codeSnippet": str(h)[:100],
                }
            )
        previous_level = current_level
    return violations
