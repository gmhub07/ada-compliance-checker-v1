from bs4 import BeautifulSoup


def check_img_alt(html: str) -> list[dict]:
    violations = []
    soup = BeautifulSoup(html, "html.parser")
    for img in soup.find_all("img"):
        alt_text = img.get("alt", "").strip()
        if not alt_text:
            selector = f"img[src='{img.get('src', '')}']"
            violations.append(
                {
                    "ruleId": "IMG_ALT_MISSING",
                    "message": "Informative images must have a descriptive alt attribute.",
                    "element": "img",
                    "selector": selector,
                    "codeSnippet": str(img)[:100],
                }
            )
    return violations
