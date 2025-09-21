
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { integrationData, type ApiEndpoint } from '@/lib/integration-data';
import { testCaseData, type TestCase } from '@/lib/test-case-data';
import { Folder, Link as LinkIcon, Flag } from 'lucide-react';


const getMethodBadge = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return <Badge className="w-16 justify-center bg-blue-500/80 text-white hover:bg-blue-500">GET</Badge>;
    case 'POST':
      return <Badge className="w-16 justify-center bg-green-500/80 text-white hover:bg-green-500">POST</Badge>;
    case 'PUT':
        return <Badge className="w-16 justify-center bg-yellow-500/80 text-white hover:bg-yellow-500">PUT</Badge>;
    case 'DELETE':
        return <Badge className="w-16 justify-center bg-red-500/80 text-white hover:bg-red-500">DELETE</Badge>;
    default:
      return <Badge className="w-16 justify-center" variant="secondary">{method}</Badge>;
  }
};

const MappedApiCard = ({ endpoint }: { endpoint: ApiEndpoint }) => {
    return (
        <Card className="bg-muted/50">
            <CardContent className="p-3">
                 <div className="flex items-center gap-4 w-full">
                    {getMethodBadge(endpoint.method)}
                    <span className="font-mono text-sm font-semibold text-foreground">{endpoint.path}</span>
                    <span className="text-sm text-muted-foreground ml-4 truncate hidden md:block">{endpoint.summary}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export const SwaggerIntegration = ({ requirementId }: { requirementId: string }) => {
  const requirement = testCaseData.find(req => req.id === requirementId);
  const requirementApis = integrationData.filter(api => api.requirementId === requirementId);

  if (!requirement) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Requirement not found.
        </CardContent>
      </Card>
    );
  }

  // Group APIs by test case ID
  const testCasesWithApis = requirement.testCases.map(tc => {
    const mappedApis = requirementApis.filter(api => api.mappedTestCases.includes(tc.id));
    return { ...tc, mappedApis };
  });

  const allTestCaseIds = testCasesWithApis.map(tc => tc.id);

  return (
    <Card>
        <CardContent className="p-4">
            <Accordion type="multiple" defaultValue={allTestCaseIds} className="w-full space-y-2">
                {testCasesWithApis.map(testCase => (
                    <AccordionItem value={testCase.id} key={testCase.id} className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="p-3 hover:no-underline bg-muted/30 hover:bg-muted/60">
                            <div className="flex items-center gap-4 w-full">
                                <Folder className="h-5 w-5 text-primary" />
                                <span className="font-semibold text-sm text-foreground">{testCase.id}: {testCase.title}</span>
                                <Badge variant="secondary" className="ml-auto">{testCase.mappedApis.length} APIs</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-2">
                            <div className="space-y-2">
                               {testCase.mappedApis.length > 0 ? (
                                    testCase.mappedApis.map(api => <MappedApiCard key={api.id} endpoint={api} />)
                                ) : (
                                    <p className="text-muted-foreground text-sm text-center py-4">No APIs mapped to this test case.</p>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
    </Card>
  );
};
