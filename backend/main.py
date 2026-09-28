from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import form_analysis

app = FastAPI(title="Form Saathi Backend API", version="1.0.0")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(form_analysis.router, prefix="/api/forms", tags=["Forms"])

@app.get("/")
def read_root():
    return {"message": "Form Saathi API is running"}
