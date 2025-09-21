
export type ApiParameter = {
    name: string;
    in: 'path' | 'query' | 'header' | 'body';
    description: string;
    required: boolean;
};

export type ApiEndpoint = {
    id: string;
    requirementId: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    summary: string;
    parameters: ApiParameter[];
    mappedTestCases: string[];
};

export const integrationData: ApiEndpoint[] = [
    {
        id: 'api-1',
        requirementId: 'HC-REQ-001',
        method: 'POST',
        path: '/api/v1/patients',
        summary: 'Create a new patient record.',
        parameters: [
            { name: 'patientData', in: 'body', description: 'JSON object containing patient information.', required: true },
        ],
        mappedTestCases: ['TC-101', 'TC-102', 'TC-103', 'TC-104', 'TC-105', 'TC-108'],
    },
    {
        id: 'api-2',
        requirementId: 'HC-REQ-001',
        method: 'GET',
        path: '/api/v1/patients/check-encryption/{patientId}',
        summary: 'Verify encryption of a patient record.',
        parameters: [
            { name: 'patientId', in: 'path', description: 'The unique identifier of the patient.', required: true },
        ],
        mappedTestCases: ['TC-106', 'TC-101'],
    },
     {
        id: 'api-3',
        requirementId: 'HC-REQ-001',
        method: 'GET',
        path: '/api/v1/audit-trails',
        summary: 'Retrieve audit trail logs for patient registration.',
        parameters: [
             { name: 'eventType', in: 'query', description: 'Filter by event type, e.g., "PATIENT_REGISTRATION".', required: false },
        ],
        mappedTestCases: ['TC-107', 'TC-101', 'TC-102'],
    },
    {
        id: 'api-4',
        requirementId: 'HC-REQ-002',
        method: 'POST',
        path: '/api/v1/appointments',
        summary: 'Schedule a new appointment.',
        parameters: [
            { name: 'appointmentData', in: 'body', description: 'JSON object with appointment details.', required: true },
        ],
        mappedTestCases: ['TC-201', 'TC-204'],
    },
    {
        id: 'api-5',
        requirementId: 'HC-REQ-002',
        method: 'PUT',
        path: '/api/v1/appointments/{appointmentId}',
        summary: 'Reschedule an existing appointment.',
        parameters: [
            { name: 'appointmentId', in: 'path', description: 'The unique identifier of the appointment.', required: true },
            { name: 'updateData', in: 'body', description: 'JSON object with new time/date.', required: true },
        ],
        mappedTestCases: ['TC-202'],
    },
     {
        id: 'api-6',
        requirementId: 'HC-REQ-002',
        method: 'DELETE',
        path: '/api/v1/appointments/{appointmentId}',
        summary: 'Cancel an appointment.',
        parameters: [
             { name: 'appointmentId', in: 'path', description: 'The unique identifier of the appointment.', required: true },
        ],
        mappedTestCases: ['TC-203'],
    },
    {
        id: 'api-7',
        requirementId: 'HC-REQ-001',
        method: 'GET',
        path: '/api/v1/patients/{patientId}/insurance',
        summary: 'Get patient insurance details.',
        parameters: [
            { name: 'patientId', in: 'path', description: 'The unique identifier of the patient.', required: true },
        ],
        mappedTestCases: ['TC-105', 'TC-101'],
    },
];


