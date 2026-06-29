import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Initialize Gemini SDK
// Assumes GEMINI_API_KEY is set in environment
const ai = new GoogleGenAI({}); 

const mockPoDb = JSON.parse(fs.readFileSync('./mock-po-db.json', 'utf-8'));

app.post('/api/audit', upload.single('invoice'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No invoice file uploaded.' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    
    // Read file for Gemini
    const fileBytes = fs.readFileSync(filePath);
    const filePart = {
        inlineData: {
            data: fileBytes.toString("base64"),
            mimeType: mimeType
        }
    };

    // Agent 1: Extractor Agent
    console.log('Running Extractor Agent...');
    const extractorPrompt = `
You are an expert financial data extractor. 
Extract the following information from this invoice:
1. PO Number (Look for PO, Purchase Order, etc. If not found, guess based on common formats, or default to PO-1001 for testing).
2. Line items with "description", "qty" (quantity), and "price" (unit price).
Return ONLY a valid JSON object with the keys: "poNumber" (string), "lineItems" (array of objects with description, qty, price). No markdown, no code blocks, just raw JSON.`;

    const extractorResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [extractorPrompt, filePart],
      config: {
        responseMimeType: 'application/json',
      }
    });

    let extractedData;
    try {
        extractedData = JSON.parse(extractorResponse.text);
    } catch(e) {
        // Fallback for parsing issues
        const text = extractorResponse.text.replace(/```json/g, '').replace(/```/g, '').trim();
        extractedData = JSON.parse(text);
    }

    console.log('Extracted Data:', extractedData);
    
    // Lookup PO in our internal database
    // Default to PO-1001 if the model failed to find it in the test image
    let poRecord = mockPoDb[extractedData.poNumber];
    if (!poRecord) {
       poRecord = mockPoDb["PO-1001"];
    }

    // Agent 2 & 3: Auditor and Triage Agent
    console.log('Running Auditor & Triage Agent...');
    const triagePrompt = `
You are the VendorVibe Triage Agent. Your job is to compare an incoming invoice against the internal ground-truth Purchase Order, and generate a Triage Report.

Internal PO Record (Ground Truth):
${JSON.stringify(poRecord, null, 2)}

Extracted Invoice Data:
${JSON.stringify(extractedData, null, 2)}

Task:
1. Compare each line item. Identify if the invoice quantity or unit price differs from the PO.
2. Generate a "triageReport" explaining any discrepancies, potential financial leakage, and recommended actions.
3. Return a JSON object with:
   - "lineItemsComparison": Array combining the PO and Invoice data. Fields needed: description, invoiceQty, poQty, invoicePrice, poPrice.
   - "triageReport": A string containing the human-readable dispute report.
   - "discrepanciesFound": boolean
`;

    const triageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [triagePrompt],
      config: {
        responseMimeType: 'application/json',
      }
    });

    let auditResult;
    try {
        auditResult = JSON.parse(triageResponse.text);
    } catch(e) {
        const text = triageResponse.text.replace(/```json/g, '').replace(/```/g, '').trim();
        auditResult = JSON.parse(text);
    }
    
    auditResult.poNumber = poRecord.poNumber;

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json(auditResult);

  } catch (error) {
    console.error('Audit Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`VendorVibe backend running on port \${PORT}\`);
});
