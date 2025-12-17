from typing import List, Dict
from bs4 import BeautifulSoup
import re
import webcolors
from app.constants import (
    DEFAULT_BG_COLOR,
    LARGE_TEXT_THRESHOLD,
    NORMAL_TEXT_THRESHOLD,
    TARGET_ELEMENTS,
)

def rgb_from_string(color_str: str):
    if not color_str:
        return None
    color_str = color_str.strip().lower()
    if color_str == "transparent":
        return (255, 255, 255)

    if re.match(r"^#([0-9a-f]{3})$", color_str):
        color_str = "#" + "".join([c * 2 for c in color_str[1:]])

    try:
        rgb = webcolors.name_to_rgb(color_str)
        return rgb
    except ValueError:
        pass

    if color_str.startswith("#"):
        try:
            rgb = webcolors.hex_to_rgb(color_str)
            return rgb
        except ValueError:
            return None

    rgb_match = re.match(r"rgb\((\d+),\s*(\d+),\s*(\d+)\)", color_str)
    if rgb_match:
        rgb = tuple(int(rgb_match.group(i)) for i in range(1, 4))
        return rgb

    return None


def relative_luminance(rgb):
    def channel_lum(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = rgb
    return 0.2126 * channel_lum(r) + 0.7152 * channel_lum(g) + 0.0722 * channel_lum(b)


def contrast_ratio(rgb1, rgb2):
    lum1 = relative_luminance(rgb1)
    lum2 = relative_luminance(rgb2)
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    ratio = (lighter + 0.05) / (darker + 0.05)
    return ratio


def extract_css_property(style: str, prop: str):
    if not style:
        return None
    match = re.search(rf"{prop}\s*:\s*([^;]+);?", style, re.IGNORECASE)
    val = match.group(1).strip() if match else None
    return val


def is_large_text(style: str) -> bool:
    if not style:
        return False

    size_match = re.search(r"font-size\s*:\s*([\d.]+)\s*px", style, re.IGNORECASE)
    weight_match = re.search(r"font-weight\s*:\s*([\w\d]+)", style, re.IGNORECASE)

    font_size = float(size_match.group(1)) if size_match else 0
    font_weight = (
        weight_match.group(1).strip(" ;").lower() if weight_match else "normal"
    )

    bold_values = {"bold", "bolder", "600", "700", "800", "900"}

    large = font_size >= 24 or (font_size >= 19 and font_weight in bold_values)
    return large


def check_color_contrast(html: str) -> List[Dict]:
    violations = []
    soup = BeautifulSoup(html, "html.parser")
    elements = soup.find_all(TARGET_ELEMENTS)

    for el in elements:
        style = el.get("style", "")

        fg_color_str = extract_css_property(style, "color")
        bg_color_str = extract_css_property(style, "background-color")

        if not fg_color_str:
            continue

        # Default background to white if not set
        if not bg_color_str:
            bg_color_str = DEFAULT_BG_COLOR

        fg_rgb = rgb_from_string(fg_color_str)
        bg_rgb = rgb_from_string(bg_color_str)

        if not fg_rgb or not bg_rgb:
            continue

        ratio = contrast_ratio(fg_rgb, bg_rgb)

        large_text = is_large_text(style)
        threshold = LARGE_TEXT_THRESHOLD if large_text else NORMAL_TEXT_THRESHOLD

        if ratio < threshold:
            violations.append(
                {
                    "ruleId": "COLOR_CONTRAST",
                    "message": f"Low contrast ratio: {ratio:.2f}. Minimum expected is {threshold}.",
                    "element": el.name,
                    "selector": el.name,
                    "codeSnippet": str(el)[:100],
                }
            )

    return violations
