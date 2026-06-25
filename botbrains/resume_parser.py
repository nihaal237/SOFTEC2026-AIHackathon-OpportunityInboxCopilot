import os
import json
import fitz
from docx import Document
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_pdf_text(file_path):
    text = ""

    pdf = fitz.open(file_path)

    for page in pdf:
        text += page.get_text()

    pdf.close()

    return text


def extract_docx_text(file_path):
    doc = Document(file_path)

    text = ""

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text


def extract_json(text):

    text = text.strip()

    if "```json" in text:
        text = text.split("```json")[1]

    if "```" in text:
        text = text.split("```")[0]

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise Exception("No JSON found in AI response.")

    return text[start:end + 1]


def parse_resume(file_path):

    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        resume_text = extract_pdf_text(file_path)

    elif extension == ".docx":
        resume_text = extract_docx_text(file_path)

    else:
        raise Exception("Only PDF and DOCX are supported.")

    prompt = f"""
You are an expert AI Resume Parser.

Extract the information from this resume.

Return ONLY VALID JSON.

Do not explain anything.

Do not use markdown.

Do not write ```json.

Return EXACTLY this schema.

{{
"name":"",
"email":"",
"phone":"",
"degree":"",
"university":"",
"cgpa":"",
"skills":[],
"projects":[],
"experience":[],
"certifications":[],
"linkedin":"",
"github":"",
"portfolio":""
}}

Resume:

{resume_text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0,
        max_tokens=2000
    )

    result = response.choices[0].message.content

    print("\n========== RAW RESPONSE ==========\n")
    print(result)
    print("\n==================================\n")

    json_text = extract_json(result)

    try:
        return json.loads(json_text)

    except Exception as e:

        print("\n========== JSON TEXT ==========\n")
        print(json_text)
        print("\n===============================\n")

        raise Exception(f"JSON Parse Error: {e}")