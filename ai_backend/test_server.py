from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Test AI Telemedicine API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Telemedicine Test API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}

@app.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint working", "features": [
        "Bloodwork Analysis with Cancer Risk Assessment",
        "X-ray AI Analysis with Doctor Notes",
        "Medication Tracking and Life Impact Analysis",
        "Vaccination Records and Missing Vaccines",
        "Surgical Procedure Guides for Doctors"
    ]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 