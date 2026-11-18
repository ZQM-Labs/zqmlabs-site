#!/usr/bin/env python3
"""Build the public, two-page resume. Requires reportlab; no network calls."""
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "static/computing/alex-zelenski-resume.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

font_root = Path("/usr/share/fonts/truetype/dejavu")
if (font_root / "DejaVuSans.ttf").exists():
    pdfmetrics.registerFont(TTFont("PublicResume", str(font_root / "DejaVuSans.ttf")))
    pdfmetrics.registerFont(TTFont("PublicResume-Bold", str(font_root / "DejaVuSans-Bold.ttf")))
    pdfmetrics.registerFontFamily("PublicResume", normal="PublicResume", bold="PublicResume-Bold")
    FACE, BOLD = "PublicResume", "PublicResume-Bold"
else:
    FACE, BOLD = "Helvetica", "Helvetica-Bold"

TEAL = colors.HexColor("#145b63")
INK = colors.HexColor("#20343b")
MUTED = colors.HexColor("#52676d")
styles = {
    "name": ParagraphStyle("name", fontName=BOLD, fontSize=25, leading=29, textColor=INK, spaceAfter=5),
    "subtitle": ParagraphStyle("subtitle", fontName=BOLD, fontSize=10.3, leading=14, textColor=TEAL, spaceAfter=7),
    "contact": ParagraphStyle("contact", fontName=FACE, fontSize=8.6, leading=12, textColor=MUTED, spaceAfter=13),
    "section": ParagraphStyle("section", fontName=BOLD, fontSize=10, leading=14, textColor=TEAL, spaceBefore=12, spaceAfter=6, keepWithNext=True),
    "role": ParagraphStyle("role", fontName=BOLD, fontSize=9.5, leading=13, textColor=INK, spaceBefore=7, spaceAfter=4, keepWithNext=True),
    "body": ParagraphStyle("body", fontName=FACE, fontSize=9.25, leading=13.4, textColor=INK, spaceAfter=6),
    "bullet": ParagraphStyle("bullet", fontName=FACE, fontSize=9.25, leading=13.1, textColor=INK, leftIndent=10, firstLineIndent=-9, spaceAfter=4),
    "small": ParagraphStyle("small", fontName=FACE, fontSize=8.5, leading=12, textColor=MUTED, spaceAfter=5),
}
story = []

def p(text, kind="body"):
    story.append(Paragraph(text, styles[kind]))

def bullet(text):
    p("• " + text, "bullet")

def link(url, label):
    return '<a href="' + escape(url, {'"': '&quot;'}) + '" color="#145b63">' + escape(label) + '</a>'

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#cbdad7"))
    canvas.line(42, 40, 570, 40)
    canvas.setFont(FACE, 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 27, "Alex Zelenski, GISP  |  Public résumé  |  November 2026")
    canvas.drawRightString(570, 27, f"{doc.page} / 2")
    canvas.restoreState()

p("ALEX ZELENSKI, GISP", "name")
p("ENVIRONMENTAL PLANNING &amp; GEOSPATIAL DEVELOPMENT", "subtitle")
p("New Smyrna Beach, Florida · " + link("mailto:zqmcomputing@gmail.com", "zqmcomputing@gmail.com") + "<br/>" +
  link("https://zqmlabs.com/computing/alex-zelenski/", "zqmlabs.com/computing/alex-zelenski/") + " · " +
  link("https://www.linkedin.com/in/alexczelenski/", "LinkedIn"), "contact")
p("PROFESSIONAL PROFILE", "section")
p("Environmental planning and geospatial professional with roughly 12 years of experience spanning permitting support, wetland and natural-resource work, land-development GIS, flood and watershed analysis, conservation research, cartography and technical leadership. Founded and led Clearview Geographic. Now develops GIS tools and reproducible spatial-data workflows through ZQM Computing.")
p("CORE CAPABILITIES", "section")
bullet("<b>Environmental:</b> FDEP/WMD permitting support; wetland and GPS mapping; mitigation and protected-species work; constraints and regulatory exhibits; agency coordination.")
bullet("<b>Geospatial:</b> flood exposure, critical-asset inventories, conservation prioritization, parcel/map series, spatial-data preparation, QA/QC and technical reporting.")
bullet("<b>Delivery:</b> scopes, proposals, budgets, client relationships, multidisciplinary coordination, GIS automation and documented technical handoff.")
p("PROFESSIONAL EXPERIENCE", "section")
p("ZQM Computing | Independent Geospatial Developer | Oct 2026–present", "role")
bullet("Build reusable Python, QGIS/PyQGIS, GDAL, GeoPandas and PostGIS examples with documentation and validation. Publish synthetic parcel Atlas and workflow QA demonstrations for prospective GIS scopes.")
bullet("Develop spatial-data processing, web GIS/API and operational tooling. ZQM Labs is a separate game-studio project.")
p("Clearview Geographic LLC | Founder &amp; Practice Lead | Mar 2018–Sep 2026", "role")
bullet("Led an environmental and geospatial consultancy across project scoping, proposals, budgets, team coordination, technical delivery and QA/QC. The former practice closed in 2026.")
bullet("Combined environmental planning/permitting support, regulatory mapping, flood and watershed analysis, conservation research and Python-based GIS processing.")
bullet("Contributed to publicly documented county studies, technical reports, asset inventories and municipal assessment presentations. Selected credits and sources appear on page 2.")
p("Zev Cohen &amp; Associates | Environmental Scientist &amp; GIS Specialist | 2016–2018", "role")
bullet("Supported development and infrastructure permitting with environmental field investigations, wetland/GPS mapping, regulatory exhibits, mitigation and protected-species compliance work.")
p("Kappa Map Group | Digital Cartographer | 2015–2016", "role")
bullet("Prepared commercial cartographic products and atlases; digitized and checked transportation and municipal vector data for publication.")
p("Stetson University | Research &amp; Teaching Support | 2014–2016", "role")
p("Supported environmental research and teaching while completing Environmental Science &amp; Geography studies.", "small")

story.append(PageBreak())
p("SELECTED WORK &amp; PROFESSIONAL CREDITS", "section")
p("Historical consulting credits below are from the Clearview Geographic period. Source links are available in the " + link("https://zqmlabs.com/computing/portfolio/", "project portfolio") + ".", "small")
bullet("<b>Monroe County watershed planning:</b> Stetson University credits GIS model development, map production and report coauthorship. Collaborative watershed and flood-risk work supported county resilience planning.")
bullet("<b>Lake County conservation planning (2023):</b> named coauthor of the technical Appendix A to the natural-lands inventory and resilient green-space planning report, FDEP Agreement 23RRE04.")
bullet("<b>Osceola County conservation planning (2024):</b> named technical-report coauthor for biodiversity, conservation prioritization and flood resilience, FDEP Agreement 24RRE02.")
bullet("<b>Islamorada vulnerability assessment (2024):</b> named originator/contact in critical-asset inventory metadata.")
bullet("<b>Fort Lauderdale vulnerability assessment (2024):</b> city minutes document consultant-team participation and explanation of DEM-based modeling to the Sustainability Advisory Board.")
bullet("<b>St. Lucie County:</b> county webinar record names Alex Zelenski as a presenter of the vulnerability-assessment project and local resilience-planning process.")
bullet("<b>Mitigation banking GIS:</b> public map and layer records attribute mitigation-bank, watershed, drainage-basin and service-area GIS content to Alex Zelenski.")
p("PUBLIC SERVICE &amp; TECHNICAL COMMUNICATION", "section")
bullet("<b>Volusia County ENRAC:</b> appointed September 2022 for a two-year term; recorded individual comments addressed historic trees, canopy retention, conservation easements and historical imagery.")
bullet("<b>Florida DEP state-park planning:</b> participated in the June 2022 Blue Spring/Hontoon Island advisory-group process.")
bullet("<b>Environmental proceedings:</b> accepted and testified as an expert in GIS, environmental permitting and related environmental subjects in the proceeding documented by DEP OGC 22-2509 / DOAH 24-4282, paragraph 154 of the attached recommended order.")
p("EDUCATION &amp; PROFESSIONAL CREDENTIAL", "section")
p("<b>B.S., Environmental Science &amp; Geography</b> — Stetson University, 2016.<br/><b>Certified GIS Professional (GISP)</b> — GIS Certification Institute.")
p("TECHNICAL TOOLKIT", "section")
p("<b>GIS and modeling:</b> ArcGIS Pro/ArcMap, ArcPy, QGIS/PyQGIS, GDAL/OGR, GPS, LiDAR, HAZUS-MH, SLAMM and spatial exposure analysis.<br/><b>Data and applications:</b> Python, SQL, PostgreSQL/PostGIS, GeoPandas, DuckDB Spatial, GeoParquet, web maps and geospatial APIs.<br/><b>Supporting engineering:</b> Linux, Docker, Proxmox/Ceph, Git/GitHub, automated checks and operational documentation.")
p("CURRENT WORK SAMPLES", "section")
p(link("https://github.com/ZQM-Computing", "ZQM Computing open-source GIS repositories") + " · " + link("https://zqmlabs.com/computing/", "GIS services and synthetic examples") + "<br/>" + link("https://zqmlabs.com/computing/inquiry/", "Discuss a defined GIS project"))

doc = SimpleDocTemplate(str(OUT), pagesize=(612, 792), rightMargin=42, leftMargin=42,
                        topMargin=35, bottomMargin=54, title="Alex Zelenski, GISP — Public Resume",
                        author="Alex Zelenski", subject="Environmental planning and geospatial development",
                        pageCompression=1, invariant=1)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
