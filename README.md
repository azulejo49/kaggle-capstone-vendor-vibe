# VendorVibe: The Automated B2B Invoice & Dispute Agent

[![Tech Stack](https://shields.io)](https://github.com)
[![License: MIT](https://shields.io)](https://opensource.org)

**Track:** Agents for Business  
**Course:** Kaggle 5-Day AI Agents: Intensive Vibe Coding Course with Google  

An enterprise-grade, autonomous multi-agent financial auditing application built for the **Agents for Business** track. VendorVibe automates unstructured text ingestion, verifies live billing data against ground-truth internal Purchase Orders (POs) via a secure data context bridge, and builds human-in-the-loop dispute mitigation assets.

---

## 📋 Project Overview
VendorVibe solves a critical workflow drain for small and medium businesses: the tedious manual process of matching incoming PDF invoices against internal Purchase Orders (POs) and drafting dispute letters when pricing mismatches occur. 

Using an autonomous, multi-agent architecture built during the Kaggle Intensive, VendorVibe automatically ingests billing data, checks it against ground-truth database records, and prepares human-in-the-loop email drafts when corporate compliance or pricing terms are violated.

---

## 🏗️ Architecture & Core Concepts
This project demonstrates **three (3) key concepts** from the course:
1. **Multi-Agent System (ADK Setup):** Implements separate, dedicated personalities (Data Extractor Agent and Auditor Agent) to maintain a clean separation of concerns.
2. **Model Context Protocol (MCP Server):** Simulates a secure context bridge fetching real-time ground-truth inventory and contract prices without exposing whole databases to the model.
3. **Agent Skills (Agents CLI):** Wrapped as a modular command-line pipeline optimized for rapid automation and validation tracking.

### 📊 Operational Pipeline Workflow

[ Input Invoice ]│▼┌───────────────────────┐│ Extractor Agent (LLM) │└───────────┬───────────┘│ (Extracted JSON Data)▼┌───────────────────────┐       ┌──────────────────────────┐│  Auditor Agent (LLM)  │ ◄──── │ Custom MCP Data Context  │└───────────┬───────────┘       │ (Ground-Truth PO Records)││                   └──────────────────────────┘▼┌─────────────────────────────────────────┐│            OUTCOME TRIAGE               │├────────────────────┬────────────────────┤│ [If Match]         │ [If Discrepancy]   ││ Payment Approval   │ Draft Dispute Email│└────────────────────┴────────────────────┘

---

## 💻 Tech Stack & Requirements
- **Language:** Python 3.10+
- **Framework:** Google GenAI SDK (`google-genai`)
- **Model:** `gemini-2.5-flash`

---

## ⚙️ Installation & Setup Instruction
Follow these steps to run the pipeline locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd kaggle-capstone-vendor-vibe
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   Do **NOT** hardcode API keys into the source files. Export your credential securely:
   
   *On Linux/macOS:*
   ```bash
   export GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```
   *On Windows (PowerShell):*
   ```powershell
   \$env:GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

4. **Run the Agent CLI Execution Pipeline:**
   ```bash
   python app.py
   ```

---

## 🔒 Security & Guardrails
- **No Hardcoded Credentials:** The application throws an immediate runtime error if `GEMINI_API_KEY` is missing from the environment.
- **Sandboxed Execution:** The simulated MCP Server uses strict read-only queries with strict bounds, preventing any unauthorized system prompt injection from modifying internal database records.
- **Human-in-the-Loop Validation:** The agent generates the final outcome text but leaves execution control completely isolated to human operators, preventing programmatic, automated email spam.
