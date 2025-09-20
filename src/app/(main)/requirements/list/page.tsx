
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Search, HeartPulse, FileText, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const requirementsData = [
  {
    id: 'HC-REQ-001',
    title: 'Patient Registration Form',
    description: 'Allow new patients to register with personal and insurance details.',
    version: 'BRD v1.2',
    type: 'Functional',
    deliverables: 'UI Form Design, Registration API, Data Validation Rules, DB Schema',
    source: 'BRD v1.2',
  },
  {
    id: 'HC-REQ-002',
    title: 'Appointment Scheduling',
    description: 'Enable patients to schedule, reschedule, or cancel appointments.',
    version: 'BRD v1.0',
    type: 'Functional',
    deliverables: 'UI Calendar Integration, Scheduling API, Notification System, DB Schema',
    source: 'BRD v1.0',
  },
  {
    id: 'HC-REQ-003',
    title: 'Patient Dashboard',
    description: 'Provide a dashboard for patients to view their medical history and upcoming appointments.',
    version: 'BRD v1.3',
    type: 'Functional',
    deliverables: 'UI Dashboard Design, Data Fetching API, Security Measures, DB Updates',
    source: 'BRD v1.3',
  },
  {
    id: 'HC-REQ-004',
    title: 'Telehealth Services',
    description: 'Enable virtual consultations between patients and healthcare providers.',
    version: 'BRD v1.4',
    type: 'Functional',
    deliverables: 'UI Video Call Integration, Telehealth API, User Authentication, DB Mana...',
    source: 'BRD v1.4',
  },
  {
    id: 'HC-REQ-005',
    title: 'Medication Tracking',
    description: 'Allow patients to track their medication schedules and reminders.',
    version: 'BRD v1.0',
    type: 'Functional',
    deliverables: 'UI Reminder System, Medication Database, Notification API, Data Priva...',
    source: 'BRD v1.0',
  },
   {
    id: 'HC-REQ-006',
    title: 'Health Records Access',
    description: 'Facilitate secure access to personal health records for patients and authorized users.',
    version: 'BRD v1.2',
    type: 'Functional',
    deliverables: 'UI Records Viewer, Access Control Implementation, API for Sharing Dat...',
    source: 'BRD v1.2',
  },
];


export default function RequirementListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
        router.push('/test-cases');
        setIsGenerating(false);
    }, 2000);
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied!",
        description: "Requirement source copied to clipboard.",
    });
  }

  return (
    <div className="pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Requirement List</h1>
            <p className="text-muted-foreground">
            Please review the findings below and update your document accordingly.
            </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9" />
        </div>
      </div>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="inprogress">Inprogress</TabsTrigger>
          <TabsTrigger value="tested">Tested</TabsTrigger>
        </TabsList>
        <TabsContent value="new" className="mt-4">
          <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm font-semibold text-muted-foreground px-4 mb-2 md:grid-cols-3">
              <div>Requirement Details</div>
              <div className="hidden md:block">WBS Deliverables</div>
              <div className="hidden md:block">Requirement Source</div>
          </div>
          <div className="space-y-4">
            {requirementsData.map((req) => (
              <Card key={req.id}>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                        <HeartPulse className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{req.id}: {req.title}</p>
                      <p className="text-xs text-muted-foreground">{req.description}</p>
                      <p className="text-xs font-semibold text-primary mt-1">{req.version}</p>
                    </div>
                    <Badge variant="outline" className="md:hidden ml-auto">{req.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="hidden md:inline-flex">{req.type}</Badge>
                    <p className="text-sm text-muted-foreground">{req.deliverables}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{req.source}</p>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(req.source)}>
                      <Copy className="h-4 w-4"/>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-0 left-0 right-0 lg:left-[--sidebar-width] p-4 bg-background/80 backdrop-blur-sm border-t border-border z-10">
            <div className="flex justify-end gap-4 max-w-6xl mx-auto">
                <Button variant="outline" disabled>
                    Update Document & Re-validate
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        'Generate Testcases'
                    )}
                </Button>
            </div>
        </div>
    </div>
  );
}
