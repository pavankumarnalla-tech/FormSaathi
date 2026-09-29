from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, JSON
from datetime import datetime
from database import Base

class GovernmentForm(Base):
    __tablename__ = "government_forms"

    id = Column(Integer, primary_key=True, index=True)
    form_key = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    service_type = Column(String(50), default="FORM")        # FORM | ONLINE_SERVICE
    government_level = Column(String(50), default="TELANGANA") # TELANGANA | NATIONAL
    department = Column(String(255), nullable=True)
    ministry = Column(String(255), nullable=True)
    category_id = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    official_source_url = Column(String(500), nullable=True)
    official_application_url = Column(String(500), nullable=True)
    template_path = Column(String(255), nullable=True)
    status = Column(String(50), default="official-template-ready") # official-template-ready | official-source-only | coming-soon
    version = Column(String(20), default="1.0")
    last_verified = Column(String(20), default="2026-09-29")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FormFieldMapping(Base):
    __tablename__ = "form_field_mappings"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("government_forms.id"), nullable=False)
    field_key = Column(String(100), nullable=False)
    field_label = Column(String(255), nullable=False)
    original_label = Column(String(255), nullable=True)
    field_type = Column(String(50), default="TEXT")
    section = Column(String(100), nullable=True)
    required = Column(Boolean, default=True)
    pdf_field_name = Column(String(100), nullable=True)
    page_number = Column(Integer, default=1)
    x_position = Column(Float, nullable=True)
    y_position = Column(Float, nullable=True)
    width = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    mapping_type = Column(String(50), default="COORDINATE") # COORDINATE | ACROFORM | UNMAPPED
    verified = Column(Boolean, default=True)


class UserApplication(Base):
    __tablename__ = "user_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    form_id = Column(String(50), nullable=False)
    form_name = Column(String(255), nullable=False)
    status = Column(String(50), default="In Progress")     # In Progress | Completed
    form_values = Column(Text, nullable=True)             # JSON string of submitted answers
    generated_pdf_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
