from bs4 import BeautifulSoup


def check_img_alt_length(html: str) -> list[dict]:
    violations = []
    soup = BeautifulSoup(html, "html.parser")
    for img in soup.find_all("img"):
        alt_text = img.get("alt", "")
        if alt_text and len(alt_text) > 120:
            selector = f"img[src='{img.get('src', '')}']"
            violations.append(
                {
                    "ruleId": "IMG_ALT_LENGTH",
                    "message": "The alt attribute text should not exceed 120 characters.",
                    "element": "img",
                    "selector": selector,
                    "codeSnippet": str(img)[:100],
                }
            )
    return violations
