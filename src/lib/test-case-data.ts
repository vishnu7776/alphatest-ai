
export type TestCase = {
  id: string;
  title: string;
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pass' | 'Fail' | 'Inprogress' | 'New';
  scenario: string;
  preRequisites: string[];
  testSteps: string[];
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
      { id: 'TC-101', title: 'Valid Registration', tags: ['HIPAA', 'GDPR'], priority: 'High', status: 'Pass', scenario: 'Submit all valid fields (Name, DOB, Email, Phone, Insurance ID)', preRequisites: ['User is on the registration page.'], testSteps: ['Fill out all required fields with valid data.', 'Check the terms and conditions checkbox.', 'Click the "Register" button.'], expectedResult: 'Registration is successful, confirmation message shown' },
      { id: 'TC-102', title: 'Missing Email', tags: ['HIPAA'], priority: 'Medium', status: 'Inprogress', scenario: 'Leave Email blank', preRequisites: ['User is on the registration page.'], testSteps: ['Fill out all fields except for the email.', 'Click the "Register" button.'], expectedResult: 'Error message "Email is required" displayed' },
      { id: 'TC-103', title: 'Future DOB', tags: ['HIPAA'], priority: 'Medium', status: 'Inprogress', scenario: 'Enter a DOB in the future', preRequisites: ['User is on the registration page.'], testSteps: ['Enter a date of birth that is in the future.', 'Fill out all other required fields.', 'Click the "Register" button.'], expectedResult: 'Error message "Invalid date of birth" displayed' },
      { id: 'TC-104', title: 'Duplicate Email', tags: ['HIPAA', 'GDPR'], priority: 'High', status: 'Fail', scenario: 'Register using an existing email ID', preRequisites: ['A user with a known email already exists.', 'User is on the registration page.'], testSteps: ['Enter an email address that is already registered.', 'Fill out all other required fields.', 'Click the "Register" button.'], expectedResult: 'Error message "Email already exists" displayed' },
      { id: 'TC-105', title: 'Invalid Insurance ID', tags: ['HIPAA'], priority: 'Medium', status: 'Fail', scenario: 'Enter an invalid or expired insurance ID', preRequisites: ['User is on the registration page.'], testSteps: ['Enter an insurance ID that is known to be invalid or expired.', 'Fill out all other required fields.', 'Click the "Register" button.'], expectedResult: 'Error message "Invalid insurance" displayed' },
      { id: 'TC-106', title: 'PHI Encryption Check', tags: ['HIPAA'], priority: 'High', status: 'Inprogress', scenario: 'Inspect patient record in database', preRequisites: ['A patient has been registered.', 'Database access is available.'], testSteps: ['Query the database for the newly created patient record.', 'Inspect the fields containing Protected Health Information (PHI).'], expectedResult: 'PHI fields (Name, DOB, Insurance ID) are encrypted at rest' },
      { id: 'TC-107', title: 'Audit Trail Creation', tags: ['FDA 21', 'CFR Part 11'], priority: 'High', status: 'Pass', scenario: 'Verify that an audit trail is created upon new patient registration with all required details.', preRequisites: ['User has privileges to view audit logs.'], testSteps: ['Register a new patient.', 'Navigate to the audit trail section.', 'Search for the registration event.'], expectedResult: 'An audit trail entry is successfully logged in the system with the correct user, action, and timestamp.' },
      { id: 'TC-108', title: 'Consent Checkbox Mandatory', tags: ['GDPR'], priority: 'High', status: 'Inprogress', scenario: 'Attempt to submit the registration form without checking the consent checkbox.', preRequisites: ['User is on the registration page.'], testSteps: ['Fill out all required fields.', 'Do NOT check the consent checkbox.', 'Click the "Register" button.'], expectedResult: 'Form submission is blocked, and an error message "You must agree to the terms" is displayed.' },
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
      { id: 'TC-201', title: 'Schedule New Appointment', tags: ['Functional'], priority: 'High', status: 'Pass', scenario: 'Patient selects a doctor, date, and time slot and confirms.', preRequisites: ['Patient is logged in.'], testSteps: ['Navigate to the appointment scheduling page.', 'Select a doctor and an available time slot.', 'Confirm the appointment.'], expectedResult: 'Appointment is successfully booked and appears in the patient\'s dashboard.' },
      { id: 'TC-202', title: 'Reschedule Appointment', tags: ['Functional'], priority: 'Medium', status: 'Pass', scenario: 'Patient changes the time/date of an existing appointment.', preRequisites: ['Patient is logged in and has an existing appointment.'], testSteps: ['Navigate to the dashboard.', 'Select the option to reschedule an appointment.', 'Choose a new date and time.', 'Confirm the changes.'], expectedResult: 'The appointment is updated with the new time/date.' },
      { id: 'TC-203', title: 'Cancel Appointment', tags: ['Functional'], priority: 'Medium', status: 'Fail', scenario: 'Patient cancels an upcoming appointment.', preRequisites: ['Patient is logged in and has an upcoming appointment.'], testSteps: ['Navigate to the dashboard.', 'Select the option to cancel an appointment.', 'Confirm the cancellation.'], expectedResult: 'Appointment is removed from the dashboard and the time slot becomes available.' },
      { id: 'TC-204', title: 'Double Booking Check', tags: ['Functional'], priority: 'High', status: 'Inprogress', scenario: 'Attempt to book two appointments in the same time slot for the same doctor.', preRequisites: ['A time slot for a doctor is already booked.'], testSteps: ['Log in as a different patient.', 'Attempt to book the same time slot with the same doctor.'], expectedResult: 'System prevents double booking and shows an error message.' },
      { id: 'TC-205', title: 'View Doctor Availability', tags: ['Functional'], priority: 'Low', status: 'New', scenario: 'Patient selects a doctor to see their available time slots.', preRequisites: ['Patient is logged in.'], testSteps: ['Navigate to the "Book Appointment" page.', 'Select a doctor from the list.'], expectedResult: 'A calendar view shows all available slots for the selected doctor.' },
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
      { id: 'TC-301', title: 'Secure Login', tags: ['Security', 'HIPAA'], priority: 'High', status: 'Pass', scenario: 'User logs in with valid credentials.', preRequisites: ['User has a registered account.'], testSteps: ['Enter valid username and password.', 'Click "Login".'], expectedResult: 'User is authenticated and gains access to their personal dashboard.' },
      { id: 'TC-302', title: 'Unauthorized Access Attempt', tags: ['Security', 'HIPAA'], priority: 'High', status: 'Pass', scenario: 'Attempt to access a patient dashboard without logging in or with another user\'s session.', preRequisites: ['A valid patient dashboard URL is known.'], testSteps: ['Attempt to directly navigate to the dashboard URL without an active session.'], expectedResult: 'Access is denied and user is redirected to the login page.' },
      { id: 'TC-303', title: 'Load Medical History', tags: ['Performance'], priority: 'Medium', status: 'Inprogress', scenario: 'Patient navigates to the "Medical History" section of the dashboard.', preRequisites: ['Patient is logged in and has medical history.'], testSteps: ['Click on the "Medical History" tab or link.'], expectedResult: 'The complete medical history loads in under 3 seconds.' },
      { id: 'TC-304', title: 'Data Encryption Verification', tags: ['Security'], priority: 'High', status: 'New', scenario: 'Verify that all patient data transmitted between the client and server is encrypted.', preRequisites: ['Network monitoring tool is available.'], testSteps: ['Log in as a patient.', 'Use a network tool to inspect the traffic between browser and server.'], expectedResult: 'Network traffic analysis shows that all data is sent over HTTPS.' },
    ],
  },
];
