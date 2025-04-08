import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useCurrency } from "@/hooks/use-currency";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Transaction, transactionSchema } from "@shared/schema";

type AddTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const { toast } = useToast();
  const { user } = useAuth();
  const { currency } = useCurrency();

  // Prepare form with zod validation
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'income',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  // Handle type change
  const handleTypeChange = (checked: boolean) => {
    const newType = checked ? 'expense' : 'income';
    setTransactionType(newType);
    form.setValue('type', newType);
    
    // Clear category if switching to income
    if (newType === 'income') {
      form.setValue('category', undefined);
    }
  };

  // Handle form submission
  const addTransactionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof transactionSchema>) => {
      if (!user) throw new Error("User not authenticated");

      // Prepare data for API
      const payload = {
        userId: user.id,
        description: data.description,
        amount: parseFloat(data.amount as string),
        date: data.date,
        notes: data.notes || null,
        ...(data.type === 'expense' ? { category: data.category } : {}),
      };

      // Call the appropriate API endpoint
      const endpoint = data.type === 'income' ? '/api/incomes' : '/api/expenses';
      const response = await apiRequest('POST', endpoint, payload);
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Success message and close modal
      toast({
        title: `${variables.type === 'income' ? 'Income' : 'Expense'} added`,
        description: `Successfully added ${variables.description}`,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/incomes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });

      // Reset form and close modal
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to add transaction",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof transactionSchema>) {
    addTransactionMutation.mutate(values);
  }

  // Categories for expenses
  const categories = [
    "Housing", "Transportation", "Food", "Utilities", "Insurance", 
    "Healthcare", "Personal", "Entertainment", "Education", 
    "Debt Payment", "Savings", "Other"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="transaction-type" className={transactionType === 'income' ? 'text-primary' : 'text-slate-500'}>Income</Label>
                  <Switch 
                    id="transaction-type" 
                    checked={transactionType === 'expense'}
                    onCheckedChange={handleTypeChange}
                    className={transactionType === 'expense' ? 'data-[state=checked]:bg-red-500' : ''}
                  />
                  <Label htmlFor="transaction-type" className={transactionType === 'expense' ? 'text-red-500' : 'text-slate-500'}>Expense</Label>
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Salary, Rent, Groceries" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500">{currency.symbol}</span>
                      </div>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        min="0" 
                        className="pl-7" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {transactionType === 'expense' && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.toLowerCase()} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional details..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit"
                disabled={addTransactionMutation.isPending}
                className={transactionType === 'expense' ? 'bg-red-500 hover:bg-red-600' : undefined}
              >
                {addTransactionMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Transaction"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
