# Security Vulnerability Findings — AI Backend Services

**Audit Date:** 2026-08-13  
**Scope:** SSRF, command injection, unsafe deserialization, path traversal, arbitrary code execution  
**Excluded (already reported):** Zero authentication on entire AI backend, path traversal in `ai_training_sandbox.py`, hardcoded PHI encryption key, unauthenticated `decrypt-phi` endpoint

---

## CRITICAL Findings

### 1. Unsafe Deserialization via `joblib.load` — Arbitrary Code Execution

**File:** `ai_backend/services/model_explainer.py`  
**Lines:** 176–177

```python
self.model = joblib.load(f"{model_path}/model.pkl")
self.scaler = joblib.load(f"{model_path}/scaler.pkl")
```

**Attack Chain:**
1. Attacker places a crafted `.pkl` file at a known or controllable `model_path` (e.g., via the path-traversal file upload vulnerabilities described below, or via the already-reported training sandbox path traversal).
2. When `ModelExplainer.load_model()` is invoked, `joblib.load` deserializes the pickle, which can execute arbitrary Python code during deserialization.
3. Since the backend runs without sandboxing, the attacker gains full remote code execution as the service user.

**Amplification:** The unauthenticated backend means any attacker who can reach the network can trigger model loading or upload a malicious file that later gets loaded.

**Severity:** CRITICAL

---

### 2. Unsafe Deserialization via `torch.load` — Arbitrary Code Execution

**File:** `ai_backend/services/model_comparison_dashboard.py`  
**Line:** 237

```python
model = torch.load(model_path, map_location='cpu')
```

**Attack Chain:**
1. `model_path` is derived from `ModelConfig.model_path`, which is loaded from `config/model_configs.json` (line 120–126). If an attacker can modify or supply this config file (e.g., via a file-write vulnerability), they control `model_path`.
2. Even without config modification, the model comparison endpoint (`POST /model-comparison/compare`) accepts a list of `model_names` from the user (main.py line 1149–1153). If a config entry has a `model_path` pointing to attacker-controlled storage (e.g., after a path-traversal file write), `torch.load` deserializes the file using pickle, executing arbitrary code.

**Severity:** CRITICAL (requires chaining with file-write; becomes trivially exploitable with the file upload path traversals below)

---

## HIGH Findings

### 3. Path Traversal in File Upload — Arbitrary File Write

**File:** `ai_backend/main.py`  
**Lines:** 1367–1368

```python
file_path = f"uploads/{file_id}_{file.filename}"
```

**Also at line 1525:**
```python
file_path = f"uploads/{file_id}_{bloodwork_file.filename}"
```

**Attack Chain:**
1. Attacker sends a multipart upload to `POST /analyze/bloodwork/enhanced` or `POST /medical-records/comprehensive-analysis` with `filename` set to `../../etc/cron.d/backdoor` (or any path).
2. The server writes the uploaded content to the attacker-controlled path relative to the working directory.
3. This enables arbitrary file writes anywhere the process user has permission—backdoors, cron jobs, SSH keys, overwriting config files for the pickle-load attacks above, etc.

**Affected Endpoints:**
- `POST /analyze/bloodwork/enhanced` (line 1346)
- `POST /medical-records/comprehensive-analysis` (line 1500)

**Note:** The `FileHandler.save_upload()` method (used by other endpoints) is also vulnerable since it uses `os.path.join(self.upload_dir, temp_filename)` where `temp_filename` includes the extension derived from `file.filename` via `os.path.splitext`, but the `file_id` used for the base name is a UUID. However, the two endpoints above bypass `FileHandler` and directly use `file.filename` in the path.

**Severity:** HIGH

---

### 4. Path Traversal in Voice Emotion Analysis — Arbitrary File Write

**File:** `ai_backend/services/advanced_ai_features.py`  
**Lines:** 189–190

```python
temp_audio_path = f"temp_audio_{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.wav"
with open(temp_audio_path, "wb") as f:
    f.write(audio_data)
```

**Attack Chain:**
1. Attacker calls `POST /ai/voice-emotion` with `patient_id` set to `../../etc/cron.d/exploit` (form field, main.py line 746).
2. The service constructs a file path using the unsanitized `patient_id`, writing attacker-controlled binary content (the audio upload) to an arbitrary filesystem location.
3. Although the file is deleted after processing (line 217), race conditions or processing errors can leave the file in place. Even in normal operation, the attacker achieves a momentary arbitrary file write which can be exploited against services that poll directories.

**Severity:** HIGH

---

### 5. Hardcoded Database Credentials in Source Code

**File:** `ai_backend/services/offline_sync_queue.py`  
**Lines:** 65–69

```python
self.mysql_config = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'ai_telemedicine_user'),
    'password': os.getenv('MYSQL_PASSWORD', 'ai_telemedicine_password_2024'),
    'database': os.getenv('MYSQL_DATABASE', 'ai_telemedicine'),
    'port': int(os.getenv('MYSQL_PORT', 3306))
}
```

**Impact:**
- Username `ai_telemedicine_user` and password `ai_telemedicine_password_2024` are embedded in source code.
- Any developer, CI system, or code leak exposes production database credentials.
- Combined with the unauthenticated backend, an attacker who gains code access (e.g., via the arbitrary file read or source disclosure) can directly access the MySQL database containing patient data.

**Severity:** HIGH

---

## MEDIUM Findings

### 6. Verbose Error Disclosure via Global Exception Handler

**File:** `ai_backend/main.py`  
**Lines:** 1337–1341

```python
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )
```

**Impact:**
- Internal exception messages (including file paths, stack traces, database connection strings, and internal service URLs) are returned to any caller.
- Aids attackers in fingerprinting the environment, discovering file paths for traversal attacks, and identifying additional attack surface.

**Severity:** MEDIUM

---

### 7. Unsafe Deserialization via `joblib.load` in AI Training Sandbox (additional vector)

**File:** `ai_backend/services/ai_training_sandbox.py`  
**Line:** 358

```python
label_encoder = joblib.load('models/label_encoder.pkl') if os.path.exists('models/label_encoder.pkl') else None
```

**Attack Chain:**
- Combined with the already-reported path traversal in the training sandbox (which allows writing files to arbitrary relative paths using `clinic_id`/`dataset_name`), an attacker can write a malicious pickle file to `models/label_encoder.pkl`.
- On next invocation of the prediction path, `joblib.load` deserializes it → arbitrary code execution.

**Note:** This is a distinct attack vector from the already-reported path traversal. The traversal is the enabler; this finding identifies the RCE payload delivery mechanism.

**Severity:** MEDIUM (HIGH when combined with the known path traversal)

---

### 8. `torch.load` in AI Training Sandbox (additional vector)

**File:** `ai_backend/services/ai_training_sandbox.py`  
**Line:** 175

```python
model_state = torch.load(model_path)
```

**Impact:** Same as finding #7—attacker uses path traversal to place a malicious `.pth` file, then triggers model loading for code execution.

**Severity:** MEDIUM (HIGH when combined with the known path traversal)

---

## Summary Table

| # | Severity | Vulnerability Type | File | Lines | Exploitable Without Auth |
|---|----------|-------------------|------|-------|-------------------------|
| 1 | CRITICAL | Unsafe Deserialization (joblib/pickle) | model_explainer.py | 176–177 | Yes (with file write chain) |
| 2 | CRITICAL | Unsafe Deserialization (torch.load) | model_comparison_dashboard.py | 237 | Yes (with file write chain) |
| 3 | HIGH | Path Traversal → Arbitrary File Write | main.py | 1367–1368, 1525 | Yes |
| 4 | HIGH | Path Traversal → Arbitrary File Write | advanced_ai_features.py | 189 | Yes |
| 5 | HIGH | Hardcoded Credentials | offline_sync_queue.py | 65–69 | N/A (source exposure) |
| 6 | MEDIUM | Information Disclosure | main.py | 1337–1341 | Yes |
| 7 | MEDIUM | Unsafe Deserialization (joblib) | ai_training_sandbox.py | 358 | Yes (with known traversal) |
| 8 | MEDIUM | Unsafe Deserialization (torch.load) | ai_training_sandbox.py | 175 | Yes (with known traversal) |

---

## Composite Attack Scenario

The most severe realistic attack chain combining these findings:

1. **Unauthenticated access** (known) → attacker reaches all endpoints.
2. **Path traversal file write** (Finding #3) via `POST /analyze/bloodwork/enhanced` with `filename=../../models/label_encoder.pkl` → attacker writes a malicious pickle file.
3. **Pickle deserialization** (Finding #7) → when the training sandbox loads the poisoned file, attacker code executes with service permissions.
4. **Full compromise** → attacker has shell access, can exfiltrate PHI, pivot to database using hardcoded credentials (Finding #5), or install persistent backdoors.

This entire chain requires zero authentication and only two HTTP requests.

---

## Recommendations

1. **Sanitize all user-supplied filenames**: Use `os.path.basename()` or allowlist characters; never concatenate user input into file paths.
2. **Replace `joblib.load`/`torch.load` with safe alternatives**: Use `torch.load(..., weights_only=True)` (PyTorch 2.6+), or verify file integrity with cryptographic signatures before loading.
3. **Remove hardcoded credentials**: Use secrets management (Vault, AWS Secrets Manager) with no defaults in code.
4. **Suppress internal errors**: Return generic error messages to clients; log details server-side only.
5. **Add authentication**: All findings are amplified by the lack of authentication on the AI backend.
