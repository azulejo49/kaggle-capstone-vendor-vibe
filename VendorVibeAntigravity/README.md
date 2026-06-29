# VendorVibe

**VendorVibe** is an autonomous multi-agent financial auditing application designed to eliminate financial leakage by auditing unstructured incoming supplier invoices against internal Purchase Order (PO) records. 

Built with the **Google Gemini 2.5-Flash** model, VendorVibe automates unstructured text ingestion, verifies billing data metrics directly against ground-truth internal records, and seamlessly creates human-in-the-loop dispute triage assets.

## ✨ Features

- **Unstructured Text Ingestion**: Upload image or PDF invoices; the system autonomously extracts line items, quantities, pricing, and PO details.
- **Autonomous Multi-Agent Pipeline**:
  - **Extractor Agent**: Reads the raw invoice file and outputs structured JSON data.
  - **Auditor Agent**: Cross-references the extracted invoice metrics against ground-truth PO data from the internal database.
  - **Triage Agent**: Automatically generates detailed dispute triage reports highlighting pricing compliance failures or unexpected markups.
- **Human-in-the-Loop Triage Dashboard**: A stunning, premium web interface to review discrepancies and generated dispute assets.

## 🛠 Technology Stack

- **Frontend**: React, Vite, Vanilla CSS (Custom Glassmorphism Dark Mode UI)
- **Backend**: Node.js, Express, Multer (for file uploads)
- **AI/LLM**: Google Gen AI SDK (`@google/genai`), Gemini 2.5-Flash

## 🚀 Getting Started

VendorVibe is split into a `client` and `server` architecture. You will need to start both to run the application locally.

### 1. Prerequisites
- Node.js (v18+ recommended)
- A valid Google Gemini API Key.

### 2. Configure the Environment
Navigate to the `server` directory and configure your API key in the `.env` file:
```bash
cd server
# Open .env and add your key:
# GEMINI_API_KEY="your_actual_api_key_here"
```

### 3. Start the Backend Server
Open a terminal in the `server` directory and install dependencies:
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:3000`.

### 4. Start the Frontend Application
Open a new terminal in the `client` directory and install dependencies:
```bash
cd client
npm install
npm run dev
```
The React application will open on `http://localhost:5173`.

## 📖 Usage

1. Open the frontend dashboard at `http://localhost:5173`.
2. Use the **Ingest Invoice** panel to upload a sample invoice image or PDF.
3. The system will process the file, extract the information, compare it to the mock PO database, and display the detailed **Audit Details** and **Triage Report**.

---

*VendorVibe: Built for the "Agents for Business" track.*
