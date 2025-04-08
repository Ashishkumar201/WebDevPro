import React, { useState, useEffect } from "react";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { Loader2, ChartLine } from "lucide-react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { loginMutation, registerMutation, user } = useAuth();
  const [, navigate] = useLocation();

  // Effect for redirection instead of conditional rendering
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 gap-0">
      {/* Form section */}
      <div className="flex items-center justify-center p-4 bg-white">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary flex items-center justify-center">
                <ChartLine className="mr-2" /> FinTrack
              </h1>
              <p className="text-slate-500 mt-2">
                {isLogin ? "Your personal finance dashboard" : "Create your account"}
              </p>
            </div>

            {isLogin ? (
              <LoginForm loginMutation={loginMutation} />
            ) : (
              <RegisterForm registerMutation={registerMutation} />
            )}

            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero section */}
      <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-6">Take Control of Your Financial Life</h2>
          <p className="text-lg mb-8">
            Track your income, expenses, assets, and debts in one place. 
            Get insights into your spending habits and make smarter financial decisions.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Financial Dashboard</h3>
              <p className="text-sm">Get a comprehensive overview of your financial health at a glance</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Track Expenses</h3>
              <p className="text-sm">Categorize and monitor your spending to identify saving opportunities</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Manage Debts</h3>
              <p className="text-sm">Keep track of your outstanding balances and monitor your progress</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Net Worth Calculator</h3>
              <p className="text-sm">Calculate your net worth by tracking your assets and liabilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ loginMutation }: { loginMutation: any }) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="your_username" 
                  {...field} 
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
            Forgot password?
          </a>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm({ registerMutation }: { registerMutation: any }) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="your_username" 
                  {...field} 
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  autoComplete="new-password"
                />
              </FormControl>
              <p className="text-xs text-slate-500 mt-1">
                Must be at least 8 characters long with a number and symbol.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <label
            htmlFor="terms"
            className="text-sm text-slate-700"
          >
            I agree to the{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Privacy Policy
            </a>
          </label>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
