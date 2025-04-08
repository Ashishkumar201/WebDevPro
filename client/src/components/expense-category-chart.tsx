import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrency } from "@/hooks/use-currency";

type CategoryData = {
  category: string;
  total: number;
};

type ExpenseCategoryChartProps = {
  data: CategoryData[];
  isLoading: boolean;
};

// Color palette for the different categories
const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#ef4444", // red
  "#6366f1", // indigo
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#a855f7", // violet
  "#84cc16", // lime
  "#06b6d4", // cyan
];

export function ExpenseCategoryChart({ data, isLoading }: ExpenseCategoryChartProps) {
  const [timeframe, setTimeframe] = useState("this-month");
  const { formatAmount, currency } = useCurrency();
  
  // Format data for the chart
  const chartData = data.map((item) => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    value: Number(item.total)
  }));
  
  // Calculate total expenses
  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentages
  const chartDataWithPercentage = chartData.map(item => ({
    ...item,
    percentage: totalExpenses > 0 ? (item.value / totalExpenses * 100).toFixed(1) : 0
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold">Expenses by Category</CardTitle>
            <div className="skeleton h-8 w-32"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-slate-200 animate-pulse"></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-slate-200 mr-2"></div>
                <div className="h-4 w-20 bg-slate-200 animate-pulse rounded"></div>
                <div className="ml-auto h-4 w-8 bg-slate-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Expenses by Category</CardTitle>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartDataWithPercentage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={false}
              >
                {chartDataWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatAmount(value), 'Amount']}
                labelFormatter={(name) => `${name}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartDataWithPercentage.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span className="text-sm text-slate-600 capitalize">{entry.name}</span>
              <span className="ml-auto text-sm font-medium">{entry.percentage}%</span>
            </div>
          ))}
          
          {/* Show "No data" if there are no expenses */}
          {chartDataWithPercentage.length === 0 && (
            <div className="col-span-2 text-center py-4 text-slate-500">
              No expense data for this period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
