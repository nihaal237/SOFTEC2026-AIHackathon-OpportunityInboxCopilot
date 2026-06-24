from datetime import datetime


def extract_min_cgpa(eligibility_list):
    for item in eligibility_list:
        if "cgpa" in item.lower():
            for word in item.replace(":", " ").split():
                try:
                    return float(word)
                except:
                    pass
    return None


def get_matched_skills(student_skills, eligibility_list):
    matched = []

    for skill in student_skills:
        for item in eligibility_list:
            if skill.lower() in item.lower():
                matched.append(skill)

    return list(set(matched))


def calculate_deadline(deadline):
    score = 0
    urgency = "unknown"

    if not deadline:
        return score, urgency

    try:
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
        pass

    return score, urgency


def generate_checklist(opportunity):
    checklist = []

    for doc in opportunity.get("required_documents", []):
        checklist.append(f"Prepare {doc}")

    if opportunity.get("application_link"):
        checklist.append("Open application link and apply")

    if opportunity.get("deadline"):
        checklist.append(
            f"Submit before {opportunity['deadline']}"
        )

    if not checklist:
        checklist.append("Review details carefully")

    return checklist


def get_priority_label(score):
    if score >= 60:
        return "🔥 Apply Now"
    elif score >= 30:
        return "⏳ Apply Soon"
    else:
        return "❌ Not Suitable"


def calculate_score(student, opportunity):
    score = 0
    reasons = []
    warnings = []

    opportunity_type = opportunity.get("type", "")
    eligibility = opportunity.get("eligibility", [])
    deadline = opportunity.get("deadline", "")
    location = opportunity.get("location", "")

    if opportunity_type.lower() in [
        x.lower() for x in student["preferred_types"]
    ]:
        score += 30
        reasons.append("Matches preferred type")

    min_cgpa = extract_min_cgpa(eligibility)

    if min_cgpa:
        if student["cgpa"] >= min_cgpa:
            score += 20
            reasons.append("CGPA requirement met")
        else:
            score -= 20
            warnings.append("CGPA requirement not met")

    matched_skills = get_matched_skills(
        student["skills"],
        eligibility
    )

    if matched_skills:
        score += len(matched_skills) * 8
        reasons.append(
            "Matched skills: " + ", ".join(matched_skills)
        )

    deadline_score, urgency = calculate_deadline(deadline)
    score += deadline_score

    if student["location_preference"] and location:
        if student["location_preference"].lower() in location.lower():
            score += 10
            reasons.append("Location match")

    if student["financial_need"] and opportunity_type.lower() == "scholarship":
        score += 15
        reasons.append("Financial support match")

    return {
        "score": score,
        "reasons": reasons,
        "warnings": warnings,
        "urgency": urgency
    }


def rank_opportunities(student, emails):
    results = []

    for email in emails:
        if not email.get("isOpportunity", False):
            continue

        score_data = calculate_score(student, email)

        results.append({
            "title": email.get("title", ""),
            "type": email.get("type", ""),
            "deadline": email.get("deadline", ""),
            "application_link": email.get("application_link", ""),
            "score": score_data["score"],
            "urgency": score_data["urgency"],
            "reasons": score_data["reasons"],
            "warnings": score_data["warnings"],
            "priority": get_priority_label(score_data["score"]),
            "checklist": generate_checklist(email)
        })

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results