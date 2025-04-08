import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type ChartData = {
  name: string;
  income: number;
  expenses: number;
  savings: number;
};

// Sample data for the chart
const generateData = (): ChartData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => {
    const income = 4500 + Math.random() * 1000;
    const expenses = 3000 + Math.random() * 800;
    return {
      name: month,
      income: Number(income.toFixed(2)),
      expenses: Number(expenses.toFixed(2)),
      savings: Number((income - expenses).toFixed(2))
    };
  });
};

export function IncomeExpenseChart() {
  const [timeframe, setTimeframe] = useState("last-6-months");
  const [data] = useState<ChartData[]>(generateData());

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Income vs Expenses</CardTitle>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-12-months">Last 12 Months</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
                width={40}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
                contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0' }}
              />
              <Bar 
                dataKey="income" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
                name="Income"
              />
              <Bar 
                dataKey="expenses" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
                name="Expenses"
              />
              <Bar 
                dataKey="savings" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
                name="Savings"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
            <span className="text-sm text-slate-600">Income</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-sm text-slate-600">Expenses</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-slate-600">Savings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
