import { users, applications, type User, type InsertUser, type Application, type InsertApplication } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  
  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getAllApplications(): Promise<Application[]>;
  getUserApplications(userId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, applicationData: Partial<Application>): Promise<Application>;
  deleteApplication(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private applications: Map<number, Application>;
  private userId: number;
  private applicationId: number;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.userId = 1;
    this.applicationId = 1;
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

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = {
      id,
      username: userData.username,
      password: userData.password,
      email: userData.email || null,
      role: userData.role || "user",
      status: userData.status || "active",
      createdAt: null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...existingUser,
      ...userData,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deleted = this.users.delete(id);
    
    // Delete associated applications
    for (const [appId, app] of this.applications.entries()) {
      if (app.userId === id) {
        this.applications.delete(appId);
      }
    }
    
    return deleted;
  }

  // Application methods
  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getAllApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getUserApplications(userId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (app) => app.userId === userId,
    );
  }

  async createApplication(applicationData: InsertApplication): Promise<Application> {
    const id = this.applicationId++;
    const newApplication: Application = {
      id,
      ...applicationData,
      status: applicationData.status || "pending",
      createdAt: applicationData.createdAt || new Date().toISOString(),
    };
    this.applications.set(id, newApplication);
    return newApplication;
  }

  async updateApplication(id: number, applicationData: Partial<Application>): Promise<Application> {
    const existingApplication = this.applications.get(id);
    if (!existingApplication) {
      throw new Error("Application not found");
    }

    const updatedApplication: Application = {
      ...existingApplication,
      ...applicationData,
    };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  async deleteApplication(id: number): Promise<boolean> {
    return this.applications.delete(id);
  }
}

export const storage = new MemStorage();
