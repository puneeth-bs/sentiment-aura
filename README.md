# Sentiment Aura — Real-Time Emotional Visualization

> A real-time voice-to-emotion visualizer that listens to your speech, transcribes it live, analyzes its sentiment, and visualizes your emotions through a glowing, dynamic *Perlin noise aura* on screen.

---

## ✨ Overview

**Sentiment Aura** connects your **voice**, **language**, and **emotion** in real time.  
It uses:

- 🎙️ **Deepgram** — real-time speech-to-text transcription  
- 🧠 **OpenAI API** — semantic sentiment analysis  
- 🌀 **p5.js** — dynamic particle-based emotional aura visualization  
- ⚙️ **FastAPI** — backend orchestration  
- ⚛️ **React** — interactive frontend UI  

---

## ⚙️ How to Run the Project Locally

This section explains how to install and run both the **backend (FastAPI)** and **frontend (React + p5.js)**.


### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/sentiment-aura.git
cd sentiment-aura
```

### 2. Setup and Run the Backend (FastAPI)

#### Create a Virtual Environment
```bash
cd server
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

#### 📦 Install Dependencies
```bash
pip install -r requirements.txt
```

#### ⚙️ Create .env File

Create a .env file inside the backend/ folder with the following content:
```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=your_openai_model
```

#### ▶️ Start the Backend Server
```bash
uvicorn main:app --reload
```
This will start your FastAPI server on http://localhost:8000

### 3. Setup and Run the Frontend (React)

#### 📦 Install Node Dependencies
```bash
cd client
npm install
```

#### ⚙️ Create .env File

Create a .env file inside the frontend/ folder with the following content:
```bash
REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key
REACT_APP_BACKEND_URL=http://localhost:8000
```

#### ▶️ Start the Frontend Server
```bash
npm start
```
This runs the app on http://localhost:3000

### 🔗 4. Verify Connection

Open http://localhost:3000

Click Start — you should see:

The “Listening…” pulse animation

Your voice transcribed into live text

The aura background reacting to your tone

When you stop speaking, the transcript is sent to the backend → analyzed → and aura color changes dynamically.


| Issue                        | Cause                            | Fix                                                |
| ---------------------------- | -------------------------------- | -------------------------------------------------- |
| ❌ `OPENAI_API_KEY not found` | `.env` missing                   | Add your API key in backend `.env`                 |
| ⚠️ `BACKEND_URL undefined`  | Missing frontend `.env` variable | Add `REACT_APP_BACKEND_URL=http://localhost:8000` |
| 💤 UI lag or freezes         | Too many rerenders               | Refresh or lower particle count in `AuraCanvas.js` |
| 🎤 Mic not working           | Browser permission denied        | Allow mic access in browser settings               |



## 🧩 Architecture Diagram

The system connects **speech**, **AI sentiment analysis**, and **visual art** in real time.  
Here’s how everything interacts:

                    ┌───────────────────────────┐
                    │         🎙️ User          │
                    │   Speaks through mic     │
                    └────────────┬──────────────┘
                                 │
                                 ▼
                   ┌─────────────────────────────┐
                   │     Deepgram JavaScript SDK │
                   │  (Streaming Speech-to-Text) │
                   └────────────┬────────────────┘
                                 │  Live transcript JSON
                                 ▼
      ┌──────────────────────────────────────────────────────┐
      │                     React Frontend                   │
      │------------------------------------------------------│
      │                                                      │
      │  🧠 useDeepgramStream.js                              │
      │    • Captures mic audio via MediaRecorder            │
      │    • Streams chunks to Deepgram SDK                  │
      │    • Updates transcript in real-time                 │
      │    • Calls sentiment API when transcript is final    │
      │                                                      │
      │  🎨 SpeechAura.js                                   │
      │    • Displays live transcript                        │
      │    • Shows “Listening…” pulse while recording        │
      │    • Passes sentiment to AuraCanvas                  │
      │                                                      │
      │  🌈 AuraCanvas.js (p5.js)                            │
      │    • Renders Perlin-noise particles                  │
      │    • Smoothly transitions color based on sentiment   │
      │    • Creates ambient wavy glow                       │
      │                                                      │
      └──────────────────────┬───────────────────────────────┘
                             │
                POST /api/v1/process_text
                             │
                             ▼
           ┌────────────────────────────────┐
           │           FastAPI Backend       │
           │---------------------------------│
           │  /api/v1/process_text           │
           │     → Receives transcript       │
           │     → Calls analyze() in LLM    │
           │                                 │
           │  services/llm.py                │
           │     → Sends text to OpenAI      │
           │     → Gets sentiment JSON       │
           │     → Returns label & score     │
           └─────────────────┬────────────────┘
                             │
                             ▼
             ┌────────────────────────────────┐
             │         OpenAI GPT Model        │
             │---------------------------------│
             │  • Analyzes tone of text        │
             │  • Returns structured JSON:     │
             │    { sentiment_label, score }   │
             └────────────────────────────────┘
                             │
                             ▼
           ┌──────────────────────────────────────────┐
           │      React (Frontend Visualization)       │
           │-------------------------------------------│
           │  • Updates sentimentRef in SpeechAura     │
           │  • AuraCanvas transitions color           │
           │  • Text fades in/out dynamically          │
           │  • Final aura visual = Emotion feedback   │
           └──────────────────────────────────────────┘




---

### 🧠 Data Flow Summary

| Step | Component | Description |
|------|------------|-------------|
| 1️⃣ | **Microphone** | Captures live audio from user |
| 2️⃣ | **Deepgram SDK** | Streams real-time audio → transcript |
| 3️⃣ | **React Hook (`useDeepgramStream`)** | Updates transcript & triggers sentiment |
| 4️⃣ | **FastAPI Backend** | Receives transcript, calls OpenAI |
| 5️⃣ | **OpenAI API** | Returns structured sentiment JSON |
| 6️⃣ | **SpeechAura + AuraCanvas** | Visualizes emotions with color and flow |
| 7️⃣ | **User UI** | Sees glowing aura that changes dynamically |

---
