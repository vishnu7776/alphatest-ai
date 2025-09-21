
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

const MappedTestCaseCard = ({ testCaseId }: { testCaseId: string }) => {
    const allTestCases = testCaseData.flatMap(req => req.testCases);
    const testCase = allTestCases.find(tc => tc.id === testCaseId);

    if (!testCase) {
        return (
            <Card>
                <CardContent className="p-3 text-sm text-muted-foreground">
                    Test Case {testCaseId} not found.
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="bg-muted/50">
            <CardContent className="p-3 text-sm">
                <p className="font-semibold text-foreground">{testCase.id}: {testCase.title}</p>
                <p className="text-muted-foreground mt-1">{testCase.scenario}</p>
            </CardContent>
        </Card>
    );
};


const ApiEndpointDetails = ({ endpoint }: { endpoint: ApiEndpoint }) => {
    return (
        <div className="space-y-4 py-4 px-2">
            <div>
                <h4 className="font-semibold text-foreground mb-2">Parameters</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Name</th>
                                <th className="p-2">In</th>
                                <th className="p-2">Description</th>
                                <th className="p-2">Required</th>
                            </tr>
                        </thead>
                        <tbody>
                        {endpoint.parameters.map((param, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2 font-mono text-primary">{param.name}</td>
                                <td className="p-2 text-muted-foreground">{param.in}</td>
                                <td className="p-2">{param.description}</td>
                                <td className="p-2">{param.required ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-foreground mb-2">Mapped Test Cases</h4>
                <div className="space-y-2">
                    {endpoint.mappedTestCases.length > 0 ? (
                        endpoint.mappedTestCases.map(tcId => <MappedTestCaseCard key={tcId} testCaseId={tcId} />)
                    ) : (
                        <p className="text-muted-foreground text-sm">No test cases mapped to this endpoint.</p>
                    )}
                </div>
            </div>
        </div>
    )
};


export const SwaggerIntegration = ({ requirementId }: { requirementId: string }) => {
  const requirementApis = integrationData.filter(api => api.requirementId === requirementId);

  if (requirementApis.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No integration endpoints found for this requirement.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
        <CardContent className="p-4">
            <Accordion type="single" collapsible className="w-full space-y-2">
                {requirementApis.map(endpoint => (
                    <AccordionItem value={endpoint.id} key={endpoint.id} className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="p-3 hover:no-underline bg-muted/30 hover:bg-muted/60">
                            <div className="flex items-center gap-4 w-full">
                                {getMethodBadge(endpoint.method)}
                                <span className="font-mono text-sm font-semibold text-foreground">{endpoint.path}</span>
                                <span className="text-sm text-muted-foreground ml-4 truncate hidden md:block">{endpoint.summary}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <ApiEndpointDetails endpoint={endpoint} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
    </Card>
  );
};

