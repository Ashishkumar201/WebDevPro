import { users, incomes, expenses, assets, debts } from "@shared/schema";
import type { User, InsertUser, Income, InsertIncome, Expense, InsertExpense, Asset, InsertAsset, Debt, InsertDebt } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
// Use require for pg as it doesn't work well with ESM
import pg from 'pg';
const { Pool } = pg;

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Income methods
  async getIncomes(userId: number): Promise<Income[]> {
    return await db
      .select()
      .from(incomes)
      .where(eq(incomes.userId, userId))
      .orderBy(sql`${incomes.date} DESC`);
  }

  async getIncomesByMonth(userId: number, year: number, month: number): Promise<Income[]> {
    // In SQL, months are 1-based, but JavaScript months are 0-based
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    // Adjust month to be 1-based for SQL
    const startDate = new Date(year, month, 1);
    const endDate = new Date(nextYear, nextMonth, 1);
    
    return await db
      .select()
      .from(incomes)
      .where(and(
        eq(incomes.userId, userId),
        sql`${incomes.date} >= ${startDate.toISOString()}`,
        sql`${incomes.date} < ${endDate.toISOString()}`
      ));
  }

  async createIncome(insertIncome: InsertIncome): Promise<Income> {
    const [income] = await db.insert(incomes).values(insertIncome).returning();
    return income;
  }

  // Expense methods
  async getExpenses(userId: number): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userId))
      .orderBy(sql`${expenses.date} DESC`);
  }

  async getExpensesByMonth(userId: number, year: number, month: number): Promise<Expense[]> {
    // In SQL, months are 1-based, but JavaScript months are 0-based
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    // Adjust month to be 1-based for SQL
    const startDate = new Date(year, month, 1);
    const endDate = new Date(nextYear, nextMonth, 1);
    
    return await db
      .select()
      .from(expenses)
      .where(and(
        eq(expenses.userId, userId),
        sql`${expenses.date} >= ${startDate.toISOString()}`,
        sql`${expenses.date} < ${endDate.toISOString()}`
      ));
  }

  async getExpensesByCategory(userId: number, year: number, month: number): Promise<{ category: string, total: number }[]> {
    // In SQL, months are 1-based, but JavaScript months are 0-based
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    // Adjust month to be 1-based for SQL
    const startDate = new Date(year, month, 1);
    const endDate = new Date(nextYear, nextMonth, 1);
    
    // This query groups expenses by category and calculates the sum for each category
    const result = await db.select({
      category: expenses.category,
      total: sql<number>`sum(${expenses.amount}::numeric)`,
    })
    .from(expenses)
    .where(and(
      eq(expenses.userId, userId),
      sql`${expenses.date} >= ${startDate.toISOString()}`,
      sql`${expenses.date} < ${endDate.toISOString()}`
    ))
    .groupBy(expenses.category);
    
    return result;
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const [expense] = await db.insert(expenses).values(insertExpense).returning();
    return expense;
  }

  // Asset methods
  async getAssets(userId: number): Promise<Asset[]> {
    return await db
      .select()
      .from(assets)
      .where(eq(assets.userId, userId));
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const [asset] = await db.insert(assets).values(insertAsset).returning();
    return asset;
  }

  // Debt methods
  async getDebts(userId: number): Promise<Debt[]> {
    return await db
      .select()
      .from(debts)
      .where(eq(debts.userId, userId));
  }

  async createDebt(insertDebt: InsertDebt): Promise<Debt> {
    const [debt] = await db.insert(debts).values(insertDebt).returning();
    return debt;
  }
}

export const storage = new DatabaseStorage();
