import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def force_non_opportunity(subject, body):
    text = (subject + " " + body).lower()
    non_opportunity_keywords = [
        "reminder", "webinar", "seminar", "announcement",
        "notice", "meeting", "event reminder",
        "newsletter", "otp", "verification",
        "security alert", "password reset",
        "promotion", "discount", "unsubscribe",
        "your order", "invoice", "receipt", "payment",
        "delivery", "shipped", "tracking"
    ]
    return any(kw in text for kw in non_opportunity_keywords)


def parse_email(email_data):
    subject = email_data.get("subject", "").strip()
    body = email_data.get("body", "").strip()
    email_id = email_data.get("id", 0)

    # Fast-path: clearly not an opportunity
    if force_non_opportunity(subject, body):
        return {
            "id": email_id,
            "title": subject,
            "subject": subject,
            "body": body,
            "type": "Other",
            "isOpportunity": False,
            "organization": "",
            "deadline": "",
            "eligibility": [],
            "required_documents": [],
            "benefits": [],
            "application_link": "",
            "contact_info": "",
            "location": "",
        }

    # Truncate body for prompt efficiency
    body_snippet = body[:2000] if len(body) > 2000 else body

    prompt = f"""You are an email classifier for a student opportunity tracker.

Analyze the following email and return ONLY a valid JSON object — no markdown, no explanation, no extra text.

Determine if this email is a student opportunity (internship, scholarship, fellowship, competition, exchange program, research assistant, ambassador program, programming contest, admission, volunteer program). If it is NOT an opportunity, set isOpportunity to false.

JSON schema to return:
{{
  "id": {email_id},
  "title": <string: email subject or short descriptive title>,
  "type": <string: one of Internship/Scholarship/Fellowship/Competition/Exchange Program/Research Assistant/Ambassador Program/Programming Contest/Admission/Volunteer/Other>,
  "organization": <string: name of the sending organization or company>,
  "deadline": <string: application deadline in format "DD Month YYYY" e.g. "15 July 2025", or "" if not found>,
  "eligibility": <array of strings: CGPA requirements, skills needed, year of study, etc.>,
  "required_documents": <array of strings: e.g. ["CV", "Transcript", "Cover Letter"]>,
  "benefits": <array of strings: e.g. ["Stipend", "Certificate", "Mentorship"]>,
  "application_link": <string: URL to apply, or "">,
  "contact_info": <string: contact email or phone, or "">,
  "location": <string: city/country or "Remote", or "">,
  "isOpportunity": <boolean: true only if this is a real student opportunity>
}}

Subject: {subject}

Body:
{body_snippet}

Return ONLY the JSON object."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=800
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if model adds them anyway
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        parsed = json.loads(raw)

        # Ensure required fields are always present
        parsed["id"] = email_id
        parsed["subject"] = subject
        parsed["body"] = body
        parsed.setdefault("title", subject)
        parsed.setdefault("isOpportunity", False)
        parsed.setdefault("type", "Other")
        parsed.setdefault("organization", "")
        parsed.setdefault("deadline", "")
        parsed.setdefault("eligibility", [])
        parsed.setdefault("required_documents", [])
        parsed.setdefault("benefits", [])
        parsed.setdefault("application_link", "")
        parsed.setdefault("contact_info", "")
        parsed.setdefault("location", "")

        return parsed

    except json.JSONDecodeError as e:
        print(f"JSON parse error for email {email_id}: {e}")
        print(f"Raw response was: {raw[:300]}")
    except Exception as e:
        print(f"Error parsing email {email_id}: {e}")

    # Fallback
    return {
        "id": email_id,
        "title": subject,
        "subject": subject,
        "body": body,
        "type": "Other",
        "isOpportunity": False,
        "organization": "",
        "deadline": "",
        "eligibility": [],
        "required_documents": [],
        "benefits": [],
        "application_link": "",
        "contact_info": "",
        "location": "",
    }