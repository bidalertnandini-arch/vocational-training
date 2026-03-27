// Mock data for ITI Faculty Monitoring System
// Represents ITIs in Andhra Pradesh with faculty, attendance, and feedback

export interface Institute {
  id: string;
  name: string;
  nameTE: string;
  district: string;
  districtTE: string;
  principalName: string;
  totalFaculty: number;
  totalStudents: number;
  trades: string[];
  attendanceRate: number;
  engagementScore: number;
  location: { lat: number; lng: number };
}

export interface Faculty {
  id: string;
  name: string;
  nameTE: string;
  instituteId: string;
  trade: string;
  tradeTE: string;
  phone: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
  faceEnrolled: boolean;
  attendanceRate: number;
  engagementScore: number;
  photoUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  facultyId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  method: 'face' | 'manual' | 'biometric';
  location?: { lat: number; lng: number };
}

export interface ClassroomSession {
  id: string;
  facultyId: string;
  date: string;
  startTime: string;
  endTime: string;
  trade: string;
  studentCount: number;
  engagementScore: number;
  facultyPresent: boolean;
  duration: number; // in minutes
}

export interface StudentFeedback {
  id: string;
  facultyId: string;
  date: string;
  rating: number; // 1-5
  feedbackText: string;
  feedbackTextTE: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  isAnonymous: boolean;
}

export interface AnomalyAlert {
  id: string;
  type: 'late_arrival' | 'frequent_absence' | 'low_engagement' | 'negative_feedback' | 'duration_mismatch';
  severity: 'high' | 'medium' | 'low';
  facultyId: string;
  instituteId: string;
  description: string;
  descriptionTE: string;
  explanation: string;
  explanationTE: string;
  detectedAt: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export interface User {
  id: string;
  username: string;
  name: string;
  nameTE: string;
  role: 'admin' | 'dto' | 'principal' | 'faculty' | 'student';
  email: string;
  instituteId?: string;
  district?: string;
}

// AP Districts List
export const districts = [
  { id: 'all', name: 'All Districts', nameTE: 'అన్ని జిల్లాలు' },
  { id: 'guntur', name: 'Guntur', nameTE: 'గుంటూరు' },
  { id: 'krishna', name: 'Krishna', nameTE: 'కృష్ణా' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', nameTE: 'విశాఖపట్నం' },
  { id: 'east_godavari', name: 'East Godavari', nameTE: 'తూర్పు గోదావరి' },
  { id: 'west_godavari', name: 'West Godavari', nameTE: 'పశ్చిమ గోదావరి' },
  { id: 'chittoor', name: 'Chittoor', nameTE: 'చిత్తూరు' },
  { id: 'kurnool', name: 'Kurnool', nameTE: 'కర్నూలు' },
  { id: 'anantapur', name: 'Anantapur', nameTE: 'అనంతపురం' },
  { id: 'kadapa', name: 'YSR Kadapa', nameTE: 'వైఎస్ఆర్ కడప' },
  { id: 'nellore', name: 'SPSR Nellore', nameTE: 'నెల్లూరు' },
  { id: 'prakasam', name: 'Prakasam', nameTE: 'ప్రకాశం' },
  { id: 'srikakulam', name: 'Srikakulam', nameTE: 'శ్రీకాకుళం' },
  { id: 'vizianagaram', name: 'Vizianagaram', nameTE: 'విజయనగరం' },
];

// Sample Institutes (All AP)
export const institutes: Institute[] = [
  // --- Guntur District ---
  {
    id: 'GU28000260',
    name: 'Govt District Level Training Centre / ITI Guntur',
    nameTE: 'ప్రభుత్వ జిల్లా స్థాయి శిక్షణా కేంద్రం / ఐటీఐ గుంటూరు',
    district: 'Guntur',
    districtTE: 'గుంటూరు',
    principalName: 'Sri K. Venkata Rao',
    totalFaculty: 42,
    totalStudents: 450,
    trades: ['Electrician', 'Fitter', 'Diesel Mechanic', 'COPA'],
    attendanceRate: 93.5,
    engagementScore: 84.2,
    location: { lat: 16.3067, lng: 80.4365 },
  },
  {
    id: 'GR28000206',
    name: 'Govt Industrial Training Institute Tenali',
    nameTE: 'ప్రభుత్వ పారిశ్రామిక శిక్షణా సంస్థ తెనాలి',
    district: 'Guntur',
    districtTE: 'గుంటూరు',
    principalName: 'Sri M. Ravi Kumar',
    totalFaculty: 24,
    totalStudents: 464,
    trades: ['Electrician', 'Fitter', 'Plumber'],
    attendanceRate: 91.2,
    engagementScore: 76.8,
    location: { lat: 16.2348, lng: 80.6400 },
  },
  {
    id: 'GR28000991',
    name: 'Govt Residential ITI Macherla (Nagarjunasagar)',
    nameTE: 'ప్రభుత్వ రెసిడెన్షియల్ ఐటీఐ మాచర్ల',
    district: 'Guntur',
    districtTE: 'గుంటూరు',
    principalName: 'Smt. P. Sujatha',
    totalFaculty: 18,
    totalStudents: 240,
    trades: ['Electrician', 'Fitter', 'Welder'],
    attendanceRate: 88.9,
    engagementScore: 79.5,
    location: { lat: 16.5772, lng: 79.3190 },
  },
  {
    id: 'GR28000992',
    name: 'Govt Industrial Training Institute Nizampatnam',
    nameTE: 'ప్రభుత్వ పారిశ్రామిక శిక్షణా సంస్థ నిజాంపట్నం',
    district: 'Guntur',
    districtTE: 'గుంటూరు',
    principalName: 'Sri B. Satyanarayana',
    totalFaculty: 12,
    totalStudents: 128,
    trades: ['Fitter', 'Marine Fitter', 'Navik'],
    attendanceRate: 85.6,
    engagementScore: 74.2,
    location: { lat: 15.9056, lng: 80.6728 },
  },
  {
    id: 'GR28000993',
    name: 'Govt ITI College, Gudavalli',
    nameTE: 'ప్రభుత్వ ఐటీఐ కళాశాల, గుడవల్లి',
    district: 'Guntur',
    districtTE: 'గుంటూరు',
    principalName: 'Sri T. Ramesh',
    totalFaculty: 15,
    totalStudents: 200,
    trades: ['COPA', 'Dress Making', 'Fitter'],
    attendanceRate: 87.4,
    engagementScore: 81.0,
    location: { lat: 16.0965, lng: 80.6548 },
  },
  {
    id: 'GR28000994',
    name: 'Govt Industrial Training Institute Narasaraopet',
    nameTE: 'ప్రభుత్వ పారిశ్రామిక శిక్షణా సంస్థ నరసరావుపేట',
    district: 'Guntur',
    districtTE: 'గుంటూరు',
    principalName: 'Smt. G. Lakshmi',
    totalFaculty: 28,
    totalStudents: 380,
    trades: ['Electrician', 'Fitter', 'Motor Mechanic'],
    attendanceRate: 90.5,
    engagementScore: 83.1,
    location: { lat: 16.2361, lng: 80.0543 },
  },
  {
    id: 'GR28000995',
    name: 'Govt Industrial Training Institute Sattenapalle',
    nameTE: 'ప్రభుత్వ పారిశ్రామిక శిక్షణా సంస్థ సత్తెనపల్లి',
    district: 'Guntur',
    districtTE: 'గుంటూరు',
    principalName: 'Sri V. Krishna',
    totalFaculty: 20,
    totalStudents: 250,
    trades: ['Electrician', 'Surveyor'],
    attendanceRate: 89.1,
    engagementScore: 78.4,
    location: { lat: 16.3986, lng: 80.1495 },
  },
  {
    id: 'GR28000996',
    name: 'Govt Industrial Training Institute Vinukonda',
    nameTE: 'ప్రభుత్వ పారిశ్రామిక శిక్షణా సంస్థ వినుకొండ',
    district: 'Guntur',
    districtTE: 'గుంటూరు',
    principalName: 'Sri N. Rao',
    totalFaculty: 16,
    totalStudents: 180,
    trades: ['Fitter', 'Welder', 'Turner'],
    attendanceRate: 86.8,
    engagementScore: 77.3,
    location: { lat: 16.0592, lng: 79.7428 },
  },

  // --- Krishna District ---
  {
    id: 'KR28000501',
    name: 'Govt ITI Vijayawada',
    nameTE: 'ప్రభుత్వ ఐటీఐ విజయవాడ',
    district: 'Krishna',
    districtTE: 'కృష్ణా',
    principalName: 'Sri P. Suresh',
    totalFaculty: 35,
    totalStudents: 410,
    trades: ['Electrician', 'Fitter', 'R&AC', 'Electronics'],
    attendanceRate: 94.2,
    engagementScore: 86.5,
    location: { lat: 16.5062, lng: 80.6480 },
  },
  {
    id: 'KR28000502',
    name: 'Govt ITI Machilipatnam',
    nameTE: 'ప్రభుత్వ ఐటీఐ మచిలీపట్నం',
    district: 'Krishna',
    districtTE: 'కృష్ణా',
    principalName: 'Sri M. Venkat',
    totalFaculty: 22,
    totalStudents: 310,
    trades: ['Welder', 'Turner', 'Machinist'],
    attendanceRate: 88.5,
    engagementScore: 79.2,
    location: { lat: 16.1808, lng: 81.1196 },
  },

  // --- East Godavari District ---
  {
    id: 'EG28000601',
    name: 'Govt ITI Rajahmundry',
    nameTE: 'ప్రభుత్వ ఐటీఐ రాజమండ్రి',
    district: 'East Godavari',
    districtTE: 'తూర్పు గోదావరి',
    principalName: 'Sri K. Suryanarayana',
    totalFaculty: 45,
    totalStudents: 620,
    trades: ['Electrician', 'Fitter', 'Draughtsman Civil', 'COPA'],
    attendanceRate: 95.1,
    engagementScore: 87.8,
    location: { lat: 17.0005, lng: 81.8040 },
  },
  {
    id: 'EG28000602',
    name: 'Govt ITI Kakinada',
    nameTE: 'ప్రభుత్వ ఐటీఐ కాకినాడ',
    district: 'East Godavari',
    districtTE: 'తూర్పు గోదావరి',
    principalName: 'Smt. L. Padmavathi',
    totalFaculty: 38,
    totalStudents: 550,
    trades: ['Electrician', 'Marine Fitter', 'Instrumentation'],
    attendanceRate: 92.4,
    engagementScore: 85.3,
    location: { lat: 16.9891, lng: 82.2475 },
  },


  // --- Visakhapatnam District ---
  {
    id: 'VS28000701',
    name: 'Govt ITI (Old) Visakhapatnam',
    nameTE: 'ప్రభుత్వ ఐటీఐ (పాత) విశాఖపట్నం',
    district: 'Visakhapatnam',
    districtTE: 'విశాఖపట్నం',
    principalName: 'Sri L. Narayana',
    totalFaculty: 48,
    totalStudents: 520,
    trades: ['Electrician', 'Fitter', 'Instrument Mechanic', 'Draftsman'],
    attendanceRate: 95.1,
    engagementScore: 88.4,
    location: { lat: 17.6868, lng: 83.2185 },
  },
  {
    id: 'VS28000702',
    name: 'Govt ITI Gajuwaka',
    nameTE: 'ప్రభుత్వ ఐటీఐ గాజువాక',
    district: 'Visakhapatnam',
    districtTE: 'విశాఖపట్నం',
    principalName: 'Sri R. Bose',
    totalFaculty: 30,
    totalStudents: 350,
    trades: ['Fitter', 'Welder', 'Electrician'],
    attendanceRate: 92.3,
    engagementScore: 85.0,
    location: { lat: 17.6905, lng: 83.2120 },
  },

  // --- West Godavari ---
  {
    id: 'WG28000801',
    name: 'Govt ITI Eluru',
    nameTE: 'ప్రభుత్వ ఐటీఐ ఏలూరు',
    district: 'West Godavari',
    districtTE: 'పశ్చిమ గోదావరి',
    principalName: 'Sri V. Sharma',
    totalFaculty: 32,
    totalStudents: 410,
    trades: ['Electrician', 'Fitter', 'COPA'],
    attendanceRate: 90.1,
    engagementScore: 81.5,
    location: { lat: 16.7107, lng: 81.0952 },
  },

  // --- Chittoor ---
  {
    id: 'CH28000901',
    name: 'Govt ITI Tirupati',
    nameTE: 'ప్రభుత్వ ఐటీఐ తిరుపతి',
    district: 'Chittoor',
    districtTE: 'చిత్తూరు',
    principalName: 'Smt. K. Lakshmi',
    totalFaculty: 40,
    totalStudents: 500,
    trades: ['Electrician', 'Electronics', 'Fitter'],
    attendanceRate: 93.8,
    engagementScore: 86.2,
    location: { lat: 13.6288, lng: 79.4192 },
  },

  // --- Kurnool ---
  {
    id: 'KU28001001',
    name: 'Govt ITI Kurnool',
    nameTE: 'ప్రభుత్వ ఐటీఐ కర్నూలు',
    district: 'Kurnool',
    districtTE: 'కర్నూలు',
    principalName: 'Sri M. Reddy',
    totalFaculty: 35,
    totalStudents: 450,
    trades: ['Electrician', 'Diesel Mechanic', 'Welder'],
    attendanceRate: 89.5,
    engagementScore: 80.4,
    location: { lat: 15.8281, lng: 78.0373 },
  },

  // --- Anantapur ---
  {
    id: 'AN28001101',
    name: 'Govt ITI Anantapur',
    nameTE: 'ప్రభుత్వ ఐటీఐ అనంతపురం',
    district: 'Anantapur',
    districtTE: 'అనంతపురం',
    principalName: 'Sri B. Naidu',
    totalFaculty: 28,
    totalStudents: 380,
    trades: ['Fitter', 'Turner', 'Machinist'],
    attendanceRate: 88.2,
    engagementScore: 78.9,
    location: { lat: 14.6819, lng: 77.6006 },
  },

  // --- YSR Kadapa ---
  {
    id: 'KA28001201',
    name: 'Govt ITI Kadapa',
    nameTE: 'ప్రభుత్వ ఐటీఐ కడప',
    district: 'YSR Kadapa',
    districtTE: 'వైఎస్ఆర్ కడప',
    principalName: 'Smt. R. Devi',
    totalFaculty: 30,
    totalStudents: 400,
    trades: ['Electrician', 'Draughtsman Civil', 'Surveyor'],
    attendanceRate: 91.5,
    engagementScore: 83.1,
    location: { lat: 14.4673, lng: 78.8242 },
  },

  // --- SPSR Nellore ---
  {
    id: 'NE28001301',
    name: 'Govt ITI Nellore',
    nameTE: 'ప్రభుత్వ ఐటీఐ నెల్లూరు',
    district: 'SPSR Nellore',
    districtTE: 'నెల్లూరు',
    principalName: 'Sri K. Murthy',
    totalFaculty: 33,
    totalStudents: 420,
    trades: ['Electrician', 'Fitter', 'Instrument Mechanic'],
    attendanceRate: 92.0,
    engagementScore: 84.5,
    location: { lat: 14.4426, lng: 79.9865 },
  },

  // --- Prakasam ---
  {
    id: 'PR28001401',
    name: 'Govt ITI Ongole',
    nameTE: 'ప్రభుత్వ ఐటీఐ ఒంగోలు',
    district: 'Prakasam',
    districtTE: 'ప్రకాశం',
    principalName: 'Sri T. Rao',
    totalFaculty: 26,
    totalStudents: 350,
    trades: ['Electrician', 'Fitter', 'Welder'],
    attendanceRate: 87.9,
    engagementScore: 79.8,
    location: { lat: 15.5057, lng: 80.0499 },
  },

  // --- Srikakulam ---
  {
    id: 'SR28001501',
    name: 'Govt ITI Srikakulam',
    nameTE: 'ప్రభుత్వ ఐటీఐ శ్రీకాకుళం',
    district: 'Srikakulam',
    districtTE: 'శ్రీకాకుళం',
    principalName: 'Smt. P. Kumari',
    totalFaculty: 24,
    totalStudents: 300,
    trades: ['Electrician', 'Fitter', 'COPA'],
    attendanceRate: 88.6,
    engagementScore: 80.2,
    location: { lat: 18.3000, lng: 83.9000 },
  },

  // --- Vizianagaram ---
  {
    id: 'VI28001601',
    name: 'Govt ITI Vizianagaram',
    nameTE: 'ప్రభుత్వ ఐటీఐ విజయనగరం',
    district: 'Vizianagaram',
    districtTE: 'విజయనగరం',
    principalName: 'Sri A. Raju',
    totalFaculty: 29,
    totalStudents: 360,
    trades: ['Fitter', 'Turner', 'Machinist'],
    attendanceRate: 89.8,
    engagementScore: 81.7,
    location: { lat: 18.1067, lng: 83.3956 },
  },
];

// Sample Faculty (Mapped to Guntur POC Institutes)
export const faculty: Faculty[] = [
  // Guntur DLTC
  {
    id: 'fac-001',
    name: 'Srinivas Rao K.',
    nameTE: 'శ్రీనివాస్ రావు కె.',
    instituteId: 'GU28000260',
    trade: 'Electrician',
    tradeTE: 'ఎలక్ట్రీషియన్',
    phone: '9876543210',
    email: 'srinivas.rao@apit.gov.in',
    joinDate: '2016-06-15',
    status: 'active',
    faceEnrolled: true,
    attendanceRate: 96.2,
    engagementScore: 85.4,
  },
  {
    id: 'fac-002',
    name: 'Padma Devi M.',
    nameTE: 'పద్మ దేవి ఎం.',
    instituteId: 'GU28000260',
    trade: 'Fitter',
    tradeTE: 'ఫిట్టర్',
    phone: '9876543211',
    email: 'padma.devi@apit.gov.in',
    joinDate: '2018-03-20',
    status: 'active',
    faceEnrolled: true,
    attendanceRate: 94.8,
    engagementScore: 88.2,
  },
  // Tenali Govt ITI
  {
    id: 'fac-003',
    name: 'Venkata Reddy G.',
    nameTE: 'వెంకట రెడ్డి జి.',
    instituteId: 'GR28000206',
    trade: 'Electrician',
    tradeTE: 'ఎలక్ట్రీషియన్',
    phone: '9876543215',
    email: 'venkata.reddy@apit.gov.in',
    joinDate: '2016-04-18',
    status: 'active',
    faceEnrolled: true,
    attendanceRate: 93.4,
    engagementScore: 86.7,
  },
  // Macherla Govt ITI
  {
    id: 'fac-004',
    name: 'Ravi Teja P.',
    nameTE: 'రవి తేజ పి.',
    instituteId: 'GR28000991',
    trade: 'Welder',
    tradeTE: 'వెల్డర్',
    phone: '9876543224',
    email: 'ravi.teja@apit.gov.in',
    joinDate: '2019-09-14',
    status: 'active',
    faceEnrolled: true,
    attendanceRate: 88.3,
    engagementScore: 81.2,
  },
  // Narasaraopet Govt ITI
  {
    id: 'fac-005',
    name: 'Krishna Murthy B.',
    nameTE: 'కృష్ణ మూర్తి బి.',
    instituteId: 'GR28000994',
    trade: 'Motor Mechanic',
    tradeTE: 'మోటార్ మెకానిక్',
    phone: '9876543225',
    email: 'krishna.m@apit.gov.in',
    joinDate: '2017-11-25',
    status: 'active',
    faceEnrolled: false,
    attendanceRate: 91.5,
    engagementScore: 85.9,
  },
  // Nizampatnam Govt ITI
  {
    id: 'fac-006',
    name: 'Anand Kumar S.',
    nameTE: 'ఆనంద్ కుమార్ ఎస్.',
    instituteId: 'GR28000992',
    trade: 'Marine Fitter',
    tradeTE: 'మెరైన్ ఫిట్టర్',
    phone: '9876543226',
    email: 'anand.s@apit.gov.in',
    joinDate: '2020-02-10',
    status: 'active',
    faceEnrolled: true,
    attendanceRate: 84.6,
    engagementScore: 76.4,
  },
];

// Generate attendance records for the last 30 days
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  faculty.forEach((fac) => {
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const random = Math.random();
      let status: AttendanceRecord['status'];
      let checkIn: string | null = null;
      let checkOut: string | null = null;

      if (random > 0.15) {
        if (random > 0.85) {
          status = 'late';
          checkIn = `09:${Math.floor(Math.random() * 45 + 15).toString().padStart(2, '0')}`;
        } else {
          status = 'present';
          checkIn = `08:${Math.floor(Math.random() * 30 + 30).toString().padStart(2, '0')}`;
        }
        checkOut = `17:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`;
      } else if (random > 0.08) {
        status = 'half-day';
        checkIn = `09:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`;
        checkOut = `13:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`;
      } else {
        status = 'absent';
      }

      records.push({
        id: `att-${fac.id}-${date.toISOString().split('T')[0]}`,
        facultyId: fac.id,
        date: date.toISOString().split('T')[0],
        checkIn,
        checkOut,
        status,
        method: Math.random() > 0.2 ? 'face' : 'biometric',
      });
    }
  });

  return records;
};

export const attendanceRecords = generateAttendanceRecords();

export const getFeedbackByFaculty = (facultyId: string) => studentFeedback.filter((f) => f.facultyId === facultyId);

export const markAttendance = (facultyId: string, location: { lat: number; lng: number }) => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const timeStr = today.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  const record: AttendanceRecord = {
    id: `att-${facultyId}-${dateStr}-${Date.now()}`,
    facultyId,
    date: dateStr,
    checkIn: timeStr,
    checkOut: null,
    status: 'present',
    method: 'face',
    location,
  };

  // Check if already checked in today
  const existingIndex = attendanceRecords.findIndex(
    (a) => a.facultyId === facultyId && a.date === dateStr
  );

  if (existingIndex >= 0) {
    // If already checked in, maybe we are checking out? Or just updating? 
    // For this demo, let's just update the check-in if it's not set (unlikely) or do nothing
    // But let's assume we allow multiple scans to "verify presence"
    console.log("Already marked for today");
    return attendanceRecords[existingIndex];
  }

  attendanceRecords.push(record);
  return record;
};

// Sample Classroom Sessions (Mapped to Guntur Faculty)
export const classroomSessions: ClassroomSession[] = [
  {
    id: 'ses-001',
    facultyId: 'fac-001',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    trade: 'Electrician',
    studentCount: 28,
    engagementScore: 87.5,
    facultyPresent: true,
    duration: 120,
  },
  {
    id: 'ses-002',
    facultyId: 'fac-003',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:30',
    trade: 'Electrician',
    studentCount: 32,
    engagementScore: 92.3,
    facultyPresent: true,
    duration: 150,
  },
  {
    id: 'ses-003',
    facultyId: 'fac-005',
    date: new Date().toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '13:00',
    trade: 'Motor Mechanic',
    studentCount: 25,
    engagementScore: 84.4,
    facultyPresent: true,
    duration: 120,
  },
];

// Sample Student Feedback
export const studentFeedback: StudentFeedback[] = [
  {
    id: 'fb-001',
    facultyId: 'fac-001',
    date: new Date().toISOString().split('T')[0],
    rating: 5,
    feedbackText: 'Excellent teaching at Guntur DLTC. Practical sessions are very useful.',
    feedbackTextTE: 'గుంటూరు DLTC లో అద్భుతమైన బోధన. ప్రాక్టికల్ సెషన్లు చాలా ఉపయోగకరంగా ఉన్నాయి.',
    sentiment: 'positive',
    isAnonymous: true,
  },
  {
    id: 'fb-002',
    facultyId: 'fac-003',
    date: new Date().toISOString().split('T')[0],
    rating: 4,
    feedbackText: 'Good explanations but needs more lab time.',
    feedbackTextTE: 'మంచి వివరణలు కానీ ల్యాబ్ సమయం ఎక్కువ కావాలి.',
    sentiment: 'positive',
    isAnonymous: true,
  },
];

// Sample Anomaly Alerts (Mapped to Guntur Faculty)
export const anomalyAlerts: AnomalyAlert[] = [
  {
    id: 'alert-001',
    type: 'frequent_absence',
    severity: 'high',
    facultyId: 'fac-006',
    instituteId: 'GR28000992',
    description: 'Faculty absent 3 times this week at Nizampatnam',
    descriptionTE: 'నిజాంపట్నంలో ఈ వారం 3 సార్లు ఫ్యాకల్టీ గైర్హాజరయ్యారు',
    explanation: 'AI detected pattern: Monday/Friday absences frequent.',
    explanationTE: 'AI గుర్తించిన నమూనా: సోమవారం/శుక్రవారం గైర్హాజరులు తరచుగా.',
    detectedAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'new',
  },
  {
    id: 'alert-002',
    type: 'late_arrival',
    severity: 'medium',
    facultyId: 'fac-003',
    instituteId: 'GR28000206',
    description: 'Late arrival detected at Tenali ITI',
    descriptionTE: 'తెనాలి ఐటీఐలో ఆలస్య రాక గుర్తించబడింది',
    explanation: 'Checked in at 9:45 AM (Schedule: 9:00 AM).',
    explanationTE: 'ఉదయం 9:45 గంటలకు చెక్ ఇన్ చేశారు (షెడ్యూల్: 9:00 AM).',
    detectedAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'acknowledged',
  },
];

// Sample Users (Guntur POC Users)
export const users: User[] = [
  {
    id: 'user-001',
    username: 'ADM_AP_001',
    name: 'State Administrator',
    nameTE: 'రాష్ట్ర అడ్మినిస్ట్రేటర్',
    role: 'admin',
    email: 'admin@det.ap.gov.in',
  },
  {
    id: 'user-002',
    username: 'DTO_GNT_01',
    name: 'Sri V. Rao (DTO Guntur)',
    nameTE: 'శ్రీ వి. రావు (DTO గుంటూరు)',
    role: 'dto',
    email: 'dto.guntur@det.ap.gov.in',
    district: 'Guntur',
  },
  {
    id: 'user-003',
    username: 'PRI_ITI_GNT01',
    name: 'Sri K. Venkata Rao',
    nameTE: 'శ్రీ కె. వెంకట రావు',
    role: 'principal',
    email: 'principal@guntur.gov.in',
    instituteId: 'GU28000260',
  },
  {
    id: 'user-005',
    username: 'FAC_ITI_GNT01_1023',
    name: 'Srinivas Rao K.',
    nameTE: 'శ్రీనివాస్ రావు కె.',
    role: 'faculty',
    email: 'srinivas.rao@apit.gov.in',
    instituteId: 'GU28000260',
  },
  {
    id: 'user-006',
    username: 'STU_ITI_GNT01_2024',
    name: 'Ramesh Kumar',
    nameTE: 'రమేష్ కుమార్',
    role: 'student',
    email: 'ramesh@student.ap.gov.in',
    instituteId: 'GU28000260',
  }
];

// Helper functions
export const getInstituteById = (id: string) => institutes.find((i) => i.id === id);
export const getFacultyById = (id: string) => faculty.find((f) => f.id === id);
export const getFacultyByInstitute = (instituteId: string) => faculty.filter((f) => f.instituteId === instituteId);
export const getAttendanceByFaculty = (facultyId: string) => attendanceRecords.filter((a) => a.facultyId === facultyId);
export const getAlertsByInstitute = (instituteId: string) => anomalyAlerts.filter((a) => a.instituteId === instituteId);

// Dashboard statistics (Filtered by District and/or Institute)
export const getDashboardStats = (districtId: string = 'all', instituteId: string = 'all') => {
  // 1. Filter Institutes (First by District, then by Institute if specified)
  let filteredInstitutes = institutes;

  if (districtId !== 'all') {
    const districtObj = districts.find(d => d.id === districtId);
    const filterTerm = districtObj ? districtObj.name : districtId;
    filteredInstitutes = filteredInstitutes.filter(i => i.district.toLowerCase() === filterTerm.toLowerCase());
  }

  if (instituteId !== 'all') {
    filteredInstitutes = filteredInstitutes.filter(i => i.id === instituteId);
  }

  const instituteIds = filteredInstitutes.map(i => i.id);

  // 2. Filter Faculty (belonging to those institutes)
  const filteredFaculty = faculty.filter(f => instituteIds.includes(f.instituteId));

  // 3. Filter Alerts (linked to those institutes or faculty)
  // Note: Alerts have both instituteId and facultyId, usually consistent.
  const filteredAlerts = anomalyAlerts.filter(a => instituteIds.includes(a.instituteId));

  // 4. Filter Feedback (linked to those faculty)
  const facultyIds = filteredFaculty.map(f => f.id);
  const filteredFeedback = studentFeedback.filter(f => facultyIds.includes(f.facultyId));

  // --- Calculate Metrics ---
  const totalFaculty = filteredFaculty.length;
  const activeFaculty = filteredFaculty.filter((f) => f.status === 'active').length;

  const avgAttendance = totalFaculty > 0
    ? filteredFaculty.reduce((sum, f) => sum + f.attendanceRate, 0) / totalFaculty
    : 0;

  const avgEngagement = totalFaculty > 0
    ? filteredFaculty.reduce((sum, f) => sum + f.engagementScore, 0) / totalFaculty
    : 0;

  const totalAlerts = filteredAlerts.filter((a) => a.status === 'new').length;
  const positiveFeedback = filteredFeedback.filter((f) => f.sentiment === 'positive').length;
  const totalFeedback = filteredFeedback.length;

  return {
    totalInstitutes: filteredInstitutes.length,
    totalFaculty,
    activeFaculty,
    avgAttendance: avgAttendance.toFixed(1),
    avgEngagement: avgEngagement.toFixed(1),
    totalAlerts,
    feedbackSentiment: totalFeedback > 0 ? ((positiveFeedback / totalFeedback) * 100).toFixed(0) : '0',
  };
};
