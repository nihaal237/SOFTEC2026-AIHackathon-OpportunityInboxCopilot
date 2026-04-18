# scoring_engine.py

import json
from datetime import datetime


# ---------------- LOAD DATA ----------------

def load_students(file_path="students.json"):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_emails(file_path="parsed_emails.json"):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


# ---------------- EXTRACT MIN CGPA ----------------

def extract_min_cgpa(eligibility_list):
    for item in eligibility_list:
        item_lower = item.lower()

        if "cgpa" in item_lower:
            words = item.replace(":", " ").split()

            for word in words:
                try:
                    value = float(word)
                    return value
                except:
                    continue

    return None


# ---------------- SKILL MATCH ----------------

def get_matched_skills(student_skills, eligibility_list):
    matched = []

    for skill in student_skills:
        for item in eligibility_list:
            if skill.lower() in item.lower():
                matched.append(skill)

    return list(set(matched))


# ---------------- DEADLINE SCORE ----------------

def calculate_deadline(deadline):
    score = 0
    urgency = "unknown"

    if not deadline:
        return score, urgency

    try:
        # Example: 20 April 2026
        deadline_date = datetime.strptime(deadline, "%d %B %Y")
        today = datetime.today()

        days_left = (deadline_date - today).days

        if days_left <= 3:
            score = 25
            urgency = "high"

        elif days_left <= 7:
            score = 15
            urgency = "medium"

        elif days_left <= 14:
            score = 10
            urgency = "low"

        else:
            score = 5
            urgency = "low"

    except:
        urgency = "unknown"

    return score, urgency


# ---------------- SCORING FUNCTION ----------------

def calculate_score(student, opportunity):
    score = 0
    reasons = []
    warnings = []

    opportunity_type = opportunity.get("type", "")
    eligibility = opportunity.get("eligibility", [])
    required_documents = opportunity.get("required_documents", [])
    deadline = opportunity.get("deadline", "")
    location = opportunity.get("location", "")

    student_cgpa = student.get("cgpa", 0)
    student_skills = student.get("skills", [])
    preferred_types = student.get("preferred_types", [])
    preferred_location = student.get("location_preference", "")
    financial_need = student.get("financial_need", False)

    # ---------- TYPE MATCH ----------

    if opportunity_type.lower() in [x.lower() for x in preferred_types]:
        score += 30
        reasons.append("Matches your preferred opportunity type")

    # ---------- CGPA MATCH ----------

    min_cgpa = extract_min_cgpa(eligibility)

    if min_cgpa:
        if student_cgpa >= min_cgpa:
            score += 20
            reasons.append(f"CGPA requirement satisfied ({min_cgpa})")
        else:
            score -= 20
            warnings.append(f"CGPA requirement not met (Required: {min_cgpa})")

    # ---------- SKILLS MATCH ----------

    matched_skills = get_matched_skills(student_skills, eligibility)

    if matched_skills:
        skill_score = len(matched_skills) * 8
        score += skill_score
        reasons.append("Matched skills: " + ", ".join(matched_skills))

    # ---------- DEADLINE ----------

    deadline_score, urgency = calculate_deadline(deadline)
    score += deadline_score

    if urgency == "high":
        reasons.append("Very urgent deadline")

    elif urgency == "medium":
        reasons.append("Deadline approaching soon")

    # ---------- LOCATION MATCH ----------

    if preferred_location and location:
        if preferred_location.lower() in location.lower():
            score += 10
            reasons.append("Matches your preferred location")

    # ---------- FINANCIAL NEED ----------

    if financial_need and opportunity_type.lower() == "scholarship":
        score += 15
        reasons.append("Scholarship supports financial need")

    # ---------- DOCUMENTS ----------

    if required_documents:
        reasons.append(
            f"Requires {len(required_documents)} important document(s)"
        )

    return {
        "score": round(score, 2),
        "reasons": reasons,
        "warnings": warnings,
        "urgency": urgency
    }


# ---------------- CHECKLIST ----------------

def generate_checklist(opportunity):
    checklist = []

    docs = opportunity.get("required_documents", [])

    for doc in docs:
        checklist.append(f"Prepare {doc}")

    if opportunity.get("application_link"):
        checklist.append("Open application link and apply")

    if opportunity.get("deadline"):
        checklist.append(
            f"Submit before deadline: {opportunity['deadline']}"
        )

    if not checklist:
        checklist.append("Review opportunity details carefully")

    return checklist


# ---------------- PRIORITY LABEL ----------------

def get_priority_label(score):
    if score >= 60:
        return "🔥 Apply Now"

    elif score >= 30:
        return "⏳ Apply Soon"

    else:
        return "❌ Not Suitable"


# ---------------- RANKING FUNCTION ----------------

def rank_opportunities(student, emails):
    results = []

    for email in emails:

        if not email.get("isOpportunity", False):
            continue

        opportunity = email

        score_data = calculate_score(student, opportunity)

        result = {
    "title": opportunity.get("title", ""),
    "type": opportunity.get("type", ""),
    "deadline": opportunity.get("deadline", ""),
    "application_link": opportunity.get("application_link", ""),
    "required_documents": opportunity.get("required_documents", []),
    "benefits": opportunity.get("benefits", []),
    "eligibility": opportunity.get("eligibility", []),

    "score": score_data["score"],
    "urgency": score_data["urgency"],
    "reasons": score_data["reasons"],
    "warnings": score_data["warnings"],
    "fit_percentage": f"{score_data['score']}%",
    "priority": get_priority_label(score_data["score"]),
    "checklist": generate_checklist(opportunity)
}
        results.append(result)

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results


# ---------------- TEST RUN ----------------

if __name__ == "__main__":
    students = load_students()
    emails = load_emails()

    student = students[0]

    ranked = rank_opportunities(student, emails)

    print("\n===== TOP OPPORTUNITIES =====\n")

    for item in ranked:
        print("Title:", item["title"])
        print("Type:", item["type"])
        print("Score:", item["score"])
        print("Priority:", item["priority"])
        print("Urgency:", item["urgency"])
        print("Reasons:", item["reasons"])
        print("Warnings:", item["warnings"])
        print("Checklist:", item["checklist"])
        print("-" * 50)