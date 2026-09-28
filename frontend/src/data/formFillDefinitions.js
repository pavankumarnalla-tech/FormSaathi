// Centralized sample form-fields definition used by the Form Saathi Filling page (Step 6).
// Each form entry here maps to a form in formData.js by matching 'id'.

export const formFillDefinitions = {
  1: { // Income Certificate Application
    sections: [
      {
        name: "Personal Information",
        fields: [
          { name: "Full Name",        key: "fullName",      type: "text",   required: true,  description: "Enter your full legal name exactly as on your Aadhaar card.",   placeholder: "e.g. Pavan Kumar" },
          { name: "Date of Birth",    key: "dob",           type: "date",   required: true,  description: "Date of birth as shown on your identity document." },
          { name: "Gender",           key: "gender",        type: "radio",  required: true,  description: "Select your gender.", options: ["Male", "Female", "Other"] },
          { name: "Aadhaar Number",   key: "aadhaar",       type: "text",   required: true,  description: "12-digit Aadhaar UID (you can write XXXX XXXX in place of first 8 digits for privacy).", placeholder: "XXXX XXXX 1234" }
        ]
      },
      {
        name: "Income Details",
        fields: [
          { name: "Annual Income (₹)", key: "annualIncome",   type: "number",   required: true,  description: "Total income earned by your family from all sources in one year (salary, business, agriculture, etc.).", placeholder: "e.g. 120000" },
          { name: "Occupation",         key: "occupation",    type: "text",     required: true,  description: "Your current primary occupation.", placeholder: "e.g. Farmer / Govt. Employee / Business" },
          { name: "Source of Income",   key: "sourceIncome",  type: "text",     required: false, description: "Main source of your income — e.g. Salary, Agriculture, Business.", placeholder: "e.g. Salary" }
        ]
      },
      {
        name: "Contact & Address",
        fields: [
          { name: "Mobile Number",    key: "mobile",      type: "tel",      required: true,  description: "Active 10-digit mobile number for updates.", placeholder: "e.g. 9876543210" },
          { name: "Permanent Address",key: "address",     type: "textarea", required: true,  description: "Your full residential address.", placeholder: "Door No., Street, Area, City, State, Pincode" },
          { name: "Date of Application",key: "appDate",   type: "date",     required: true,  description: "Today's date." }
        ]
      },
      {
        name: "Documents",
        fields: [
          { name: "Identity Proof",   key: "doc_identity",  type: "file",   required: true,  description: "Upload Aadhaar Card, Voter ID, or Passport.",              docLabel: "Identity Proof" },
          { name: "Address Proof",    key: "doc_address",   type: "file",   required: true,  description: "Upload an electricity bill, gas bill, or ration card.",   docLabel: "Address Proof" },
          { name: "Income Proof",     key: "doc_income",    type: "file",   required: false, description: "Optional — salary slip or other income proof.",           docLabel: "Income Proof (optional)" }
        ]
      }
    ]
  },
  2: { // Residence Certificate
    sections: [
      {
        name: "Personal Information",
        fields: [
          { name: "Full Name",      key: "fullName",  type: "text",  required: true,  description: "Full legal name as on Aadhaar.", placeholder: "e.g. Priya Sharma" },
          { name: "Date of Birth",  key: "dob",       type: "date",  required: true,  description: "Date of birth as per identity document." },
          { name: "Aadhaar Number", key: "aadhaar",   type: "text",  required: true,  description: "12-digit Aadhaar number.", placeholder: "XXXX XXXX XXXX" }
        ]
      },
      {
        name: "Residence Details",
        fields: [
          { name: "Current Address",           key: "address",      type: "textarea", required: true,  description: "Full current residential address.", placeholder: "House No., Street, Village/City, District, State, Pincode" },
          { name: "Residing Since (Date/Year)",key: "residingSince", type: "text",    required: true,  description: "How long have you been residing at this address? Enter year or date.", placeholder: "e.g. 2010 or 01/06/2010" },
          { name: "State of Residence",        key: "state",        type: "text",     required: true,  description: "State where you are applying for residence certificate.", placeholder: "e.g. Telangana" }
        ]
      },
      {
        name: "Documents",
        fields: [
          { name: "Identity Proof",  key: "doc_identity", type: "file", required: true,  description: "Upload Aadhaar or Voter ID.", docLabel: "Identity Proof" },
          { name: "Address Proof",   key: "doc_address",  type: "file", required: true,  description: "Electricity bill, gas bill or rental agreement.", docLabel: "Address Proof" }
        ]
      }
    ]
  },
  3: { // Student Scholarship
    sections: [
      {
        name: "Student Information",
        fields: [
          { name: "Full Name",      key: "fullName",   type: "text",   required: true,  description: "Name as on marks memo.", placeholder: "e.g. Rahul Yadav" },
          { name: "Date of Birth",  key: "dob",        type: "date",   required: true,  description: "Date of birth as per birth certificate or Aadhaar." },
          { name: "Gender",         key: "gender",     type: "radio",  required: true,  description: "Select gender.", options: ["Male", "Female", "Other"] },
          { name: "Aadhaar Number", key: "aadhaar",    type: "text",   required: true,  description: "12-digit Aadhaar UID.", placeholder: "XXXX XXXX XXXX" },
          { name: "Caste Category", key: "caste",      type: "select", required: true,  description: "Your caste category as per caste certificate.", options: ["General", "OBC", "SC", "ST", "EWS"] }
        ]
      },
      {
        name: "Education Details",
        fields: [
          { name: "College / Institution Name", key: "college",  type: "text",   required: true,  description: "Name of the institution you are currently studying in.", placeholder: "e.g. Government Degree College" },
          { name: "Course",                      key: "course",   type: "text",   required: true,  description: "Name of the course you are pursuing.", placeholder: "e.g. B.Tech / B.Sc / B.A." },
          { name: "Academic Year",               key: "year",     type: "text",   required: true,  description: "Current academic year.", placeholder: "e.g. 2024–25" },
          { name: "Previous Year Marks (%)",     key: "marks",    type: "number", required: true,  description: "Percentage obtained in the previous academic year.", placeholder: "e.g. 78" }
        ]
      },
      {
        name: "Family & Income",
        fields: [
          { name: "Parent/Guardian Name",        key: "parentName",    type: "text",   required: true,  description: "Name of your parent or guardian.", placeholder: "e.g. Suresh Yadav" },
          { name: "Annual Family Income (₹)",    key: "familyIncome",  type: "number", required: true,  description: "Total annual income of your entire family.", placeholder: "e.g. 80000" }
        ]
      },
      {
        name: "Bank Details",
        fields: [
          { name: "Bank Account Number", key: "bankAcc",  type: "text",   required: true,  description: "Bank account number where scholarship will be credited.", placeholder: "Enter account number" },
          { name: "IFSC Code",           key: "ifsc",     type: "text",   required: true,  description: "11-character IFSC code of your bank branch.", placeholder: "e.g. SBIN0001234" }
        ]
      },
      {
        name: "Documents",
        fields: [
          { name: "Income Certificate",         key: "doc_income",    type: "file", required: true,  description: "Valid income certificate issued by a competent authority.", docLabel: "Income Certificate" },
          { name: "Caste Certificate",          key: "doc_caste",     type: "file", required: false, description: "Caste certificate (if applicable).", docLabel: "Caste Certificate (if applicable)" },
          { name: "Marks Memo",                 key: "doc_marks",     type: "file", required: true,  description: "Previous year marks memo.", docLabel: "Previous Year Marks Memo" },
          { name: "Bank Passbook (Front Page)", key: "doc_bank",      type: "file", required: true,  description: "Front page of bank passbook showing account details.", docLabel: "Bank Passbook" }
        ]
      }
    ]
  }
};

// Default fallback for forms not yet fully defined
export const defaultSections = (formName) => ([
  {
    name: "Personal Information",
    fields: [
      { name: "Full Name",     key: "fullName", type: "text", required: true,  description: "Your full legal name.",           placeholder: "Enter your full name" },
      { name: "Date of Birth", key: "dob",      type: "date", required: true,  description: "Your date of birth." },
      { name: "Mobile Number", key: "mobile",   type: "tel",  required: true,  description: "Active mobile number.",           placeholder: "10-digit mobile number" }
    ]
  },
  {
    name: "Address",
    fields: [
      { name: "Permanent Address", key: "address", type: "textarea", required: true, description: "Your full residential address.", placeholder: "House No., Street, City, State, Pincode" }
    ]
  }
]);

// Maps backend analysis fields (from step 5) to form-fill field definitions
export const mapAnalysisToFillSections = (analysisSections) => {
  return analysisSections.map(section => ({
    name: section.name,
    fields: section.fields.map(f => ({
      name: f.name,
      key: f.name.toLowerCase().replace(/\s+/g, '_'),
      type: f.type === 'signature' ? 'text' : f.type,
      required: f.required,
      description: f.help || '',
      placeholder: '',
      prefillValue: f.value || '',
      prefillSource: f.value ? 'uploaded_form' : null
    }))
  }));
};
