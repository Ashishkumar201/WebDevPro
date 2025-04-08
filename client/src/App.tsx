import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { CurrencyProvider } from "./hooks/use-currency";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/transactions" component={() => <h1 className="p-8 text-2xl font-bold">Transactions Page</h1>} />
      <ProtectedRoute path="/budget" component={() => <h1 className="p-8 text-2xl font-bold">Budget Page</h1>} />
      <ProtectedRoute path="/assets" component={() => <h1 className="p-8 text-2xl font-bold">Assets Page</h1>} />
      <ProtectedRoute path="/debts" component={() => <h1 className="p-8 text-2xl font-bold">Debts Page</h1>} />
      <ProtectedRoute path="/reports" component={() => <h1 className="p-8 text-2xl font-bold">Reports Page</h1>} />
      <ProtectedRoute path="/settings" component={() => <h1 className="p-8 text-2xl font-bold">Settings Page</h1>} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <Router />
          <Toaster />
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
