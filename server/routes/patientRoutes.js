// server/routes/patientRoutes.js - Express REST API for Laboratory Patient & Sample Lifecycle
import express from 'express';
import { PatientModel, PatientMongooseSchemaDefinition } from '../db.js';

const router = express.Router();

// GET /api/patients/schema - Return MongoDB Mongoose Schema definition for Pakistan Laboratory
router.get('/schema', async (req, res) => {
  res.json({
    success: true,
    country: 'Pakistan',
    standard: 'PM&DC and PHCC Compliant',
    schema: PatientMongooseSchemaDefinition
  });
});

// GET /api/patients - Search & filter patients
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const patients = await PatientModel.find({ status, search });
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/patients/:id - Single patient record
router.get('/:id', async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient record not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/patients - Register new patient (Step 3)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      mobile,
      testType,
      visitDate,
      doctorName,
      notes,
      cnic,
      city,
      province,
      guardianName,
      billing
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Patient name is required.'
      });
    }

    if (!mobile || !mobile.trim() || mobile.replace(/\D/g, '').length < 9) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is missing. Please enter the patient's Pakistani WhatsApp number."
      });
    }

    let formattedMobile = mobile.trim();
    if (!formattedMobile.startsWith('+')) {
      if (formattedMobile.startsWith('0')) {
        formattedMobile = '+92 ' + formattedMobile.slice(1);
      } else {
        formattedMobile = '+92 ' + formattedMobile;
      }
    }

    const newPatient = await PatientModel.create({
      name: name.trim(),
      age: Number(age) || 30,
      gender: gender || 'Male',
      mobile: formattedMobile,
      cnic: cnic?.trim() || undefined,
      city: city?.trim() || 'Lahore',
      province: province?.trim() || 'Punjab',
      guardianName: guardianName?.trim() || undefined,
      testType: testType || 'Complete Blood Count (CBC)',
      visitDate: visitDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      doctorName: doctorName?.trim() || 'Self / Walk-in',
      notes: notes?.trim() || undefined,
      billing: billing || {
        testPrice: 650,
        discount: 0,
        paidAmount: 650,
        currency: 'PKR',
        paymentMethod: 'Cash',
        paymentStatus: 'Paid'
      }
    });

    res.status(201).json({ success: true, data: newPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/patients/:id/sample - Mark sample collected (Step 4)
router.post('/:id/sample', async (req, res) => {
  try {
    const { sampleType, collectedAt, technician, tubeType, sampleCondition, notes } = req.body;
    
    const sampleDetails = {
      sampleType: sampleType || 'Blood',
      collectedAt: collectedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      technician: technician || 'Muhammad Bilal Khan (BS-MLT)',
      tubeType: tubeType || 'EDTA Purple Tube (K2 EDTA)',
      sampleCondition: sampleCondition || 'Good',
      notes: notes || undefined
    };

    const updated = await PatientModel.findByIdAndUpdate(req.params.id, {
      status: 'collected',
      sampleDetails
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/patients/:id/status - Update processing status (Step 5)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, needsAttentionReason } = req.body;
    const update = { status };
    if (needsAttentionReason !== undefined) {
      update.needsAttentionReason = needsAttentionReason;
    }

    const updated = await PatientModel.findByIdAndUpdate(req.params.id, update);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/patients/:id/results - Save test results & PDF upload (Step 6)
router.post('/:id/results', async (req, res) => {
  try {
    const { fileName, fileSize, parameters, clinicalRemarks, isDraft } = req.body;
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const reportDetails = {
      ...(patient.reportDetails || {}),
      reportId: `REP-${patient.id}`,
      fileName: fileName || `${patient.name.replace(/\s+/g, '_')}_Report.pdf`,
      fileSize: fileSize || '412 KB',
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parameters: parameters || patient.reportDetails?.parameters || [],
      clinicalRemarks: clinicalRemarks || patient.reportDetails?.clinicalRemarks || '',
      isDraft: isDraft ?? true,
      isPdfReady: true
    };

    const updated = await PatientModel.findByIdAndUpdate(req.params.id, {
      status: 'ready_for_review',
      reportDetails
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/patients/:id/approve - Pathologist review and approval (Step 7)
router.post('/:id/approve', async (req, res) => {
  try {
    const { approverName } = req.body;
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (!patient.reportDetails?.isPdfReady) {
      return res.status(400).json({
        success: false,
        message: 'Report is not uploaded. Please upload the PDF before approving.'
      });
    }

    const reportDetails = {
      ...patient.reportDetails,
      isDraft: false,
      approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      approvedBy: approverName || 'Prof. Dr. Ayesha Siddiqui (FCPS)'
    };

    const updated = await PatientModel.findByIdAndUpdate(req.params.id, {
      status: 'ready_for_review',
      reportDetails
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/patients/:id/whatsapp - Send report via WhatsApp (Step 8)
router.post('/:id/whatsapp', async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messagePreview = `Assalam-o-Alaikum,\nYour diagnostic test report is ready.\nPatient: ${patient.name}\nTest: ${patient.testType}\nDate: ${patient.visitDate}\nLab: LabFlow Diagnostics, Gulberg Lahore\n\nClick below to view your report:\nhttps://labflow.pk/report/${patient.id}`;

    const deliveryDetails = {
      whatsappSentAt: now,
      deliveredAt: now,
      openedAt: null,
      downloadedAt: null,
      status: 'delivered',
      resendCount: patient.deliveryDetails?.resendCount || 0,
      messagePreview
    };

    const previousReports = [
      ...(patient.previousReports || []),
      {
        id: `rep-${Date.now()}`,
        date: patient.visitDate,
        testType: patient.testType,
        status: 'Sent',
        fileName: patient.reportDetails?.fileName || `${patient.name}_Report.pdf`,
        downloadCount: 0
      }
    ];

    const updated = await PatientModel.findByIdAndUpdate(req.params.id, {
      status: 'sent',
      deliveryDetails,
      previousReports
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/patients/:id/resend - Resend WhatsApp link (Step 9)
router.post('/:id/resend', async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const deliveryDetails = {
      ...(patient.deliveryDetails || {}),
      whatsappSentAt: now,
      deliveredAt: now,
      status: 'delivered',
      resendCount: (patient.deliveryDetails?.resendCount || 0) + 1
    };

    const updated = await PatientModel.findByIdAndUpdate(req.params.id, {
      deliveryDetails
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/patients/:id/action - Simulate Patient Open or Download action
router.post('/:id/action', async (req, res) => {
  try {
    const { action } = req.body; // 'open' | 'download'
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const deliveryDetails = { ...(patient.deliveryDetails || {}) };

    if (action === 'open') {
      deliveryDetails.openedAt = now;
      if (deliveryDetails.status !== 'downloaded') {
        deliveryDetails.status = 'opened';
      }
    } else if (action === 'download') {
      deliveryDetails.downloadedAt = now;
      deliveryDetails.status = 'downloaded';
    }

    const updated = await PatientModel.findByIdAndUpdate(req.params.id, {
      deliveryDetails
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/patients/:id/phone - Update patient phone number
router.put('/:id/phone', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || mobile.replace(/\D/g, '').length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit WhatsApp number.'
      });
    }

    const updated = await PatientModel.findByIdAndUpdate(req.params.id, {
      mobile: mobile.trim()
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/patients/reset - Reset demo database
router.post('/reset', async (req, res) => {
  try {
    const resetList = await PatientModel.resetDefaults();
    res.json({ success: true, data: resetList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
