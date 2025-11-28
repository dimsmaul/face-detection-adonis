import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A bar chart'

// const chartData = [
//   { month: 'January', desktop: 186 },
//   { month: 'February', desktop: 305 },
//   { month: 'March', desktop: 237 },
//   { month: 'April', desktop: 73 },
//   { month: 'May', desktop: 209 },
//   { month: 'June', desktop: 214 },
// ]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const chartConfig = {
  desktop: {
    label: 'Present',
    color: '#1447E6',
  },
} satisfies ChartConfig

export interface DataChart {
  month: number
  count: number
}

export interface ChartBarProps {
  data: DataChart[]
}

export function ChartBarDefault(props: ChartBarProps) {
  const chartData = props.data.map((item) => ({
    month: months[item.month - 1],
    desktop: item.count,
  }))

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
