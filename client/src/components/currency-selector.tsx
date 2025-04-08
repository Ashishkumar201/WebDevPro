import { useCurrency } from "@/hooks/use-currency";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DollarSign, ChevronDown } from "lucide-react";

export function CurrencySelector() {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <DollarSign className="h-4 w-4 mr-1" />
          {currency.code}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr)}
            className={`gap-2 ${
              curr.code === currency.code ? "bg-slate-100 font-medium" : ""
            }`}
          >
            <span className="ml-1 font-medium">{curr.symbol}</span>
            <span>{curr.code}</span>
            <span className="text-slate-500 text-xs">{curr.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}