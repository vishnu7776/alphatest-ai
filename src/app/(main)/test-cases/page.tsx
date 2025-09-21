
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Search, HeartPulse, FileText, ArrowUpRight } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { testCaseData, type TestCase, type Requirement } from '@/lib/test-case-data';


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
  

export default function TestCasesPage() {
    return (
        <div className="space-y-6">
            <div>
              <BackButton />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                      <h1 className="text-2xl font-bold tracking-tight">Generated Test Cases</h1>
                      <p className="text-muted-foreground">
                          Review the generated test cases for each requirement.
                      </p>
                  </div>
                  <div className="flex items-center gap-4">
                      <Tabs defaultValue="testcases">
                          <TabsList>
                              <TabsTrigger value="testcases">Testcases</TabsTrigger>
                              <TabsTrigger value="swagger">Swagger</TabsTrigger>
                          </TabsList>
                      </Tabs>
                      <div className="relative w-full max-w-xs">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search" className="pl-9" />
                      </div>
                  </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
                 {testCaseData.map((req, index) => (
                    <AccordionItem value={`item-${index}`} key={req.id} className="border-b-0">
                         <Card>
                             <AccordionTrigger className="p-4 w-full hover:no-underline">
                                <div className="grid grid-cols-12 items-center gap-4 w-full text-left">
                                    <div className="col-span-12 md:col-span-3 flex items-start gap-4">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <HeartPulse className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{req.id}: {req.title}</p>
                                            <p className="text-xs text-muted-foreground">{req.description}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-2">
                                        <Badge variant="outline">{req.type}</Badge>
                                    </div>
                                    <div className="col-span-12 md:col-span-3 flex items-center gap-2">
                                        <p className="text-sm text-muted-foreground truncate">{req.deliverables}</p>
                                    </div>
                                    <div className="col-span-12 md:col-span-2 flex items-center gap-2">
                                        <p className="text-sm text-muted-foreground">{req.source}</p>
                                        <FileText className="h-4 w-4 text-muted-foreground"/>
                                    </div>
                                    <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-4">
                                        <div className='text-right'>
                                            <p className="text-lg font-semibold text-foreground">{req.testCasesCount}</p>
                                            <p className="text-xs text-muted-foreground">Test Cases</p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {req.testCases.slice(0, 2).map(tc => (
                                            <Card key={tc.id}>
                                                <CardContent className="p-4 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground font-semibold">{tc.id}</p>
                                                            <p className="font-semibold text-foreground mt-1">{tc.title}</p>
                                                        </div>
                                                        {getStatusBadge(tc.status)}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/test-cases/${req.id}`}>
                                                View All
                                                <ArrowUpRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                 ))}
            </Accordion>
        </div>
    );
}
