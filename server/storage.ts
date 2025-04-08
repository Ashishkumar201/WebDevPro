import { users, incomes, expenses, assets, debts } from "@shared/schema";
import type { User, InsertUser, Income, InsertIncome, Expense, InsertExpense, Asset, InsertAsset, Debt, InsertDebt } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define the storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Income methods
  getIncomes(userId: number): Promise<Income[]>;
  getIncomesByMonth(userId: number, year: number, month: number): Promise<Income[]>;
  createIncome(income: InsertIncome): Promise<Income>;
  
  // Expense methods
  getExpenses(userId: number): Promise<Expense[]>;
  getExpensesByMonth(userId: number, year: number, month: number): Promise<Expense[]>;
  getExpensesByCategory(userId: number, year: number, month: number): Promise<{ category: string, total: number }[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  
  // Asset methods
  getAssets(userId: number): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  
  // Debt methods
  getDebts(userId: number): Promise<Debt[]>;
  createDebt(debt: InsertDebt): Promise<Debt>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private incomes: Map<number, Income>;
  private expenses: Map<number, Expense>;
  private assets: Map<number, Asset>;
  private debts: Map<number, Debt>;
  
  sessionStore: session.SessionStore;
  
  private userId: number;
  private incomeId: number;
  private expenseId: number;
  private assetId: number;
  private debtId: number;

  constructor() {
    this.users = new Map();
    this.incomes = new Map();
    this.expenses = new Map();
    this.assets = new Map();
    this.debts = new Map();
    
    this.userId = 1;
    this.incomeId = 1;
    this.expenseId = 1;
    this.assetId = 1;
    this.debtId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 1 day
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Income methods
  async getIncomes(userId: number): Promise<Income[]> {
    return Array.from(this.incomes.values()).filter(
      (income) => income.userId === userId,
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getIncomesByMonth(userId: number, year: number, month: number): Promise<Income[]> {
    return Array.from(this.incomes.values()).filter(
      (income) => {
        const incomeDate = new Date(income.date);
        return income.userId === userId && 
               incomeDate.getFullYear() === year && 
               incomeDate.getMonth() === month;
      }
    );
  }

  async createIncome(insertIncome: InsertIncome): Promise<Income> {
    const id = this.incomeId++;
    const income: Income = { ...insertIncome, id };
    this.incomes.set(id, income);
    return income;
  }

  // Expense methods
  async getExpenses(userId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => expense.userId === userId,
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getExpensesByMonth(userId: number, year: number, month: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => {
        const expenseDate = new Date(expense.date);
        return expense.userId === userId && 
               expenseDate.getFullYear() === year && 
               expenseDate.getMonth() === month;
      }
    );
  }

  async getExpensesByCategory(userId: number, year: number, month: number): Promise<{ category: string, total: number }[]> {
    const expenses = await this.getExpensesByMonth(userId, year, month);
    const categoryMap = new Map<string, number>();

    for (const expense of expenses) {
      const currentTotal = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentTotal + Number(expense.amount));
    }

    return Array.from(categoryMap.entries()).map(([category, total]) => ({
      category,
      total,
    }));
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.expenseId++;
    const expense: Expense = { ...insertExpense, id };
    this.expenses.set(id, expense);
    return expense;
  }

  // Asset methods
  async getAssets(userId: number): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(
      (asset) => asset.userId === userId,
    );
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.assetId++;
    const asset: Asset = { ...insertAsset, id };
    this.assets.set(id, asset);
    return asset;
  }

  // Debt methods
  async getDebts(userId: number): Promise<Debt[]> {
    return Array.from(this.debts.values()).filter(
      (debt) => debt.userId === userId,
    );
  }

  async createDebt(insertDebt: InsertDebt): Promise<Debt> {
    const id = this.debtId++;
    const debt: Debt = { ...insertDebt, id };
    this.debts.set(id, debt);
    return debt;
  }
}

export const storage = new MemStorage();
