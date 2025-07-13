from fastapi import APIRouter, Body

router = APIRouter(
    prefix="/risk-wizard",
    tags=["risk-wizard"],
)

@router.post("", summary="Evaluate AI-Act risk")
async def risk_wizard(
    answers: list[bool] = Body(...),
    company_name: str = Body(...),
    contact_email: str = Body(...)
):
    """
    Dummy-Heuristik:
    • ≥3 × Ja → high  
    • 1–2 × Ja → medium  
    • 0 × Ja  → minimal
    """
    score = sum(answers)

    if score >= 3:
        return {
            "risk_class": "high",
            "required_actions": [
                "Führen Sie eine vollständige Konformitätsbewertung durch",
                "Benachrichtigen Sie die Aufsichtsbehörde"
            ]
        }

    if score >= 1:
        return {
            "risk_class": "medium",
            "required_actions": [
                "Geben Sie den Endbenutzern einen Transparenzhinweis",
                "Generieren Sie technische Dokumentation nach Anhang IV"
            ]
        }

    return {"risk_class": "minimal", "required_actions": []}
