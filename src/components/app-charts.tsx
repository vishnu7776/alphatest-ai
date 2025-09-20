
'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const barChartData = [
  { app: 'App A', passed: 86, failed: 12, skipped: 2 },
  { app: 'App B', passed: 120, failed: 25, skipped: 8 },
  { app: 'App C', passed: 45, failed: 5, skipped: 0 },
  { app: 'App D', passed: 210, failed: 45, skipped: 15 },
  { app: 'App E', passed: 98, failed: 18, skipped: 4 },
  { app: 'App F', passed: 73, failed: 7, skipped: 1 },
];

const barChartConfig = {
  passed: {
    label: 'Passed',
    color: '#8AEA70',
  },
  failed: {
    label: 'Failed',
    color: '#B42C48',
  },
  skipped: {
    label: 'Skipped',
    color: '#F97315',
  },
} satisfies ChartConfig;

const lineChartData = [
  { month: 'January', open: 186, closed: 80 },
  { month: 'February', open: 205, closed: 120 },
  { month: 'March', open: 237, closed: 150 },
  { month: 'April', open: 173, closed: 190 },
  { month: 'May', open: 209, closed: 130 },
  { month: 'June', open: 214, closed: 140 },
];

const lineChartConfig = {
  open: {
    label: 'Open',
    color: 'hsl(var(--chart-1))',
  },
  closed: {
    label: 'Closed',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function AppCharts({ chartType }: { chartType: 'bar' | 'line' }) {
  if (chartType === 'bar') {
    return (
      <ChartContainer config={barChartConfig} className="h-[250px] w-full">
        <BarChart accessibilityLayer data={barChartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="app"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 6)}
          />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="passed" stackId="a" fill="var(--color-passed)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="failed" stackId="a" fill="var(--color-failed)" />
          <Bar dataKey="skipped" stackId="a" fill="var(--color-skipped)" />
        </BarChart>
      </ChartContainer>
    );
  }

  if (chartType === 'line') {
    return (
      <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
        <LineChart
          accessibilityLayer
          data={lineChartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
           <YAxis />
          <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Line
            dataKey="open"
            type="natural"
            stroke="var(--color-open)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-open)",
            }}
            activeDot={{
              r: 6,
            }}
          />
           <Line
            dataKey="closed"
            type="natural"
            stroke="var(--color-closed)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-closed)",
            }}
             activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ChartContainer>
    );
  }

  return null;
}

