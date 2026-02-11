import os
import json
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv
from typing import Dict, List, Any

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

def get_gemini_json(prompt: str) -> Dict[str, Any]:
    """Helper to get JSON from Gemini"""
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt + "\n\nIMPORTANT: Return ONLY valid JSON. Do not use markdown code blocks.")
    try:
        # Clean up response if it contains markdown code blocks
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Gemini JSON Parse Error: {e}")
        # Fallback empty structure or re-raise
        return {}

def get_gemini_text(prompt: str) -> str:
    """Helper to get text from Gemini"""
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    return response.text.strip()


async def generate_summary(transcript: str) -> Dict[str, any]:
    """
    Generate summary and key points from transcript using GPT or Gemini
    """
    prompt = f"""You are an AI assistant that analyzes meeting transcripts.

Given the following meeting transcript, provide:
1. A concise summary (2-3 sentences)
2. Key points discussed (as a list)

Transcript:
{transcript}

Respond in JSON format:
{{
  "summary": "Brief summary here",
  "key_points": ["Point 1", "Point 2", "Point 3"]
}}
"""

    try:
        if PROVIDER == "openai":
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that analyzes meeting transcripts and returns structured JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        else:
            return get_gemini_json(prompt)

    except Exception as e:
        raise Exception(f"{PROVIDER} summarization failed: {str(e)}")


async def extract_tasks(transcript: str) -> List[Dict[str, str]]:
    """
    Extract action items and tasks from transcript using GPT or Gemini
    """
    prompt = f"""You are an AI assistant that extracts action items from meeting transcripts.

Given the following meeting transcript, extract all action items and tasks mentioned.

For each task, provide:
1. task: Description of the task
2. deadline: Date in YYYY-MM-DD format (if mentioned, otherwise null)

Transcript:
{transcript}

Respond in JSON format:
{{
  "tasks": [
    {{"task": "Task description", "deadline": "2026-02-14"}},
    {{"task": "Another task", "deadline": null}}
  ]
}}

If no tasks are found, return an empty tasks array.
"""

    try:
        if PROVIDER == "openai":
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that extracts tasks from meeting transcripts and returns structured JSON with ISO date format."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content).get("tasks", [])
        else:
            result = get_gemini_json(prompt)
            return result.get("tasks", [])

    except Exception as e:
        raise Exception(f"{PROVIDER} task extraction failed: {str(e)}")


async def detect_sentiment(transcript: str) -> str:
    """
    Detect the overall tone of the meeting transcript
    """
    prompt = f"""
You are an AI meeting analyst.

Analyze the OVERALL tone of this meeting transcript and classify it into EXACTLY ONE word from the list below:

Positive
Neutral
Tense
Urgent

Definitions:
- Positive → calm, productive, optimistic discussion
- Neutral → normal informational or balanced discussion
- Tense → disagreement, conflict, stress, pressure, frustration
- Urgent → deadlines, critical issues, time-sensitive actions

Rules:
- Return ONLY one word from the list
- No explanation
- No punctuation
- No extra text

Transcript:
{transcript}
"""

    try:
        sentiment = ""
        if PROVIDER == "openai":
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0
            )
            sentiment = response.choices[0].message.content.strip()
        else:
            sentiment = get_gemini_text(prompt)

        if sentiment not in ["Positive", "Neutral", "Tense", "Urgent"]:
            return "Neutral"
        return sentiment

    except Exception:
        return "Neutral"


async def process_voice_command(command: str, transcript: str) -> str:
    """
    Process voice command using stored transcript context
    """
    prompt = f"""You are an AI assistant helping a user interact with their meeting notes.

Meeting Transcript:
{transcript}

User Command: {command}

Provide a helpful, concise response to the user's command based on the meeting transcript.
"""

    try:
        if PROVIDER == "openai":
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that answers questions about meeting transcripts."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        else:
            return get_gemini_text(prompt)

    except Exception as e:
        raise Exception(f"{PROVIDER} voice command processing failed: {str(e)}")


async def detect_language(transcript: str) -> str:
    """
    Detect the primary language of the meeting transcript
    """
    prompt = f"""
Detect the primary language of the following meeting transcript.

Return ONLY the language name in English (for example: English, Hindi, Marathi, French, etc.).
No extra text.

Transcript:
{transcript}
"""

    try:
        if PROVIDER == "openai":
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0
            )
            return response.choices[0].message.content.strip()
        else:
            return get_gemini_text(prompt)

    except Exception:
        return "Unknown"


async def translate_text(text: str, target_language: str) -> str:
    """
    Translate text into a target language
    """
    prompt = f"""
Translate the following text into {target_language}.
Keep meaning accurate and natural.
Return only translated text.

Text:
{text}
"""

    try:
        if PROVIDER == "openai":
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0
            )
            return response.choices[0].message.content.strip()
        else:
            return get_gemini_text(prompt)

    except Exception as e:
         raise Exception(f"Translation failed: {str(e)}")
