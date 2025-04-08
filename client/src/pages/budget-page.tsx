import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { CurrencySelector } from "@/components/currency-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Plus, BarChart2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/hooks/use-currency";

type BudgetCategory = {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentSpent: number;
};

export default function BudgetPage() {
  const [timeframe, setTimeframe] = useState("this-month");
  const { formatAmount } = useCurrency();

  // In a real app, this would come from the API
  const budgetCategories: BudgetCategory[] = [
    { category: "Housing", budgeted: 1500, spent: 1500, remaining: 0, percentSpent: 100 },
    { category: "Food", budgeted: 500, spent: 325, remaining: 175, percentSpent: 65 },
    { category: "Transportation", budgeted: 400, spent: 320, remaining: 80, percentSpent: 80 },
    { category: "Entertainment", budgeted: 200, spent: 150, remaining: 50, percentSpent: 75 },
    { category: "Shopping", budgeted: 300, spent: 280, remaining: 20, percentSpent: 93 },
    { category: "Utilities", budgeted: 250, spent: 230, remaining: 20, percentSpent: 92 },
    { category: "Healthcare", budgeted: 150, spent: 0, remaining: 150, percentSpent: 0 },
    { category: "Personal Care", budgeted: 100, spent: 80, remaining: 20, percentSpent: 80 },
  ];

  // Calculate total budget and spending
  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const totalPercentSpent = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  // Function to determine color based on spending percentage
  const getColorForPercentage = (percent: number) => {
    if (percent < 70) return "bg-green-500";
    if (percent < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Budget</h1>
              <p className="text-slate-500 text-sm">Manage your spending plan</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <CurrencySelector />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="next-month">Next Month</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-1" /> Create Budget
              </Button>
            </div>
          </div>
        </header>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Budgeted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(totalBudgeted)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(totalSpent)}</div>
              <Progress value={totalPercentSpent} className="h-2 mt-2" />
              <p className="text-xs text-slate-500 mt-1">{totalPercentSpent}% of budget used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(totalRemaining)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2" />
              Budget Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgetCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{category.category}</h3>
                      <div className="text-sm text-slate-500">
                        {formatAmount(category.spent)} of {formatAmount(category.budgeted)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatAmount(category.remaining)}</div>
                      <div className="text-sm text-slate-500">remaining</div>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getColorForPercentage(category.percentSpent)}`}
                      style={{ width: `${category.percentSpent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}