import { RequirementsForm } from '@/components/requirements-form';

export default function RequirementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Import Requirement
        </h1>
        <p className="text-muted-foreground">
          Upload your software requirements document, type them directly, or use
          your voice. Our AI will analyze it for completeness and compliance.
        </p>
      </div>
      <RequirementsForm />
    </div>
  );
}
