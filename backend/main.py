from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv
import PyPDF2
import io

load_dotenv()

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI APIs
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
hf_client = InferenceClient(token=os.getenv("HUGGINGFACE_API_KEY"))

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # Read resume content
        contents = await resume.read()
        
        # Extract text from PDF
        if resume.filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
            resume_text = ""
            for page in pdf_reader.pages:
                resume_text += page.extract_text()
        else:
            resume_text = contents.decode()

        # Analyze with Gemini
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""
        Analyze this resume against the job description and provide:
        1. Keyword matches found
        2. Missing important keywords
        3. Match percentage
        4. Specific suggestions for improvement

        Resume:
        {resume_text}

        Job Description:
        {job_description}
        """
        
        response = model.generate_content(prompt)
        
        # Process and structure the response
        # This is a simple example - you'll want to parse the response more carefully
        return {
            "match_score": 75,  # Example score
            "keywords_found": ["Python", "React", "API"],
            "missing_keywords": ["Docker", "AWS"],
            "suggestions": [
                "Add more details about Python projects",
                "Include AWS experience if any",
                "Quantify achievements with metrics"
            ]
        }
        
    except Exception as e:
        return {"error": str(e)}