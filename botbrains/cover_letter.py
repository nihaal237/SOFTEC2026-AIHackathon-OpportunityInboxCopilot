import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_cover_letter(student, opportunity):

    prompt = f"""
You are an expert career coach and professional HR recruiter.

Your task is to generate a HIGH-QUALITY, PERSONALIZED cover letter.

=========================
STUDENT PROFILE
=========================

Name: {student.get("name", "")}
Degree: {student.get("degree", "")}
University: {student.get("university", "")}
CGPA: {student.get("cgpa", "")}
Skills: {student.get("skills", [])}
Projects: {student.get("projects", "")}

=========================
OPPORTUNITY DETAILS
=========================

Title: {opportunity.get("title", "")}
Organization: {opportunity.get("organization", "")}
Type: {opportunity.get("type", "")}
Deadline: {opportunity.get("deadline", "")}
Location: {opportunity.get("location", "")}
Eligibility: {opportunity.get("eligibility", [])}
Description:
{opportunity.get("body", "")}

=========================
INSTRUCTIONS
=========================

1. Return ONLY the cover letter.
2. DO NOT use placeholders like [Your Name], [Date], or [Address].
3. Start with "Dear Hiring Manager," unless a person's name is available.
4. If the organization name is available, mention it naturally.
5. Personalize the letter using the student's:
   - degree
   - university
   - CGPA
   - skills
   - projects
6. Explain why the student is a strong fit for THIS opportunity.
7. Mention relevant skills only if they match the opportunity.
8. Keep the tone professional and enthusiastic.
9. Length should be around 250–350 words.
10. End with:

Sincerely,

{student.get("name", "")}

Do not invent information that is not provided.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4,
        max_tokens=800,
    )

    return response.choices[0].message.content.strip()