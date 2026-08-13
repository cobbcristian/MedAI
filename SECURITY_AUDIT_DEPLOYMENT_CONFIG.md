# Security Audit: Deployment & Configuration Files

**Application:** MedAI Healthcare/Telemedicine Platform
**Audit Date:** 2026-08-13
**Scope:** Deployment configs, CI/CD, environment files, infrastructure-as-code
**Excludes:** JWT secret, MySQL root/password, Elasticsearch port 9200 exposure, Actuator endpoints, AI backend CORS `allow_origins=["*"]` (already reported)

---

## CRITICAL Findings

### 1. Wazuh Dashboard Hardcoded Admin Credentials
- **File:** `docker-compose.enhanced.yml`, lines 286–287
- **Severity:** CRITICAL
- **Detail:** The Wazuh security monitoring dashboard has credentials hardcoded directly in the compose file rather than sourced from environment variables:
  ```yaml
  INDEXER_USERNAME=admin
  INDEXER_PASSWORD=SecretPassword
  ```
- **Attack Chain:** Anyone with repository read access obtains credentials to the security monitoring platform. An attacker can log in to Wazuh, disable alerts and active response rules, then operate undetected inside the healthcare network. Since Wazuh monitors the entire stack, compromising it blinds all intrusion detection.
- **Fix:** Move to `${WAZUH_INDEXER_USERNAME}` and `${WAZUH_INDEXER_PASSWORD}` environment variable references; store actual values in a secrets manager.

### 2. Spring Security Default User: admin/admin
- **File:** `backend/src/main/resources/application.yml`, lines 39–41
- **Severity:** CRITICAL
- **Detail:**
  ```yaml
  security:
    user:
      name: admin
      password: admin
  ```
  Spring Boot's built-in user is configured with trivially guessable credentials. This grants authenticated access to any Spring Security–protected endpoint including actuator management endpoints, form-login routes, and Basic-auth gated resources.
- **Attack Chain:** Attacker tries `admin`/`admin` on `POST /login` or via HTTP Basic auth → gains full admin-level access to the Spring backend → can access patient data, management APIs, and potentially invoke actuator operations.
- **Fix:** Remove the `spring.security.user` block entirely; rely on the application's own authentication system (JWT-based). If a bootstrap admin is needed, source the password from an environment variable.

### 3. `.env.enhanced` Committed to Git Repository
- **File:** `.env.enhanced` (tracked in git, verified by `git ls-files`)
- **Severity:** CRITICAL
- **Detail:** The `.gitignore` lists `.env` but **not** `.env.enhanced`. This file is committed and contains the structural blueprint for every secret the platform uses — AWS keys, Azure credentials, Stripe keys, Twilio tokens, SMTP passwords, FHIR client secrets, encryption keys, and more. While current values are placeholders, the file structure maps the entire secrets surface. If any developer replaces placeholders with real values and commits, all secrets are exposed in git history permanently.
- **Attack Chain:** A contributor replaces a placeholder with a real key → pushes → the secret is in git history forever (even if later removed). Alternatively, the placeholder naming conventions reveal which services to target (Stripe, Twilio, OpenAI, AWS, Azure, GCP).
- **Fix:** Add `.env.enhanced` to `.gitignore`. Remove it from git tracking with `git rm --cached .env.enhanced`. Provide a `.env.enhanced.example` with only key names and no values.

### 4. GCP Credentials Template Committed with Private Key Placeholder
- **File:** `gcp-credentials-template.json` (tracked in git)
- **Severity:** CRITICAL
- **Detail:** This file is tracked by git. The `.gitignore` excludes `gcp-credentials.json` but **not** `gcp-credentials-template.json`. The file contains a full GCP service account JSON structure including a `private_key` field with a PEM-formatted placeholder. The real credentials file is one copy-paste edit away from being committed as this exact filename.
- **Attack Chain:** Developer copies template → fills in real credentials → commits under the template filename (not excluded by gitignore) → GCP service account key is permanently in git history → full access to the GCP project.
- **Fix:** Add `gcp-credentials-template.json` and `gcp-credentials*.json` to `.gitignore`. Remove from git tracking. Document the expected structure in `README.md` instead.

---

## HIGH Findings

### 5. Redis Exposed Without Authentication (Simple Compose)
- **File:** `docker-compose.simple.yml`, lines 22–29
- **Severity:** HIGH
- **Detail:** Redis is exposed on port 6379 to the Docker host with **no** `--requirepass` flag and no authentication whatsoever. Compare with `docker-compose.enhanced.yml` line 117 which does use `--requirepass`.
- **Attack Chain:** Attacker connects to `host:6379` → reads/writes all session data, cached patient records, and cached AI analysis results → can inject malicious session tokens → hijack any user session → access PHI.
- **Fix:** Add `command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}` and remove or restrict the host port binding.

### 6. Prometheus Exposed with Lifecycle API Enabled
- **File:** `docker-compose.enhanced.yml`, lines 174–191
- **Severity:** HIGH
- **Detail:** Prometheus is bound to host port 9090 (line 179) with `--web.enable-lifecycle` (line 188). This flag enables unauthenticated HTTP endpoints `POST /-/reload` and `POST /-/quit` that can reconfigure or shut down Prometheus remotely.
- **Attack Chain:** Attacker sends `POST http://host:9090/-/quit` → shuts down all metrics collection → then sends `POST /-/reload` with a malicious config to redirect metric scraping to an attacker-controlled server → metrics exfiltration including health data patterns. Alternatively, blinding monitoring before launching further attacks.
- **Fix:** Remove `--web.enable-lifecycle` or put Prometheus behind an authenticated reverse proxy. Remove the host port binding; keep it internal to the Docker network.

### 7. Kibana Exposed Without Authentication
- **File:** `docker-compose.enhanced.yml`, lines 139–150
- **Severity:** HIGH
- **Detail:** Kibana is bound to host port 5601 with no authentication configured. It connects to Elasticsearch which also has `xpack.security.enabled=false`.
- **Attack Chain:** Attacker browses to `host:5601` → full read access to all indexed logs → logs contain application events, audit trails, potentially patient interaction records and PHI → can also create/delete indices, destroying audit evidence.
- **Fix:** Enable Elasticsearch security (`xpack.security.enabled=true`), configure Kibana authentication, and remove the host port binding.

### 8. Logstash Monitoring API Exposed Without Authentication
- **File:** `docker-compose.enhanced.yml`, lines 153–171
- **Severity:** HIGH
- **Detail:** Logstash exposes port 9600 (monitoring API), port 5044 (Beats input), and port 5000 (TCP/UDP input) to the host with no authentication.
- **Attack Chain:** Attacker connects to port 9600 → reads pipeline configuration and stats → identifies data flow patterns. Connects to port 5000 or 5044 → injects fake log entries → poisons audit logs and security monitoring → covers tracks for HIPAA compliance evasion.
- **Fix:** Remove host port bindings for ports 9600, 5044, and 5000. Keep them internal to the Docker network only.

### 9. Wazuh Manager API Exposed on Port 55000
- **File:** `docker-compose.enhanced.yml`, lines 231–252
- **Severity:** HIGH
- **Detail:** The Wazuh Manager binds multiple ports to the host including port 55000 (Wazuh REST API). Combined with the hardcoded credentials from Finding #1, this provides remote API access to the security monitoring platform.
- **Attack Chain:** Attacker uses credentials from Finding #1 → authenticates to `host:55000` API → disables active response rules → removes agents → modifies security policies → operates undetected.
- **Fix:** Remove host port bindings for Wazuh ports; access Wazuh only through the Docker network or via VPN/bastion.

### 10. DATABASE_URL with `useSSL=false` — Unencrypted DB Traffic
- **File:** `.env.enhanced`, line 10
- **Severity:** HIGH
- **Detail:**
  ```
  DATABASE_URL=jdbc:mysql://mysql:3306/ai_telemedicine?useSSL=false&allowPublicKeyRetrieval=true
  ```
  Database connections are explicitly configured to disable SSL and allow public key retrieval. In a healthcare application handling PHI, this means all patient data transits the network unencrypted.
- **Also in:** `backend/src/main/resources/application.yml`, line 6: `useSSL=false`
- **Attack Chain:** Network-level attacker performs ARP spoofing or MITM on the Docker bridge network → intercepts all SQL queries and results in plaintext → exfiltrates PHI → HIPAA violation.
- **Fix:** Set `useSSL=true` and configure proper SSL certificates for MySQL. Remove `allowPublicKeyRetrieval=true`.

### 11. CI/CD Security Scan Results Silenced
- **File:** `.github/workflows/deploy.yml`, line 39
- **Severity:** HIGH
- **Detail:**
  ```bash
  bandit -r ai_backend/ -f json -o bandit-report.json || true
  ```
  The `|| true` suffix ensures Bandit security findings never fail the pipeline. Security vulnerabilities in the AI backend Python code will be detected but silently ignored, and the build/deploy proceeds regardless.
- **Attack Chain:** Developer introduces a code injection vulnerability → Bandit detects it → pipeline continues anyway → vulnerable code reaches production → attacker exploits the vulnerability in the healthcare application.
- **Fix:** Remove `|| true`. Configure Bandit with an appropriate severity threshold: `bandit -r ai_backend/ -f json -o bandit-report.json -ll` (fail on medium+ severity). Make the security job a required status check.

### 12. DEBUG Logging for Security Components in Production
- **File:** `backend/src/main/resources/application.yml`, lines 74–78
- **Severity:** HIGH
- **Detail:**
  ```yaml
  logging:
    level:
      com.aitelemedicine.telemedicine: DEBUG
      org.springframework.security: DEBUG
      org.springframework.web: DEBUG
  ```
  DEBUG-level logging for Spring Security logs authentication flows including tokens, session IDs, and authorization decisions. Spring Web DEBUG logs full request/response bodies which can contain PHI. These logs are then shipped to the unauthenticated Elasticsearch/Kibana stack (Findings #7, #8).
- **Attack Chain:** DEBUG logs capture JWT tokens, session data, patient request payloads → logs shipped to unauthenticated Elasticsearch → attacker accesses Kibana (Finding #7) → harvests tokens and PHI from logs.
- **Fix:** Set all production logging to `WARN` or `INFO`. Use Spring profiles to keep `DEBUG` only for development.

---

## MEDIUM Findings

### 13. Health Endpoint Exposes Internal System Details
- **File:** `backend/src/main/resources/application.yml`, line 89
- **Severity:** MEDIUM
- **Detail:**
  ```yaml
  endpoint:
    health:
      show-details: always
  ```
  The `/actuator/health` endpoint shows full system details to all callers including database connection status, disk space, Redis connectivity, and component versions.
- **Attack Chain:** Attacker queries `GET /actuator/health` → learns database type/version, Redis presence, disk space → uses this intelligence to target specific CVEs or plan resource exhaustion attacks.
- **Fix:** Set `show-details: when-authorized` and require authentication for actuator endpoints.

### 14. No Security Headers in Vercel/Netlify Configurations
- **Files:** `vercel.json`, `frontend/vercel.json`, `netlify.toml`
- **Severity:** MEDIUM
- **Detail:** None of the frontend deployment configurations define security headers. For a healthcare application, the following are absent:
  - `Strict-Transport-Security` (HSTS)
  - `Content-Security-Policy` (CSP)
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- **Attack Chain:** Without HSTS, users can be downgraded to HTTP via MITM → credentials/PHI intercepted. Without CSP, XSS payloads can exfiltrate data. Without X-Frame-Options, the application can be framed for clickjacking attacks tricking medical professionals into unintended actions.
- **Fix:** Add security headers to `vercel.json`:
  ```json
  "headers": [{ "source": "/(.*)", "headers": [
    {"key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains"},
    {"key": "X-Frame-Options", "value": "DENY"},
    {"key": "X-Content-Type-Options", "value": "nosniff"},
    {"key": "Content-Security-Policy", "value": "default-src 'self'; ..."}
  ]}]
  ```
  And equivalent `[[headers]]` blocks in `netlify.toml`.

### 15. Hardcoded Production API URL in Frontend Vercel Config
- **File:** `frontend/vercel.json`, lines 31–32
- **Severity:** MEDIUM
- **Detail:**
  ```json
  "env": {
    "REACT_APP_API_URL": "https://medai-production-45a2.up.railway.app"
  }
  ```
  The production backend URL is hardcoded in a committed config file. This exposes the production infrastructure endpoint to anyone with repository access.
- **Attack Chain:** Attacker reads the URL from the public/shared repo → directly attacks the production backend API → no need to discover infrastructure.
- **Fix:** Use Vercel environment variables configured through the dashboard, not in the committed `vercel.json`.

### 16. Deploy Script Creates .env with Default Credentials
- **File:** `deploy-simple.py`, lines 37–60
- **Severity:** MEDIUM
- **Detail:** The deployment script auto-generates a `.env` file containing default credentials:
  ```python
  JWT_SECRET=your-super-secret-jwt-key-that-is-at-least-256-bits-long
  DB_PASSWORD=telemedicine_password
  STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
  EMAIL_PASSWORD=your_app_password
  ```
  These are the same weak/predictable values used in `application.yml`. If the operator runs the deploy script and doesn't modify the generated `.env`, the application launches with guessable credentials.
- **Attack Chain:** Operator runs `python deploy-simple.py` → accepts defaults → application starts with known credentials → attacker tries default JWT secret/DB password.
- **Fix:** Generate random values for secrets in the script or refuse to proceed until the operator provides real values.

### 17. Backup Container Missing Password Environment Variable
- **File:** `docker-compose.enhanced.yml`, lines 299–325
- **Severity:** MEDIUM
- **Detail:** The backup container uses `$$MYSQL_ROOT_PASSWORD` in its inline script (line 317) but the `MYSQL_ROOT_PASSWORD` environment variable is not passed to the container. The container's `environment:` block only has `BACKUP_SCHEDULE` and `BACKUP_RETENTION_DAYS`. The `mysqldump` command will fail silently or produce incomplete backups.
- **Attack Chain:** Backups silently fail → no disaster recovery capability → if ransomware or data corruption occurs, patient data is lost → HIPAA violation for lack of adequate backup procedures.
- **Fix:** Add `- MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}` to the backup container's environment section. Better: use a dedicated backup user with limited privileges instead of root.

### 18. Docker Compose Port Conflicts
- **File:** `docker-compose.enhanced.yml`
- **Severity:** MEDIUM
- **Detail:** Two port conflicts exist:
  - **Port 9200:** Both `elasticsearch` (line 131) and `wazuh-indexer` (line 259) bind to host port 9200
  - **Port 443:** Both `nginx` (line 217) and `wazuh-dashboard` (line 284) bind to host port 443
  
  Only one service per conflict can start successfully; the other fails silently, leaving either the security monitoring stack or the application stack partially non-functional.
- **Attack Chain:** If wazuh-indexer fails to start → Wazuh security monitoring is non-functional → no intrusion detection. If nginx fails → no TLS termination → all traffic is unencrypted.
- **Fix:** Assign unique host ports (e.g., wazuh-indexer on 9201, wazuh-dashboard on 8443).

### 19. Prometheus Scrapes Actuator Without Authentication
- **File:** `prometheus.yml`, lines 16–20
- **Severity:** MEDIUM
- **Detail:**
  ```yaml
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:8080']
    metrics_path: '/actuator/prometheus'
  ```
  Prometheus scrapes the Spring Boot actuator Prometheus endpoint without any authentication headers configured. If actuator endpoints are ever secured (as they should be), this scrape config will break. Currently it works because actuator is unauthenticated, compounding the actuator exposure issue.
- **Attack Chain:** This keeps the actuator endpoint as a hard dependency for monitoring, creating resistance to securing it. Metrics may also expose business-sensitive data (request rates, error patterns, JVM internals).
- **Fix:** Add `bearer_token` or `basic_auth` to the Prometheus scrape config. Secure the actuator endpoint.

### 20. Render Deployment Has No Health Check, Env Vars, or Headers
- **File:** `render.yaml`
- **Severity:** MEDIUM
- **Detail:** The Render deployment is a minimal 7-line config with `autoDeploy: true` and no health check, no environment variables, no security headers, and no access controls. Any push to the connected branch triggers an automatic production deployment without gates.
- **Attack Chain:** A compromised or careless commit triggers auto-deploy → malicious frontend code goes to production immediately → no health check means broken deployments stay live.
- **Fix:** Add `healthCheckPath`, configure environment variables, add security headers, and consider disabling `autoDeploy` for production.

---

## Summary Table

| # | Severity | File | Line(s) | Finding |
|---|----------|------|---------|---------|
| 1 | CRITICAL | `docker-compose.enhanced.yml` | 286–287 | Wazuh hardcoded credentials: admin/SecretPassword |
| 2 | CRITICAL | `application.yml` | 39–41 | Spring Security default admin/admin user |
| 3 | CRITICAL | `.env.enhanced` | (entire file) | Secrets template committed to git (not in .gitignore) |
| 4 | CRITICAL | `gcp-credentials-template.json` | (entire file) | GCP credential template committed (not in .gitignore) |
| 5 | HIGH | `docker-compose.simple.yml` | 22–29 | Redis exposed without any authentication |
| 6 | HIGH | `docker-compose.enhanced.yml` | 179, 188 | Prometheus exposed with lifecycle API (remote shutdown) |
| 7 | HIGH | `docker-compose.enhanced.yml` | 139–150 | Kibana exposed on port 5601 without authentication |
| 8 | HIGH | `docker-compose.enhanced.yml` | 153–171 | Logstash ports 5044/5000/9600 exposed without auth |
| 9 | HIGH | `docker-compose.enhanced.yml` | 231–252 | Wazuh Manager API exposed on port 55000 |
| 10 | HIGH | `.env.enhanced` / `application.yml` | 10 / 6 | Database `useSSL=false` — unencrypted PHI in transit |
| 11 | HIGH | `.github/workflows/deploy.yml` | 39 | Bandit security scan silenced with `\|\| true` |
| 12 | HIGH | `application.yml` | 74–78 | DEBUG logging for Security and Web in production |
| 13 | MEDIUM | `application.yml` | 89 | Health endpoint `show-details: always` |
| 14 | MEDIUM | `vercel.json` / `netlify.toml` | — | No security headers (HSTS, CSP, X-Frame-Options) |
| 15 | MEDIUM | `frontend/vercel.json` | 31–32 | Hardcoded production API URL committed |
| 16 | MEDIUM | `deploy-simple.py` | 37–60 | Deploy script creates .env with default credentials |
| 17 | MEDIUM | `docker-compose.enhanced.yml` | 299–325 | Backup container missing DB password env var |
| 18 | MEDIUM | `docker-compose.enhanced.yml` | 131/259, 217/284 | Port conflicts: 9200 and 443 double-bound |
| 19 | MEDIUM | `prometheus.yml` | 16–20 | Prometheus scrapes actuator without auth |
| 20 | MEDIUM | `render.yaml` | 1–7 | No health check, env vars, headers, or deploy gates |
