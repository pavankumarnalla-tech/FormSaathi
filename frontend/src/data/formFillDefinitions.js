/**
 * formFillDefinitions.js — Form Saathi Field Definitions
 *
 * Fields are defined based on the standard requirements of each verified
 * Telangana government form as listed on the official MeeSeva / Telangana portal.
 *
 * RULE: Only include fields that are actually required by the official form.
 * RULE: Labels must match or clearly correspond to the original form label.
 * RULE: Do NOT invent fields that do not exist in the real form.
 *
 * Only FORM-type entries with status 'official-template-ready' have fill definitions.
 */

export const formFillDefinitions = {

  /* ── 1. Income Certificate ──────────────────────────────────────────── */
  1: {
    sections: [
      {
        name: "Personal Information",
        fields: [
          {
            name: "Full Name",
            key: "fullName",
            type: "text",
            required: true,
            description: "Enter your full legal name exactly as it appears on your Aadhaar card. Do not use initials.",
            placeholder: "e.g. Pavan Kumar Nalla"
          },
          {
            name: "Date of Birth",
            key: "dob",
            type: "date",
            required: true,
            description: "Your date of birth as shown on your Aadhaar card or birth certificate."
          },
          {
            name: "Gender",
            key: "gender",
            type: "radio",
            required: true,
            description: "Select your gender.",
            options: ["Male", "Female", "Transgender / Other"]
          },
          {
            name: "Father's / Husband's Name",
            key: "fatherName",
            type: "text",
            required: true,
            description: "Enter your father's name (unmarried) or husband's name (married women).",
            placeholder: "e.g. Raju Nalla"
          },
          {
            name: "Aadhaar Number",
            key: "aadhaar",
            type: "text",
            required: true,
            description: "Your 12-digit Aadhaar UID for verification at MeeSeva.",
            placeholder: "XXXX XXXX XXXX"
          },
          {
            name: "Caste / Community",
            key: "caste",
            type: "select",
            required: true,
            description: "Select your caste/community category.",
            options: ["General / OC", "OBC / BC-A", "OBC / BC-B", "OBC / BC-C", "OBC / BC-D", "OBC / BC-E", "SC (Scheduled Caste)", "ST (Scheduled Tribe)"]
          }
        ]
      },
      {
        name: "Income Details",
        fields: [
          {
            name: "Total Annual Income (₹)",
            key: "annualIncome",
            type: "number",
            required: true,
            description: "Total income of your entire family from ALL sources in one year (salary, agriculture, business, etc.).",
            placeholder: "e.g. 150000"
          },
          {
            name: "Occupation / Nature of Work",
            key: "occupation",
            type: "text",
            required: true,
            description: "Your current primary occupation — e.g. Farmer, Government Employee, Daily Wage Worker.",
            placeholder: "e.g. Farmer"
          },
          {
            name: "Source of Income",
            key: "sourceIncome",
            type: "text",
            required: false,
            description: "Main source from which you earn — e.g. Agriculture, Salary, Business.",
            placeholder: "e.g. Agriculture"
          }
        ]
      },
      {
        name: "Contact & Address",
        fields: [
          {
            name: "Mobile Number",
            key: "mobile",
            type: "tel",
            required: true,
            description: "Your active 10-digit mobile number for SMS status updates.",
            placeholder: "e.g. 9876543210"
          },
          {
            name: "Village / Mandal",
            key: "village",
            type: "text",
            required: true,
            description: "Name of your village or mandal.",
            placeholder: "e.g. Hanamkonda"
          },
          {
            name: "District",
            key: "district",
            type: "text",
            required: true,
            description: "Name of your district in Telangana.",
            placeholder: "e.g. Warangal Urban"
          },
          {
            name: "Permanent Address",
            key: "address",
            type: "textarea",
            required: true,
            description: "Your full residential address — door number, street, locality, pincode.",
            placeholder: "Door No., Street, Area, City, Pincode"
          }
        ]
      },
      {
        name: "Documents",
        fields: [
          {
            name: "Identity Proof",
            key: "doc_identity",
            type: "file",
            required: true,
            description: "Upload Aadhaar Card or Voter ID.",
            docLabel: "Identity Proof (Aadhaar / Voter ID)"
          },
          {
            name: "Address Proof",
            key: "doc_address",
            type: "file",
            required: true,
            description: "Upload electricity bill, gas bill, or ration card.",
            docLabel: "Address Proof"
          }
        ]
      }
    ]
  },

  /* ── 2. Residence Certificate ───────────────────────────────────────── */
  2: {
    sections: [
      {
        name: "Personal Information",
        fields: [
          {
            name: "Full Name",
            key: "fullName",
            type: "text",
            required: true,
            description: "Your full legal name as on Aadhaar.",
            placeholder: "e.g. Priya Reddy"
          },
          {
            name: "Date of Birth",
            key: "dob",
            type: "date",
            required: true,
            description: "Your date of birth."
          },
          {
            name: "Father's / Husband's Name",
            key: "fatherName",
            type: "text",
            required: true,
            description: "Father's name (unmarried) or husband's name (married women).",
            placeholder: "e.g. Venkat Reddy"
          },
          {
            name: "Aadhaar Number",
            key: "aadhaar",
            type: "text",
            required: true,
            description: "Your 12-digit Aadhaar UID.",
            placeholder: "XXXX XXXX XXXX"
          }
        ]
      },
      {
        name: "Residence Details",
        fields: [
          {
            name: "Current Address",
            key: "address",
            type: "textarea",
            required: true,
            description: "Complete residential address — door number, street, mandal, district, pincode.",
            placeholder: "Door No., Street, Area, Mandal, District, Pincode"
          },
          {
            name: "Residing in Telangana Since (Year)",
            key: "residingSince",
            type: "text",
            required: true,
            description: "Year or date from which you have continuously resided in Telangana.",
            placeholder: "e.g. 2010"
          },
          {
            name: "District",
            key: "district",
            type: "text",
            required: true,
            description: "Your district in Telangana.",
            placeholder: "e.g. Nizamabad"
          }
        ]
      },
      {
        name: "Documents",
        fields: [
          {
            name: "Identity Proof",
            key: "doc_identity",
            type: "file",
            required: true,
            description: "Upload Aadhaar Card or Voter ID.",
            docLabel: "Identity Proof"
          },
          {
            name: "Address Proof",
            key: "doc_address",
            type: "file",
            required: true,
            description: "Electricity bill, gas bill, or ration card.",
            docLabel: "Address Proof"
          }
        ]
      }
    ]
  },

  /* ── 3. Caste Certificate ───────────────────────────────────────────── */
  3: {
    sections: [
      {
        name: "Personal Information",
        fields: [
          {
            name: "Full Name",
            key: "fullName",
            type: "text",
            required: true,
            description: "Your full legal name as on Aadhaar.",
            placeholder: "e.g. Suresh Kumar"
          },
          {
            name: "Date of Birth",
            key: "dob",
            type: "date",
            required: true,
            description: "Your date of birth."
          },
          {
            name: "Gender",
            key: "gender",
            type: "radio",
            required: true,
            description: "Select gender.",
            options: ["Male", "Female", "Transgender / Other"]
          },
          {
            name: "Father's Name",
            key: "fatherName",
            type: "text",
            required: true,
            description: "Father's full name.",
            placeholder: "e.g. Ramaiah Kumar"
          },
          {
            name: "Aadhaar Number",
            key: "aadhaar",
            type: "text",
            required: true,
            description: "12-digit Aadhaar UID.",
            placeholder: "XXXX XXXX XXXX"
          }
        ]
      },
      {
        name: "Caste Details",
        fields: [
          {
            name: "Caste / Sub-Caste",
            key: "caste",
            type: "text",
            required: true,
            description: "Name of caste and sub-caste for certificate.",
            placeholder: "e.g. Yadav (BC-B)"
          },
          {
            name: "Community Category",
            key: "communityCategory",
            type: "select",
            required: true,
            description: "Community category.",
            options: ["BC-A", "BC-B", "BC-C", "BC-D", "BC-E", "SC", "ST", "Minority"]
          }
        ]
      },
      {
        name: "Contact & Address",
        fields: [
          {
            name: "Permanent Address",
            key: "address",
            type: "textarea",
            required: true,
            description: "Permanent residential address.",
            placeholder: "Door No., Street, Area, Mandal, District, Pincode"
          },
          {
            name: "Mobile Number",
            key: "mobile",
            type: "tel",
            required: true,
            description: "Active mobile number.",
            placeholder: "e.g. 9876543210"
          }
        ]
      },
      {
        name: "Documents",
        fields: [
          {
            name: "Identity Proof",
            key: "doc_identity",
            type: "file",
            required: true,
            description: "Upload Aadhaar Card or Voter ID.",
            docLabel: "Identity Proof"
          },
          {
            name: "Address Proof",
            key: "doc_address",
            type: "file",
            required: true,
            description: "Ration card or address proof.",
            docLabel: "Address Proof"
          }
        ]
      }
    ]
  },

  /* ── 4. Birth Certificate ───────────────────────────────────────────── */
  4: {
    sections: [
      {
        name: "Child's Information",
        fields: [
          {
            name: "Child's Full Name",
            key: "childName",
            type: "text",
            required: true,
            description: "Child's full name as it should appear on the Birth Certificate.",
            placeholder: "e.g. Aarav Raju"
          },
          {
            name: "Date of Birth",
            key: "dob",
            type: "date",
            required: true,
            description: "Child's exact date of birth."
          },
          {
            name: "Sex of Child",
            key: "gender",
            type: "radio",
            required: true,
            description: "Select sex.",
            options: ["Male", "Female", "Other"]
          },
          {
            name: "Place of Birth",
            key: "birthPlace",
            type: "text",
            required: true,
            description: "Hospital, nursing home, or address where birth occurred.",
            placeholder: "e.g. Government General Hospital, Hyderabad"
          }
        ]
      },
      {
        name: "Parents' Information",
        fields: [
          {
            name: "Father's Full Name",
            key: "fatherName",
            type: "text",
            required: true,
            description: "Father's legal name on Aadhaar.",
            placeholder: "e.g. Raju Sharma"
          },
          {
            name: "Mother's Full Name",
            key: "motherName",
            type: "text",
            required: true,
            description: "Mother's legal name on Aadhaar.",
            placeholder: "e.g. Lakshmi Sharma"
          },
          {
            name: "Father's Aadhaar Number",
            key: "fatherAadhaar",
            type: "text",
            required: true,
            description: "Father's Aadhaar UID.",
            placeholder: "XXXX XXXX XXXX"
          }
        ]
      },
      {
        name: "Address & Contact",
        fields: [
          {
            name: "Residential Address",
            key: "address",
            type: "textarea",
            required: true,
            description: "Parents' residential address.",
            placeholder: "Door No., Street, Area, Mandal, District, Pincode"
          },
          {
            name: "Mobile Number",
            key: "mobile",
            type: "tel",
            required: true,
            description: "Parent/applicant contact mobile number.",
            placeholder: "e.g. 9876543210"
          }
        ]
      },
      {
        name: "Documents",
        fields: [
          {
            name: "Hospital Birth Report / Discharge Summary",
            key: "doc_birth_report",
            type: "file",
            required: true,
            description: "Birth report issued by hospital.",
            docLabel: "Hospital Birth Report"
          },
          {
            name: "Father's Identity Proof",
            key: "doc_father_id",
            type: "file",
            required: true,
            description: "Father's Aadhaar Card.",
            docLabel: "Father's Identity Proof"
          }
        ]
      }
    ]
  },

  /* ── 5. Integrated Certificate ──────────────────────────────────────── */
  5: {
    sections: [
      {
        name: "Personal Information",
        fields: [
          {
            name: "Full Name",
            key: "fullName",
            type: "text",
            required: true,
            description: "Full legal name as on Aadhaar.",
            placeholder: "e.g. Kavitha Rao"
          },
          {
            name: "Date of Birth",
            key: "dob",
            type: "date",
            required: true,
            description: "Date of birth."
          },
          {
            name: "Father's Name",
            key: "fatherName",
            type: "text",
            required: true,
            description: "Father's full name.",
            placeholder: "e.g. Rao Venkat"
          },
          {
            name: "Aadhaar Number",
            key: "aadhaar",
            type: "text",
            required: true,
            description: "Aadhaar UID.",
            placeholder: "XXXX XXXX XXXX"
          }
        ]
      },
      {
        name: "Caste, Income & Residence",
        fields: [
          {
            name: "Caste / Community",
            key: "caste",
            type: "text",
            required: true,
            description: "Caste/community name.",
            placeholder: "e.g. Kamma (BC-D)"
          },
          {
            name: "Total Annual Income (₹)",
            key: "annualIncome",
            type: "number",
            required: true,
            description: "Family annual income from all sources.",
            placeholder: "e.g. 200000"
          },
          {
            name: "Permanent Address",
            key: "address",
            type: "textarea",
            required: true,
            description: "Permanent residential address.",
            placeholder: "Door No., Street, Area, Mandal, District, Pincode"
          },
          {
            name: "Mobile Number",
            key: "mobile",
            type: "tel",
            required: true,
            description: "Mobile number.",
            placeholder: "e.g. 9876543210"
          }
        ]
      },
      {
        name: "Documents",
        fields: [
          {
            name: "Identity Proof",
            key: "doc_identity",
            type: "file",
            required: true,
            description: "Aadhaar Card or Voter ID.",
            docLabel: "Identity Proof"
          },
          {
            name: "Address Proof",
            key: "doc_address",
            type: "file",
            required: true,
            description: "Ration card or electricity bill.",
            docLabel: "Address Proof"
          }
        ]
      }
    ]
  },

  /* ── 6. Death Registration ──────────────────────────────────────────── */
  6: {
    sections: [
      {
        name: "Deceased Person's Details",
        fields: [
          {
            name: "Name of the Deceased",
            key: "deceasedName",
            type: "text",
            required: true,
            description: "Full name of deceased person.",
            placeholder: "e.g. Ramaiah Sharma"
          },
          {
            name: "Date of Death",
            key: "dateOfDeath",
            type: "date",
            required: true,
            description: "Exact date of death."
          },
          {
            name: "Age at Death",
            key: "ageAtDeath",
            type: "number",
            required: true,
            description: "Age at time of death (in years).",
            placeholder: "e.g. 72"
          },
          {
            name: "Place of Death",
            key: "placeOfDeath",
            type: "text",
            required: true,
            description: "Hospital or address where death occurred.",
            placeholder: "e.g. Osmania General Hospital, Hyderabad"
          }
        ]
      },
      {
        name: "Applicant's Information",
        fields: [
          {
            name: "Applicant's Full Name",
            key: "applicantName",
            type: "text",
            required: true,
            description: "Name of person registering death.",
            placeholder: "e.g. Suresh Sharma"
          },
          {
            name: "Relationship to Deceased",
            key: "relationship",
            type: "select",
            required: true,
            description: "Relationship to deceased.",
            options: ["Son", "Daughter", "Spouse", "Parent", "Sibling", "Other"]
          },
          {
            name: "Applicant's Aadhaar Number",
            key: "aadhaar",
            type: "text",
            required: true,
            description: "Applicant's Aadhaar.",
            placeholder: "XXXX XXXX XXXX"
          },
          {
            name: "Mobile Number",
            key: "mobile",
            type: "tel",
            required: true,
            description: "Active mobile number.",
            placeholder: "e.g. 9876543210"
          },
          {
            name: "Permanent Address",
            key: "address",
            type: "textarea",
            required: true,
            description: "Permanent address of deceased.",
            placeholder: "Door No., Street, Area, Mandal, District, Pincode"
          }
        ]
      },
      {
        name: "Documents",
        fields: [
          {
            name: "Identity Proof of Applicant",
            key: "doc_identity",
            type: "file",
            required: true,
            description: "Aadhaar Card or Voter ID of applicant.",
            docLabel: "Applicant's Identity Proof"
          }
        ]
      }
    ]
  },

  /* ── 13. Economically Weaker Sections (EWS) Certificate ─────────────── */
  13: {
    sections: [
      {
        name: "Applicant Information",
        fields: [
          {
            name: "Full Name of Applicant",
            key: "fullName",
            type: "text",
            required: true,
            description: "Full legal name as on Aadhaar card.",
            placeholder: "e.g. Anish Kumar"
          },
          {
            name: "Date of Birth",
            key: "dob",
            type: "date",
            required: true,
            description: "Date of birth as per official records."
          },
          {
            name: "Father's / Husband's Name",
            key: "fatherName",
            type: "text",
            required: true,
            description: "Father's or husband's full name.",
            placeholder: "e.g. Satyanarayana Kumar"
          },
          {
            name: "Aadhaar Number",
            key: "aadhaar",
            type: "text",
            required: true,
            description: "12-digit Aadhaar UID.",
            placeholder: "XXXX XXXX XXXX"
          },
          {
            name: "Caste / Sub-Caste (General Category)",
            key: "caste",
            type: "text",
            required: true,
            description: "Sub-caste within General Category (e.g. Brahmin, Reddy, Kamma, Vysya, Kapu).",
            placeholder: "e.g. Brahmin"
          }
        ]
      },
      {
        name: "Gross Annual Family Income & Assets",
        fields: [
          {
            name: "Gross Annual Family Income (₹)",
            key: "annualIncome",
            type: "number",
            required: true,
            description: "Total annual gross income of all family members from all sources (Must be below ₹8 Lakh).",
            placeholder: "e.g. 350000"
          },
          {
            name: "Agricultural Land Owned (Acres)",
            key: "agriLand",
            type: "text",
            required: false,
            description: "Total agricultural land owned by family (Must be less than 5 Acres for EWS).",
            placeholder: "e.g. 0 or 1.5"
          },
          {
            name: "Residential Flat Area (Sq. Ft.)",
            key: "flatArea",
            type: "text",
            required: false,
            description: "Residential flat area owned by family (Must be below 1000 sq ft).",
            placeholder: "e.g. 750"
          }
        ]
      },
      {
        name: "Address & Contact",
        fields: [
          {
            name: "Permanent Address",
            key: "address",
            type: "textarea",
            required: true,
            description: "Full residential address.",
            placeholder: "Door No., Street, Mandal, District, Pincode"
          },
          {
            name: "Mobile Number",
            key: "mobile",
            type: "tel",
            required: true,
            description: "10-digit mobile number.",
            placeholder: "e.g. 9876543210"
          }
        ]
      },
      {
        name: "Documents",
        fields: [
          {
            name: "Aadhaar Card",
            key: "doc_identity",
            type: "file",
            required: true,
            description: "Upload Aadhaar Card.",
            docLabel: "Aadhaar Card"
          },
          {
            name: "Income Certificate / Income Proof",
            key: "doc_income",
            type: "file",
            required: true,
            description: "Upload valid Income Proof or Salary Certificate.",
            docLabel: "Income Proof"
          }
        ]
      }
    ]
  },

  /* ── 14. Family Member Certificate ──────────────────────────────────── */
  14: {
    sections: [
      {
        name: "Deceased Person Details",
        fields: [
          {
            name: "Deceased Person's Name",
            key: "deceasedName",
            type: "text",
            required: true,
            description: "Full legal name of deceased family head.",
            placeholder: "e.g. Venkataiah Nalla"
          },
          {
            name: "Date of Death",
            key: "dateOfDeath",
            type: "date",
            required: true,
            description: "Date when death occurred."
          },
          {
            name: "Death Certificate Number",
            key: "deathCertNo",
            type: "text",
            required: true,
            description: "Official registration number of Death Certificate.",
            placeholder: "e.g. TS-DC-2024-12345"
          }
        ]
      },
      {
        name: "Surviving Family Members",
        fields: [
          {
            name: "Applicant's Full Name",
            key: "fullName",
            type: "text",
            required: true,
            description: "Name of primary applicant (surviving family member).",
            placeholder: "e.g. Sujatha Nalla"
          },
          {
            name: "Relationship to Deceased",
            key: "relationship",
            type: "select",
            required: true,
            description: "Relationship to deceased.",
            options: ["Spouse (Wife/Husband)", "Son", "Daughter", "Mother", "Father"]
          },
          {
            name: "List of All Surviving Legal Heirs",
            key: "familyMembersList",
            type: "textarea",
            required: true,
            description: "Names, ages, and relationships of all living legal family members.",
            placeholder: "1. Sujatha (Wife, 52 yrs)\n2. Pavan (Son, 26 yrs)\n3. Swathi (Daughter, 23 yrs)"
          },
          {
            name: "Aadhaar Number",
            key: "aadhaar",
            type: "text",
            required: true,
            description: "Applicant's Aadhaar UID.",
            placeholder: "XXXX XXXX XXXX"
          },
          {
            name: "Mobile Number",
            key: "mobile",
            type: "tel",
            required: true,
            description: "Contact mobile number.",
            placeholder: "e.g. 9876543210"
          }
        ]
      },
      {
        name: "Documents",
        fields: [
          {
            name: "Death Certificate",
            key: "doc_death_cert",
            type: "file",
            required: true,
            description: "Official Death Certificate.",
            docLabel: "Death Certificate"
          },
          {
            name: "Ration Card / Household Card",
            key: "doc_ration",
            type: "file",
            required: true,
            description: "Ration card showing family relationships.",
            docLabel: "Ration Card"
          }
        ]
      }
    ]
  },

  /* ── 15. Senior Citizen Identity Card Application ───────────────────── */
  15: {
    sections: [
      {
        name: "Senior Citizen Details",
        fields: [
          {
            name: "Full Name",
            key: "fullName",
            type: "text",
            required: true,
            description: "Full legal name as on Aadhaar card.",
            placeholder: "e.g. Subba Rao Nalla"
          },
          {
            name: "Date of Birth",
            key: "dob",
            type: "date",
            required: true,
            description: "Date of birth proving age 60 or above."
          },
          {
            name: "Gender",
            key: "gender",
            type: "radio",
            required: true,
            description: "Select gender.",
            options: ["Male", "Female", "Other"]
          },
          {
            name: "Blood Group",
            key: "bloodGroup",
            type: "select",
            required: true,
            description: "Medical blood group for Senior Citizen ID.",
            options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
          },
          {
            name: "Aadhaar Number",
            key: "aadhaar",
            type: "text",
            required: true,
            description: "12-digit Aadhaar UID.",
            placeholder: "XXXX XXXX XXXX"
          }
        ]
      },
      {
        name: "Emergency Contact & Address",
        fields: [
          {
            name: "Emergency Contact Name",
            key: "emergencyName",
            type: "text",
            required: true,
            description: "Name of family member to contact in emergency.",
            placeholder: "e.g. Pavan Nalla (Son)"
          },
          {
            name: "Emergency Contact Phone",
            key: "emergencyPhone",
            type: "tel",
            required: true,
            description: "Emergency phone number.",
            placeholder: "e.g. 9876543210"
          },
          {
            name: "Permanent Address",
            key: "address",
            type: "textarea",
            required: true,
            description: "Residential address in Telangana.",
            placeholder: "Door No., Street, Mandal, District, Pincode"
          }
        ]
      },
      {
        name: "Documents",
        fields: [
          {
            name: "Age Proof",
            key: "doc_age",
            type: "file",
            required: true,
            description: "Upload Aadhaar / Birth Certificate / Voter ID.",
            docLabel: "Age Proof"
          }
        ]
      }
    ]
  }

};

// ── Default fallback sections (for form ids without a defined fill definition) ────────────────
export const defaultSections = (formName) => ([
  {
    name: "Personal Information",
    fields: [
      { name: "Full Name",     key: "fullName", type: "text", required: true,  description: "Your full legal name.", placeholder: "Enter your full name" },
      { name: "Date of Birth", key: "dob",      type: "date", required: true,  description: "Your date of birth." },
      { name: "Mobile Number", key: "mobile",   type: "tel",  required: true,  description: "Active mobile number.", placeholder: "10-digit mobile number" }
    ]
  },
  {
    name: "Address",
    fields: [
      { name: "Permanent Address", key: "address", type: "textarea", required: true, description: "Your full residential address.", placeholder: "House No., Street, City, State, Pincode" }
    ]
  }
]);

// ── Maps Gemini document analysis fields to the form-fill format (upload flow) ───────────────
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
