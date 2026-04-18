# main.py

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber
import os
import json

from scoring_engine import rank_opportunities
from parser import parse_email

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

class RankRequest(BaseModel):
    student_id: str
    selected_email_ids: list


class EmailInput(BaseModel):
    raw_emails: str


# =====================================================
# LOAD FILES
# =====================================================

def load_students():
    with open("students.json", "r", encoding="utf-8") as f:
        return json.load(f)


def load_emails():
    with open("parsed_emails.json", "r", encoding="utf-8") as f:
        return json.load(f)


def load_raw_emails():
    try:
        with open("email.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []


def load_parsed_emails():
    try:
        with open("parsed_emails.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "message": "Opportunity Inbox Copilot API Running 🚀"
    }


# =====================================================
# GET STUDENTS
# =====================================================

@app.get("/students")
def get_students():
    return load_students()


# =====================================================
# GET EMAILS
# =====================================================

@app.get("/emails")
def get_emails():
    return load_emails()


# =====================================================
# RANK OPPORTUNITIES
# =====================================================

@app.post("/rank")
def rank(request: RankRequest):
    students = load_students()
    emails = load_emails()

    # ---------- Find Student ----------
    student = next(
        (s for s in students if s["id"] == request.student_id),
        None
    )

    if not student:
        return {
            "error": "Student not found"
        }

    # ---------- Filter Selected Emails ----------
    selected_emails = [
        email for email in emails
        if email["id"] in request.selected_email_ids
    ]

    ranked = rank_opportunities(student, selected_emails)

    return {
        "student": student,
        "total_opportunities": len(ranked),
        "buckets": {
            "apply_now": [
                r for r in ranked
                if r["priority"] == "🔥 Apply Now"
            ],
            "apply_soon": [
                r for r in ranked
                if r["priority"] == "⏳ Apply Soon"
            ],
            "not_suitable": [
                r for r in ranked
                if r["priority"] == "❌ Not Suitable"
            ]
        },
        "all_ranked": ranked
    }


# =====================================================
# TEXT PASTE EMAILS + AUTO PARSE
# =====================================================

@app.post("/parse-pasted-emails")
def parse_pasted_emails(data: EmailInput):
    raw_text = data.raw_emails.strip()

    if not raw_text:
        return {
            "success": False,
            "message": "No emails provided"
        }

    old_emails = load_raw_emails()

    if old_emails:
        next_id = max(email["id"] for email in old_emails) + 1
    else:
        next_id = 1

    separated_emails = raw_text.split("###")
    new_emails = []

    for item in separated_emails:
        item = item.strip()

        if not item:
            continue

        lines = item.split("\n")

        subject = ""
        body = ""

        for line in lines:
            line = line.strip()

            if line.startswith("Subject:"):
                subject = line.replace("Subject:", "").strip()

            elif line.startswith("Body:"):
                body = line.replace("Body:", "").strip()

            else:
                if body:
                    body += "\n" + line

        if not subject:
            subject = "Untitled Email"

        new_emails.append({
            "id": next_id,
            "subject": subject,
            "body": body
        })

        next_id += 1

    # Save raw emails
    all_emails = old_emails + new_emails

    with open("email.json", "w", encoding="utf-8") as f:
        json.dump(
            all_emails,
            f,
            indent=4,
            ensure_ascii=False
        )

    # Auto parse only new emails
    old_parsed = load_parsed_emails()
    new_parsed = []

    for email in new_emails:
        print(f"Parsing New Email ID: {email['id']}")
        parsed_data = parse_email(email)
        new_parsed.append(parsed_data)

    all_parsed = old_parsed + new_parsed

    with open("parsed_emails.json", "w", encoding="utf-8") as f:
        json.dump(
            all_parsed,
            f,
            indent=4,
            ensure_ascii=False
        )

    return {
        "success": True,
        "new_emails_added": len(new_emails),
        "total_emails_now": len(all_emails),
        "message": "Emails added and parsed successfully"
    }


# =====================================================
# PDF UPLOAD + AUTO PARSE
# =====================================================

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        # -----------------------------------
        # Save uploaded PDF temporarily
        # -----------------------------------

        temp_path = file.filename

        with open(temp_path, "wb") as buffer:
            buffer.write(await file.read())

        # -----------------------------------
        # Extract text from PDF
        # -----------------------------------

        extracted_text = ""

        with pdfplumber.open(temp_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()

                if text:
                    extracted_text += text + "\n"

        # -----------------------------------
        # Extract Subject + Body
        # -----------------------------------

        subject = "Untitled Email"
        body = extracted_text.strip()

        lines = extracted_text.split("\n")

        for line in lines:
            if line.lower().startswith("subject:"):
                subject = line.replace("Subject:", "").strip()

        # -----------------------------------
        # Load old emails
        # -----------------------------------

        old_emails = load_raw_emails()

        if old_emails:
            next_id = max(email["id"] for email in old_emails) + 1
        else:
            next_id = 1

        # -----------------------------------
        # Create new email
        # -----------------------------------

        new_email = {
            "id": next_id,
            "subject": subject,
            "body": body
        }

        # Append to old emails
        old_emails.append(new_email)

        with open("email.json", "w", encoding="utf-8") as f:
            json.dump(
                old_emails,
                f,
                indent=4,
                ensure_ascii=False
            )

        # -----------------------------------
        # Auto parse
        # -----------------------------------

        parsed_email = parse_email(new_email)

        old_parsed = load_parsed_emails()
        old_parsed.append(parsed_email)

        with open("parsed_emails.json", "w", encoding="utf-8") as f:
            json.dump(
                old_parsed,
                f,
                indent=4,
                ensure_ascii=False
            )

        # Delete temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        return {
            "success": True,
            "message": "PDF uploaded and parsed successfully",
            "email": parsed_email
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }