import os
from google import genai

# 🚨 SECURITY CHECK: Confirm API credentials are local environment bound
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("System Initialization Error: Missing GEMINI_API_KEY environment variable.")

# Initialize the official Google GenAI Client
client = genai.Client()

# CONCEPT 1: Custom Tool acting as a Mock MCP Server Data Source
def fetch_purchase_order(po_number: str) -> dict:
    """Mock MCP tool to query internal PO database records."""
    db = {
        "PO-2026-001": {"vendor": "Acme Corp", "expected_total": 1250.00, "currency": "USD"},
        "PO-2026-002": {"vendor": "Globex IT", "expected_total": 4300.00, "currency": "USD"}
    }
    return db.get(po_number, {"error": f"Purchase Order {po_number} not found"})

# CONCEPT 2: Multi-Agent Coordination Design (ADK Concept)
def run_vendor_vibe_pipeline(invoice_text: str, po_number: str) -> str:
    """Orchestrates Extractor and Auditor Agent workflows."""
    
    # Agent 1: Data Extractor
    extractor_prompt = f"Extract the total amount and vendor name from this invoice: {invoice_text}. Return clean structural text."
    extracted_data = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=extractor_prompt
    ).text

    # Fetch reference data from our mock MCP data layout
    po_records = fetch_purchase_order(po_number)

    # Agent 2: Auditor Agent
    auditor_prompt = f"""
    You are an automated corporate financial auditor.
    Compare the Extracted Invoice Data with our Internal PO Records.
    
    Invoice Data: {extracted_data}
    Internal PO Records: {po_records}
    
    If there is a price mismatch or a different vendor name, write a professional vendor dispute email.
    If everything matches perfectly, state that the invoice is approved for payment.
    """
    
    final_verdict = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=auditor_prompt
    )
    return final_verdict.text

# CONCEPT 3: Agents CLI Entrypoint Execution Simulator
if __name__ == "__main__":
    # Test Data: $1500 Charged vs $1250 Expected (Forces a Discrepancy Dispute Email)
    mock_invoice = "Invoice from Acme Corp. Total Charged: $1500.00 USD."
    mock_po = "PO-2026-001"
    
    print("=== Starting VendorVibe Agent Pipeline ===")
    print(f"Ingesting System Parameters: PO Number = {mock_po}")
    
    result = run_vendor_vibe_pipeline(mock_invoice, mock_po)
    
    print("\n=== Final Pipeline Audit Output ===")
    print(result)
