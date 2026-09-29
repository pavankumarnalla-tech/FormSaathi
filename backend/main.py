from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models.user                # Ensure User model is loaded before create_all
import models.government_form     # Ensure GovernmentForm models are loaded
from routes import form_analysis, ai_assistance, auth

# Initialize DB tables on startup
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")
except Exception as e:
    print(f"Warning: Database initialization error: {e}")

app = FastAPI(
    title="Form Saathi Backend API",
    version="3.0.0",
    description="AI-powered Government Form Guidance and Discovery Platform API"
)

# Configure CORS for frontend access
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://form-saathi-bv6g.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include active guidance routes
app.include_router(auth.router,          prefix="/api/auth",  tags=["Authentication"])
app.include_router(form_analysis.router, prefix="/api/forms", tags=["Document Understanding"])
app.include_router(ai_assistance.router, prefix="/api/ai",    tags=["AI Saathi Guidance"])

@app.get("/")
def read_root():
    return {
        "message": "Form Saathi API is running",
        "platform": "AI-powered Government Form Guidance & Discovery Platform"
    }

