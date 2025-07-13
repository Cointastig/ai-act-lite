# backend/app/risk_wizard.py

from fastapi import APIRouter, Body

router = APIRouter(
    prefix="/risk-wizard",
    tags=["risk-wizard"],
)

@router.post("", summary="Evaluate AI-Act risk")
async def risk_wizard(
    answers: list[bool] = Body(..., embed=True),
    company_name: str = Body(...),
    contact_email: str = Body(...)
):
    """
    Einfaches Scoring:
    • 7–10 Ja -> high
    • 4–6  Ja -> medium
    • 0–3  Ja -> minimal
    """
    score = sum(1 for a in answers if a)
    if score >= 7:
        risk = "high"
        actions = [
            "Melden Sie Ihr System an Aufsichtsbehörde",
            "Erstellen Sie ein vollständiges Sicherheitskonzept"
        ]
    elif score >= 4:
        risk = "medium"
        actions = [
            "Geben Sie den Endbenutzern einen Transparenzhinweis",
            "Generieren Sie technische Dokumentation nach Anhang IV"
        ]
    else:
        risk = "minimal"
        actions = []

    references = [
        "https://eur-lex.europa.eu/eli/reg/2021/0106/oj#d1e3946",
        "https://eur-lex.europa.eu/eli/reg/2021/0106/oj#annex-IV"
    ]

    return {
        "risk_class": risk,
        "required_actions": actions,
        "references": references
    }
