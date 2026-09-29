/**
 * Form Saathi — Government Form & Service Catalogue
 *
 * VERIFIED SOURCES (as of September 2026):
 *   Telangana State Portal:     https://www.telangana.gov.in/
 *   Telangana Public Forms:     https://www.telangana.gov.in/services/public-utility-forms/
 *   Telangana MeeSeva:          https://ts.meeseva.telangana.gov.in/
 *   National Portal of India:   https://www.india.gov.in/
 *   Parivahan (MoRTH):         https://parivahan.gov.in/
 *   NSDL PAN:                   https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html
 *
 * serviceType: "FORM" | "ONLINE_SERVICE"
 * governmentLevel: "TELANGANA" | "NATIONAL"
 * status: "official-template-ready" | "official-source-only" | "coming-soon"
 */

export const forms = [

  /* ══════════════════════════════════════════════════════════
     TELANGANA — OFFICIAL TEMPLATE READY (FORM TYPE)
  ══════════════════════════════════════════════════════════ */

  {
    id: 1,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "official-template-ready",
    name: "Income Certificate Application",
    categoryId: "income",
    categoryName: "Income & Tax",
    department: "Revenue Department",
    ministry: "Government of Telangana",
    shortDescription: "Apply for an official Income Certificate issued by the Revenue Department, Telangana.",
    purpose: "To officially certify the annual income of an individual or family for government benefits, fee reimbursement, scholarship eligibility, and reservations.",
    eligibility: "Any citizen residing in Telangana who requires proof of income for official purposes.",
    requiredDocuments: [
      "Identity Proof — Aadhaar Card (mandatory)",
      "Address Proof — Ration Card / Electricity Bill / Aadhaar",
      "Recent Passport Size Photograph",
      "Salary Certificate (for salaried employees) or Income Declaration",
      "Ration Card / Food Security Card (if applicable)"
    ],
    fee: "Verified at MeeSeva / CSC portal.",
    whereToApply: "Nearest MeeSeva Centre / Common Service Centre (CSC) or online via Telangana ePASS / MeeSeva portal.",
    instructions: [
      "Fill in all personal details exactly as they appear on your Aadhaar card.",
      "Calculate total annual income from ALL sources (salary, agriculture, business, etc.).",
      "Attach self-attested photocopies of all required documents.",
      "Submit the application form along with supporting documents at the nearest MeeSeva centre.",
      "Collect the certificate once it is digitally signed and ready."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/meeseva-services/",
    officialApplicationUrl: "https://ts.meeseva.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["income", "certificate", "revenue", "earnings", "salary", "meeseva", "telangana", "aayam"]
  },

  {
    id: 2,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "official-template-ready",
    name: "Residence Certificate Application",
    categoryId: "certificates",
    categoryName: "Identity & Certificates",
    department: "Revenue Department",
    ministry: "Government of Telangana",
    shortDescription: "Apply for a Residence Certificate proving continuous residence in Telangana.",
    purpose: "To prove domicile or residential status in Telangana for educational admissions, employment applications, or state-specific government schemes.",
    eligibility: "Must be a resident of Telangana. Minimum continuous residence period may be required for specific purposes — verify with the issuing authority.",
    requiredDocuments: [
      "Identity Proof — Aadhaar Card",
      "Address Proof — Electricity Bill / Gas Bill / Ration Card / Rental Agreement",
      "Study Certificates from local schools or colleges (if applying for educational purpose)",
      "House Tax Receipt (if property owner)"
    ],
    fee: "Verified at MeeSeva / CSC portal.",
    whereToApply: "Nearest MeeSeva Centre or local Mandal Revenue Office (MRO) / Tahsildar Office.",
    instructions: [
      "Provide accurate details of your current and all previous addresses in Telangana.",
      "Attach valid address proof clearly showing the residential address.",
      "If applying for educational purposes, include study certificates from schools or colleges in the district.",
      "Submit at the nearest MeeSeva centre or Tahsildar office."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/meeseva-services/",
    officialApplicationUrl: "https://ts.meeseva.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["residence", "domicile", "nativity", "address", "certificate", "telangana", "meeseva"]
  },

  {
    id: 3,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "official-template-ready",
    name: "Caste Certificate Application",
    categoryId: "certificates",
    categoryName: "Identity & Certificates",
    department: "Revenue Department / BC Welfare",
    ministry: "Government of Telangana",
    shortDescription: "Apply for an official Caste Certificate (SC / ST / OBC / BC) issued by the Revenue Department, Telangana.",
    purpose: "To obtain an official document certifying community/caste status for reservations, government schemes, educational admissions, and employment.",
    eligibility: "Citizens belonging to Scheduled Caste (SC), Scheduled Tribe (ST), Other Backward Classes (OBC/BC), or Economically Weaker Sections (EWS) residing in Telangana.",
    requiredDocuments: [
      "Identity Proof — Aadhaar Card",
      "Address Proof",
      "Caste Proof — Caste certificate or declaration of a parent or grandparent (if available)",
      "Ration Card (showing family details)",
      "School Transfer Certificate showing caste (if available)"
    ],
    fee: "Verified at MeeSeva / CSC portal.",
    whereToApply: "Nearest MeeSeva Centre or Tahsildar / Mandal Revenue Office (MRO).",
    instructions: [
      "Carry original identity proof and address proof documents for verification.",
      "If caste proof of a parent or grandparent is available, include it — it significantly speeds up the process.",
      "The Tahsildar may conduct a field enquiry to verify the application.",
      "The certificate will be digitally signed and issued after verification."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/meeseva-services/",
    officialApplicationUrl: "https://ts.meeseva.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["caste", "sc", "st", "obc", "bc", "certificate", "reservation", "telangana", "meeseva", "jati"]
  },

  {
    id: 4,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "official-template-ready",
    name: "Birth Certificate Application",
    categoryId: "certificates",
    categoryName: "Identity & Certificates",
    department: "Municipal Administration / Gram Panchayat",
    ministry: "Government of Telangana",
    shortDescription: "Apply for an official Birth Certificate for a child born in Telangana.",
    purpose: "To officially register a birth and obtain the foundational identity document required for school admission, Aadhaar, passport, and all other government purposes.",
    eligibility: "Parents or legal guardians of a child born in Telangana. Should be applied within 21 days of birth to avoid late registration fees.",
    requiredDocuments: [
      "Hospital Discharge Summary or Birth Report issued by the hospital / nursing home",
      "Identity Proof of both parents — Aadhaar Card / Voter ID",
      "Marriage Certificate of parents (if available)",
      "Address Proof of parents"
    ],
    fee: "Verified at local Municipal Corporation / Gram Panchayat.",
    whereToApply: "Local Municipal Corporation office, Municipal Panchayat, or Gram Panchayat of the area where the birth occurred.",
    instructions: [
      "Apply within 21 days of the child's birth. Late registration requires additional documentation.",
      "Ensure the correct spelling of the child's name and parents' names is provided.",
      "Collect the birth report from the hospital before leaving.",
      "Both parents' names, date of birth, place of birth, and address must be accurately recorded."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/public-utility-forms/",
    officialApplicationUrl: "https://cdma.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["birth", "certificate", "newborn", "child", "municipality", "gram panchayat", "telangana", "janma"]
  },

  {
    id: 5,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "official-template-ready",
    name: "Integrated Certificate Application",
    categoryId: "certificates",
    categoryName: "Identity & Certificates",
    department: "Revenue Department",
    ministry: "Government of Telangana",
    shortDescription: "Apply for an Integrated Certificate combining Caste, Residence, and Income in a single document.",
    purpose: "A combined certificate covering caste, residence, and income status — required for college admissions, scholarship applications, and government benefit programmes.",
    eligibility: "Citizens of Telangana belonging to SC/ST/BC/OBC/EWS communities who require a combined certificate for educational or employment purposes.",
    requiredDocuments: [
      "Identity Proof — Aadhaar Card",
      "Address Proof",
      "Caste Proof or parent/grandparent caste certificate",
      "Income Proof or salary certificate",
      "Ration Card",
      "School / College Certificate"
    ],
    fee: "Verified at MeeSeva / CSC portal.",
    whereToApply: "Nearest MeeSeva Centre or Tahsildar office.",
    instructions: [
      "The Integrated Certificate is particularly useful for college admissions under reservation quota.",
      "Carry all original documents for verification at the MeeSeva centre.",
      "The certificate is digitally signed and issued within the prescribed working days."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/meeseva-services/",
    officialApplicationUrl: "https://ts.meeseva.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["integrated", "certificate", "caste", "income", "residence", "combined", "telangana", "meeseva"]
  },

  {
    id: 6,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "official-template-ready",
    name: "Death Registration Application",
    categoryId: "certificates",
    categoryName: "Identity & Certificates",
    department: "Municipal Administration / Gram Panchayat",
    ministry: "Government of Telangana",
    shortDescription: "Register a death and obtain a Death Certificate through the local municipal authority in Telangana.",
    purpose: "To officially register a death and obtain the Death Certificate required for legal processes such as inheritance, insurance claims, pension stoppage, and bank account settlement.",
    eligibility: "Family members or legal representatives of a deceased person who died in Telangana.",
    requiredDocuments: [
      "Death Intimation Form from the hospital or declaration from a family member",
      "Medical Certificate of Death (if the death occurred at a hospital)",
      "Identity Proof of the applicant (Aadhaar / Voter ID)",
      "Proof of deceased's address",
      "Ration Card or family document (if available)"
    ],
    fee: "Verified at local Municipal Corporation / Gram Panchayat.",
    whereToApply: "Local Municipal Corporation office or Gram Panchayat of the area where the death occurred.",
    instructions: [
      "Register the death within 21 days. Late registration requires a report from local authority.",
      "If the death occurred in a hospital, obtain the medical cause-of-death certificate from the hospital.",
      "Both the date and cause of death must be accurately documented."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/public-utility-forms/",
    officialApplicationUrl: "https://cdma.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["death", "certificate", "registration", "municipality", "gram panchayat", "telangana", "maranam"]
  },

  {
    id: 13,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "official-template-ready",
    name: "Economically Weaker Sections (EWS) Certificate",
    categoryId: "income",
    categoryName: "Income & Tax",
    department: "Revenue Department",
    ministry: "Government of Telangana",
    shortDescription: "Apply for EWS Certificate for 10% reservation in educational admissions and state government employment.",
    purpose: "Provides official certification of Economically Weaker Section status for General Category citizens with family income below ₹8 Lakh per annum.",
    eligibility: "General Category citizens residing in Telangana whose family gross annual income is below ₹8 Lakh and who do not belong to SC/ST/BC categories.",
    requiredDocuments: [
      "Aadhaar Card of Applicant",
      "Income Certificate / Income Proof of all family members",
      "Property / Land documents (if applicable)",
      "Ration Card / Food Security Card",
      "Self-Declaration Affidavit"
    ],
    fee: "Verified at MeeSeva / CSC portal.",
    whereToApply: "Nearest MeeSeva Centre or Tahsildar / Mandal Revenue Office (MRO).",
    instructions: [
      "Ensure all family members' incomes are calculated and declared correctly.",
      "Submit self-declaration along with identity and address proofs.",
      "Tahsildar issues certificate after field verification."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/meeseva-services/",
    officialApplicationUrl: "https://ts.meeseva.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["ews", "economically weaker section", "income", "reservation", "revenue", "meeseva", "telangana"]
  },

  {
    id: 14,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "official-template-ready",
    name: "Family Member Certificate Application",
    categoryId: "certificates",
    categoryName: "Identity & Certificates",
    department: "Revenue Department",
    ministry: "Government of Telangana",
    shortDescription: "Official application to certify living legal family members of a deceased individual.",
    purpose: "Required for receiving government ex-gratia payments, pension transfer, compassionate appointment, or legal heir representation.",
    eligibility: "Surviving family members (spouse, children, parents) of a deceased resident of Telangana.",
    requiredDocuments: [
      "Death Certificate of the deceased",
      "Aadhaar Cards of all surviving family members",
      "Ration Card / Household Card showing family relationships",
      "Notarized Affidavit signed by family members"
    ],
    fee: "Verified at MeeSeva / CSC portal.",
    whereToApply: "Nearest MeeSeva Centre or Mandal Revenue Office (MRO).",
    instructions: [
      "List all living legal heirs in the application.",
      "Attach death certificate of the deceased and identity cards of all legal heirs."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/meeseva-services/",
    officialApplicationUrl: "https://ts.meeseva.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["family", "family member", "legal heir", "revenue", "meeseva", "telangana"]
  },

  {
    id: 15,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "official-template-ready",
    name: "Senior Citizen Identity Card Application",
    categoryId: "social_welfare",
    categoryName: "Social Welfare",
    department: "Department of Senior Citizens Welfare",
    ministry: "Government of Telangana",
    shortDescription: "Apply for official Senior Citizen Identity Card to avail welfare concessions and health benefits.",
    purpose: "Provides official ID card for senior citizens to claim travel concessions, medical benefits, and government welfare priority.",
    eligibility: "Citizens aged 60 years or above residing in Telangana.",
    requiredDocuments: [
      "Age Proof — Aadhaar / Voter ID / Birth Certificate / Passport",
      "Address Proof — Aadhaar / Electricity Bill",
      "Blood Group / Medical Certificate",
      "Recent Passport Size Photographs"
    ],
    fee: "No Fee (Free Service).",
    whereToApply: "Nearest MeeSeva Centre or District Senior Citizens Welfare Office.",
    instructions: [
      "Verify that age proof clearly indicates date of birth showing age 60 or above.",
      "Provide active emergency contact details."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/public-utility-forms/",
    officialApplicationUrl: "https://ts.meeseva.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["senior citizen", "elderly", "welfare", "concession", "identity card", "telangana"]
  },

  /* ══════════════════════════════════════════════════════════
     ONLINE SERVICES & PENDING INTEGRATIONS (OFFICIAL SOURCE ONLY)
  ══════════════════════════════════════════════════════════ */

  {
    id: 7,
    serviceType: "ONLINE_SERVICE",
    governmentLevel: "TELANGANA",
    status: "official-source-only",
    name: "Voter ID / EPIC Card (Name Inclusion / Correction)",
    categoryId: "identity",
    categoryName: "Identity & Certificates",
    department: "Telangana State Election Commission / ECI",
    ministry: "Election Commission of India",
    shortDescription: "Apply online for inclusion of your name in the Electoral Roll or correction of details on your EPIC (Voter ID) card.",
    purpose: "To register as a voter, add your name to the electoral roll, correct name/address errors on your Voter ID, or get a new EPIC card.",
    eligibility: "Indian citizens aged 18 years or above as on the qualifying date.",
    requiredDocuments: [
      "Identity Proof — Aadhaar Card / PAN Card / Passport / Driving Licence",
      "Age Proof — Aadhaar / Birth Certificate / School Leaving Certificate",
      "Address Proof — Aadhaar / Electricity Bill / Bank Passbook",
      "Passport Size Photograph"
    ],
    fee: "No fee for voter registration.",
    whereToApply: "Online via National Voters Service Portal (nvsp.in) or Voter Helpline App.",
    instructions: [
      "Visit official National Voters Service Portal: https://nvsp.in",
      "Select Form 6 (new registration) or Form 8 (correction).",
      "Submit application online and track with reference number."
    ],
    officialSourceUrl: "https://eci.gov.in/",
    officialApplicationUrl: "https://nvsp.in/",
    lastVerified: "2026-09-29",
    keywords: ["voter", "epic", "election", "vote", "electoral roll", "voter id", "nvsp", "form 6"]
  },

  {
    id: 8,
    serviceType: "ONLINE_SERVICE",
    governmentLevel: "NATIONAL",
    status: "official-source-only",
    name: "PAN Card Application / Correction",
    categoryId: "income",
    categoryName: "Income & Tax",
    department: "Income Tax Department",
    ministry: "Ministry of Finance, Government of India",
    shortDescription: "Apply for a new PAN card or request correction/reprint of an existing PAN card online.",
    purpose: "PAN is a 10-digit alphanumeric identifier required for income tax filing and financial transactions.",
    eligibility: "Any Indian citizen or entity requiring a PAN.",
    requiredDocuments: [
      "Identity Proof — Aadhaar Card / Passport / Voter ID",
      "Date of Birth Proof — Aadhaar / Birth Certificate",
      "Address Proof — Aadhaar / Utility Bill"
    ],
    fee: "Verified at official NSDL / UTIITSL portal.",
    whereToApply: "Online via NSDL e-Gov (onlineservices.nsdl.com) or UTIITSL.",
    instructions: [
      "Visit NSDL PAN application portal.",
      "Fill online Form 49A / CSF, pay fee, and track status online."
    ],
    officialSourceUrl: "https://www.india.gov.in/",
    officialApplicationUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    lastVerified: "2026-09-29",
    keywords: ["pan", "permanent account number", "income tax", "finance", "tax", "nsdl"]
  },

  {
    id: 9,
    serviceType: "ONLINE_SERVICE",
    governmentLevel: "NATIONAL",
    status: "official-source-only",
    name: "Passport Application / Renewal",
    categoryId: "identity",
    categoryName: "Identity & Certificates",
    department: "Passport Seva",
    ministry: "Ministry of External Affairs, Government of India",
    shortDescription: "Apply for a new passport, renew an existing one, or get a Tatkaal passport online.",
    purpose: "Official travel document issued by Government of India for international travel.",
    eligibility: "Indian citizens of all ages.",
    requiredDocuments: [
      "Proof of Date of Birth — Birth Certificate / Aadhaar",
      "Identity Proof — Aadhaar Card / Voter ID",
      "Address Proof — Aadhaar / Utility Bill"
    ],
    fee: "Verified at Passport Seva portal.",
    whereToApply: "Online via passportindia.gov.in, then schedule appointment at PSK / POPSK.",
    instructions: [
      "Register on Passport Seva portal: https://passportindia.gov.in",
      "Fill online application, pay fee, book appointment at PSK."
    ],
    officialSourceUrl: "https://www.india.gov.in/",
    officialApplicationUrl: "https://passportindia.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["passport", "travel", "external affairs", "tatkaal", "psk"]
  },

  {
    id: 10,
    serviceType: "ONLINE_SERVICE",
    governmentLevel: "NATIONAL",
    status: "official-source-only",
    name: "Learner's Licence Application (Parivahan)",
    categoryId: "transport",
    categoryName: "Transport",
    department: "State Transport Authority",
    ministry: "Ministry of Road Transport and Highways, Government of India",
    shortDescription: "Apply online for a Learner's Licence via national Parivahan Sewa portal.",
    purpose: "Prerequisite for obtaining a permanent Driving Licence.",
    eligibility: "Minimum age 16 for gearless motorcycles, 18 for other vehicles.",
    requiredDocuments: [
      "Age Proof — Aadhaar / Birth Certificate",
      "Address Proof — Aadhaar / Utility Bill"
    ],
    fee: "Verified at Parivahan portal.",
    whereToApply: "Online via parivahan.gov.in",
    instructions: [
      "Visit Parivahan Sewa portal: https://parivahan.gov.in/",
      "Select state, fill Learner Licence application, schedule test."
    ],
    officialSourceUrl: "https://www.india.gov.in/",
    officialApplicationUrl: "https://parivahan.gov.in/parivahan/",
    lastVerified: "2026-09-29",
    keywords: ["driving", "licence", "learner", "vehicle", "rto", "parivahan"]
  },

  {
    id: 11,
    serviceType: "ONLINE_SERVICE",
    governmentLevel: "NATIONAL",
    status: "official-source-only",
    name: "National Scholarship Portal (NSP)",
    categoryId: "education",
    categoryName: "Education",
    department: "National Scholarship Portal",
    ministry: "Ministry of Electronics and Information Technology",
    shortDescription: "Apply for central government scholarships via National Scholarship Portal.",
    purpose: "Financial assistance for meritorious students from economically weaker sections.",
    eligibility: "Eligible students enrolled in recognised institutions.",
    requiredDocuments: [
      "Aadhaar Card (seeded with bank account)",
      "Bank Account Passbook",
      "Previous Year Mark Sheet",
      "Income Certificate"
    ],
    fee: "No fee.",
    whereToApply: "Online via NSP portal: https://scholarships.gov.in/",
    instructions: [
      "Register on NSP portal: https://scholarships.gov.in/",
      "Fill academic & income details, upload documents."
    ],
    officialSourceUrl: "https://www.india.gov.in/",
    officialApplicationUrl: "https://scholarships.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["scholarship", "student", "nsp", "education", "school", "college"]
  },

  {
    id: 12,
    serviceType: "ONLINE_SERVICE",
    governmentLevel: "NATIONAL",
    status: "official-source-only",
    name: "Aadhaar Update / Correction",
    categoryId: "identity",
    categoryName: "Identity & Certificates",
    department: "UIDAI",
    ministry: "MeitY, Government of India",
    shortDescription: "Update or correct Aadhaar details online or at an Enrolment Centre.",
    purpose: "Keep Aadhaar identity details current and accurate.",
    eligibility: "All Aadhaar holders.",
    requiredDocuments: [
      "Supporting proof for field being updated"
    ],
    fee: "Verified at UIDAI portal.",
    whereToApply: "Online via myaadhaar.uidai.gov.in or Aadhaar Enrolment Centre.",
    instructions: [
      "Log in to myAadhaar portal: https://myaadhaar.uidai.gov.in/",
      "Upload supporting document and track URN number."
    ],
    officialSourceUrl: "https://uidai.gov.in/",
    officialApplicationUrl: "https://myaadhaar.uidai.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["aadhaar", "uidai", "update", "correction", "address"]
  },

  {
    id: 16,
    serviceType: "FORM",
    governmentLevel: "TELANGANA",
    status: "coming-soon",
    name: "Birth / Death Certificate Correction Application",
    categoryId: "certificates",
    categoryName: "Identity & Certificates",
    department: "Municipal Administration",
    ministry: "Government of Telangana",
    shortDescription: "Correction of name, date, or parent details on an existing Telangana Birth or Death Certificate.",
    purpose: "Official application to rectify clerical errors or spelling mistakes on municipal certificates.",
    eligibility: "Certificate holder or parent/family member.",
    requiredDocuments: [
      "Original erroneous certificate",
      "Notarized Affidavit stating correct details",
      "Supporting identity proof (Aadhaar/School Memo)"
    ],
    fee: "Verified at Municipal Corporation office.",
    whereToApply: "Local Municipal Corporation / CDMA Office.",
    instructions: [
      "Submit original certificate along with notarized affidavit to local municipal registrar."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/public-utility-forms/",
    officialApplicationUrl: "https://cdma.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["birth correction", "death correction", "name change", "municipality", "telangana"]
  },

  {
    id: 17,
    serviceType: "ONLINE_SERVICE",
    governmentLevel: "TELANGANA",
    status: "official-source-only",
    name: "Employment Exchange Registration / Renewal",
    categoryId: "employment",
    categoryName: "Employment",
    department: "Department of Employment & Training",
    ministry: "Government of Telangana",
    shortDescription: "Register or renew job seeker registration on Telangana Employment Exchange portal.",
    purpose: "Enables job seekers to register qualifications for government job notifications and skill training.",
    eligibility: "Job seekers residing in Telangana aged 18+.",
    requiredDocuments: [
      "Educational certificates",
      "Aadhaar Card",
      "Caste / Residence Certificate"
    ],
    fee: "Free Service.",
    whereToApply: "Online via Telangana Employment Exchange portal.",
    instructions: [
      "Register qualifications on official Employment Exchange portal and renew periodically."
    ],
    officialSourceUrl: "https://www.telangana.gov.in/services/state-services/",
    officialApplicationUrl: "https://employment.telangana.gov.in/",
    lastVerified: "2026-09-29",
    keywords: ["employment", "job", "exchange", "registration", "renewal", "telangana"]
  }
];
