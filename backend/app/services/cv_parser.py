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
        Parse CV text using OpenAI GPT-4 to extract structured information
        """
        try:
            prompt = f"""
            You are an expert CV/Resume parser. Extract the following information from the CV text below and return it as a JSON object.
            
            Extract:
            - name: Full name of the person
            - title: Current job title or desired position
            - location: City and country (if available)
            - experience_level: One of: 'Entry', 'Mid-Level', 'Senior', 'Lead', 'Executive'
            - skills: Array of technical and soft skills (max 8 most important)
            - salary_min: Estimated minimum salary in USD (based on experience and skills)
            - salary_max: Estimated maximum salary in USD
            
            CV Text:
            {cv_text}
            
            Return ONLY valid JSON in this exact format:
            {{
                "name": "string",
                "title": "string",
                "location": "string or null",
                "experience_level": "string",
                "skills": ["skill1", "skill2", ...],
                "salary_min": number,
                "salary_max": number
            }}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional CV parser that extracts structured data from resumes."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            # Parse JSON from response
            result_text = response.choices[0].message.content.strip()
            
            # Remove markdown code blocks if present
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
            
            parsed_data = json.loads(result_text.strip())
            
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
