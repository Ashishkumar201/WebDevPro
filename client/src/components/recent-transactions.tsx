import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp } from "lucide-react";

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
};

type RecentTransactionsProps = {
  transactions: Transaction[];
  isLoading: boolean;
};

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
  // Format currency
  const formatCurrency = (amount: number, isExpense = false) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(isExpense ? -amount : amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="py-5 px-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Skeleton className="h-5 w-16" />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-5 px-6 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          <Link href="/transactions" className="text-sm text-primary hover:text-primary/80">
            View All
          </Link>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No transactions yet. Add your first transaction using the button above.
          </div>
        ) : (
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`${transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} p-2 rounded-full mr-3`}>
                        {transaction.type === 'income' ? (
                          <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUp className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{transaction.description}</p>
                        <p className="text-xs text-slate-500">{transaction.notes?.substring(0, 20) || transaction.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 capitalize">{transaction.category}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{formatDate(transaction.date)}</td>
                  <td className={`py-3 px-4 text-right text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
