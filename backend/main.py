from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models.user  # Ensure User model is loaded before create_all
from routes import form_analysis, ai_assistance, form_generate, auth

# Initialize DB tables on startup
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")
except Exception as e:
    print(f"Warning: Database initialization error (make sure MySQL is running): {e}")

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
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(form_analysis.router, prefix="/api/forms", tags=["Forms"])
app.include_router(ai_assistance.router, prefix="/api/ai", tags=["AI Assistance"])
app.include_router(form_generate.router, prefix="/api/forms", tags=["PDF Generation"])

@app.get("/")
def read_root():
    return {"message": "Form Saathi API is running"}
