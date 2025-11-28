import { Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A donut chart with an active sector'

const chartConfig = {
  present: {
    label: 'Present',
    color: '#14d931',
  },
  leave: {
    label: 'Leave',
    color: '#fcb61e',
  },
  absent: {
    label: 'Absent',
    color: '#f71616',
  },
} satisfies ChartConfig

export interface ChartPieDataProps {
  absent: number
  permit: number
  present: number
}

export function ChartPieDonutActive(props: ChartPieDataProps) {
  const chartData = [
    { browser: 'Present', visitors: props.present || 0, fill: '#14d931' },
    { browser: 'Leave', visitors: props.permit || 0, fill: '#fcb61e' },
    { browser: 'Absent', visitors: props.absent || 0, fill: '#f71616' },
  ]

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  )
}
