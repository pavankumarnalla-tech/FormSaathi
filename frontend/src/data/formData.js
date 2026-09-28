export const forms = [
  {
    id: 1,
    name: "Income Certificate Application",
    categoryId: "income",
    categoryName: "Income",
    shortDescription: "Application used for income certificate-related services.",
    purpose: "To officially certify the annual income of an individual or family for government benefits, fee reimbursement, and reservations.",
    eligibility: "Any citizen residing in the state.",
    requiredDocuments: [
      "Identity Proof (Aadhaar/Voter ID)", 
      "Address Proof", 
      "Recent Passport Size Photo", 
      "Ration Card / Food Security Card (if applicable)",
      "Salary certificate or income proof"
    ],
    fee: "Demo: ₹50 (Processing fee at MeeSeva / CSC)",
    whereToApply: "Sample: Nearest MeeSeva/Common Service Centers or online citizen portal.",
    instructions: [
      "Fill all personal details accurately matching your Aadhaar.",
      "Calculate total annual income from all sources.",
      "Attach self-attested copies of required documents.",
      "Submit the form to the nearest service center or online portal."
    ],
    officialSource: "Sample reference — replace with verified official source before production.",
    keywords: ["income", "certificate", "revenue", "money", "earnings", "salary"]
  },
  {
    id: 2,
    name: "Residence Certificate Application",
    categoryId: "certificates",
    categoryName: "Certificates",
    shortDescription: "Application to prove continuous residence in a specific state or local area.",
    purpose: "To prove domicile or residential status for educational admissions, employment, or state-specific schemes.",
    eligibility: "Must be a continuous resident of the state/district for the specified number of years (usually 4 to 7 years).",
    requiredDocuments: [
      "Identity Proof (Aadhaar)",
      "Address Proof (Electricity Bill / Gas Bill)",
      "Study certificates from local schools (for students)",
      "House tax receipt (if property owner)"
    ],
    fee: "Demo: ₹35",
    whereToApply: "Sample: Online state portal or local Mandal Revenue Office (MRO).",
    instructions: [
      "Provide exact dates of residence.",
      "Include all places lived within the state.",
      "Attach relevant study certificates if applying for educational purposes."
    ],
    officialSource: "Sample reference — replace with verified official source before production.",
    keywords: ["residence", "domicile", "local", "nativity", "address", "certificates"]
  },
  {
    id: 3,
    name: "Student Scholarship Application",
    categoryId: "education",
    categoryName: "Education",
    shortDescription: "Form for students applying for state/central government scholarships.",
    purpose: "To provide financial assistance to eligible students pursuing higher education.",
    eligibility: "Students admitted to recognized institutions, meeting specific family income criteria.",
    requiredDocuments: [
      "Income Certificate",
      "Caste Certificate (if applicable)",
      "Previous year marks memo",
      "Bank Account Passbook (front page)",
      "Aadhaar Card",
      "College Admission/Bonafide Certificate"
    ],
    fee: "Demo: No Fee",
    whereToApply: "Sample: State e-Pass or National Scholarship Portal.",
    instructions: [
      "Ensure bank account is seeded with Aadhaar.",
      "Upload clear scanned copies of all documents.",
      "Take a printout and submit to the college principal for verification."
    ],
    officialSource: "Sample reference — replace with verified official source before production.",
    keywords: ["scholarship", "student", "education", "school", "college", "epass", "reimbursement"]
  },
  {
    id: 4,
    name: "Birth Certificate Application",
    categoryId: "certificates",
    categoryName: "Certificates",
    shortDescription: "Form to register and obtain a birth certificate.",
    purpose: "To officially record a birth and obtain the foundational identity document.",
    eligibility: "Parents or legal guardians of the newborn.",
    requiredDocuments: [
      "Hospital discharge summary or birth report",
      "Parents' Identity Proofs (Aadhaar/Voter ID)",
      "Marriage Certificate of parents (optional but helpful)"
    ],
    fee: "Demo: ₹20 if applied within 21 days.",
    whereToApply: "Sample: Municipal Corporation or Gram Panchayat office.",
    instructions: [
      "Apply within 21 days of birth to avoid late fees.",
      "Ensure the spelling of the child's and parents' names is absolutely correct."
    ],
    officialSource: "Sample reference — replace with verified official source before production.",
    keywords: ["birth", "certificate", "newborn", "child", "municipality"]
  },
  {
    id: 5,
    name: "Senior Citizen Identity Card",
    categoryId: "social_welfare",
    categoryName: "Social Welfare",
    shortDescription: "Application for Senior Citizen ID to avail concessions.",
    purpose: "To provide an official ID card that grants senior citizens access to travel concessions, medical benefits, and special schemes.",
    eligibility: "Any citizen aged 60 years or above.",
    requiredDocuments: [
      "Age Proof (Aadhaar, Passport, or Birth Certificate)",
      "Address Proof",
      "Medical Certificate (Blood Group)",
      "3 Passport Size Photographs"
    ],
    fee: "Demo: No Fee",
    whereToApply: "Sample: Department of Senior Citizens Welfare or authorized centers.",
    instructions: [
      "Ensure age proof clearly shows the date of birth.",
      "Provide a valid emergency contact number."
    ],
    officialSource: "Sample reference — replace with verified official source before production.",
    keywords: ["senior", "elderly", "pension", "welfare", "concession", "identity"]
  },
  {
    id: 6,
    name: "Driving License Learner's Form",
    categoryId: "transport",
    categoryName: "Transport",
    shortDescription: "Application for obtaining a Learner's License for driving.",
    purpose: "To legally authorize an individual to learn how to drive a motor vehicle on public roads.",
    eligibility: "Minimum age 16 for gearless motorcycles, 18 for other vehicles.",
    requiredDocuments: [
      "Age Proof",
      "Address Proof",
      "Medical Certificate (Form 1A) if applicable",
      "Passport Size Photographs"
    ],
    fee: "Demo: ₹200 per vehicle class",
    whereToApply: "Sample: Parivahan Portal or local RTO.",
    instructions: [
      "Book a slot for the computerized test.",
      "Pass the basic traffic rules test to get the license."
    ],
    officialSource: "Sample reference — replace with verified official source before production.",
    keywords: ["driving", "license", "vehicle", "car", "bike", "rto", "transport", "learner"]
  }
];
