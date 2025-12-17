from app.rules import (
    doc_lang,
    doc_title,
    img_alt,
    link_text,
    heading,
    heading_order,
    color_contrast,
    img_alt_length,
)


class AccessibilityCheckerService:
    def __init__(self):
        self.rules = [
            doc_lang.check_doc_lang,
            doc_title.check_doc_title,
            img_alt.check_img_alt,
            img_alt_length.check_img_alt_length,
            link_text.check_generic_link_text,
            heading.check_single_h1,
            heading_order.check_heading_order,
            color_contrast.check_color_contrast,
        ]

    def check_html(self, html: str) -> list[dict]:
        violations = []
        for rule in self.rules:
            try:
                violations.extend(rule(html))
            except Exception as e:
                print(f"Error running {rule.__name__}: {e}")
        return violations
