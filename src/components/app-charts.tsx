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
  { month: 'January', defects: 186 },
  { month: 'February', defects: 205 },
  { month: 'March', defects: 237 },
  { month: 'April', defects: 173 },
  { month: 'May', defects: 209 },
  { month: 'June', defects: 214 },
];

const lineChartConfig = {
  defects: {
    label: 'Defects',
    color: 'hsl(var(--chart-1))',
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
          <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" hideLabel />} />
          <Line
            dataKey="defects"
            type="natural"
            stroke="var(--color-defects)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    );
  }

  return null;
}
