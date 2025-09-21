
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
import { Button } from '@/components/ui/button';


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

const JiraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM12.3379 12.0003L16.4852 7.85291C16.8049 7.53326 16.8049 7.0229 16.4852 6.70325C16.1656 6.3836 15.6552 6.3836 15.3356 6.70325L10.5093 11.5296L8.66469 9.685C8.34504 9.36535 7.83468 9.36535 7.51503 9.685C7.19538 10.0047 7.19538 10.515 7.51503 10.8347L11.1883 14.508L7.51503 18.1813C7.19538 18.5009 7.19538 19.0113 7.51503 19.3309C7.83468 19.6506 8.34504 19.6506 8.66469 19.3309L12.3379 15.6577L15.3356 18.6553C15.6552 18.975 16.1656 18.975 16.4852 18.6553C16.8049 18.3357 16.8049 17.8253 16.4852 17.5057L12.3379 12.0003Z" fill="#2684FF"/>
    </svg>
);

const AzureDevOpsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M18.4483 0.00012207L12.0689 3.25012L7.35166 0.00012207L0 10.0001V22.0001L7.36896 15.5001L12.0862 19.0001L18.431 22.0001L24 12.0001V3.25012L18.4483 0.00012207ZM7.36896 3.86212L10.362 5.60362L7.36896 8.50012V3.86212Z" fill="#0078D4"/>
    </svg>
);


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
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="h-8">
                                        <JiraIcon className="mr-2"/>
                                        Jira
                                    </Button>
                                     <Button variant="outline" size="sm" className="h-8">
                                        <AzureDevOpsIcon className="mr-2"/>
                                        Azure
                                    </Button>
                                    {getStatusBadge(tc.status)}
                                </div>
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
