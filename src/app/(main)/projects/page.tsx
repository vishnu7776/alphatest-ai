
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, PlusCircle, FolderKanban, BookText, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const projectsData = [
  {
    id: 'proj-001',
    name: 'Healthy Me',
    description: 'A comprehensive healthcare platform for patient management, appointment scheduling, and telehealth services.',
    status: 'In Progress',
    userStories: 48,
    testCases: 234,
  },
  {
    id: 'proj-002',
    name: 'Clinical Trial Portal',
    description: 'A portal for managing clinical trial data, participant recruitment, and regulatory compliance documentation.',
    status: 'Completed',
    userStories: 72,
    testCases: 540,
  },
  {
    id: 'proj-003',
    name: 'EHR System Modernization',
    description: 'Upgrade and migration of a legacy Electronic Health Record system to a modern, cloud-based infrastructure.',
    status: 'On Hold',
    userStories: 15,
    testCases: 88,
  },
  {
    id: 'proj-004',
    name: 'Pharmacy Inventory Mgmt',
    description: 'An application to track and manage pharmacy inventory, handle prescriptions, and automate reordering.',
    status: 'Planning',
    userStories: 5,
    testCases: 0,
  },
    {
    id: 'proj-005',
    name: 'Patient Engagement App',
    description: 'A mobile app to improve patient engagement through educational content, medication reminders, and secure messaging.',
    status: 'In Progress',
    userStories: 25,
    testCases: 112,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'In Progress':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">In Progress</Badge>;
    case 'Completed':
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Completed</Badge>;
    case 'On Hold':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">On Hold</Badge>;
    case 'Planning':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200">Planning</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};


export default function ProjectsPage() {
  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
                Manage your projects and track their testing progress.
            </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-9" />
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
            </Button>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
                <Card key={project.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <FolderKanban className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">{project.name}</CardTitle>
                            </div>
                            {getStatusBadge(project.status)}
                        </div>
                         <CardDescription className="pt-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end">
                       <div className="border-t pt-4">
                         <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <BookText className="h-4 w-4" />
                                <span>{project.userStories} User Stories</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <ClipboardCheck className="h-4 w-4" />
                                <span>{project.testCases} Test Cases</span>
                            </div>
                        </div>
                        <Button asChild variant="outline" className="w-full mt-4">
                            <Link href="/test-cases">
                                View Test Cases <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                       </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
