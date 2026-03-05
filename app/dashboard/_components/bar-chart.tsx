'use client';

import GaugeChart from 'react-gauge-chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export function GaugeChartComponent({
  used,
  total,
}: {
  used: number;
  total: number;
}) {
  const gaugeValue = total > 0 ? Math.min(used / total, 1) : 0; // Prevent division by zero and cap at 100%
  const usagePercentage = (gaugeValue * 100).toFixed(1);
  const remainingGB = Math.max(total - used, 0).toFixed(2);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <p>Bandwidth Usage</p>
            <p className="">{remainingGB} GB left</p>
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="flex justify-start items-end w-full">
          <GaugeChart
            className="gauge-chart"
            id="gauge-chart"
            nrOfLevels={50}
            percent={gaugeValue}
            colors={['#22c55e', '#eab308', '#ef4444']} // Green to yellow to red
            arcWidth={0.25}
            needleColor="#1f2937"
            animate
            hideText
            arcPadding={0.02}
            animateDuration={2000}
            marginInPercent={0.02}
            needleBaseColor="#374151"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          You have used {used.toFixed(2)} GB out of {total.toFixed(2)} GB{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing system usage as a percentage of maximum capacity.
        </div>
      </CardFooter>
    </Card>
  );
}
