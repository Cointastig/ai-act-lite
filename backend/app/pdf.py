# backend/app/pdf.py

from fastapi import APIRouter, Body
from fastapi.responses import Response
from jinja2 import Environment, PackageLoader, select_autoescape
from weasyprint import HTML

router = APIRouter()

env = Environment(
    loader=PackageLoader("app", "templates"),
    autoescape=select_autoescape()
)

@router.post("/pdf", summary="Annex-IV PDF")
async def generate_pdf(
    company_name: str = Body(...),
    risk_class: str = Body(...),
    required_actions: list[str] = Body(..., embed=True)
):
    tpl = env.get_template("report.html")
    html = tpl.render(
        company=company_name,
        risk=risk_class.capitalize(),
        actions=required_actions
    )
    pdf_bytes = HTML(string=html).write_pdf()

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=Annex-IV-Report.pdf"
        },
    )
