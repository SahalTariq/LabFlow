// server/db.js - MongoDB-compatible in-memory & file-backed document store for Pakistan Diagnostic Lab
// Provides Mongoose-style schema and model methods: find, findById, create, findByIdAndUpdate
import fs from 'fs';
import path from 'path';
import { PatientMongooseSchemaDefinition } from './models/PatientSchema.js';

const DB_FILE = path.join(process.cwd(), 'data-labflow.json');

// Initial seed data for Laboratory MongoDB collection tailored for Pakistan
const INITIAL_PATIENTS = [
  {
    _id: 'LF-1048',
    id: 'LF-1048',
    tokenNumber: 48,
    name: 'Fatima Zahra',
    guardianName: 'Syed Tariq Hussain',
    cnic: '35201-7654321-2',
    city: 'Lahore',
    province: 'Punjab',
    age: 34,
    gender: 'Female',
    mobile: '+92 301 9876543',
    testType: 'Complete Blood Count (CBC)',
    visitDate: '18 September 2026',
    doctorName: 'Prof. Dr. Shahid Hameed (FCPS, FRCP - Services Hospital)',
    pmdcRegNumber: 'PMDC # 18492-P',
    notes: 'Routine health checkup. Patient reports mild fatigue and low energy.',
    status: 'sent',
    billing: {
      testPrice: 650,
      discount: 0,
      paidAmount: 650,
      currency: 'PKR',
      paymentMethod: 'JazzCash',
      paymentStatus: 'Paid'
    },
    sampleDetails: {
      sampleType: 'Blood',
      collectedAt: '09:42 AM',
      technician: 'Muhammad Bilal Khan (BS-MLT)',
      tubeType: 'EDTA Purple Tube (K2 EDTA)',
      sampleCondition: 'Good',
      notes: 'Clean venipuncture right cubital vein. No hemolysis observed.'
    },
    reportDetails: {
      reportId: 'REP-1048',
      fileName: 'Fatima_Zahra_CBC_18Sep2026.pdf',
      fileSize: '412 KB',
      uploadedAt: '02:05 PM',
      approvedAt: '02:15 PM',
      approvedBy: 'Prof. Dr. Ayesha Siddiqui (FCPS, MPhil)',
      pathologistPmdc: 'PM&DC Reg # 24519-P',
      isDraft: false,
      isPdfReady: true,
      clinicalRemarks: 'Hemoglobin (13.2 g/dL) within physiological limits. Total Leukocyte Count and Platelets normal. Normocytic normochromic blood picture.',
      parameters: [
        { name: 'Hemoglobin (Hb)', value: '13.2', unit: 'g/dL', referenceRange: '12.0 - 15.5', flag: 'Normal' },
        { name: 'RBC Count', value: '4.45', unit: 'million/uL', referenceRange: '3.80 - 5.20', flag: 'Normal' },
        { name: 'Total Leucocyte Count (TLC)', value: '6,800', unit: '/cu.mm', referenceRange: '4,000 - 11,000', flag: 'Normal' },
        { name: 'Platelet Count', value: '265,000', unit: '/cu.mm', referenceRange: '150,000 - 450,000', flag: 'Normal' },
        { name: 'Packed Cell Volume (PCV)', value: '39.8', unit: '%', referenceRange: '36.0 - 46.0', flag: 'Normal' },
        { name: 'Mean Corpuscular Volume (MCV)', value: '89.4', unit: 'fL', referenceRange: '80.0 - 99.0', flag: 'Normal' }
      ]
    },
    deliveryDetails: {
      whatsappSentAt: '02:18 PM',
      deliveredAt: '02:18 PM',
      openedAt: '02:22 PM',
      downloadedAt: null,
      status: 'opened',
      resendCount: 0,
      messagePreview: 'Assalam-o-Alaikum,\nYour diagnostic lab report is ready.\nPatient: Fatima Zahra\nTest: Complete Blood Count (CBC)\nLab: LabFlow Diagnostics, Gulberg Lahore\nClick below to securely access your PDF report.'
    },
    previousReports: [
      { id: 'rep-prev-1', date: '18 Sep 2026', testType: 'Complete Blood Count (CBC)', status: 'Sent', fileName: 'Fatima_Zahra_CBC_18Sep2026.pdf', downloadCount: 1 },
      { id: 'rep-prev-2', date: '26 Aug 2026', testType: 'Serum Lipid Profile', status: 'Sent', fileName: 'Fatima_Zahra_Lipid_26Aug2026.pdf', downloadCount: 2 },
      { id: 'rep-prev-3', date: '19 Jul 2026', testType: 'Thyroid Stimulating Hormone (TSH)', status: 'Sent', fileName: 'Fatima_Zahra_Thyroid_19Jul2026.pdf', downloadCount: 1 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'LF-1049',
    id: 'LF-1049',
    tokenNumber: 49,
    name: 'Muhammad Tariq',
    guardianName: 'Abdul Rehman',
    cnic: '37405-1234567-3',
    city: 'Rawalpindi',
    province: 'Punjab',
    age: 52,
    gender: 'Male',
    mobile: '+92 321 4567890',
    testType: 'Lipid Profile',
    visitDate: '18 September 2026',
    doctorName: 'Dr. Naila Parveen (FCPS Medicine - Shifa International)',
    pmdcRegNumber: 'PMDC # 21084-P',
    status: 'ready_for_review',
    billing: {
      testPrice: 1400,
      discount: 100,
      paidAmount: 1300,
      currency: 'PKR',
      paymentMethod: 'Cash',
      paymentStatus: 'Paid'
    },
    sampleDetails: {
      sampleType: 'Serum',
      collectedAt: '10:15 AM',
      technician: 'Muhammad Bilal Khan (BS-MLT)',
      tubeType: 'SST Gold Gel Tube (Clot Activator)',
      sampleCondition: 'Good'
    },
    reportDetails: {
      reportId: 'REP-1049',
      fileName: 'Muhammad_Tariq_Lipid_18Sep2026.pdf',
      fileSize: '380 KB',
      uploadedAt: '11:45 AM',
      isDraft: true,
      isPdfReady: true,
      clinicalRemarks: 'Mild hypercholesterolemia observed with elevated LDL. Dietary counseling and regular physical activity advised.',
      parameters: [
        { name: 'Total Cholesterol', value: '228', unit: 'mg/dL', referenceRange: '< 200', flag: 'High' },
        { name: 'Serum Triglycerides', value: '165', unit: 'mg/dL', referenceRange: '< 150', flag: 'High' },
        { name: 'HDL Cholesterol (Good)', value: '42', unit: 'mg/dL', referenceRange: '> 40', flag: 'Normal' },
        { name: 'LDL Cholesterol (Bad)', value: '145', unit: 'mg/dL', referenceRange: '< 100', flag: 'High' }
      ]
    },
    previousReports: [
      { id: 'rep-prev-4', date: '18 Sep 2026', testType: 'Lipid Profile', status: 'Ready', fileName: 'Muhammad_Tariq_Lipid_18Sep2026.pdf', downloadCount: 0 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'LF-1050',
    id: 'LF-1050',
    tokenNumber: 50,
    name: 'Zainab Bibi',
    guardianName: 'Muhammad Arshad',
    cnic: '33100-9876543-4',
    city: 'Faisalabad',
    province: 'Punjab',
    age: 28,
    gender: 'Female',
    mobile: '+92 333 6543210',
    testType: 'Thyroid Stimulating Hormone (TSH)',
    visitDate: '18 September 2026',
    doctorName: 'Prof. Dr. Shahid Hameed (FCPS, FRCP)',
    pmdcRegNumber: 'PMDC # 18492-P',
    status: 'awaiting_sample',
    billing: {
      testPrice: 1200,
      discount: 0,
      paidAmount: 1200,
      currency: 'PKR',
      paymentMethod: 'Easypaisa',
      paymentStatus: 'Paid'
    },
    previousReports: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'LF-1051',
    id: 'LF-1051',
    tokenNumber: 51,
    name: 'Hamza Ali Sheikh',
    guardianName: 'Sheikh Muhammad Akram',
    cnic: '42101-5678901-5',
    city: 'Karachi',
    province: 'Sindh',
    age: 61,
    gender: 'Male',
    mobile: '+92 345 2233445',
    testType: 'Fasting Blood Sugar (FBS) & HbA1c',
    visitDate: '18 September 2026',
    doctorName: 'Dr. Tariq Mehmood (Consultant Physician, JPMC)',
    pmdcRegNumber: 'PMDC # 14230-P',
    status: 'collected',
    billing: {
      testPrice: 1100,
      discount: 0,
      paidAmount: 1100,
      currency: 'PKR',
      paymentMethod: 'Cash',
      paymentStatus: 'Paid'
    },
    sampleDetails: {
      sampleType: 'Blood',
      collectedAt: '10:30 AM',
      technician: 'Muhammad Bilal Khan (BS-MLT)',
      tubeType: 'Sodium Fluoride Grey Tube',
      sampleCondition: 'Good'
    },
    previousReports: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'LF-1052',
    id: 'LF-1052',
    tokenNumber: 52,
    name: 'Ayesha Malik',
    guardianName: 'Malik Zafar Iqbal',
    cnic: '61101-2345678-6',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    age: 45,
    gender: 'Female',
    mobile: '+92 302 3344556',
    testType: 'Complete Blood Count (CBC)',
    visitDate: '18 September 2026',
    doctorName: 'Dr. Naila Parveen (FCPS Medicine)',
    pmdcRegNumber: 'PMDC # 21084-P',
    status: 'processing',
    billing: {
      testPrice: 650,
      discount: 0,
      paidAmount: 650,
      currency: 'PKR',
      paymentMethod: 'Cash',
      paymentStatus: 'Paid'
    },
    sampleDetails: {
      sampleType: 'Blood',
      collectedAt: '10:50 AM',
      technician: 'Muhammad Bilal Khan (BS-MLT)',
      tubeType: 'EDTA Purple Tube (K2 EDTA)',
      sampleCondition: 'Good'
    },
    previousReports: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'LF-1053',
    id: 'LF-1053',
    tokenNumber: 53,
    name: 'Bilal Ahmed Qureshi',
    guardianName: 'Qureshi Ghulam Rasool',
    cnic: '36302-3456789-7',
    city: 'Multan',
    province: 'Punjab',
    age: 39,
    gender: 'Male',
    mobile: '+92 315 8899001',
    testType: 'Liver Function Test (LFT)',
    visitDate: '18 September 2026',
    status: 'needs_attention',
    billing: {
      testPrice: 1600,
      discount: 0,
      paidAmount: 1600,
      currency: 'PKR',
      paymentMethod: 'Cash',
      paymentStatus: 'Paid'
    },
    needsAttentionReason: 'WhatsApp delivery returned unreachable (+92 315 8899001). Please verify alternate PTCL or mobile with patient.',
    sampleDetails: {
      sampleType: 'Serum',
      collectedAt: '09:15 AM',
      technician: 'Muhammad Bilal Khan (BS-MLT)',
      tubeType: 'Plain Red Tube (No Additive)',
      sampleCondition: 'Good'
    },
    previousReports: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_STAFF = [
  {
    _id: 'usr-1',
    id: 'usr-1',
    name: 'Muhammad Usman Tariq',
    role: 'admin',
    roleTitle: 'Lab Administrator & Operations Manager',
    mobile: '+92 300 8472910',
    email: 'usman@labflow.pk'
  },
  {
    _id: 'usr-2',
    id: 'usr-2',
    name: 'Prof. Dr. Ayesha Siddiqui',
    role: 'pathologist',
    roleTitle: 'Consultant Pathologist & Lab Director (FCPS, MPhil)',
    pmdcNumber: 'PM&DC Reg # 24519-P',
    mobile: '+92 321 4455667',
    email: 'drayesha@labflow.pk'
  },
  {
    _id: 'usr-3',
    id: 'usr-3',
    name: 'Muhammad Bilal Khan',
    role: 'technician',
    roleTitle: 'Chief Medical Lab Technologist (BS-MLT)',
    mobile: '+92 333 7788990',
    email: 'bilal@labflow.pk'
  }
];

// In-memory collections initialized with Pakistan datasets
let patientsCollection = [...INITIAL_PATIENTS];
let staffCollection = [...INITIAL_STAFF];

// Always write current Pakistan data to disk so fresh runs and server restarts keep Pakistani data
function persistDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      schema: 'Pakistan-Lab-Standard-Mongoose-v1',
      country: 'Pakistan',
      currency: 'PKR',
      patients: patientsCollection,
      staff: staffCollection
    }, null, 2));
  } catch (err) {
    // Non-fatal
  }
}

// Initial sync to disk
persistDb();

// Export the Mongoose schema definition
export { PatientMongooseSchemaDefinition };

// Mongoose-style Model for Patients
export const PatientModel = {
  find: async (query = {}) => {
    let result = [...patientsCollection];
    if (query.status && query.status !== 'all') {
      result = result.filter(p => p.status === query.status);
    }
    if (query.search) {
      const q = query.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.mobile.includes(q) ||
        (p.cnic && p.cnic.includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        p.testType.toLowerCase().includes(q)
      );
    }
    return result;
  },

  findById: async (id) => {
    return patientsCollection.find(p => p.id === id || p._id === id) || null;
  },

  create: async (data) => {
    const nextToken = patientsCollection.length > 0
      ? Math.max(...patientsCollection.map(p => p.tokenNumber || 0)) + 1
      : 48;
    const newId = `LF-${1000 + nextToken}`;
    
    // Normalize mobile to Pakistan +92 format
    let cleanMobile = (data.mobile || '').trim();
    if (!cleanMobile.startsWith('+')) {
      if (cleanMobile.startsWith('0')) {
        cleanMobile = '+92 ' + cleanMobile.slice(1);
      } else {
        cleanMobile = '+92 ' + cleanMobile;
      }
    }

    const newPatient = {
      _id: newId,
      id: newId,
      tokenNumber: nextToken,
      status: 'awaiting_sample',
      city: data.city || 'Lahore',
      province: data.province || 'Punjab',
      cnic: data.cnic || undefined,
      guardianName: data.guardianName || undefined,
      billing: {
        testPrice: data.billing?.testPrice || 650,
        discount: data.billing?.discount || 0,
        paidAmount: data.billing?.paidAmount || 650,
        currency: 'PKR',
        paymentMethod: data.billing?.paymentMethod || 'Cash',
        paymentStatus: 'Paid'
      },
      previousReports: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
      mobile: cleanMobile
    };

    patientsCollection.unshift(newPatient);
    persistDb();
    return newPatient;
  },

  findByIdAndUpdate: async (id, updateData) => {
    const index = patientsCollection.findIndex(p => p.id === id || p._id === id);
    if (index === -1) return null;

    patientsCollection[index] = {
      ...patientsCollection[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    persistDb();
    return patientsCollection[index];
  },

  countDocuments: async (query = {}) => {
    const list = await PatientModel.find(query);
    return list.length;
  },

  resetDefaults: async () => {
    patientsCollection = JSON.parse(JSON.stringify(INITIAL_PATIENTS));
    persistDb();
    return patientsCollection;
  }
};

// Staff Model
export const StaffModel = {
  find: async () => [...staffCollection],
  findById: async (id) => staffCollection.find(s => s.id === id || s._id === id) || null,
  login: async (identifier, pass) => {
    const clean = (identifier || '').trim().toLowerCase();
    const found = staffCollection.find(
      s => s.email.toLowerCase().includes(clean) ||
           s.mobile.replace(/\D/g, '').includes(clean.replace(/\D/g, '')) ||
           s.name.toLowerCase().includes(clean)
    );
    return found || staffCollection[0];
  }
};
