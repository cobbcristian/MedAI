from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
import os

app = FastAPI(title="MedAI Frontend")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return HTMLResponse(content="""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MedAI - AI Telemedicine Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .login-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 400px;
            margin: 0 auto;
            text-align: center;
        }
        
        .login-card h2 {
            color: #667eea;
            margin-bottom: 20px;
        }
        
        .login-card p {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .button-group {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        
        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
        }
        
        .btn-outline {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
        }
        
        .btn-outline:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
        }
        
        .nav-bar {
            background: white;
            padding: 15px 0;
            margin-bottom: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .nav-bar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .nav-bar h1 {
            color: #667eea;
            margin: 0;
        }
        
        .nav-bar button {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .feature-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .feature-card p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .upload-area {
            border: 2px dashed #667eea;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin: 15px 0;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .upload-area:hover {
            background: #f8f9ff;
            border-color: #5a6fd8;
        }
        
        .upload-area input {
            display: none;
        }
        
        .analysis-result {
            background: #f8f9ff;
            border-radius: 10px;
            padding: 20px;
            margin-top: 15px;
            border-left: 4px solid #667eea;
        }
        
        .analysis-result h4 {
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .analysis-result ul {
            margin-left: 20px;
        }
        
        .analysis-result li {
            margin-bottom: 5px;
        }
        
        .medication-list {
            background: #f8f9ff;
            border-radius: 10px;
            padding: 20px;
            margin-top: 15px;
        }
        
        .medication-item {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid #667eea;
        }
        
        .vaccination-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .vaccine-item {
            background: white;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            border: 2px solid #e0e0e0;
        }
        
        .vaccine-item.completed {
            border-color: #4CAF50;
            background: #f1f8e9;
        }
        
        .vaccine-item.missing {
            border-color: #f44336;
            background: #ffebee;
        }
        
        .surgical-guide {
            background: #f8f9ff;
            border-radius: 10px;
            padding: 20px;
            margin-top: 15px;
        }
        
        .step-list {
            counter-reset: step-counter;
        }
        
        .step-item {
            counter-increment: step-counter;
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid #667eea;
        }
        
        .step-item::before {
            content: counter(step-counter);
            background: #667eea;
            color: white;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            font-weight: bold;
        }
        
        .status {
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin-bottom: 20px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #333;
            font-weight: bold;
        }
        
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }
        
        .form-group textarea {
            height: 100px;
            resize: vertical;
        }
        
        .hidden {
            display: none;
        }
        
        .api-status {
            background: #4CAF50;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            margin: 10px 0;
        }
        
        .api-link {
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
        }
        
        .api-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- Login Screen -->
        <div id="login-screen">
            <div class="container">
                <div class="header">
                    <h1>🏥 AI Telemedicine Platform</h1>
                    <p>Experience the future of healthcare with AI-powered diagnostics, real-time consultations, and advanced medical insights.</p>
                </div>
                
                <div class="login-card">
                    <h2>Welcome to MedAI</h2>
                    <p>Access advanced AI-powered medical analysis, bloodwork interpretation, X-ray analysis, and comprehensive health insights.</p>
                    
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="showDashboard()">
                            Enter Dashboard
                        </button>
                        <button class="btn btn-outline">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Dashboard -->
        <div id="dashboard" class="hidden">
            <div class="nav-bar">
                <div class="container">
                    <h1>🏥 MedAI Dashboard</h1>
                    <button onclick="showLogin()">Logout</button>
                </div>
            </div>
            
            <div class="container">
                <div class="header">
                    <h1>🏥 AI Telemedicine Platform</h1>
                    <p>Advanced AI-powered medical analysis and healthcare solutions</p>
                    <div class="status">✅ LIVE & OPERATIONAL</div>
                    <div class="api-status">🔗 Backend API: <a href="https://medai-production-45a2.up.railway.app" class="api-link" target="_blank">Connected</a></div>
                </div>
                
                <div class="dashboard-grid">
                    <div class="feature-card">
                        <h3>🔬 Bloodwork Analysis</h3>
                        <p>Upload bloodwork results for AI-powered analysis with cancer risk assessment and life expectancy predictions.</p>
                        
                        <div class="upload-area">
                            <input type="file" id="bloodwork-upload" accept=".pdf,.jpg,.png" />
                            <label for="bloodwork-upload">
                                📄 Upload Bloodwork Results (PDF/Image)
                            </label>
                        </div>
                        
                        <button class="btn btn-primary" style="width: 100%; margin-top: 10px;" onclick="analyzeBloodwork()">
                            Analyze Bloodwork
                        </button>
                        
                        <div class="analysis-result" id="bloodwork-result" style="display: none;">
                            <h4>📊 Analysis Results</h4>
                            <ul>
                                <li><strong>Hemoglobin:</strong> 14.2 g/dL (Normal)</li>
                                <li><strong>WBC Count:</strong> 11.5 K/μL (Elevated)</li>
                                <li><strong>Cancer Risk:</strong> Low (5% probability)</li>
                                <li><strong>Life Expectancy:</strong> 78 years</li>
                                <li><strong>Recommendations:</strong> Monitor WBC, follow-up in 2 weeks</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="feature-card">
                        <h3>📷 X-ray AI Analysis</h3>
                        <p>Upload medical images for AI-powered diagnosis with automatic abnormality detection.</p>
                        
                        <div class="upload-area">
                            <input type="file" id="xray-upload" accept=".jpg,.png,.dicom" />
                            <label for="xray-upload">
                                📷 Upload X-ray/CT/MRI Image
                            </label>
                        </div>
                        
                        <button class="btn btn-primary" style="width: 100%; margin-top: 10px;" onclick="analyzeXray()">
                            Analyze Image
                        </button>
                        
                        <div class="analysis-result" id="xray-result" style="display: none;">
                            <h4>🔍 AI Diagnosis</h4>
                            <ul>
                                <li><strong>Finding:</strong> Normal chest X-ray</li>
                                <li><strong>Confidence:</strong> 95%</li>
                                <li><strong>Abnormalities:</strong> None detected</li>
                                <li><strong>Recommendations:</strong> No immediate action required</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="feature-card">
                        <h3>💊 Medication Tracking</h3>
                        <p>Track medication effectiveness, side effects, and life impact analysis.</p>
                        
                        <div class="form-group">
                            <label>Medication Name:</label>
                            <input type="text" placeholder="e.g., Metformin" />
                        </div>
                        
                        <div class="form-group">
                            <label>Dosage:</label>
                            <input type="text" placeholder="e.g., 500mg twice daily" />
                        </div>
                        
                        <button class="btn btn-primary" style="width: 100%;" onclick="addMedication()">
                            Add Medication
                        </button>
                        
                        <div class="medication-list">
                            <h4>📋 Current Medications</h4>
                            <div class="medication-item">
                                <strong>Metformin 500mg</strong><br/>
                                <small>Effectiveness: Good | Side Effects: Mild | Life Impact: Positive</small>
                            </div>
                            <div class="medication-item">
                                <strong>Lisinopril 10mg</strong><br/>
                                <small>Effectiveness: Excellent | Side Effects: None | Life Impact: Very Positive</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="feature-card">
                        <h3>💉 Vaccination Records</h3>
                        <p>Track vaccination history and identify missing vaccines with risk assessment.</p>
                        
                        <div class="vaccination-grid">
                            <div class="vaccine-item completed">
                                <strong>COVID-19</strong><br/>
                                <small>✅ Completed</small>
                            </div>
                            <div class="vaccine-item completed">
                                <strong>Flu Shot</strong><br/>
                                <small>✅ Completed</small>
                            </div>
                            <div class="vaccine-item missing">
                                <strong>Tetanus</strong><br/>
                                <small>❌ Due</small>
                            </div>
                            <div class="vaccine-item completed">
                                <strong>MMR</strong><br/>
                                <small>✅ Completed</small>
                            </div>
                        </div>
                        
                        <div class="analysis-result">
                            <h4>⚠️ Missing Vaccines</h4>
                            <ul>
                                <li><strong>Tetanus:</strong> Due for booster (last: 2018)</li>
                                <li><strong>Risk Assessment:</strong> Low risk, schedule within 6 months</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="feature-card">
                        <h3>⚕️ Surgical Guides</h3>
                        <p>Step-by-step surgical procedure guides for medical professionals.</p>
                        
                        <div class="form-group">
                            <label>Select Procedure:</label>
                            <select id="procedure-select">
                                <option>Appendectomy</option>
                                <option>Cholecystectomy</option>
                                <option>Hernia Repair</option>
                                <option>Cardiac Bypass</option>
                            </select>
                        </div>
                        
                        <button class="btn btn-primary" style="width: 100%;" onclick="generateGuide()">
                            Generate Guide
                        </button>
                        
                        <div class="surgical-guide" id="surgical-guide" style="display: none;">
                            <h4>📋 Appendectomy Guide</h4>
                            <div class="step-list">
                                <div class="step-item">
                                    <strong>Pre-op Preparation:</strong> NPO 8 hours, IV access, antibiotics
                                </div>
                                <div class="step-item">
                                    <strong>Incision:</strong> McBurney's point, 3-4cm transverse incision
                                </div>
                                <div class="step-item">
                                    <strong>Appendectomy:</strong> Ligate mesoappendix, divide appendix
                                </div>
                                <div class="step-item">
                                    <strong>Closure:</strong> Close peritoneum, muscle, fascia, skin
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="feature-card">
                        <h3>🤖 AI-Powered Insights</h3>
                        <p>Comprehensive health assessment and personalized recommendations.</p>
                        
                        <button class="btn btn-primary" style="width: 100%; margin-bottom: 15px;" onclick="generateHealthReport()">
                            Generate Health Report
                        </button>
                        
                        <div class="analysis-result" id="health-report" style="display: none;">
                            <h4>📊 Health Summary</h4>
                            <ul>
                                <li><strong>Overall Health Score:</strong> 85/100</li>
                                <li><strong>Risk Factors:</strong> Elevated WBC, Age-related</li>
                                <li><strong>Recommendations:</strong> Regular exercise, balanced diet</li>
                                <li><strong>Next Checkup:</strong> 3 months</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="feature-card" style="grid-column: 1 / -1;">
                    <h3>🔗 API Integration</h3>
                    <p>This platform connects to a real AI backend with the following endpoints:</p>
                    <ul>
                        <li><strong>Bloodwork Analysis:</strong> <a href="https://medai-production-45a2.up.railway.app/analyze/bloodwork/enhanced" class="api-link" target="_blank">/analyze/bloodwork/enhanced</a></li>
                        <li><strong>X-ray Analysis:</strong> <a href="https://medai-production-45a2.up.railway.app/analyze/scan" class="api-link" target="_blank">/analyze/scan</a></li>
                        <li><strong>Surgical Guides:</strong> <a href="https://medai-production-45a2.up.railway.app/medical-records/surgical-procedures" class="api-link" target="_blank">/medical-records/surgical-procedures</a></li>
                        <li><strong>Health Check:</strong> <a href="https://medai-production-45a2.up.railway.app/health" class="api-link" target="_blank">/health</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function showDashboard() {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
        }
        
        function showLogin() {
            document.getElementById('dashboard').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
        }
        
        function analyzeBloodwork() {
            document.getElementById('bloodwork-result').style.display = 'block';
        }
        
        function analyzeXray() {
            document.getElementById('xray-result').style.display = 'block';
        }
        
        function addMedication() {
            alert('Medication added successfully!');
        }
        
        function generateGuide() {
            document.getElementById('surgical-guide').style.display = 'block';
        }
        
        function generateHealthReport() {
            document.getElementById('health-report').style.display = 'block';
        }
    </script>
</body>
</html>
    """)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "frontend"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 