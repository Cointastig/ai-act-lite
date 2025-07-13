from fastapi import APIRouter

# Teil-Router importieren
from .risk_wizard import router as wizard_router
from .pdf import router as pdf_router          #  ➜ NEU für Annex-IV-PDF

router = APIRouter()

# Teil-Router registrieren
router.include_router(wizard_router)           # /api/risk-wizard
router.include_router(pdf_router)              # /api/pdf
