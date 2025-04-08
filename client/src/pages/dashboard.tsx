import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { SummaryCards } from "@/components/summary-cards";
import { ExpenseCategoryChart } from "@/components/expense-category-chart";
import { IncomeExpenseChart } from "@/components/income-expense-chart";
import { RecentTransactions } from "@/components/recent-transactions";
import { AddTransactionModal } from "@/components/add-transaction-modal";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("this-month");

  // Fetch dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Default values for when data is loading
  const {
    netWorth = 0,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    savingsRate = 0,
    expensesByCategory = [],
    recentTransactions = []
  } = data || {};

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-500 text-sm">Overview of your finances</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="year-to-date">Year to Date</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => setIsAddTransactionModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Transaction
              </Button>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <SummaryCards 
          netWorth={netWorth}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          savingsRate={savingsRate}
          isLoading={isLoading}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ExpenseCategoryChart 
            data={expensesByCategory || []} 
            isLoading={isLoading} 
          />
          <IncomeExpenseChart />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions 
          transactions={recentTransactions || []} 
          isLoading={isLoading} 
        />

        {/* Add Transaction Modal */}
        <AddTransactionModal 
          isOpen={isAddTransactionModalOpen} 
          onClose={() => setIsAddTransactionModalOpen(false)} 
        />
      </main>
    </div>
  );
}
