
import { BackButton } from '@/components/back-button';
import { RequirementsForm } from '@/components/requirements-form';
import { Suspense } from 'react';

export default function RequirementsPage() {
  return (
    <div>
      <BackButton />
      <div className="flex flex-col gap-2">
        <Suspense>
          <RequirementsForm />
        </Suspense>
      </div>
    </div>
  );
}
