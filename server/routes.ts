import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertIncomeSchema, 
  insertExpenseSchema, 
  insertAssetSchema, 
  insertDebtSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes
  // Income routes
  app.get("/api/incomes", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const incomes = await storage.getIncomes(req.user.id);
      res.json(incomes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching incomes" });
    }
  });

  app.post("/api/incomes", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertIncomeSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const income = await storage.createIncome(validatedData);
      res.status(201).json(income);
    } catch (error) {
      res.status(400).json({ message: "Invalid income data" });
    }
  });

  // Expense routes
  app.get("/api/expenses", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const expenses = await storage.getExpenses(req.user.id);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching expenses" });
    }
  });

  app.post("/api/expenses", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertExpenseSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ message: "Invalid expense data" });
    }
  });

  // Asset routes
  app.get("/api/assets", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assets = await storage.getAssets(req.user.id);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching assets" });
    }
  });

  app.post("/api/assets", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertAssetSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const asset = await storage.createAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      res.status(400).json({ message: "Invalid asset data" });
    }
  });

  // Debt routes
  app.get("/api/debts", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const debts = await storage.getDebts(req.user.id);
      res.json(debts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching debts" });
    }
  });

  app.post("/api/debts", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertDebtSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const debt = await storage.createDebt(validatedData);
      res.status(201).json(debt);
    } catch (error) {
      res.status(400).json({ message: "Invalid debt data" });
    }
  });

  // Dashboard data
  app.get("/api/dashboard", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const date = new Date();
      const currentYear = date.getFullYear();
      const currentMonth = date.getMonth();
      
      // Get monthly data
      const monthlyIncomes = await storage.getIncomesByMonth(req.user.id, currentYear, currentMonth);
      const monthlyExpenses = await storage.getExpensesByMonth(req.user.id, currentYear, currentMonth);
      const expensesByCategory = await storage.getExpensesByCategory(req.user.id, currentYear, currentMonth);
      
      // Get assets and debts
      const assets = await storage.getAssets(req.user.id);
      const debts = await storage.getDebts(req.user.id);
      
      // Calculate totals
      const totalIncome = monthlyIncomes.reduce((sum, income) => sum + Number(income.amount), 0);
      const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const totalAssets = assets.reduce((sum, asset) => sum + Number(asset.value), 0);
      const totalDebts = debts.reduce((sum, debt) => sum + Number(debt.balance), 0);
      const netWorth = totalAssets - totalDebts;
      
      // Get recent transactions (both incomes and expenses)
      const allIncomes = await storage.getIncomes(req.user.id);
      const allExpenses = await storage.getExpenses(req.user.id);
      
      const recentTransactions = [
        ...allIncomes.map(income => ({
          id: `income-${income.id}`,
          type: 'income',
          description: income.description,
          amount: income.amount,
          date: income.date,
          category: 'Income',
          notes: income.notes
        })),
        ...allExpenses.map(expense => ({
          id: `expense-${expense.id}`,
          type: 'expense',
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
          notes: expense.notes
        }))
      ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10); // Get the 10 most recent transactions
      
      // Calculate savings rate if we have income
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      
      res.json({
        netWorth,
        monthlyIncome: totalIncome,
        monthlyExpenses: totalExpenses,
        savingsRate,
        expensesByCategory,
        recentTransactions
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
