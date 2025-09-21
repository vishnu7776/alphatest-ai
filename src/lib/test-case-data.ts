
export type TestCase = {
  id: string;
  title: string;
  tags: string[];
  status: 'Pass' | 'Fail' | 'Inprogress' | 'New';
  scenario: string;
  expectedResult: string;
};

export type Requirement = {
  id: string;
  title: string;
  description: string;
  version: string;
  type: string;
  deliverables: string;
  source: string;
  testCasesCount: number;
  testCases: TestCase[];
};

export const testCaseData: Requirement[] = [
  {
    id: 'HC-REQ-001',
    title: 'Patient Registration Form',
    description: 'Allow new patients to register with personal and insurance details.',
    version: 'BRD v1.2',
    type: 'Functional',
    deliverables: 'UI Calendar Integration, Scheduling API, Notification System, DB Schema',
    source: 'BRD v1.0',
    testCasesCount: 8,
    testCases: [
      { id: 'TC-101', title: 'Valid Registration', tags: ['HIPAA', 'GDPR'], status: 'Pass', scenario: 'Submit all valid fields (Name, DOB, Email, Phone, Insurance ID)', expectedResult: 'Registration is successful, confirmation message shown' },
      { id: 'TC-102', title: 'Missing Email', tags: ['HIPAA'], status: 'Inprogress', scenario: 'Leave Email blank', expectedResult: 'Error message "Email is required" displayed' },
      { id: 'TC-103', title: 'Future DOB', tags: ['HIPAA'], status: 'Inprogress', scenario: 'Enter a DOB in the future', expectedResult: 'Error message "Invalid date of birth" displayed' },
      { id: 'TC-104', title: 'Duplicate Email', tags: ['HIPAA', 'GDPR'], status: 'Fail', scenario: 'Register using an existing email ID', expectedResult: 'Error message "Email already exists" displayed' },
      { id: 'TC-105', title: 'Invalid Insurance ID', tags: ['HIPAA'], status: 'Fail', scenario: 'Enter an invalid or expired insurance ID', expectedResult: 'Error message "Invalid insurance" displayed' },
      { id: 'TC-106', title: 'PHI Encryption Check', tags: ['HIPAA'], status: 'Inprogress', scenario: 'Inspect patient record in database', expectedResult: 'PHI fields (Name, DOB, Insurance ID) are encrypted at rest' },
      { id: 'TC-107', title: 'Audit Trail Creation', tags: ['FDA 21', 'CFR Part 11'], status: 'Pass', scenario: 'Verify that an audit trail is created upon new patient registration with all required details.', expectedResult: 'An audit trail entry is successfully logged in the system with the correct user, action, and timestamp.' },
      { id: 'TC-108', title: 'Consent Checkbox Mandatory', tags: ['GDPR'], status: 'Inprogress', scenario: 'Attempt to submit the registration form without checking the consent checkbox.', expectedResult: 'Form submission is blocked, and an error message "You must agree to the terms" is displayed.' },
    ],
  },
  {
    id: 'HC-REQ-002',
    title: 'Appointment Scheduling',
    description: 'Enable patients to schedule, reschedule, or cancel appointments.',
    version: 'BRD v1.0',
    type: 'Functional',
    deliverables: 'UI Calendar, Scheduling API, Notifications',
    source: 'BRD v1.0',
    testCasesCount: 5,
    testCases: [
      { id: 'TC-201', title: 'Schedule New Appointment', tags: ['Functional'], status: 'Pass', scenario: 'Patient selects a doctor, date, and time slot and confirms.', expectedResult: 'Appointment is successfully booked and appears in the patient\'s dashboard.' },
      { id: 'TC-202', title: 'Reschedule Appointment', tags: ['Functional'], status: 'Pass', scenario: 'Patient changes the time/date of an existing appointment.', expectedResult: 'The appointment is updated with the new time/date.' },
      { id: 'TC-203', title: 'Cancel Appointment', tags: ['Functional'], status: 'Fail', scenario: 'Patient cancels an upcoming appointment.', expectedResult: 'Appointment is removed from the dashboard and the time slot becomes available.' },
      { id: 'TC-204', title: 'Double Booking Check', tags: ['Functional'], status: 'Inprogress', scenario: 'Attempt to book two appointments in the same time slot for the same doctor.', expectedResult: 'System prevents double booking and shows an error message.' },
      { id: 'TC-205', title: 'View Doctor Availability', tags: ['Functional'], status: 'New', scenario: 'Patient selects a doctor to see their available time slots.', expectedResult: 'A calendar view shows all available slots for the selected doctor.' },
    ],
  },
    {
    id: 'HC-REQ-003',
    title: 'Patient Dashboard Access',
    description: 'Provide a secure dashboard for patients to view medical records.',
    version: 'BRD v1.3',
    type: 'Non-Functional',
    deliverables: 'UI Dashboard, Data API, Security',
    source: 'BRD v1.3',
    testCasesCount: 4,
    testCases: [
      { id: 'TC-301', title: 'Secure Login', tags: ['Security', 'HIPAA'], status: 'Pass', scenario: 'User logs in with valid credentials.', expectedResult: 'User is authenticated and gains access to their personal dashboard.' },
      { id: 'TC-302', title: 'Unauthorized Access Attempt', tags: ['Security', 'HIPAA'], status: 'Pass', scenario: 'Attempt to access a patient dashboard without logging in or with another user\'s session.', expectedResult: 'Access is denied and user is redirected to the login page.' },
      { id: 'TC-303', title: 'Load Medical History', tags: ['Performance'], status: 'Inprogress', scenario: 'Patient navigates to the "Medical History" section of the dashboard.', expectedResult: 'The complete medical history loads in under 3 seconds.' },
      { id: 'TC-304', title: 'Data Encryption Verification', tags: ['Security'], status: 'New', scenario: 'Verify that all patient data transmitted between the client and server is encrypted.', expectedResult: 'Network traffic analysis shows that all data is sent over HTTPS.' },
    ],
  },
];
