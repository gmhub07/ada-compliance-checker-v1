from pydantic import BaseModel


class Violation(BaseModel):
    ruleId: str
    message: str
    element: str
    selector: str
    codeSnippet: str


class HtmlCheckRequest(BaseModel):
    html: str


class CheckResponse(BaseModel):
    violations: list[Violation]
