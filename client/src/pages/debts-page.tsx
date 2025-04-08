import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { CurrencySelector } from "@/components/currency-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  CreditCard, 
  Home, 
  GraduationCap, 
  Car, 
  AlertCircle, 
  ArrowDownRight,
  MoreHorizontal,
  TrendingDown
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/hooks/use-currency";
import { Skeleton } from "@/components/ui/skeleton";

export default function DebtsPage() {
  const { formatAmount } = useCurrency();

  // Fetch debts data
  const { data: debts = [], isLoading } = useQuery({
    queryKey: ["/api/debts"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Function to get icon based on debt type
  const getDebtIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mortgage':
        return <Home className="h-5 w-5" />;
      case 'student loan':
        return <GraduationCap className="h-5 w-5" />;
      case 'auto loan':
        return <Car className="h-5 w-5" />;
      case 'credit card':
        return <CreditCard className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  // Calculate total debt
  const totalDebt = debts.reduce((total, debt) => total + debt.amount, 0);

  // Group debts by type
  const debtsByType = debts.reduce((acc: Record<string, number>, debt) => {
    const type = debt.type || 'Other';
    acc[type] = (acc[type] || 0) + debt.amount;
    return acc;
  }, {});

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Debts</h1>
              <p className="text-slate-500 text-sm">Track and manage your liabilities</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <CurrencySelector />
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-1" /> Add Debt
              </Button>
            </div>
          </div>
        </header>

        {/* Debt Overview */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Debt Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Total Debt</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">{formatAmount(totalDebt)}</div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Number of Debts</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">{debts.length}</div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Largest Debt Type</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-40 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">
                    {Object.keys(debtsByType).length > 0 
                      ? Object.entries(debtsByType).sort((a, b) => b[1] - a[1])[0][0]
                      : 'None'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debt Distribution */}
        {!isLoading && debts.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Debt Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(debtsByType).map(([type, amount]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                          {getDebtIcon(type)}
                        </div>
                        <span className="font-medium">{type}</span>
                      </div>
                      <div className="text-right font-medium">
                        {formatAmount(amount)}
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${(amount / totalDebt) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">
                      {Math.round((amount / totalDebt) * 100)}% of total debt
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debts List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Debts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : debts.length === 0 ? (
              <div className="text-center py-12">
                <ArrowDownRight className="h-12 w-12 mx-auto text-slate-300" />
                <h3 className="mt-4 text-lg font-medium">No Debts Yet</h3>
                <p className="text-slate-500 mt-1">Start tracking your debts by adding your first one</p>
                <Button className="mt-4 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-1" /> Add Your First Debt
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getDebtIcon(debt.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{debt.name}</h3>
                        <p className="text-sm text-slate-500">{debt.type} • {debt.interestRate || 0}% interest</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatAmount(debt.amount)}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Make Payment</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}