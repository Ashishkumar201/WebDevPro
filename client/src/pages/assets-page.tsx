import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { CurrencySelector } from "@/components/currency-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building, Car, Briefcase, DollarSign, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/hooks/use-currency";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssetsPage() {
  const { formatAmount } = useCurrency();

  // Fetch assets data
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["/api/assets"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Function to get icon based on asset type
  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'real estate':
        return <Building className="h-5 w-5" />;
      case 'vehicle':
        return <Car className="h-5 w-5" />;
      case 'investment':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  // Calculate total assets value
  const totalAssetValue = assets.reduce((total, asset) => total + asset.value, 0);

  // Group assets by type
  const assetsByType = assets.reduce((acc: Record<string, number>, asset) => {
    const type = asset.type || 'Other';
    acc[type] = (acc[type] || 0) + asset.value;
    return acc;
  }, {});

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Assets</h1>
              <p className="text-slate-500 text-sm">Track your valuable possessions</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <CurrencySelector />
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-1" /> Add Asset
              </Button>
            </div>
          </div>
        </header>

        {/* Assets Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Assets Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Total Assets Value</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">{formatAmount(totalAssetValue)}</div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Number of Assets</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">{assets.length}</div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Most Valuable Category</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-40 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">
                    {Object.keys(assetsByType).length > 0 
                      ? Object.entries(assetsByType).sort((a, b) => b[1] - a[1])[0][0]
                      : 'None'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Assets</CardTitle>
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
            ) : assets.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-slate-300" />
                <h3 className="mt-4 text-lg font-medium">No Assets Yet</h3>
                <p className="text-slate-500 mt-1">Start tracking your assets by adding your first one</p>
                <Button className="mt-4 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-1" /> Add Your First Asset
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{asset.name}</h3>
                        <p className="text-sm text-slate-500">{asset.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatAmount(asset.value)}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
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