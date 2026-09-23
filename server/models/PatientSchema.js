// server/models/PatientSchema.js - Mongoose Schema Definition for Pakistan Diagnostic Laboratory
// Compliant with Pakistan Medical Commission (PM&DC) & Punjab Healthcare Commission (PHCC) standards

export const PatientMongooseSchemaDefinition = {
  tokenNumber: {
    type: 'Number',
    required: true,
    index: true,
    description: 'Daily sequential token number issued at reception desk'
  },
  name: {
    type: 'String',
    required: [true, 'Patient full name is mandatory'],
    trim: true,
    maxlength: 120
  },
  cnic: {
    type: 'String',
    required: false,
    trim: true,
    match: [/^\d{5}-\d{7}-\d{1}$/, 'Please enter a valid Pakistani CNIC (e.g. 35201-1234567-1) or leave blank for minors'],
    description: 'NADRA 13-digit Computerized National Identity Card number'
  },
  guardianName: {
    type: 'String',
    required: false,
    trim: true,
    description: 'Father or Husband name standard on Pakistani hospital requisitions'
  },
  age: {
    type: 'Number',
    required: true,
    min: 0,
    max: 130
  },
  gender: {
    type: 'String',
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  mobile: {
    type: 'String',
    required: [true, 'WhatsApp mobile number is required for report dispatch'],
    trim: true,
    description: 'Pakistani mobile number formatted as +92 3xx xxxxxxx or 03xx-xxxxxxx'
  },
  city: {
    type: 'String',
    default: 'Lahore',
    enum: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Gujranwala', 'Sialkot', 'Other']
  },
  province: {
    type: 'String',
    default: 'Punjab',
    enum: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Azad Kashmir', 'Gilgit-Baltistan']
  },
  testType: {
    type: 'String',
    required: true,
    description: 'Investigation name (e.g., Complete Blood Count (CBC), Lipid Profile, LFT)'
  },
  doctorName: {
    type: 'String',
    default: 'Self / Walk-in',
    description: 'Referring medical practitioner / consultant hospital in Pakistan'
  },
  pmdcRegNumber: {
    type: 'String',
    required: false,
    description: 'Pakistan Medical & Dental Council / PMC registration number of referring doctor'
  },
  visitDate: {
    type: 'String',
    required: true
  },
  status: {
    type: 'String',
    enum: ['awaiting_sample', 'collected', 'processing', 'ready_for_review', 'sent', 'needs_attention'],
    default: 'awaiting_sample',
    index: true
  },
  billing: {
    testPrice: { type: 'Number', default: 650 },
    discount: { type: 'Number', default: 0 },
    paidAmount: { type: 'Number', default: 650 },
    currency: { type: 'String', default: 'PKR' },
    paymentMethod: {
      type: 'String',
      enum: ['Cash', 'JazzCash', 'Easypaisa', 'Bank Transfer', 'Debit Card'],
      default: 'Cash'
    },
    paymentStatus: { type: 'String', enum: ['Paid', 'Partial', 'Pending'], default: 'Paid' }
  },
  sampleDetails: {
    sampleType: { type: 'String', default: 'Blood' },
    collectedAt: { type: 'String' },
    technician: { type: 'String', default: 'Muhammad Bilal Khan (BS-MLT)' },
    tubeType: { type: 'String', default: 'EDTA Purple Tube (K2 EDTA)' },
    sampleCondition: { type: 'String', default: 'Good' },
    phlebotomyNotes: { type: 'String' }
  },
  reportDetails: {
    reportId: { type: 'String' },
    fileName: { type: 'String' },
    fileSize: { type: 'String' },
    uploadedAt: { type: 'String' },
    approvedAt: { type: 'String' },
    approvedBy: { type: 'String', default: 'Prof. Dr. Ayesha Siddiqui (FCPS)' },
    pathologistPmdc: { type: 'String', default: 'PM&DC Reg # 24519-P' },
    isDraft: { type: 'Boolean', default: false },
    isPdfReady: { type: 'Boolean', default: true },
    clinicalRemarks: { type: 'String' },
    parameters: [
      {
        name: { type: 'String' },
        value: { type: 'String' },
        unit: { type: 'String' },
        referenceRange: { type: 'String' },
        flag: { type: 'String', enum: ['Normal', 'High', 'Low'] }
      }
    ]
  },
  deliveryDetails: {
    whatsappSentAt: { type: 'String' },
    deliveredAt: { type: 'String' },
    openedAt: { type: 'String' },
    downloadedAt: { type: 'String' },
    status: { type: 'String', enum: ['pending', 'sent', 'delivered', 'opened', 'failed'], default: 'pending' },
    resendCount: { type: 'Number', default: 0 },
    messagePreview: { type: 'String' }
  },
  previousReports: [
    {
      id: { type: 'String' },
      date: { type: 'String' },
      testType: { type: 'String' },
      status: { type: 'String' },
      fileName: { type: 'String' },
      downloadCount: { type: 'Number', default: 0 }
    }
  ]
};
