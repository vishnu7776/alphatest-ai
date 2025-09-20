
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TestCasesPage() {
  const testCases = `
      1. Verify user can log in with valid credentials.
      2. Verify user cannot log in with invalid credentials.
      3. Verify a new patient can be successfully added to the system.
      4. Verify patient records can be searched and retrieved.
      5. Verify a new appointment can be scheduled for a patient.
      `;
  const summary = "This is a mock summary of the requirements document. It seems to be about building a healthcare application with patient management features.";

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Generated Test Cases
        </h1>
        <p className="text-muted-foreground">
          Below are the test cases and summary generated from your requirements.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-muted/50 p-4 rounded-md whitespace-pre-wrap"><code>{testCases}</code></pre>
        </CardContent>
      </Card>
    </div>
  );
}
