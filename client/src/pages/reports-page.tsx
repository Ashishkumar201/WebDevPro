import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { CurrencySelector } from "@/components/currency-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeExpenseChart } from "@/components/income-expense-chart";
import { ExpenseCategoryChart } from "@/components/expense-category-chart";
import { Calendar, ChevronDown, Download, Filter, PieChart, BarChart2, LineChart, Share2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("last-6-months");
  const [reportType, setReportType] = useState("overview");

  // This would come from API in a real implementation
  const expensesByCategory = [
    { category: "Housing", total: 1500 },
    { category: "Food", total: 500 },
    { category: "Transportation", total: 300 },
    { category: "Entertainment", total: 200 },
    { category: "Shopping", total: 150 },
    { category: "Utilities", total: 125 },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
              <p className="text-slate-500 text-sm">Analyze your financial data</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <CurrencySelector />
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="year-to-date">Year to Date</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>PDF Report</DropdownMenuItem>
                  <DropdownMenuItem>Excel Spreadsheet</DropdownMenuItem>
                  <DropdownMenuItem>CSV File</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Report Types */}
        <Tabs 
          value={reportType} 
          onValueChange={setReportType}
          className="mb-6"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <BarChart2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="income-expense">
              <LineChart className="h-4 w-4 mr-2" />
              Income & Expenses
            </TabsTrigger>
            <TabsTrigger value="spending">
              <PieChart className="h-4 w-4 mr-2" />
              Spending Analysis
            </TabsTrigger>
            <TabsTrigger value="net-worth">
              <Share2 className="h-4 w-4 mr-2" />
              Net Worth
            </TabsTrigger>
          </TabsList>

          {/* Overview Report */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income vs. Expenses</CardTitle>
                  <CardDescription>Monthly comparison of your cash flow</CardDescription>
                </CardHeader>
                <CardContent>
                  <IncomeExpenseChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Where your money goes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpenseCategoryChart data={expensesByCategory} isLoading={false} />
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Net Worth Trend</CardTitle>
                  <CardDescription>Your financial growth over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <p className="text-slate-500">Net worth chart will appear here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Income & Expenses Report */}
          <TabsContent value="income-expense">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income & Expenses Comparison</CardTitle>
                  <CardDescription>Detailed monthly breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <p className="text-slate-500">Income & Expenses comparison chart will appear here</p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Income Sources</CardTitle>
                    <CardDescription>Breakdown by source</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-slate-500">Income sources chart will appear here</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Trends</CardTitle>
                    <CardDescription>Monthly spending pattern</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-slate-500">Expense trends chart will appear here</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Spending Analysis Report */}
          <TabsContent value="spending">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Categories</CardTitle>
                  <CardDescription>Detailed breakdown of where your money goes</CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <p className="text-slate-500">Spending categories chart will appear here</p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Expenses</CardTitle>
                    <CardDescription>Your biggest spending areas</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-slate-500">Top expenses chart will appear here</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Comparison</CardTitle>
                    <CardDescription>See how your spending changes</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-slate-500">Monthly comparison chart will appear here</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Net Worth Report */}
          <TabsContent value="net-worth">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Net Worth Trend</CardTitle>
                  <CardDescription>Track your financial growth over time</CardDescription>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center">
                  <p className="text-slate-500">Net worth trend chart will appear here</p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assets Distribution</CardTitle>
                    <CardDescription>What you own</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-slate-500">Assets distribution chart will appear here</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Liabilities Breakdown</CardTitle>
                    <CardDescription>What you owe</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-slate-500">Liabilities breakdown chart will appear here</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}