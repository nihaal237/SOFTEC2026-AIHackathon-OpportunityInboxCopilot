from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any
import imaplib
from fastapi import UploadFile, File
import shutil
import os
from resume_parser import parse_resume
from parser import parse_email
from gmail_imap import fetch_gmail_imap
from scoring_engine import rank_opportunities
from cover_letter import generate_cover_letter
app = FastAPI()

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# REQUEST MODELS
# =====================================================

class GmailLoginRequest(BaseModel):
    email: str
    app_password: str
    max_emails: int = 10


class StudentPreferences(BaseModel):
    cgpa: float
    skills: List[str]
    preferred_types: List[str]
    location_preference: str = ""
    financial_need: bool = False


class RankRequest(BaseModel):
    student: StudentPreferences
    selected_emails: List[Any]

class CoverLetterRequest(BaseModel):
    student: dict
    opportunity: dict
# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "message": "Opportunity Inbox Copilot API Running 🚀"
    }


# =====================================================
# TEST GMAIL CONNECTION
# =====================================================

@app.post("/emails/gmail-imap/test")
def test_gmail_connection(request: GmailLoginRequest):
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(request.email, request.app_password)
        mail.logout()

        return {
            "success": True,
            "message": "Connected successfully"
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# =====================================================
# FETCH REAL EMAILS FROM GMAIL + PARSE
# =====================================================

@app.post("/emails/gmail-imap")
def get_gmail_imap(request: GmailLoginRequest):
    result = fetch_gmail_imap(
        gmail_address=request.email,
        app_password=request.app_password,
        max_emails=request.max_emails
    )

    if not result["success"]:
        return {
            "success": False,
            "error": result["error"]
        }

    parsed_emails = []

    for raw_email in result["emails"]:
        try:
            parsed = parse_email(raw_email)
            parsed_emails.append(parsed)
        except Exception as e:
            print("Email parsing failed:", e)

    return {
        "success": True,
        "emails": parsed_emails
    }


# =====================================================
# RANK SELECTED EMAILS
# =====================================================

@app.post("/rank")
def rank(request: RankRequest):
    try:
        student = {
            "cgpa": request.student.cgpa,
            "skills": request.student.skills,
            "preferred_types": request.student.preferred_types,
            "location_preference": request.student.location_preference,
            "financial_need": request.student.financial_need
        }

        ranked = rank_opportunities(
            student,
            request.selected_emails
        )

        return {
            "success": True,
            "total_opportunities": len(ranked),
            "all_ranked": ranked
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/generate-cover-letter")
def cover_letter(request: CoverLetterRequest):

    letter = generate_cover_letter(
        request.student,
        request.opportunity
    )

    return {
        "success": True,
        "cover_letter": letter
    }

# =====================================================
# PARSE RESUME
# =====================================================

@app.post("/parse-resume")
async def parse_resume_api(file: UploadFile = File(...)):

    upload_folder = "uploads"

    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:

        profile = parse_resume(file_path)

        return {
            "success": True,
            "profile": profile
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }

    finally:

        if os.path.exists(file_path):
            os.remove(file_path)