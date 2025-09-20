import { RequirementsForm } from '@/components/requirements-form';
import { Suspense } from 'react';

export default function RequirementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense>
        <RequirementsForm />
      </Suspense>
    </div>
  );
}
