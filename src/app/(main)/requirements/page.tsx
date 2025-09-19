import { RequirementsForm } from '@/components/requirements-form';

export default function RequirementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Generate Test Cases
        </h1>
        <p className="text-muted-foreground">
          Paste your software requirements to generate test cases using AI.
        </p>
      </div>
      <RequirementsForm />
    </div>
  );
}
