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
  const gaugeValue = used / total; // Example value, 65% filled

  return (
    <Card className="w-full md:w-2/5">
      <CardHeader>
        <CardTitle>
          <div className="flex  justify-between">
            <p>Bandwidth </p>
            <p className="">{total - used} GB left</p>
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-start items-end mt-10">
          <GaugeChart
            className="gauge-chart"
            id="gauge-chart"
            nrOfLevels={35}
            percent={gaugeValue}
            colors={['#00E676', '#FFC371', '#FF5F6D']}
            arcWidth={0.2}
            needleColor="#00E676"
            animate
            hideText
            arcPadding={0.03}
            animateDuration={4000}
            marginInPercent={0.01}
            needleBaseColor="yellow"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          You have used {used} GB out of {total} GB{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing system usage as a percentage of maximum capacity.
        </div>
      </CardFooter>
    </Card>
  );
}
