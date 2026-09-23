import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import { COMMON_LAB_TESTS } from '../data/initialData.js';
import {
  UserPlus,
  X,
  Phone,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  CreditCard,
  Building,
  IdCard,
} from 'lucide-react';

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Hyderabad',
  'Bahawalpur',
  'Other'
];

export const RegisterPatientModal = () => {
  const {
    isRegisterOpen,
    setIsRegisterOpen,
    registerPatient,
    setReceiptPatient,
    showNotification,
  } = useLab();

  const [name, setName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [cnic, setCnic] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [city, setCity] = useState('Lahore');
  const [mobile, setMobile] = useState('');
  const [testType, setTestType] = useState('Complete Blood Count (CBC)');
  const [doctorName, setDoctorName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isRegisterOpen) return null;

  // Selected test pricing in PKR
  const selectedTestObj = COMMON_LAB_TESTS.find((t) => t.name === testType) || COMMON_LAB_TESTS[0];

  const handleCnicChange = (val) => {
    // Auto-mask Pakistani CNIC as 35201-1234567-1
    const digitsOnly = val.replace(/\D/g, '').slice(0, 13);
    let formatted = digitsOnly;
    if (digitsOnly.length > 5 && digitsOnly.length <= 12) {
      formatted = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
    } else if (digitsOnly.length > 12) {
      formatted = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 12)}-${digitsOnly.slice(12)}`;
    }
    setCnic(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter the patient’s full name.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 9) {
      setErrorMsg('Please enter a valid Pakistani WhatsApp mobile number (e.g. 0300 1234567 or +92 300 1234567).');
      return;
    }

    // Format mobile to Pakistan international format
    let finalMobile = mobile.trim();
    if (!finalMobile.startsWith('+')) {
      if (finalMobile.startsWith('0')) {
        finalMobile = '+92 ' + finalMobile.slice(1);
      } else {
        finalMobile = '+92 ' + finalMobile;
      }
    }

    setSubmitting(true);
    try {
      const newPatient = await registerPatient({
        name: name.trim(),
        guardianName: guardianName.trim() || undefined,
        cnic: cnic.trim() || undefined,
        city: city || 'Lahore',
        province: city === 'Karachi' ? 'Sindh' : city === 'Islamabad' ? 'Islamabad Capital Territory' : city === 'Peshawar' ? 'Khyber Pakhtunkhwa' : city === 'Quetta' ? 'Balochistan' : 'Punjab',
        age: Number(age) || 30,
        gender,
        mobile: finalMobile,
        testType,
        doctorName: doctorName.trim() || 'Self / Walk-in',
        notes: notes.trim() || undefined,
        billing: {
          testPrice: selectedTestObj.price,
          discount: 0,
          paidAmount: selectedTestObj.price,
          currency: 'PKR',
          paymentMethod,
          paymentStatus: 'Paid'
        },
        visitDate: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      });

      // Close registration and open the printable receipt token
      setIsRegisterOpen(false);
      setReceiptPatient(newPatient);

      // Reset form
      setName('');
      setGuardianName('');
      setCnic('');
      setAge('');
      setCity('Lahore');
      setMobile('');
      setDoctorName('');
      setNotes('');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-teal-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center border border-teal-600">
              <UserPlus className="w-4 h-4 text-teal-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Register New Patient</h2>
                <span className="bg-teal-900/60 text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/40">
                  🇵🇰 Pakistan
                </span>
              </div>
              <p className="text-[11px] text-teal-100">Step 3 of Diagnostic Lifecycle • Auto Token & Slip Generation</p>
            </div>
          </div>
          <button
            onClick={() => setIsRegisterOpen(false)}
            className="text-teal-200 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-900 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Name and Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patient Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fatima Zahra / Muhammad Usman"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2: Guardian Name & CNIC (Pakistan specific) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Father / Husband Name
              </label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Syed Tariq Hussain"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  NADRA CNIC / B-Form
                </label>
                <span className="text-[10px] text-slate-400 font-mono">13 digits</span>
              </div>
              <input
                type="text"
                value={cnic}
                onChange={(e) => handleCnicChange(e.target.value)}
                placeholder="e.g. 35201-7654321-2"
                maxLength={15}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Age, City, and WhatsApp Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 34"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Mobile <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="0300 1234567"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
          <p className="text-[10px] text-teal-800 font-medium">
            💡 Reports will be dispatched automatically via WhatsApp Business API to Pakistani numbers (+92 3xx).
          </p>

          {/* Row 4: Prescribed Diagnostic Test */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Prescribed Diagnostic Test <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-bold text-teal-800 font-mono">
                Fee: Rs. {selectedTestObj.price} PKR
              </span>
            </div>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {COMMON_LAB_TESTS.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} — {t.sampleType} ({t.tube}) [Rs. {t.price}]
                </option>
              ))}
            </select>
          </div>

          {/* Row 5: Referring Doctor & Payment Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Referring Doctor / Hospital
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Prof. Dr. Shahid Hameed (FCPS) or Self"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method (PKR)
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Cash">Cash (Counter)</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="Bank Transfer">1Link / Online Bank Transfer</option>
                <option value="Debit Card">Debit / Credit Card (POS)</option>
              </select>
            </div>
          </div>

          {/* Row 6: Clinical Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Notes / Fasting Status
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 12-hour fasting verified. Patient reports morning fever or weakness."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRegisterOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>{submitting ? 'Registering...' : 'Save & Print Token Slip'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
