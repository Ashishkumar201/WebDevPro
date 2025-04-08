import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  RefreshCcw, 
  Wallet, 
  Landmark, 
  CreditCard, 
  PieChart, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChartLine
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  
  const menuItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="w-5 mr-2" /> },
    { path: "/transactions", label: "Transactions", icon: <RefreshCcw className="w-5 mr-2" /> },
    { path: "/budget", label: "Budget", icon: <Wallet className="w-5 mr-2" /> },
    { path: "/assets", label: "Assets", icon: <Landmark className="w-5 mr-2" /> },
    { path: "/debts", label: "Debts", icon: <CreditCard className="w-5 mr-2" /> },
    { path: "/reports", label: "Reports", icon: <PieChart className="w-5 mr-2" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 mr-2" /> },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-primary text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center">
          <ChartLine className="mr-2" /> FinTrack
        </h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-white hover:bg-primary/80 hover:text-white focus:text-white focus:ring-offset-0"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Sidebar */}
      <aside className={`bg-slate-800 text-white w-full md:w-64 md:min-h-screen md:sticky md:top-0 flex-shrink-0 ${isOpen ? 'fixed inset-0 z-50' : 'hidden md:block'} transition-all duration-200 ease-in-out`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center">
              <ChartLine className="mr-2" /> FinTrack
            </h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeSidebar}
              className="md:hidden text-white hover:bg-slate-700 hover:text-white focus:text-white focus:ring-offset-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-slate-400">Welcome,</p>
            <p className="font-medium">
              {user?.firstName || user?.username}
            </p>
          </div>
        </div>
        
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center px-4 py-3 hover:bg-slate-700 ${
                    location === item.path
                      ? "text-white bg-primary hover:bg-primary/90"
                      : "text-slate-300"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto p-4 border-t border-slate-700 absolute bottom-0 w-full">
          <Button 
            variant="ghost" 
            className="flex items-center text-slate-300 hover:text-white hover:bg-slate-700 focus:text-white p-0 w-auto h-auto"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
