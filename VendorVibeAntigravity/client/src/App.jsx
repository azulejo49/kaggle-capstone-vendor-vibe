import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, FileText } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [auditing, setAuditing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setAuditing(true);
    
    const formData = new FormData();
    formData.append('invoice', file);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert('Audit failed. See console.');
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>VendorVibe</h1>
        <div style={{color: 'var(--text-main)', fontSize: '0.9rem'}}>Autonomous Auditing Pipeline</div>
      </header>

      <main className="main-content">
        <div className="dashboard-grid">
          
          <div className="glass-panel">
            <h2><UploadCloud style={{verticalAlign: 'middle', marginRight: '10px'}}/> Ingest Invoice</h2>
            <div className="uploader" onClick={() => document.getElementById('file-upload').click()}>
              <input 
                id="file-upload" 
                type="file" 
                style={{display: 'none'}} 
                onChange={handleFileChange} 
                accept="image/*,application/pdf"
              />
              {file ? (
                <div>
                  <FileText size={48} color="var(--accent)" />
                  <p>{file.name}</p>
                </div>
              ) : (
                <p>Drag & Drop or Click to Upload Invoice (PDF/Image)</p>
              )}
            </div>
            <button className="btn" onClick={handleUpload} disabled={!file || auditing}>
              {auditing ? 'Auditing...' : 'Run Autonomous Audit'}
            </button>
          </div>

          <div className="glass-panel">
            <h2><AlertCircle style={{verticalAlign: 'middle', marginRight: '10px'}}/> Triage & Discrepancies</h2>
            {results ? (
              <div className="triage-report">
                <p><strong>Status:</strong> {results.discrepanciesFound ? <span className="discrepancy">Discrepancies Found</span> : <span className="match">Perfect Match</span>}</p>
                <div style={{background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', marginTop: '15px', whiteSpace: 'pre-wrap', fontFamily: 'monospace'}}>
                  {results.triageReport}
                </div>
              </div>
            ) : (
              <p style={{opacity: 0.6}}>Upload an invoice to view the generated triage report.</p>
            )}
          </div>

        </div>

        {results && (
          <div className="glass-panel" style={{marginTop: '30px'}}>
            <h2>Audit Details (Invoice vs PO {results.poNumber})</h2>
            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Invoice Qty</th>
                  <th>PO Qty</th>
                  <th>Invoice Unit Price</th>
                  <th>PO Unit Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.lineItemsComparison.map((item, idx) => {
                  const qtyMatch = item.invoiceQty === item.poQty;
                  const priceMatch = item.invoicePrice === item.poPrice;
                  const isMatch = qtyMatch && priceMatch;

                  return (
                    <tr key={idx}>
                      <td>{item.description}</td>
                      <td className={qtyMatch ? 'match' : 'discrepancy'}>{item.invoiceQty}</td>
                      <td>{item.poQty}</td>
                      <td className={priceMatch ? 'match' : 'discrepancy'}>${item.invoicePrice}</td>
                      <td>${item.poPrice}</td>
                      <td>
                        {isMatch ? <CheckCircle color="var(--success)" size={20}/> : <AlertCircle color="var(--error)" size={20}/>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
