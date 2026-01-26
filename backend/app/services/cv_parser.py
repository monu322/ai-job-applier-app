from openai import OpenAI
from app.config import settings
import PyPDF2
import docx
import io
import json


class CVParserService:
    """Service for parsing CV files using OpenAI"""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            return text
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            doc_file = io.BytesIO(file_content)
            doc = docx.Document(doc_file)
            
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            raise ValueError(f"Failed to extract text from DOCX: {str(e)}")
    
    async def parse_cv_with_openai(self, cv_text: str) -> dict:
        """
        Parse CV text using OpenAI GPT to extract comprehensive structured information
        """
        try:
            prompt = f"""
You are an expert CV/Resume parser. Extract the following information from the CV text provided below and return it as a JSON object with these exact keys:

- name: Full name of the candidate
- title: Professional title/role (e.g., "Senior Software Engineer")
- email: Email address
- phone: Phone number
- experience: Years of experience (e.g., "5+ years", "3-5 years")
- experience_level: One of: 'Entry', 'Mid-Level', 'Senior', 'Lead', 'Executive'
- education: Highest degree and institution
- skills: Array of technical skills (limit to top 10-15 most relevant)
- roles: Array of job roles/titles the candidate should search for (e.g., ["Software Engineer", "Full Stack Developer", "Backend Engineer"])
- job_search_location: Preferred job search location (city/country or "Remote" if mentioned, e.g., "London, UK", "Remote", "San Francisco, CA")
- location: Current location (city and country if available). If not explicitly mentioned in the CV, try to infer from the phone number's country code (e.g., +44 = UK, +1 = USA/Canada, +91 = India, +61 = Australia, etc.). If location cannot be determined from either CV text or phone number, use null.
- summary: Professional summary (2-3 sentences describing the candidate's expertise and career highlights)
- work_history: Array of objects with keys: company, position, duration, description, achievements (array of strings), start_date (YYYY-MM format), end_date (YYYY-MM format or "Present"), skills (array of relevant skills for that role). IMPORTANT: Include ALL work experiences from the CV, not just recent ones. For each role, carefully extract ONLY the achievements that are specifically mentioned for that particular position/company.
- salary_min: Estimated minimum salary in USD (based on experience and skills)
- salary_max: Estimated maximum salary in USD
- gender: Inferred gender based on the candidate's name (use "male", "female", or null if uncertain)
- areas_of_improvement: Array of 3-5 actionable improvement suggestions for the CV. Each item should be an object with keys: "title" (short heading like "Add Quantifiable Achievements") and "description" (1-2 sentences explaining the improvement and why it matters)

If any field is not found in the CV, use null for that field. 
For work_history: 
  - Include ALL work experiences from the CV (not just 3-4 most recent)
  - For each position, carefully match achievements to the specific role by looking at bullet points under each job
  - Only include achievements explicitly stated for that role to avoid mixing up accomplishments between different positions
  - Extract 2-4 key accomplishments per role if available
For roles, suggest 3-5 relevant job titles that match the candidate's experience and skills.
For job_search_location, look for location preferences, current location, or infer from work history if explicitly mentioned.
For gender, infer from the first name using common naming patterns. Only use "male" or "female" if you're reasonably confident, otherwise use null.
For areas_of_improvement, analyze the CV for missing elements, weak areas, or opportunities to strengthen the profile. Focus on actionable suggestions like: adding metrics/numbers, highlighting leadership, improving summary, adding certifications, showcasing projects, or better skill presentation.

CV Text:
{cv_text}

Return ONLY the JSON object, no additional text or explanation.
"""
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional CV parser that extracts structured data from resumes."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            # Parse JSON from response
            content = response.choices[0].message.content.strip()
            
            # Remove markdown code blocks if present
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()
            
            parsed_data = json.loads(content)
            
            # Validate required fields
            if not parsed_data.get("name") or not parsed_data.get("title"):
                raise ValueError("Failed to extract required fields (name, title)")
            
            return parsed_data
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse OpenAI response as JSON: {str(e)}")
        except Exception as e:
            raise ValueError(f"OpenAI parsing error: {str(e)}")


# Singleton instance
cv_parser = CVParserService()
