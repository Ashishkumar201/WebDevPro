import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { RecentTransactions } from "@/components/recent-transactions";
import { AddTransactionModal } from "@/components/add-transaction-modal";
import { CurrencySelector } from "@/components/currency-selector";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TransactionsPage() {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("this-month");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch transactions data
  const { data: incomeData, isLoading: incomeLoading } = useQuery({
    queryKey: ["/api/incomes"],
    staleTime: 60 * 1000, // 1 minute
  });

  const { data: expenseData, isLoading: expenseLoading } = useQuery({
    queryKey: ["/api/expenses"],
    staleTime: 60 * 1000, // 1 minute
  });

  const isLoading = incomeLoading || expenseLoading;

  // Combine and format transactions
  const incomes = (incomeData || []).map(income => ({
    id: income.id.toString(),
    type: 'income',
    description: income.source,
    amount: income.amount,
    date: income.date,
    category: income.category,
    notes: income.notes || ''
  }));

  const expenses = (expenseData || []).map(expense => ({
    id: expense.id.toString(),
    type: 'expense',
    description: expense.description,
    amount: expense.amount,
    date: expense.date,
    category: expense.category,
    notes: expense.notes || ''
  }));

  // Combine all transactions and sort by date (newest first)
  const allTransactions = [...incomes, ...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter based on active tab
  const filteredTransactions = 
    activeTab === 'income' ? incomes :
    activeTab === 'expense' ? expenses :
    allTransactions;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
              <p className="text-slate-500 text-sm">Manage your income and expenses</p>
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

        {/* Transaction Filters */}
        <div className="mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expenses</TabsTrigger>
              </TabsList>
              
              <div className="relative">
                <Input 
                  placeholder="Search transactions..." 
                  className="pl-8 w-full md:w-64"
                />
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </Tabs>
        </div>

        {/* Transactions List */}
        <RecentTransactions 
          transactions={filteredTransactions} 
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