
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Link as LinkIcon, Flag } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { SwaggerIntegration } from '@/components/swagger-integration';
import { testCaseData } from '@/lib/test-case-data';
import type { Requirement, TestCase } from '@/lib/test-case-data';


const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
        case 'Pass':
            return <LinkIcon className="h-4 w-4 text-green-500" />;
        case 'Fail':
            return <Flag className="h-4 w-4 text-red-500" />;
        case 'Inprogress':
            return <LinkIcon className="h-4 w-4 text-yellow-500" />;
        case 'New':
             return <LinkIcon className="h-4 w-4 text-blue-500" />;
        default:
            return null;
    }
}

const getStatusBadge = (status: TestCase['status']) => {
  switch (status) {
    case 'Pass':
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Pass</Badge>;
    case 'Fail':
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Fail</Badge>;
    case 'Inprogress':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200">Inprogress</Badge>;
    default:
       return <Badge variant="secondary">New</Badge>;
  }
};


const RequirementTestCases = ({ requirement }: { requirement: Requirement }) => {
    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {requirement.testCases.map(tc => (
                    <Card key={tc.id}>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(tc.status)}
                                        <p className="text-xs text-muted-foreground font-semibold">{tc.id}</p>
                                        {tc.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                        ))}
                                    </div>
                                    <p className="font-semibold text-foreground mt-1">{tc.title}</p>
                                </div>
                                {getStatusBadge(tc.status)}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-xs border-t pt-3">
                                <div>
                                    <p className="text-muted-foreground font-semibold mb-1">Scenario</p>
                                    <p className="text-foreground">{tc.scenario}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground font-semibold mb-1">Expected Result</p>
                                    <p className="text-foreground">{tc.expectedResult}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function TestCaseDetailsPage() {
    const params = useParams();
    const requirement = testCaseData.find(req => req.id === params.id);

    if (!requirement) {
        return (
            <div className="space-y-6">
                <BackButton />
                <h1 className="text-2xl font-bold tracking-tight">Requirement not found</h1>
                <p className="text-muted-foreground">The requirement you are looking for does not exist.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
              <BackButton />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                      <h1 className="text-2xl font-bold tracking-tight">{requirement.id}: {requirement.title}</h1>
                      <p className="text-muted-foreground">
                          {requirement.description}
                      </p>
                  </div>
              </div>
            </div>

            <Tabs defaultValue="test-cases">
                <TabsList>
                    <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                    <TabsTrigger value="integration-testing">Integration Testing</TabsTrigger>
                </TabsList>
                <TabsContent value="test-cases" className="mt-4">
                    <Card>
                        <CardContent className="p-4">
                            <RequirementTestCases requirement={requirement} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="integration-testing" className="mt-4">
                    <SwaggerIntegration requirementId={requirement.id as string} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
