from fastapi import APIRouter

from .risk_wizard import router as wizard_router   #   <-- Jetzt vorhanden
from .pdf import router as pdf_router

router = APIRouter()
router.include_router(wizard_router)   # /api/risk-wizard
router.include_router(pdf_router)      # /api/pdf
