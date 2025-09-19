import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowUpRight,
  Cpu,
  BookText,
  Activity,
  ClipboardCheck,
  Folder,
  Link as LinkIcon,
} from 'lucide-react';
import { AppCharts } from '@/components/app-charts';

const testRuns = [
  {
    appName: 'Clinical Trial App',
    testCount: '2 tests',
    tests: [
      {
        testId: 'TR-001',
        userStoryId: 'US-401',
        status: 'Running',
        progress: 75,
        jiraLink: '#',
      },
      {
        testId: 'TR-006',
        userStoryId: 'US-402',
        status: 'Passed',
        progress: 100,
        jiraLink: '#',
      },
    ],
  },
  {
    appName: 'Patient Portal',
    testCount: '1 tests',
    tests: [
      {
        testId: 'TR-002',
        userStoryId: 'US-403',
        status: 'Failed',
        progress: 100,
        jiraLink: '#',
      },
    ],
  },
  {
    appName: 'EHR System',
    testCount: '1 tests',
    tests: [
      {
        testId: 'TR-003',
        userStoryId: 'US-404',
        status: 'Pending',
        progress: 0,
        jiraLink: '#',
      },
    ],
  },
  {
    appName: 'Telemedicine Platform',
    testCount: '1 tests',
    tests: [
      {
        testId: 'TR-004',
        userStoryId: 'US-405',
        status: 'Passed',
        progress: 100,
        jiraLink: '#',
      },
    ],
  },
  {
    appName: 'Pharmacy Management',
    testCount: '2 tests',
    tests: [
       {
        testId: 'TR-005',
        userStoryId: 'US-406',
        status: 'Running',
        progress: 50,
        jiraLink: '#',
      },
       {
        testId: 'TR-007',
        userStoryId: 'US-407',
        status: 'Passed',
        progress: 100,
        jiraLink: '#',
      },
    ],
  },
];

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'passed':
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          Passed
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive">
          Failed
        </Badge>
      );
    case 'running':
       return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Running
        </Badge>
      );
    case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your testing activities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/requirements">
              New Testcase Journey
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apps Used</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Stories</CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+32 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54</div>
            <p className="text-xs text-muted-foreground">+10 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Test Cases Passed
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-muted-foreground">
              -1.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>App-wise Test Case Status</CardTitle>
            <CardDescription>
              Breakdown of test case results for each application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppCharts chartType="bar" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Defect Trends</CardTitle>
            <CardDescription>
              Number of defects reported over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppCharts chartType="line" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Test Runs</CardTitle>
          <CardDescription>
            An overview of your recent test case executions by application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="item-0">
             {testRuns.map((run, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{run.appName}</span>
                    <Badge variant="secondary">{run.testCount}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test ID</TableHead>
                        <TableHead>User Story ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Jira Link</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {run.tests.map((test) => (
                        <TableRow key={test.testId}>
                          <TableCell>{test.testId}</TableCell>
                          <TableCell>{test.userStoryId}</TableCell>
                          <TableCell>{getStatusBadge(test.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={test.progress} className="h-2 w-24" />
                              <span>{test.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <a href={test.jiraLink} className="flex items-center gap-1 text-primary hover:underline">
                              <LinkIcon className="h-4 w-4" />
                              Open Ticket
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
