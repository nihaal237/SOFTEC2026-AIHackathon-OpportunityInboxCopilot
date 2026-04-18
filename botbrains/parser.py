# parser.py

import json
from groq import Groq

# =====================================================
# STEP 1: GROQ API KEY
# =====================================================

client = Groq(
    api_key=""
)

# Example:
# api_key="gsk_xxxxxxxxxxxxxxxxxxxxxxxxx"


# =====================================================
# RULE-BASED SAFETY CHECK
# =====================================================

def force_non_opportunity(subject, body):
    text = (subject + " " + body).lower()

    non_opportunity_keywords = [
        "reminder",
        "webinar",
        "seminar",
        "announcement",
        "notice",
        "meeting",
        "event reminder",
        "optional attendance",
        "attendance optional",
        "newsletter",
        "greetings",
        "fyi",
        "for your information",
        "general notice",
        "session tomorrow",
        "workshop reminder"
    ]

    for keyword in non_opportunity_keywords:
        if keyword in text:
            return True

    return False


# =====================================================
# STEP 2: PARSE SINGLE EMAIL
# =====================================================

def parse_email(email):
    subject = email.get("subject", "").strip()
    body = email.get("body", "").strip()

    prompt = f"""
You are an AI email parser.

Analyze this email and return ONLY valid JSON.

Return the opportunity type using ONLY one of these exact values:

[
  "Internship",
  "Scholarship",
  "Competition",
  "Fellowship",
  "Exchange Program",
  "Research Assistant",
  "Volunteer",
  "Ambassador Program",
  "Programming Contest",
  "Admission",
  "Other"
]

VERY IMPORTANT:

Set "isOpportunity": true ONLY if the email is a REAL
application-based opportunity such as:

- Internship
- Scholarship
- Fellowship
- Competition
- Research Assistant
- Exchange Program
- Admission
- Ambassador Program
- Volunteer Program
- Programming Contest

Do NOT mark as opportunity for:

- reminders
- webinars
- seminars
- announcements
- greetings
- newsletters
- optional events
- attendance notices
- FYI emails
- informational emails

For these, set:

"isOpportunity": false
"type": "Other"

Also:
- Use email subject as title if needed
- NEVER leave title empty
- Do NOT create custom type names

Return ONLY this JSON format:

{{
  "id": {email["id"]},
  "title": "{subject}",
  "type": "",
  "organization": "",
  "deadline": "",
  "eligibility": [],
  "required_documents": [],
  "benefits": [],
  "application_link": "",
  "contact_info": "",
  "location": "",
  "isOpportunity": true
}}

Rules:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text
- Use subject as fallback title

Subject:
{subject}

Email Body:
{body}
"""

    try:
        # =================================================
        # USE SMALLER MODEL
        # =================================================

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        result = response.choices[0].message.content.strip()

        cleaned_text = (
            result
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        parsed_result = json.loads(cleaned_text)

        # =================================================
        # SAFETY FIXES
        # =================================================

        parsed_result["id"] = email["id"]
        parsed_result["subject"] = subject
        parsed_result["body"] = body

        # ---------- Title fallback ----------

        if not parsed_result.get("title"):
            parsed_result["title"] = subject

        # ---------- Type fallback ----------

        if not parsed_result.get("type"):
            parsed_result["type"] = "Other"

        # ---------- Opportunity fallback ----------

        if "isOpportunity" not in parsed_result:
            parsed_result["isOpportunity"] = False

        # =================================================
        # STRONG RULE-BASED OVERRIDE
        # =================================================

        if force_non_opportunity(subject, body):
            parsed_result["isOpportunity"] = False
            parsed_result["type"] = "Other"

        return parsed_result

    except Exception as e:
        print(
            f"Error parsing Email ID {email['id']}: {str(e)}"
        )

        # =================================================
        # SAFE FALLBACK IF API FAILS
        # =================================================

        return {
            "id": email["id"],
            "title": subject,
            "subject": subject,
            "body": body,
            "type": "Other",
            "organization": "",
            "deadline": "",
            "eligibility": [],
            "required_documents": [],
            "benefits": [],
            "application_link": "",
            "contact_info": "",
            "location": "",
            "isOpportunity": False,
            "error": str(e)
        }


# =====================================================
# RUN ONLY IF DIRECTLY EXECUTED
# =====================================================

if __name__ == "__main__":

    with open(
        "email.json",
        "r",
        encoding="utf-8"
    ) as file:
        emails = json.load(file)

    parsed_emails = []

    for email in emails:
        print(
            f"Parsing Email ID: {email['id']}"
        )

        parsed_data = parse_email(email)
        parsed_emails.append(parsed_data)

    with open(
        "parsed_emails.json",
        "w",
        encoding="utf-8"
    ) as file:
        json.dump(
            parsed_emails,
            file,
            indent=4,
            ensure_ascii=False
        )

    print("\nParsing completed successfully!")
    print("Saved to parsed_emails.json")