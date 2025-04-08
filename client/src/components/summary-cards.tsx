import { ArrowUpRight, ArrowDownRight, DollarSign, ArrowDown, ArrowUp, PiggyBank } from "lucide-react";
import { Card } from "@/components/ui/card";

type SummaryCardsProps = {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  isLoading: boolean;
};

export function SummaryCards({ netWorth, monthlyIncome, monthlyExpenses, savingsRate, isLoading }: SummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Sample cards with loading state
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Net Worth Card */}
      <Card className="bg-white p-5 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Net Worth</h3>
            {isLoading ? (
              <div className="h-8 w-32 bg-slate-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(netWorth)}</p>
            )}
          </div>
          <span className="p-2 bg-blue-100 text-blue-800 rounded-full">
            <DollarSign className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-auto flex items-center text-sm">
          <span className="text-green-600 flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4" /> 8.2%
          </span>
          <span className="text-slate-500 ml-2">vs last month</span>
        </div>
      </Card>

      {/* Income Card */}
      <Card className="bg-white p-5 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Monthly Income</h3>
            {isLoading ? (
              <div className="h-8 w-32 bg-slate-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(monthlyIncome)}</p>
            )}
          </div>
          <span className="p-2 bg-green-100 text-green-800 rounded-full">
            <ArrowDown className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-auto flex items-center text-sm">
          <span className="text-green-600 flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4" /> 4.3%
          </span>
          <span className="text-slate-500 ml-2">vs last month</span>
        </div>
      </Card>

      {/* Expenses Card */}
      <Card className="bg-white p-5 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Monthly Expenses</h3>
            {isLoading ? (
              <div className="h-8 w-32 bg-slate-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(monthlyExpenses)}</p>
            )}
          </div>
          <span className="p-2 bg-red-100 text-red-800 rounded-full">
            <ArrowUp className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-auto flex items-center text-sm">
          <span className="text-red-600 flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4" /> 2.8%
          </span>
          <span className="text-slate-500 ml-2">vs last month</span>
        </div>
      </Card>

      {/* Savings Rate Card */}
      <Card className="bg-white p-5 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Savings Rate</h3>
            {isLoading ? (
              <div className="h-8 w-32 bg-slate-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-slate-800">{savingsRate.toFixed(1)}%</p>
            )}
          </div>
          <span className="p-2 bg-purple-100 text-purple-800 rounded-full">
            <PiggyBank className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-auto flex items-center text-sm">
          <span className="text-green-600 flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4" /> 1.5%
          </span>
          <span className="text-slate-500 ml-2">vs last month</span>
        </div>
      </Card>
    </div>
  );
}
