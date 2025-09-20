
import { BackButton } from '@/components/back-button';
import { RequirementsForm } from '@/components/requirements-form';
import { Suspense } from 'react';

export default function RequirementsPage() {
  return (
    <div className="flex flex-col gap-2">
      <BackButton />
      <Suspense>
        <RequirementsForm />
      </Suspense>
    </div>
  );
}
