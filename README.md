# EchoNotes AI - Intelligent Meeting Assistant

**EchoNotes AI** is a privacy-first, local meeting assistant designed to transform how you capture, process, and interact with your meeting content. It leverages advanced AI (OpenAI GPT-4o & Whisper) to provide accurate transcriptions, intelligent summaries, deep sentiment analysis, real-time language translation, and actionable task management.

---

### 🎓 Capstone Project Details
This project is the Capstone Project for **VIT Bhopal University**, developed by **Group Number 41** under the supervision of **Dr. Virendra Singh Khushwah**.

**Team Members:**
- **Asmita Sakhare** (22BSA10007)
- **Nihalika Kumari** (22BSA10033)
- **Vedika Vivek Gangil** (22BSA10001)
- **Mehul Kumar** (22BSA10317)
- **Sumit Kumar** (22BSA10024)

---

## 🚀 Key Features

### 🎙️ Smart Recording & Transcription
- **Dual Source Recording**: Capture high-fidelity audio from your **Microphone** (in-person) or **System Audio** (virtual meetings).
- **Whisper Integration**: Uses OpenAI's Whisper model for state-of-the-art speech-to-text accuracy.
- **Real-Time Visuals**: Live audio visualization and recording status indicators.

### 🧠 AI-Powered Analysis
- **Intelligent Summarization**: Automatically generates concise summaries capturing the essence of discussions.
- **Key Points Extraction**: Identifies critical bullet points and key takeaways.
- **Sentiment Analysis**: Detects the emotional tone of meetings (Positive, Neutral, Tense, Urgent).

### 🌍 Language & Translation
- **Auto-Language Detection**: Automatically identifies the primary language spoken.
- **Instant Translation**: Translate summaries into multiple languages (English, Hindi, Marathi, French, Spanish) on demand.

### ✅ Smart Task Management
- **Automated Extraction**: Detects promises and deadlines mentioned in conversation.
- **Unified Dashboard**: Manage tasks across all meetings with deadline tracking (Due Soon, Overdue).
- **Interactive Management**: Mark tasks as completed directly from the dashboard.

### 🗣️ Voice Command System
- **Interactive Q&A**: Ask questions about your notes using your voice (e.g., *"What were the action items?"*).
- **Audio Responses**: The AI analyzes the transcript and answers you verbally.

### 📤 Export & Organization
- **Note Library**: Searchable grid view of all past meetings.
- **One-Click Export**: Download comprehensive text files including metadata, summaries, and transcripts.

---

## 🛠️ Technical Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, Shadcn UI.
- **Backend**: Python 3.10+, FastAPI, SQLite, Pydantic.
- **AI Services**: OpenAI API (GPT-4o, Whisper-1).
- **Database**: SQLite (Local storage for privacy).

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: v18 or higher
- **Python**: v3.10 or higher
- **OpenAI API Key**: Required for transcription and analysis features.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/echonotes-ai.git
cd echonotes-ai/Frontend
```
*(Note: If you downloaded the project directly, navigate to the `Frontend` folder where `package.json` resides.)*

### 2. Backend Setup
The backend handles audio processing, database management, and AI interactions.

```bash
# Navigate to backend directory
cd meeting-backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configuration**:
Create a `.env` file in the `meeting-backend` directory with your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

start the backend server: (It runs on http://localhost:8000)
```bash
python main.py
```

### 3. Frontend Setup
The frontend provides the user interface and interacts with the backend.

```bash
# Open a new terminal and navigate to the Frontend root
cd .. 

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit **http://localhost:3000** in your browser to start using EchoNotes AI.

---

## 📖 Usage Guide

1.  **Record a Meeting**:
    *   Click the **Microphone** card to start recording.
    *   Select your source (Mic or System Audio).
    *   Click the big red button to begin.
    *   Click Stop when finished.
2.  **Process Audio**:
    *   Click "Process Recording" to transcribe and analyze.
    *   Wait for the AI to generate the summary, tasks, and sentiment.
3.  ** Interact with Results**:
    *   **Translation**: Select a language from the dropdown in the summary card and click the translate icon.
    *   **Voice Q&A**: Click "Ask a Question" in the Voice Command panel to query your notes.
    *   **Tasks**: View extracted action items in the Task List.
4.  **Manage History**:
    *   Go to "View Notes" to see past meetings.
    *   Go to "Tasks Dashboard" for a unified view of all pending tasks.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

