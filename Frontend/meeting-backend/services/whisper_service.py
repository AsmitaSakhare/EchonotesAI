import os
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Get API Key
API_KEY = os.getenv("OPENAI_API_KEY")

# Determine Provider based on Key Format
PROVIDER = "openai" if API_KEY and API_KEY.startswith("sk-") else "gemini"

# Initialize Client
client = None
if PROVIDER == "openai":
    client = OpenAI(api_key=API_KEY)
else:
    genai.configure(api_key=API_KEY)


async def transcribe_audio(audio_file_path: str) -> str:
    """
    Transcribe audio file using OpenAI Whisper or Gemini 1.5 Flash
    
    Args:
        audio_file_path: Path to the audio file
        
    Returns:
        Transcribed text from the audio
    """
    try:
        if PROVIDER == "openai":
            with open(audio_file_path, "rb") as audio_file:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="text"
                )
            return transcript
        else:
            # Gemini Audio Transcription
            # 1. Upload the file
            myfile = genai.upload_file(audio_file_path)
            
            # 2. Generate content (Transcribe)
            model = genai.GenerativeModel("gemini-1.5-flash")
            result = model.generate_content(
                [myfile, "Transcribe this audio file verbatim."]
            )
            
            # 3. Cleanup (optional but good practice)
            # Note: genai.delete_file(myfile.name) is not yet fully standard in all SDK versions, 
            # but usually files expire. We'll leave it simple for now.
            
            return result.text

    except Exception as e:
        raise Exception(f"{PROVIDER} transcription failed: {str(e)}")
